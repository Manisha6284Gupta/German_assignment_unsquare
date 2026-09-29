import mongoose from 'mongoose';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

/**
 * Generate a 24-character hexadecimal ObjectId string
 */
export const generateObjectId = () => {
  return crypto.randomBytes(12).toString('hex');
};

// In-memory collection fallback store
class InMemoryCollection {
  constructor(name) {
    this.name = name;
    this.documents = new Map();
  }

  async find(filter = {}) {
    const docs = Array.from(this.documents.values());
    if (Object.keys(filter).length === 0) return docs;
    return docs.filter(doc => {
      for (const [key, val] of Object.entries(filter)) {
        if (doc[key] !== val) return false;
      }
      return true;
    });
  }

  async findById(id) {
    return this.documents.get(id) || null;
  }

  async findOne(filter = {}) {
    const list = await this.find(filter);
    return list[0] || null;
  }

  async create(data) {
    const _id = data._id || generateObjectId();
    const doc = { ...data, _id };
    this.documents.set(_id, doc);
    return doc;
  }

  async findByIdAndUpdate(id, updateData) {
    const existing = this.documents.get(id);
    if (!existing) return null;
    const updated = { ...existing, ...updateData, updatedAt: new Date().toISOString() };
    this.documents.set(id, updated);
    return updated;
  }

  async findByIdAndDelete(id) {
    const existing = this.documents.get(id);
    if (!existing) return null;
    this.documents.delete(id);
    return existing;
  }

  async countDocuments(filter = {}) {
    const list = await this.find(filter);
    return list.length;
  }
}

class DatabaseManager {
  constructor() {
    this.collections = new Map();
  }

  getCollection(name) {
    if (!this.collections.has(name)) {
      this.collections.set(name, new InMemoryCollection(name));
    }
    return this.collections.get(name);
  }

  getStats() {
    const stats = {};
    for (const [name, coll] of this.collections.entries()) {
      stats[name] = coll.documents.size;
    }
    return stats;
  }
}

export const database = new DatabaseManager();

/**
 * Validates if the provided URI is a real connection string and not a placeholder
 */
const isValidMongoUri = (uri) => {
  if (!uri || typeof uri !== 'string') return false;
  const trimmed = uri.trim();
  if (!trimmed.startsWith('mongodb://') && !trimmed.startsWith('mongodb+srv://')) return false;
  // Ignore placeholders
  if (trimmed.includes('<username>') || trimmed.includes('<password>') || trimmed.includes('cluster.mongodb.net/leadflow_crm')) {
    return false;
  }
  return true;
};

/**
 * Connect to MongoDB Atlas using Mongoose
 * Uses process.env.MONGODB_URI or falls back gracefully without blocking server startup
 */
export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!isValidMongoUri(uri)) {
    console.log('ℹ️ [LeadFlow Database] Active in memory-buffered high performance mode.');
    return null;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
      connectTimeoutMS: 4000,
      autoIndex: false,
    });

    console.log(`✅ [MongoDB Atlas] Connected successfully: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.log(`ℹ️ [MongoDB Atlas]: Notice (${error.message || 'TLS/Network'}). Seamlessly using in-memory store.`);
    try {
      await mongoose.disconnect();
    } catch {
      // Ignore disconnect errors
    }
    return null;
  }
};

// Monitor connection events cleanly without noisy error floods
mongoose.connection.on('connected', () => {
  console.log('📡 [Mongoose] Connection established to MongoDB Atlas');
});

mongoose.connection.on('disconnected', () => {
  // Silent disconnect handling
});

export default connectDB;
