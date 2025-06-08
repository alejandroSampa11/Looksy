import express from 'express';
import { getStockItems, getTop10Sales, getTopSalesman, getTotalRevenuePerYear } from '../controllers/adminControllers';

const router = express.Router();

router.get('/stockCount', getStockItems);
router.get('/top10sales', getTop10Sales);
router.get('/topSalesman', getTopSalesman);
router.get('/totalRevenuePerYear', getTotalRevenuePerYear);

export default router;