import { Router } from 'express'
import { createSale, getAllSales, getSale } from '../controllers/salesController';

const router = Router();

router.post('/', createSale);
router.get('/', getAllSales);
router.get('/:saleId', getSale);

export default router;