import cookieParser from 'cookie-parser';
import { domainContextDetector } from './middlewares/domain.middleware';

// ... other imports remain exactly the same but since we replacing from top, I'll just rewrite the imports block
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import fs from 'fs';

import apiRouter from './api';

dotenv.config();

const app = express();

app.use(helmet());

const appUrl = process.env.APP_URL || 'http://localhost:5173';
const adminAppUrl = process.env.ADMIN_APP_URL || 'http://admin.localhost:5173';

app.use(cors({
  origin: [appUrl, adminAppUrl],
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

// Inject global domain context detector
app.use(domainContextDetector);


if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}
app.use('/uploads', express.static('uploads'));

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// All API routes under /api prefix
app.use('/api', apiRouter);

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

export default app;
