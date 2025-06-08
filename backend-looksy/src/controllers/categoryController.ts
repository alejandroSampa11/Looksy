import { Request, Response } from 'express';
import { CategoryService } from '../services/categoryServices';
import { ValidationUtils } from '../utils/validation';
import { IApiResponse, ICategoryResponse } from '../models/Category';

export class CategoryController {

  static async create(req: Request, res: Response) {
    try {
      const { nombre, parentId } = req.body;
      console.log(req.body);

      // Validaciones
      if (!ValidationUtils.isValidName(nombre)) {
        return res.status(400).json({
          success: false,
          message: 'El nombre es requerido'
        } as IApiResponse<null>);
      }

      if (parentId && !ValidationUtils.isValidObjectId(parentId)) {
        return res.status(400).json({
          success: false,
          message: 'ParentId inválido'
        } as IApiResponse<null>);
      }

      const newCategory = await CategoryService.createCategory(nombre, parentId);

      res.status(201).json({
        success: true,
        data: {
          _id: newCategory._id.toString(),
          nombre: newCategory.nombre,
          parentId: newCategory.parentId?.toString() || null,
        }
      } as IApiResponse<ICategoryResponse>);

    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al crear categoría',
        error: error instanceof Error ? error.message : 'Error desconocido'
      } as IApiResponse<null>);
    }
  }

  // Obtener árbol completo
  static async getTree(req: Request, res: Response) {
    try {
      const categories = await CategoryService.getAllCategories();
      const tree = CategoryService.buildCategoryTree(categories);

      res.json({
        success: true,
        data: tree
      } as IApiResponse<ICategoryResponse[]>);

    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al obtener categorías',
        error: error instanceof Error ? error.message : 'Error desconocido'
      } as IApiResponse<null>);
    }
  }

  // Obtener categorías raíz
  static async getRoots(req: Request, res: Response) {
    try {
      const roots = await CategoryService.getRootCategories();

      res.json({
        success: true,
        data: roots
      } as IApiResponse<ICategoryResponse[]>);

    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al obtener categorías raíz',
        error: error instanceof Error ? error.message : 'Error desconocido'
      } as IApiResponse<null>);
    }
  }

  // Obtener hijos
  static async getChildren(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!ValidationUtils.isValidObjectId(id)) {
        return res.status(400).json({
          success: false,
          message: 'ID inválido'
        } as IApiResponse<null>);
      }

      const children = await CategoryService.getCategoryChildren(id);

      res.json({
        success: true,
        data: children
      } as IApiResponse<ICategoryResponse[]>);

    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al obtener hijos',
        error: error instanceof Error ? error.message : 'Error desconocido'
      } as IApiResponse<null>);
    }
  }

  // Actualizar categoría
  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { nombre, parentId } = req.body;

      // Validaciones
      if (!ValidationUtils.isValidObjectId(id)) {
        return res.status(400).json({
          success: false,
          message: 'ID inválido'
        } as IApiResponse<null>);
      }

      if (!ValidationUtils.isValidName(nombre)) {
        return res.status(400).json({
          success: false,
          message: 'El nombre es requerido'
        } as IApiResponse<null>);
      }

      if (ValidationUtils.isSelfParent(id, parentId)) {
        return res.status(400).json({
          success: false,
          message: 'Una categoría no puede ser padre de sí misma'
        } as IApiResponse<null>);
      }

      const updated = await CategoryService.updateCategory(id, nombre, parentId);

      if (!updated) {
        return res.status(404).json({
          success: false,
          message: 'Categoría no encontrada'
        } as IApiResponse<null>);
      }

      res.json({
        success: true,
        data: {
          _id: updated._id.toString(),
          nombre: updated.nombre,
          parentId: updated.parentId?.toString() || null,
        }
      } as IApiResponse<ICategoryResponse>);

    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al actualizar categoría',
        error: error instanceof Error ? error.message : 'Error desconocido'
      } as IApiResponse<null>);
    }
  }

  static async getById(req: Request, res: Response) {
  try {
    const { id } = req.params;

    if (!ValidationUtils.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID inválido'
      } as IApiResponse<null>);
    }

    const category = await CategoryService.getCategoryById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Categoría no encontrada'
      } as IApiResponse<null>);
    }

    res.json({
      success: true,
      data: category
    } as IApiResponse<ICategoryResponse>);

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener categoría',
      error: error instanceof Error ? error.message : 'Error desconocido'
    } as IApiResponse<null>);
  }
}

  // Eliminar categoría
  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!ValidationUtils.isValidObjectId(id)) {
        return res.status(400).json({
          success: false,
          message: 'ID inválido'
        } as IApiResponse<null>);
      }

      // Verificar si tiene hijos
      const hasChildren = await CategoryService.hasChildren(id);
      if (hasChildren) {
        return res.status(400).json({
          success: false,
          message: 'No se puede eliminar una categoría que tiene subcategorías'
        } as IApiResponse<null>);
      }

      const deleted = await CategoryService.deleteCategory(id);
      
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Categoría no encontrada'
        } as IApiResponse<null>);
      }

      res.json({
        success: true,
        message: 'Categoría eliminada exitosamente',
        data: {
          _id: deleted._id.toString(),
          nombre: deleted.nombre,
          parentId: deleted.parentId?.toString() || null,
        }
      } as IApiResponse<ICategoryResponse>);

    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al eliminar categoría',
        error: error instanceof Error ? error.message : 'Error desconocido'
      } as IApiResponse<null>);
    }
  }
}