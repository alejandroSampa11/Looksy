import { createItem, getAllItemsLimit50, getItemById, getItemsByCategory} from "../controllers/itemController";
import express from "express";

const router = express.Router()

router.get('/:id', getItemById);
router.get('/category/:category', getItemsByCategory)
router.get('/', getAllItemsLimit50)
router.post('/', createItem);

export default router;