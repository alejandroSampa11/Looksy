import { Router } from "express";
import userRoutes from "./userRoutes";
import itemRoutes from './itemRoutes';
import saleRoutes from './salesRoutes';
import adminRoutes from './adminRoutes';

const router = Router();
router.use("/users", userRoutes);
router.use("/item", itemRoutes);
router.use('/sales', saleRoutes);
router.use('/admin', adminRoutes);

export default router;