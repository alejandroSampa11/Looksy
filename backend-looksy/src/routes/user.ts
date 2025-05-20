import { Router } from "express";
import { getHealth } from "../controllers/user";
import { AppError, catchAsync } from "../middleware/errorHandler";

const router = Router();

router.get('/health', getHealth);

router.get('/error', (req, res) => {
    throw new AppError(404, 'errorCheck!')
})

router.get("/crashsync", (req, res) => {
    // @ts-ignore (Force an undefined function call)
    undefinedFunction();
});

router.get("/crash-async", catchAsync(async (req, res) => {
    const user = await Promise.reject(new Error("DB Query Failed!"));
    res.json(user);
}));

router.get("/crash-outside", (req, res) => {
    setTimeout(() => {
        throw new Error("💥 Explosion in setTimeout!");
    }, 100);
    res.send("Check server logs in 100ms!");
});

export default router;
