import { Router } from 'express';
import { getLandlordOpsOverview, verifyListing } from '../../controllers/ops.landlord.controller';

const router = Router();

router.get('/overview', getLandlordOpsOverview);
router.post('/verify-listing', verifyListing);

export default router;
