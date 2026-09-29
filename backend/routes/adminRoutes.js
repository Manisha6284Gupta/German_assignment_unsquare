import { Router } from 'express';
import { provisionBrokerage, inviteUser, getAllBrokerages } from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = Router();

// Provision New Brokerage (Platform Admin only)
router.post('/brokerages', protect, authorize('platform_admin'), provisionBrokerage);
router.get('/brokerages', protect, getAllBrokerages);

// Invite / Create User (Advisor or Client)
router.post('/users', protect, authorize('platform_admin', 'brokerage_admin', 'advisor'), inviteUser);

export default router;
