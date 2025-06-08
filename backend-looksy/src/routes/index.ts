import { Router } from "express";
import userRoutes from "./userRoutes";
import itemRoutes from './itemRoutes';
import saleRoutes from './salesRoutes';
import adminRoutes from './adminRoutes';
import categoryRoutes from './categoryRoutes';

const router = Router();
router.use("/users", userRoutes);
router.use("/item", itemRoutes);
router.use('/sales', saleRoutes);
router.use('/admin', adminRoutes);
router.use('/category', categoryRoutes);

export default router;