import { Router } from "express";
import { createUser, getHealth, getByUsername } from "../controllers/user";
import { AppError, catchAsync } from "../middleware/errorHandler";

const router = Router();

router.get('/health', getHealth);
router.post('/create', createUser);
router.get('/:username', getByUsername);


export default router;
