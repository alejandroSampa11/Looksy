import { Category } from "../models/Category";
import { ICategory, ICategoryResponse } from "../models/Category";
import { ValidationUtils } from "../utils/validation";

/**
 * @swagger
 * /api/category/{parentId}/children:
 *   get:
 *     summary: Obtener todas las subcategorías hijas de una categoría padre
 *     description: Recupera todas las categorías que tienen como padre la categoría especificada por su ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: parentId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la categoría padre
 *         example: "60d21b4667d0d8992e610c85"
 *     responses:
 *       200:
 *         description: Lista de subcategorías recuperada exitosamente
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
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: ID único de la subcategoría
 *                         example: "60d21b4667d0d8992e610c86"
 *                       nombre:
 *                         type: string
 *                         description: Nombre de la subcategoría
 *                         example: "Smartphones"
 *                       parentId:
 *                         type: string
 *                         description: ID de la categoría padre
 *                         example: "60d21b4667d0d8992e610c85"
 *                       hasChildren:
 *                         type: boolean
 *                         description: Indica si esta subcategoría tiene hijos
 *                         example: true
 *                 message:
 *                   type: string
 *                   example: "Subcategorías encontradas"
 *       400:
 *         description: ID de categoría padre inválido
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
 *                   example: "ID de categoría padre requerido"
 *       404:
 *         description: Categoría padre no encontrada
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
 *                   example: "Categoría padre no encontrada"
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
 *                   example: "Error del servidor"
 *                 error:
 *                   type: string
 *                   example: "Database connection failed"
 */
/**
 * @openapi
 * /api/category:
 *   post:
 *     summary: Crear una nueva categoría
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Electrónica
 *               parentId:
 *                 type: string
 *                 nullable: true
 *                 example: 60f7c1e4f1d2c81234567890
 *     responses:
 *       201:
 *         description: Categoría creada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       400:
 *         description: Parámetros inválidos
 */

/**
 * @openapi
 * /api/category/tree:
 *   get:
 *     summary: Obtener todas las categorías
 *     responses:
 *       200:
 *         description: Lista de categorías
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 60f7c1e4f1d2c81234567890
 *         nombre:
 *           type: string
 *           example: Electrónica
 *         parentId:
 *           type: string
 *           nullable: true
 *           example: null
 */

export class CategoryService {
  // Crear categoría
  static async createCategory(
    nombre: string,
    parentId?: string
  ): Promise<ICategory> {
    const categoryData = {
      nombre: ValidationUtils.sanitizeName(nombre),
      parentId: parentId || null,
    };

    const newCategory = new Category(categoryData);
    return await newCategory.save();
  }

  // Obtener todas las categorías
  static async getAllCategories(): Promise<ICategory[]> {
    return await Category.find({}).lean();
  }

  // Construir árbol de categorías
  static buildCategoryTree(
    categories: ICategory[],
    parentId: string | null = null
  ): ICategoryResponse[] {
    return categories
      .filter((cat) => {
        if (parentId === null) return cat.parentId === null;
        return cat.parentId?.toString() === parentId;
      })
      .map((cat) => ({
        _id: cat._id.toString(),
        nombre: cat.nombre,
        parentId: cat.parentId?.toString() || null,
        children: this.buildCategoryTree(categories, cat._id.toString()),
      }));
  }

  /**
   * @swagger
   * /api/category/roots:
   *   get:
   *     summary: Obtener todas las categorías raíz
   *     description: Recupera todas las categorías que no tienen padre (categorías principales del sistema)
   *     tags: [Categories]
   *     responses:
   *       200:
   *         description: Lista de categorías raíz recuperada exitosamente
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
   *                   items:
   *                     type: object
   *                     properties:
   *                       _id:
   *                         type: string
   *                         description: ID único de la categoría raíz
   *                         example: "60d21b4667d0d8992e610c85"
   *                       nombre:
   *                         type: string
   *                         description: Nombre de la categoría raíz
   *                         example: "Electronics"
   *                       parentId:
   *                         type: null
   *                         description: Siempre null para categorías raíz
   *                         example: null
   *                       hasChildren:
   *                         type: boolean
   *                         description: Indica si esta categoría raíz tiene subcategorías
   *                         example: true
   *                 message:
   *                   type: string
   *                   example: "Categorías raíz encontradas"
   *                 count:
   *                   type: integer
   *                   description: Número total de categorías raíz
   *                   example: 4
   *       404:
   *         description: No hay categorías raíz en el sistema
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
   *                   example: "No se encontraron categorías raíz"
   *                 data:
   *                   type: array
   *                   example: []
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
   *                   example: "Error del servidor"
   *                 error:
   *                   type: string
   *                   example: "Database connection failed"
   */
  // Obtener categorías raíz
  static async getRootCategories(): Promise<ICategoryResponse[]> {
    const roots = await Category.find({ parentId: null }).lean();

    return await Promise.all(
      roots.map(async (root) => {
        const hasChildren = await Category.exists({ parentId: root._id });
        return {
          _id: root._id.toString(),
          nombre: root.nombre,
          parentId: null,
          hasChildren: !!hasChildren,
        };
      })
    );
  }

  // Obtener hijos de una categoría
  static async getCategoryChildren(
    parentId: string
  ): Promise<ICategoryResponse[]> {
    const children = await Category.find({ parentId }).lean();

    return await Promise.all(
      children.map(async (child) => {
        const hasChildren = await Category.exists({ parentId: child._id });
        return {
          _id: child._id.toString(),
          nombre: child.nombre,
          parentId: child.parentId?.toString() || null,
          hasChildren: !!hasChildren,
        };
      })
    );
  }

  // Actualizar categoría
  static async updateCategory(
    id: string,
    nombre: string,
    parentId?: string
  ): Promise<ICategory | null> {
    return await Category.findByIdAndUpdate(
      id,
      {
        nombre: ValidationUtils.sanitizeName(nombre),
        parentId: parentId || null,
      },
      { new: true }
    );
  }

  // Eliminar categoría
  static async deleteCategory(id: string): Promise<ICategory | null> {
    return await Category.findByIdAndDelete(id);
  }

  // Verificar si tiene hijos
  static async hasChildren(categoryId: string): Promise<boolean> {
    const hasChildren = await Category.exists({ parentId: categoryId });
    return !!hasChildren;
  }

  // Verificar si existe
  static async categoryExists(id: string): Promise<boolean> {
    const exists = await Category.exists({ _id: id });
    return !!exists;
  }

  /**
   * @openapi
   * /api/category/{id}:
   *   get:
   *     summary: Obtener una categoría por su ID
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: ID de la categoría
   *     responses:
   *       200:
   *         description: Categoría encontrada
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Category'
   *       404:
   *         description: Categoría no encontrada
   */
  static async getCategoryById(id: string): Promise<ICategoryResponse | null> {
    const category = await Category.findById(id).lean();

    if (!category) {
      return null;
    }

    // Verificar si tiene hijos
    const hasChildren = await this.hasChildren(id);

    return {
      _id: category._id.toString(),
      nombre: category.nombre,
      parentId: category.parentId?.toString() || null,
      hasChildren,
      children: hasChildren ? await this.getCategoryChildren(id) : [],
    };
  }

  /**
   * @swagger
   * /api/category/{id}/parent:
   *   get:
   *     summary: Get parent category of a specific category
   *     description: Retrieve the parent category of a given category by its ID. Returns null for root categories.
   *     tags: [Categories]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: ID of the category to get its parent
   *         example: 60d21b4667d0d8992e610c86
   *     responses:
   *       200:
   *         description: Parent category retrieved successfully or category is root
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   type: object
   *                   nullable: true
   *                   properties:
   *                     _id:
   *                       type: string
   *                       example: 60d21b4667d0d8992e610c85
   *                     nombre:
   *                       type: string
   *                       example: Electronics
   *                     parentId:
   *                       type: string
   *                       nullable: true
   *                       example: null
   *                     hasChildren:
   *                       type: boolean
   *                       example: true
   *                 message:
   *                   type: string
   *                   example: "Esta es una categoría raíz"
   *       404:
   *         description: Category not found
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
   *                   example: Categoría no encontrada
   *       400:
   *         description: Invalid category ID
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
   *                   example: Invalid category ID
   *       500:
   *         description: Server error
   */

  // Obtener categoría padre mejorado
  static async getParentCategory(categoryId: string): Promise<{
    parent: ICategoryResponse | null;
    isRoot: boolean;
    categoryExists: boolean;
  }> {
    const category = await Category.findById(categoryId).lean();

    if (!category) {
      return {
        parent: null,
        isRoot: false,
        categoryExists: false,
      };
    }

    // Si no tiene parentId, es una categoría raíz
    if (!category.parentId) {
      return {
        parent: null,
        isRoot: true,
        categoryExists: true,
      };
    }

    // Obtenemos la categoría padre
    const parentCategory = await Category.findById(category.parentId).lean();

    if (!parentCategory) {
      return {
        parent: null,
        isRoot: false,
        categoryExists: true,
      };
    }

    const hasChildren = await Category.exists({ parentId: parentCategory._id });

    return {
      parent: {
        _id: parentCategory._id.toString(),
        nombre: parentCategory.nombre,
        parentId: parentCategory.parentId?.toString() || null,
        hasChildren: !!hasChildren,
      },
      isRoot: false,
      categoryExists: true,
    };
  }
}
