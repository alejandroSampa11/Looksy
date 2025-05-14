import { Router } from "express";
import { getHealth } from "../controllers/user";

const router = Router();

router.get("/health", getHealth);

export default router;
