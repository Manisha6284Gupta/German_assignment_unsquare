import { Router } from 'express';
import { requestDemo, triggerSeed } from '../controllers/demoController.js';

const router = Router();

router.post('/request', requestDemo);
router.post('/seed', triggerSeed);

export default router;
