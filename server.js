import express from 'express';
import next from 'next';
import cors from 'cors';
import dotenv from 'dotenv';
import blogRoutes from './routes/blogs.js';
import authRoutes from './routes/auth.js';
import { initializeDatabase, testConnection } from './db/connection.js';

dotenv.config();

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const port = process.env.PORT || 3000;

app.prepare().then(async () => {
  // Initialize database connection and schema
  try {
    console.log('[SERVER] Initializing database connection...');
    await testConnection();
    await initializeDatabase();
    console.log('[SERVER] Database ready - all data stored in database only');
  } catch (error) {
    console.error('[SERVER] Database initialization failed:', error);
    process.exit(1);
  }

  const server = express();

  // Middleware
  server.use(cors());
  server.use(express.json({ limit: '10mb' }));
  server.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Request logging middleware
  server.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
  });

  // API Routes - all data operations use database only
  server.use('/api/blogs', blogRoutes);
  server.use('/api/auth', authRoutes);

  // Health check endpoint
  server.get('/api/health', async (req, res) => {
    try {
      const pool = (await import('./db/connection.js')).default;
      const connection = await pool.getConnection();
      const [result] = await connection.query('SELECT 1 as test');
      connection.release();
      res.json({ 
        status: 'ok', 
        message: 'Server is running',
        database: 'connected',
        storage: 'database only'
      });
    } catch (error) {
      res.status(500).json({ 
        status: 'error', 
        message: 'Server is running but database connection failed',
        error: error.message
      });
    }
  });

  // Next.js handling
  server.all('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`[SERVER] Ready on http://localhost:${port}`);
    console.log(`[SERVER] API running at http://localhost:${port}/api`);
    console.log(`[SERVER] Health check: http://localhost:${port}/api/health`);
    console.log(`[SERVER] Data storage: Database only (MySQL)`);
  });
}).catch((err) => {
  console.error('[SERVER] Server startup error:', err);
  process.exit(1);
});
