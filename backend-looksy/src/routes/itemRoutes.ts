import { createItem, deleteItem, getAllItems , getAllItemsLimit50, searchItem, getItemById, getItemsByCategory, getItemsBySubcategory, updateItem, updateStock } from "../controllers/itemController";
import express from "express";
import { upload } from "../middleware/upload";

const router = express.Router()

router.get('/:id', getItemById);
router.get('/category/:category', getItemsByCategory);
router.post('/getItems/:page', getAllItemsLimit50);
router.get('/subcategory/:subcategoryId', getItemsBySubcategory);
router.get('/getItems/:page', getAllItemsLimit50);
router.get('/', getAllItems);
router.post('/search', searchItem);
router.post('/', upload.single('image') ,createItem);
router.put('/', updateItem);
router.put('/stock', updateStock);
router.delete('/', deleteItem)


export default router;