import { createItem, deleteItem, getAllItemsLimit50, getItemById, getItemsByCategory, updateItem, updateStock } from "../controllers/itemController";
import express from "express";
import { upload } from "../middleware/upload";

const router = express.Router()

router.get('/:id', getItemById);
router.get('/category/:category', getItemsByCategory)
router.get('/', getAllItemsLimit50)
router.post('/', upload.single('image') ,createItem);
router.put('/', updateItem);
router.put('/stock', updateStock);
router.delete('/', deleteItem)

export default router;