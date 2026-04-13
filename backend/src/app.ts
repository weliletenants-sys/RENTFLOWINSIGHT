import cookieParser from 'cookie-parser';
import { domainContextDetector } from './middlewares/domain.middleware';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const app = express();
app.set('trust proxy', 1); // Respect X-Forwarded-For headers from ALBs

// Initialize Event Listeners exclusively if Redis is locally configured or forced
if (process.env.NODE_ENV === 'production' || process.env.ENABLE_REDIS_WORKERS === 'true') {
  console.log('[System] Booting Background Redis Workers...');
  require('./events/listeners/commission.listener');
  require('./events/listeners/pipeline.listener');
} else {
  console.log('[System] Redis Background Workers gracefully Disabled (ENABLE_REDIS_WORKERS=false)');
}

app.use(helmet());

const appUrl = process.env.APP_URL || 'http://localhost:5173';
const adminAppUrl = process.env.ADMIN_APP_URL || 'http://admin.localhost:5173';

app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

import { attachRequestId } from './shared/middleware/request-id.middleware';
app.use(attachRequestId);

// Inject global domain context detector
app.use(domainContextDetector);


if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}
app.use('/uploads', express.static('uploads'));

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Native Domain-Driven Design (DDD) v2 Routes
import modulesRouter from './modules/index';
app.use('/api/v2', modulesRouter);

// Supabase Proxy Fallbacks for Lovable Syncing
import { dynamicRpcCatcher, dynamicRestCatcher } from './shared/dynamic.routes';
import { supabaseAuthGuard } from './middlewares/auth.middleware';

// Hard-guard these proxies! The AuthGuard ensures `req.user.id` is cryptographically validated and natively populated.
app.use('/api/rpc', supabaseAuthGuard, dynamicRpcCatcher);
app.use('/api/rest', supabaseAuthGuard, dynamicRestCatcher);

import { errorHandler } from './middlewares/errorHandler.middleware';
app.use(errorHandler);

export default app;
