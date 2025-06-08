import express from 'express';
import { getStockItems, getTop10Sales, getTopSalesman } from '../controllers/adminControllers';

const router = express.Router();

router.get('/stockCount', getStockItems);
router.get('/top10sales', getTop10Sales);
router.get('/topSalesman', getTopSalesman);

export default router;