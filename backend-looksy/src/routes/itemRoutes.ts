import { createItem, deleteItem, getAllItemsLimit50, getItemById, getItemsByCategory, updateItem} from "../controllers/itemController";
import express from "express";

const router = express.Router()

router.get('/:id', getItemById);
router.get('/category/:category', getItemsByCategory)
router.get('/', getAllItemsLimit50)
router.post('/', createItem);
router.put('/', updateItem);
router.delete('/', deleteItem)

export default router;