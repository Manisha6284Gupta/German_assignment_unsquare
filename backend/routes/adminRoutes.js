import { Router } from 'express';
import { provisionBrokerage, inviteUser, getAllBrokerages, getUsers, updateUser } from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = Router();

// Provision New Brokerage (Platform Admin only)
router.post('/brokerages', protect, authorize('platform_admin'), provisionBrokerage);
router.get('/brokerages', protect, getAllBrokerages);

// Users / Advisors Management (List, Invite, Update)
router.get('/users', protect, getUsers);
router.post('/users', protect, authorize('platform_admin', 'brokerage_admin', 'advisor'), inviteUser);
router.put('/users/:id', protect, authorize('platform_admin', 'brokerage_admin'), updateUser);

export default router;
