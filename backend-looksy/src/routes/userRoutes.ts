import { Router } from "express";
import { createUser, getHealth, getByUsername } from "../controllers/userController";
import { AppError, catchAsync } from "../middleware/errorHandler";

const router = Router();

router.get('/health', getHealth);
router.post('/', createUser);
router.post('/login', getByUsername);


export default router;
