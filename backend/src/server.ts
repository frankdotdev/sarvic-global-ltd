import 'express-async-errors';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import dotenv from 'dotenv';

dotenv.config();

import { generalRateLimit } from './middleware/rateLimit';
import authRoutes from './routes/auth';
import trackingRoutes from './routes/tracking';
import shipmentsRoutes from './routes/shipments';
import clientsRoutes from './routes/clients';
import contactRoutes from './routes/contact';
import documentsRoutes from './routes/documents';

const app = express();
const PORT = process.env.PORT || 4000;

// =============================================================
// SECURITY & MIDDLEWARE
// =============================================================
app.set('trust proxy', 1);

app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
    },
  },
}));

app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || [
    'http://localhost:3000',
    'https://sarvicglobal.com',
    'https://www.sarvicglobal.com',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Idempotency-Key'],
}));

app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// General rate limiting
app.use(generalRateLimit);

// =============================================================
// ROUTES
// =============================================================
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'Sarvic Global API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/tracking', trackingRoutes);
app.use('/api/shipments', shipmentsRoutes);
app.use('/api/clients', clientsRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/documents', documentsRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ success: false, error: `Route ${req.method} ${req.path} not found` });
});

// Global error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('[Error]', err);
  const statusCode = err.statusCode || err.status || 500;
  const message = process.env.NODE_ENV === 'production' && statusCode === 500
    ? 'An internal error occurred. Please try again.'
    : err.message || 'Internal server error';
  res.status(statusCode).json({ success: false, error: message });
});

// =============================================================
// START
// =============================================================
app.listen(PORT, () => {
  console.log(`\n🚢 Sarvic Global API running on port ${PORT}`);
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`   Health: http://localhost:${PORT}/health\n`);
});

export default app;
