import express from 'express';
import cors from 'cors';
// @ts-ignore
import connectDB from '../backend/config/db.js';
// @ts-ignore
import seedDatabase from '../backend/config/seed.js';
// @ts-ignore
import backendRouter from '../backend/routes/index.js';

const app = express();

app.use(cors());
app.use(express.json());

let isDbInitialized = false;

// Middleware to ensure DB connection in serverless environment
app.use(async (req, res, next) => {
  if (!isDbInitialized) {
    try {
      await connectDB();
      await seedDatabase();
      isDbInitialized = true;
    } catch (err: any) {
      console.warn('⚠️ [MongoDB Serverless]: Running with resilient memory-fallback:', err.message);
    }
  }
  next();
});

// Mount all backend API routes (supporting both stripped and unstripped Vercel paths)
app.use('/api', backendRouter);
app.use('/', backendRouter);

export default function handler(req: any, res: any) {
  return app(req, res);
}
