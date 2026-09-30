import { Router } from 'express';
import { getDeals, createDeal, updateDealStage, uploadDocument, getDealDocuments } from '../controllers/dealController.js';

const router = Router();

router.route('/')
  .get(getDeals)
  .post(createDeal);

router.route('/:id/stage')
  .patch(updateDealStage);

router.route('/:id/documents')
  .get(getDealDocuments)
  .post(uploadDocument);

export default router;
