import { Router } from 'express';
import mongoose from 'mongoose';
import dealRoutes from './dealRoutes.js';
import authRoutes from './authRoutes.js';
import demoRoutes from './demoRoutes.js';
import calculatorRoutes from './calculatorRoutes.js';
import adminRoutes from './adminRoutes.js';

const apiRouter = Router();

apiRouter.use('/deals', dealRoutes);
apiRouter.use('/auth', authRoutes);
apiRouter.use('/demo', demoRoutes);
apiRouter.use('/calculator', calculatorRoutes);
apiRouter.use('/admin', adminRoutes);
apiRouter.use('/brokerage', adminRoutes);

// Health check endpoint
apiRouter.get('/health', (req, res) => {
  const dbStates = ['Disconnected', 'Connected', 'Connecting', 'Disconnecting'];
  const stateIndex = mongoose.connection.readyState;

  res.status(200).json({
    status: 'online',
    service: 'LeadFlow CRM Backend Engine',
    engine: 'Node.js & Express / MongoDB Atlas (Mongoose ODM)',
    database: {
      status: dbStates[stateIndex] || 'Unknown',
      host: mongoose.connection.host || 'Atlas Cluster',
      name: mongoose.connection.name || 'leadflow_crm',
      readyState: stateIndex,
    },
    region: 'Frankfurt (eu-central-1)',
    compliance: 'BaFin & DSGVO Certified (ISO 27001)',
    timestamp: new Date().toISOString(),
  });
});

export default apiRouter;
