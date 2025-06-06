import { Router } from "express";
import userRoutes from "./userRoutes";
import itemRoutes from './itemRoutes';
import saleRoutes from './salesRoutes';

const router = Router();
router.use("/users", userRoutes);
router.use("/item", itemRoutes);
router.use('/sales', saleRoutes)

export default router;