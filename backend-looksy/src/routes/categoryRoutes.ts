import express from "express";
import { CategoryController } from "../controllers/categoryController";

const router = express.Router()

router.post('/', CategoryController.create);
router.get('/tree', CategoryController.getTree);
router.get('/roots', CategoryController.getRoots);
router.get('/:id/children', CategoryController.getChildren);
router.put('/:id', CategoryController.update);
router.delete('/:id', CategoryController.delete);
router.get('/:id', CategoryController.getById);
router.get('/:id/parent', CategoryController.getParent);

export default router;