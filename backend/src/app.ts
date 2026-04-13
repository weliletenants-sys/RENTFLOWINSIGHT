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

// Initialize Event Listeners
import './events/listeners/commission.listener';
import './events/listeners/pipeline.listener';

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

import { errorHandler } from './middlewares/errorHandler.middleware';
app.use(errorHandler);

export default app;
