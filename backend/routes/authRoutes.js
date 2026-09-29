import { Router } from 'express';
import { register, login, getMe, getAllUsers, convertToClient, updateUserRole } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.put('/update-role', updateUserRole);
router.post('/convert-to-client', convertToClient);
router.get('/me', protect, getMe);
router.get('/users', protect, getAllUsers);

export default router;
