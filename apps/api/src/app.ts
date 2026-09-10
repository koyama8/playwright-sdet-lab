import crypto from 'node:crypto';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env.js';
import authRoutes from './routes/auth.routes.js';
import peopleRoutes from './routes/people.routes.js';
import moviesRoutes from './routes/movies.routes.js';
import testSupportRoutes from './routes/test-support.routes.js';
import { errorHandler } from './middleware/error-handler.js';
import { prisma } from './lib/prisma.js';

export const app = express();
app.disable('x-powered-by');
app.use(helmet());
app.use(cors({ origin: env.WEB_ORIGIN, credentials: false }));
app.use((req, res, next) => {
  const requestId = req.header('x-request-id')?.trim() || crypto.randomUUID();
  res.locals.requestId = requestId;
  res.setHeader('x-request-id', requestId);
  next();
});
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));
app.get('/api/health', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      status: 'ok',
      service: 'playwright-lab-api',
      database: 'ok',
      timestamp: new Date().toISOString(),
    });
  } catch {
    res.status(503).json({
      status: 'degraded',
      service: 'playwright-lab-api',
      database: 'unavailable',
      timestamp: new Date().toISOString(),
    });
  }
});
app.get('/api', (_req, res) => res.json({
  data: {
    name: 'Playwright Lab API',
    version: '1.0.0',
    environment: env.NODE_ENV,
    documentation: 'Use the Bruno collection included with the project.',
    authentication: {
      type: 'Bearer JWT with rotating opaque refresh token',
      accessTokenExpiresInSeconds: env.ACCESS_TOKEN_TTL_SECONDS,
      idleTimeoutSeconds: env.SESSION_IDLE_TIMEOUT_SECONDS,
    },
    resources: ['/api/auth', '/api/people', '/api/movies', '/api/test-support (development only)'],
  },
}));
app.use('/api/auth', authRoutes);
app.use('/api/people', peopleRoutes);
app.use('/api/movies', moviesRoutes);
app.use('/api/test-support', testSupportRoutes);
app.use((_req, res) => res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Route not found', requestId: res.locals.requestId } }));
app.use(errorHandler);
