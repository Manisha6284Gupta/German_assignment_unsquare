import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
// @ts-ignore
import connectDB from './backend/config/db.js';
// @ts-ignore
import seedDatabase from './backend/config/seed.js';
// @ts-ignore
import backendRouter from './backend/routes/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // Initialize MongoDB Atlas connection & Auto-seed personas
  try {
    await connectDB();
    await seedDatabase();
  } catch (dbErr: any) {
    console.warn('⚠️ [MongoDB Init]: Running with resilient memory-buffered mode:', dbErr.message);
  }

  app.use(cors());
  app.use(express.json());

  // Mount backend API routes from /backend folder
  app.use('/api', backendRouter);

  // Serve with Vite in development
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
    });
    
    app.use(vite.middlewares);

    // Fallback for HTML serving in development
    app.use('*', async (req, res, next) => {
      const url = req.originalUrl;
      // Skip API routes that fell through
      if (url.startsWith('/api')) {
        return next();
      }
      try {
        let template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    // Serve static files in production
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 LeadFlow CRM Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
