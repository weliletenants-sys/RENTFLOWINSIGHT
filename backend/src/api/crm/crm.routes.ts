import express from 'express';
import { getTickets } from '../../controllers/crm.controller';

const router = express.Router();

router.get('/tickets', getTickets);

export default router;
