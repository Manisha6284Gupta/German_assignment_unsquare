import express from 'express';
import cors from 'cors';
import apiRouter from './routes/index.js';
import connectDB from './config/db.js';
import seedDatabase from './config/seed.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

const app = express();

app.use(cors());
app.use(express.json());

// Initialize database connection
connectDB().then(() => seedDatabase()).catch(err => {
  console.warn('⚠️ [MongoDB Init Backend]:', err.message);
});

// Mount the API router
app.use('/api', apiRouter);

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

export default app;
