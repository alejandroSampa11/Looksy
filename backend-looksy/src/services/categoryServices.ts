import { Category } from '../models/Category';
import { ICategory, ICategoryResponse } from '../models/Category'; 
import { ValidationUtils } from '../utils/validation';

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
  static async createCategory(nombre: string, parentId?: string): Promise<ICategory> {
    const categoryData = {
      nombre: ValidationUtils.sanitizeName(nombre),
      parentId: parentId || null
    };

    const newCategory = new Category(categoryData);
    return await newCategory.save();
  }

  // Obtener todas las categorías
  static async getAllCategories(): Promise<ICategory[]> {
    return await Category.find({}).lean();
  }

  // Construir árbol de categorías
  static buildCategoryTree(categories: ICategory[], parentId: string | null = null): ICategoryResponse[] {
    return categories
      .filter(cat => {
        if (parentId === null) return cat.parentId === null;
        return cat.parentId?.toString() === parentId;
      })
      .map(cat => ({
        _id: cat._id.toString(),
        nombre: cat.nombre,
        parentId: cat.parentId?.toString() || null,
        children: this.buildCategoryTree(categories, cat._id.toString())
      }));
  }

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
          hasChildren: !!hasChildren
        };
      })
    );
  }

  // Obtener hijos de una categoría
  static async getCategoryChildren(parentId: string): Promise<ICategoryResponse[]> {
    const children = await Category.find({ parentId }).lean();
    
    return await Promise.all(
      children.map(async (child) => {
        const hasChildren = await Category.exists({ parentId: child._id });
        return {
          _id: child._id.toString(),
          nombre: child.nombre,
          parentId: child.parentId?.toString() || null,
          hasChildren: !!hasChildren
        };
      })
    );
  }

  // Actualizar categoría
  static async updateCategory(id: string, nombre: string, parentId?: string): Promise<ICategory | null> {
    return await Category.findByIdAndUpdate(
      id,
      {
        nombre: ValidationUtils.sanitizeName(nombre),
        parentId: parentId || null
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
    children: hasChildren ? await this.getCategoryChildren(id) : []
  };
}
}