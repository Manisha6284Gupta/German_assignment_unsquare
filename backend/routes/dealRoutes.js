import { Router } from 'express';
import { getDeals, createDeal, updateDealStage } from '../controllers/dealController.js';

const router = Router();

router.route('/')
  .get(getDeals)
  .post(createDeal);

router.route('/:id/stage')
  .patch(updateDealStage);

export default router;
