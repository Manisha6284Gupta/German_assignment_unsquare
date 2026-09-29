import { Router } from 'express';
import { calculateRoi } from '../controllers/calculatorController.js';

const router = Router();

router.post('/roi', calculateRoi);

export default router;
