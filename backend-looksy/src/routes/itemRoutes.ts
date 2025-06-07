import { createItem, deleteItem, getAllItemsLimit50, getItemById, getItemsByCategory, updateItem, updateStock } from "../controllers/itemController";
import express from "express";

const router = express.Router()

router.get('/:id', getItemById);
router.get('/category/:category', getItemsByCategory)
router.get('/', getAllItemsLimit50)
router.post('/', createItem);
router.put('/', updateItem);
router.put('/stock', updateStock);
router.delete('/', deleteItem)

export default router;