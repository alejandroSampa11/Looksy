import Item from "../models/Item";
import { Request, Response } from "express";

//#region GET
/**
 * @swagger
 * /api/item/{id}:
 *   get:
 *     summary: Obtener un artículo por ID
 *     tags: [Items]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del artículo a buscar
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Artículo encontrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Item'
 *       400:
 *         description: ID no proporcionado
 *       404:
 *         description: Artículo no encontrado
 *       500:
 *         description: Error del servidor
 */
const getItemById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    console.log('id', id);
    if (!id) {
      res.status(400).json({
        success: false,
        message: "ID requerido",
      });
      return;
    }

    const item = await Item.findById(id);

    if (!item) {
      res.status(404).json({
        success: false,
        message: "Item no encontrado",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: item,
    });
  } catch (error) {
    console.error("Error fetching item:", error);
    res.status(500).json({
      success: false,
      message: "Error del servidor",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

/**
 * @swagger
 * /api/item/category/{category}:
 *   get:
 *     summary: Obtener todos los artículos por categoría
 *     tags: [Items]
 *     parameters:
 *       - in: path
 *         name: category
 *         required: true
 *         description: ID numérico de la categoría
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Lista de artículos en esa categoría
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Item'
 *       400:
 *         description: Categoría no proporcionada o inválida
 *       500:
 *         description: Error del servidor
 */
const getItemsByCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    console.log(req.params);
    const { category } = req.params;

    if (!category || isNaN(Number(category))) {
      res.status(400).json({
        success: false,
        message: "Categoría inválida o no proporcionada",
      });
      return;
    }

    const items = await Item.find({ categoria: Number(category) });

    res.status(200).json({
      success: true,
      data: items,
    });
  } catch (error) {
    console.error("Error fetching items by category:", error);
    res.status(500).json({
      success: false,
      message: "Error del servidor",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

const obtenerItemConSimilares = async (req: Request, res: Response) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ error: "Artículo no encontrado" });

    const similares = await Item.find({
      categoria: item.categoria,
      _id: { $ne: item._id },
      precio: { $gte: item.precio - 50, $lte: item.precio + 50 },
    }).limit(4);

    res.json({ item, similares });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el artículo" });
  }
};

/**
 * @swagger
 * /api/item:
 *   get:
 *     summary: Obtener hasta 50 artículos sin filtrar por categoría
 *     tags: [Items]
 *     responses:
 *       200:
 *         description: Lista de artículos (máximo 50)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   maxItems: 50
 *                   items:
 *                     $ref: '#/components/schemas/Item'
 *       500:
 *         description: Error del servidor
 */
const getAllItemsLimit50 = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const items = await Item.find().limit(50);

    res.status(200).json({
      success: true,
      data: items,
    });
  } catch (error) {
    console.error("Error fetching items:", error);
    res.status(500).json({
      success: false,
      message: "Error del servidor",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

//#endregion
//#region POST

/**
 * @swagger
 * /api/item:
 *   post:
 *     summary: Create a new item
 *     tags:
 *       - Items
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - categoria
 *               - precio
 *               - stock
 *               - descripcion
 *               - urlImage
 *             properties:
 *               nombre:
 *                 type: string
 *               categoria:
 *                 type: number
 *               precio:
 *                 type: number
 *               stock:
 *                 type: number
 *               descripcion:
 *                 type: string
 *               urlImage:
 *                 type: string
 *     responses:
 *       201:
 *         description: Item created successfully
 *       400:
 *         description: Missing fields
 *       500:
 *         description: Server error
 */

const createItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nombre, categoria, precio, stock, descripcion, urlImage } =
      req.body;
    const missingFields = [];

    if (!nombre) missingFields.push("Nombre del Producto");
    if (!categoria) missingFields.push("Categoría");
    if (!precio) missingFields.push("Precio");
    if (!stock) missingFields.push("Stock");
    if (!descripcion) missingFields.push("Descripción");
    if (!urlImage) missingFields.push("Imagen");

    if (missingFields.length > 0) {
      res.status(400).json({
        success: false,
        message: "Datos incompletos. Campos requeridos faltantes:",
        missingFields,
      });
      return;
    }

    const item = new Item(req.body);
    await item.save();
    res.status(201).json({ message: "Item created successfully" });
  } catch (error) {
    console.error("Error creating item:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create item",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
//#endregion

/**
 * @swagger
 * /api/item:
 *   put:
 *     summary: Actualizar un artículo existente
 *     tags: [Items]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - nombre
 *               - categoria
 *               - precio
 *               - stock
 *               - descripcion
 *               - urlImage
 *             properties:
 *               id:
 *                 type: string
 *                 description: ID del artículo a actualizar
 *               nombre:
 *                 type: string
 *                 description: Nombre del producto
 *               categoria:
 *                 type: number
 *                 description: Número de categoría del producto
 *                 example: 1
 *               precio:
 *                 type: number
 *                 description: Precio del producto
 *                 example: 299.99
 *               stock:
 *                 type: number
 *                 description: Cantidad disponible en inventario
 *                 example: 10
 *               descripcion:
 *                 type: string
 *                 description: Descripción detallada del producto
 *               urlImage:
 *                 type: string
 *                 description: URL de la imagen del producto
 *     responses:
 *       200:
 *         description: Artículo actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Item updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/Item'
 *       400:
 *         description: Datos incompletos o campos requeridos faltantes
 *       404:
 *         description: Artículo no encontrado
 *       500:
 *         description: Error del servidor
 */

//#region PUT
const updateItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id, nombre, categoria, precio, stock, descripcion, urlImage } =
      req.body;
    const missingFields = [];

    if (!id) missingFields.push("ID del Producto");
    if (!nombre) missingFields.push("Nombre del Producto");
    if (!categoria) missingFields.push("Categoría");
    if (!precio) missingFields.push("Precio");
    if (!stock) missingFields.push("Stock");
    if (!descripcion) missingFields.push("Descripción");
    if (!urlImage) missingFields.push("Imagen");

    if (missingFields.length > 0) {
      res.status(400).json({
        success: false,
        message: "Datos incompletos. Campos requeridos faltantes:",
        missingFields,
      });
      return;
    }

    const updatedItem = await Item.findByIdAndUpdate(
      id,
      { nombre, categoria, precio, stock, descripcion, urlImage },
      { new: true, runValidators: true }
    );

    if (!updatedItem) {
      res.status(404).json({
        success: false,
        message: "Item not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Item updated successfully",
      data: updatedItem,
    });

  } catch (error) {
    console.error("Error updating item:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update item",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

/**
 * @swagger
 * /api/item:
 *   delete:
 *     summary: Eliminar un artículo por ID
 *     tags: [Items]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: string
 *                 description: ID del artículo a eliminar
 *                 example: 665aa1d199a7f99ddab6b123
 *     responses:
 *       200:
 *         description: Artículo eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Item deleted successfully
 *       400:
 *         description: ID no proporcionado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: ID del Producto requerido
 *       404:
 *         description: Artículo no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Item not found
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Failed to delete item
 *                 error:
 *                   type: string
 *                   example: Error message details
 */
//#region DELETE
const deleteItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.body;

    if (!id) {
      res.status(400).json({
        success: false,
        message: "ID del Producto requerido"
      });
      return;
    }

    const deletedItem = await Item.findByIdAndDelete(id);

    if (!deletedItem) {
      res.status(404).json({
        success: false,
        message: "Item not found"
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Item deleted successfully"
    });

  } catch (error) {
    console.error("Error deleting item:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete item",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
};

export {
  createItem,
  obtenerItemConSimilares,
  getItemById,
  getItemsByCategory,
  getAllItemsLimit50,
  updateItem,
  deleteItem
};
