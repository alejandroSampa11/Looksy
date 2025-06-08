import Item from "../models/Item";
import { Request, Response } from "express";
import StockUpdate from "../models/StockUpdate";

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
 * /api/item/:id:
 *   get:
 *     summary: Get all items with a limit of 50 and
 *     description: Retrieve a list of all items from the database with a maximum limit of 50 items
 *     tags: [Items]
 *     responses:
 *       200:
 *         description: Items retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   maxItems: 50
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 60d21b4667d0d8992e610c85
 *                       nombre:
 *                         type: string
 *                         example: Smartphone Samsung Galaxy
 *                       categoria:
 *                         type: integer
 *                         example: 1
 *                       precio:
 *                         type: number
 *                         example: 299.99
 *                       stock:
 *                         type: integer
 *                         example: 50
 *                       descripcion:
 *                         type: string
 *                         example: Latest smartphone with advanced features
 *                       imageUrl:
 *                         type: string
 *                         example: /uploads/image-1234567890.jpg
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: 2023-06-22T10:30:40.000Z
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: 2023-06-22T10:30:40.000Z
 *       500:
 *         description: Server error
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
 *                   example: Error del servidor
 *                 error:
 *                   type: string
 *                   example: Error message details
 */
const getAllItems = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const items = await Item.find();
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


const getAllItemsLimit50 = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { filterString } = req.body;
    const page = parseInt(req.params.page, 10) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    let query = {};
    if (filterString && filterString.length > 0) {
      query = { nombre: { $regex: filterString, $options: 'i' } }
    }

    const [items, total] = await Promise.all([
      Item.find(query).sort({ createdAt: 1 }).skip(skip).limit(limit),
      Item.countDocuments()
    ]);

    const totalPages = Math.ceil(total/limit);
    const hasNextPage = page < totalPages;

    res.status(200).json({
      nextPage: hasNextPage ? page + 1 : null,
      totalPages,
      data: items
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
 *     summary: Create a new item with image upload
 *     description: Create a new item with all required fields and an image file
 *     tags: [Items]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - categoria
 *               - precio
 *               - stock
 *               - descripcion
 *               - image
 *             properties:
 *               nombre:
 *                 type: string
 *                 description: Product name
 *                 example: "Smartphone Samsung Galaxy"
 *               categoria:
 *                 type: integer
 *                 description: Category ID (numeric)
 *                 example: 1
 *               precio:
 *                 type: number
 *                 format: float
 *                 description: Product price
 *                 example: 299.99
 *               stock:
 *                 type: integer
 *                 description: Available quantity in inventory
 *                 example: 50
 *               descripcion:
 *                 type: string
 *                 description: Detailed product description
 *                 example: "Latest smartphone with advanced features"
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Product image file (JPEG, PNG, etc.)
 *     responses:
 *       201:
 *         description: Item created successfully
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
 *                   example: Item created successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 60d21b4667d0d8992e610c85
 *                     nombre:
 *                       type: string
 *                       example: Smartphone Samsung Galaxy
 *                     categoria:
 *                       type: integer
 *                       example: 1
 *                     precio:
 *                       type: number
 *                       example: 299.99
 *                     stock:
 *                       type: integer
 *                       example: 50
 *                     descripcion:
 *                       type: string
 *                       example: Latest smartphone with advanced features
 *                     imageUrl:
 *                       type: string
 *                       example: /uploads/image-1234567890.jpg
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2023-06-22T10:30:40.000Z
 *       400:
 *         description: Missing required fields or validation error
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
 *                   example: Datos incompletos. Campos requeridos faltantes
 *                 missingFields:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["Nombre del Producto", "Imagen"]
 *       500:
 *         description: Server error
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
 *                   example: Failed to create item
 *                 error:
 *                   type: string
 *                   example: Error message details
 */

const createItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nombre, categoria, precio, stock, descripcion } = req.body;
    const missingFields = [];

    if (!nombre) missingFields.push("Nombre del Producto");
    if (!categoria) missingFields.push("Categoría");
    if (!precio) missingFields.push("Precio");
    if (!stock) missingFields.push("Stock");
    if (!descripcion) missingFields.push("Descripción");
    if (!req.file) missingFields.push("Imagen");

    if (missingFields.length > 0) {
      res.status(400).json({
        success: false,
        message: "Datos incompletos. Campos requeridos faltantes:",
        missingFields,
      });
      return;
    }

    const imageUrl = `/uploads/${req.file.filename}`; // ruta pública o relativa de la imagen

    const item = new Item({
      nombre,
      categoria,
      precio,
      stock,
      descripcion,
      imageUrl,
    });

    await item.save();
    res.status(201).json({
      success: true,
      message: "Item created successfully",
      data: item,
    });
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
        message: "ID del Producto requerido",
      });
      return;
    }

    const deletedItem = await Item.findByIdAndDelete(id);

    if (!deletedItem) {
      res.status(404).json({
        success: false,
        message: "Item not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Item deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting item:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete item",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

/**
 * @swagger
 * /api/item/stock/{id}:
 *   put:
 *     summary: Actualizar el stock de un artículo por ID
 *     tags: [Items]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del artículo a actualizar
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               stock:
 *                 type: number
 *                 description: Nuevo stock del artículo
 *     responses:
 *       200:
 *         description: Stock actualizado exitosamente
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
 *                   example: Stock updated successfully
 *       400:
 *         description: ID no proporcionado o stock inválido
 *       404:
 *         description: Artículo no encontrado
 */
const updateStock = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id, stock, userId } = req.body;

    const missingFields = [];
    if (!id) {
      missingFields.push("Item id");
    }
    if (!stock) {
      missingFields.push("Stock");
    }

    if (missingFields.length > 0) {
      res
        .status(400)
        .json({ message: `Missing fields: ${missingFields.join(", ")}` });
      return;
    }

    if (typeof stock !== "number" || stock < 0) {
      res.status(400).json({ message: "Stock must be a positive number" });
      return;
    }

    const updatedItem = await Item.findByIdAndUpdate(
      id,
      { $inc: { stock } },
      { new: true, runValidators: true }
    );
    if (!updateItem) {
      res.status(404).json({ message: "Item not found" });
      return;
    }

    await StockUpdate.create({
      item: id,
      user: userId,
      stock,
      updatedAt: new Date(),
    });

    res.status(200).json({
      success: true,
      message: "Stock updated successfully",
      data: updatedItem,
    });

    res.status(200).json({
      success: true,
      message: "Stock updated succesfully",
      data: updateItem,
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error al actualizar el stock", error: error.message });
  }
};

const searchItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { filterString } = req.body;

    const items = await Item.find({
      nombre: { $regex: filterString, $options: 'i' }
    });

    res.status(200).json({ data: items });
  } catch (error: any) {
    res.status(500).json({ message: 'Error al buscar el item', error: error.message });
  }
}


export {
  createItem,
  obtenerItemConSimilares,
  getItemById,
  getItemsByCategory,
  getAllItemsLimit50,
  searchItem,
  getAllItems,
  updateItem,
  deleteItem,
  updateStock,
};
