import { Router } from 'express';
import { requestDemo } from '../controllers/demoController.js';

const router = Router();

router.post('/request', requestDemo);

export default router;
