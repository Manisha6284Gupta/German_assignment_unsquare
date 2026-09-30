import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { performance } from 'perf_hooks';

dotenv.config();

/**
 * Masks sensitive credentials in MongoDB connection strings
 * @param {string} uri - Raw connection string
 * @returns {string} - Masked connection string safe for diagnostics
 */
export const sanitizeMongoUri = (uri) => {
  if (!uri || typeof uri !== 'string') return 'N/A (Empty URI)';
  try {
    return uri.replace(/(mongodb(?:\+srv)?:\/\/[^:]+:)([^@]+)(@)/, '$1********$3');
  } catch {
    return 'mongodb+srv://[CREDENTIALS_HIDDEN]@cluster...';
  }
};

/**
 * Diagnostic utility function to validate the environment connection string
 * and execute a ping command against the MongoDB Atlas cluster.
 *
 * @param {string} [customUri] - Optional custom connection string to test. Defaults to process.env.MONGODB_URI
 * @param {number} [timeoutMs=5000] - Timeout limit in milliseconds
 * @returns {Promise<Object>} Detailed diagnostic report
 */
export const testMongoConnection = async (customUri = null, timeoutMs = 5000) => {
  const uri = (customUri || process.env.MONGODB_URI || '').trim();
  const startTime = performance.now();

  const report = {
    timestamp: new Date().toISOString(),
    envVarConfigured: Boolean(process.env.MONGODB_URI),
    sanitizedUri: sanitizeMongoUri(uri),
    connected: false,
    ping: {
      success: false,
      latencyMs: null,
      response: null,
    },
    cluster: {
      host: null,
      database: null,
      protocol: null,
      readyState: mongoose.connection.readyState,
      stateName: ['Disconnected', 'Connected', 'Connecting', 'Disconnecting'][mongoose.connection.readyState] || 'Unknown',
    },
    validation: {
      isValidFormat: false,
      hasCredentials: false,
      hasPlaceholder: false,
      issues: [],
    },
    recommendations: [],
  };

  // 1. Connection string format analysis
  if (!uri) {
    report.validation.issues.push('No MongoDB connection string detected in process.env.MONGODB_URI');
    report.recommendations.push('Set MONGODB_URI in your .env file or environment variables (e.g. mongodb+srv://user:pass@cluster.mongodb.net/leadflow_crm)');
    return {
      status: 'not_configured',
      message: 'MONGODB_URI environment variable is not defined.',
      ...report,
    };
  }

  const isStandard = uri.startsWith('mongodb://');
  const isSrv = uri.startsWith('mongodb+srv://');

  if (!isStandard && !isSrv) {
    report.validation.issues.push("URI must start with either 'mongodb://' or 'mongodb+srv://'");
    report.recommendations.push("Ensure the URI begins with 'mongodb+srv://' for Atlas clusters.");
  } else {
    report.validation.isValidFormat = true;
    report.cluster.protocol = isSrv ? 'mongodb+srv' : 'mongodb';
  }

  if (uri.includes('<username>') || uri.includes('<password>') || uri.includes('cluster.mongodb.net/leadflow_crm')) {
    report.validation.hasPlaceholder = true;
    report.validation.issues.push("URI contains unreplaced template placeholders like '<username>' or '<password>'");
    report.recommendations.push('Replace <username> and <password> with your actual MongoDB Atlas database user credentials.');
  }

  // 2. Perform Ping Test
  let tempConnection = null;

  try {
    // If mongoose already has an active connected instance to the same target, test via existing connection
    if (mongoose.connection.readyState === 1 && (!customUri || customUri === process.env.MONGODB_URI)) {
      const pingStart = performance.now();
      const adminDb = mongoose.connection.db.admin();
      const pingResult = await adminDb.ping();
      const pingLatency = Number((performance.now() - pingStart).toFixed(2));

      report.connected = true;
      report.ping.success = true;
      report.ping.latencyMs = pingLatency;
      report.ping.response = pingResult;
      report.cluster.host = mongoose.connection.host;
      report.cluster.database = mongoose.connection.name;
      report.cluster.readyState = 1;
      report.cluster.stateName = 'Connected';

      return {
        status: 'success',
        message: `✅ MongoDB Atlas ping successful (${pingLatency}ms latency) to cluster '${report.cluster.host}/${report.cluster.database}'`,
        totalDurationMs: Number((performance.now() - startTime).toFixed(2)),
        ...report,
      };
    }

    // Otherwise create an isolated testing connection client
    tempConnection = await mongoose.createConnection(uri, {
      serverSelectionTimeoutMS: timeoutMs,
      connectTimeoutMS: timeoutMs,
      socketTimeoutMS: timeoutMs,
      autoIndex: false,
    }).asPromise();

    const pingStart = performance.now();
    const adminDb = tempConnection.db.admin();
    const pingResult = await adminDb.ping();
    const pingLatency = Number((performance.now() - pingStart).toFixed(2));

    report.connected = true;
    report.ping.success = true;
    report.ping.latencyMs = pingLatency;
    report.ping.response = pingResult;
    report.cluster.host = tempConnection.host;
    report.cluster.database = tempConnection.name;
    report.cluster.readyState = tempConnection.readyState;
    report.cluster.stateName = 'Connected';

    await tempConnection.close();

    return {
      status: 'success',
      message: `✅ MongoDB Atlas ping successful (${pingLatency}ms latency) to cluster '${report.cluster.host}/${report.cluster.database}'`,
      totalDurationMs: Number((performance.now() - startTime).toFixed(2)),
      ...report,
    };
  } catch (error) {
    const duration = Number((performance.now() - startTime).toFixed(2));
    report.connected = false;
    report.ping.success = false;
    report.ping.error = error.message;

    if (error.name === 'MongooseServerSelectionError') {
      report.recommendations.push('Check MongoDB Atlas Network Access whitelist. Add 0.0.0.0/0 or your cloud container IP in Network Access settings.');
      report.recommendations.push('Verify that the database user username and password are correct and have readWrite permissions.');
    } else if (error.message && error.message.includes('bad auth')) {
      report.recommendations.push('Authentication failed. Verify the database user credentials and authSource.');
    }

    if (tempConnection) {
      try {
        await tempConnection.close();
      } catch {
        // Ignore cleanup error
      }
    }

    return {
      status: 'error',
      message: `❌ MongoDB Atlas connection ping failed: ${error.message}`,
      totalDurationMs: duration,
      ...report,
    };
  }
};

export default testMongoConnection;
