import { Router } from "express";
import userRoutes from "./user";
import itemRoutes from './itemRoutes';


const router = Router();
router.use("/users", userRoutes);
router.use("/item", itemRoutes);

export default router;
