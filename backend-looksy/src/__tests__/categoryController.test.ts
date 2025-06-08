import { CategoryController } from "../controllers/categoryController";
import { CategoryService } from "../services/categoryServices";
import { ValidationUtils } from "../utils/validation";
import { Request, Response } from "express";

jest.mock("../services/categoryServices");
jest.mock("../utils/validation");

const mockResponse = () => {
  const json = jest.fn();
  const status = jest.fn(() => ({ json }));
  return { json, status };
};

describe("CategoryController", () => {
  let req: Partial<Request>;
  let res: ReturnType<typeof mockResponse>;

  beforeEach(() => {
    req = {};
    res = mockResponse();
  });

  // --- getTree ---
  describe("getTree", () => {
    it("debe retornar árbol correctamente", async () => {
      const mockCategories = [{ _id: "1", nombre: "Test" }];
      const mockTree = [{ id: "1", nombre: "Test" }];
      (CategoryService.getAllCategories as jest.Mock).mockResolvedValue(mockCategories);
      (CategoryService.buildCategoryTree as jest.Mock).mockReturnValue(mockTree);

      await CategoryController.getTree(req as Request, res as any);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockTree,
      });
    });

    it("debe manejar error en getTree", async () => {
      (CategoryService.getAllCategories as jest.Mock).mockRejectedValue(new Error("DB error"));

      await CategoryController.getTree(req as Request, res as any);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.status().json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: "Error al obtener categorías",
        })
      );
    });
  });

  // --- getRoots ---
  describe("getRoots", () => {
    it("debe retornar raíces correctamente", async () => {
      const roots = [{ _id: "1", nombre: "Root" }];
      (CategoryService.getRootCategories as jest.Mock).mockResolvedValue(roots);

      await CategoryController.getRoots(req as Request, res as any);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: roots,
      });
    });

    it("debe manejar error en getRoots", async () => {
      (CategoryService.getRootCategories as jest.Mock).mockRejectedValue(new Error("Error"));

      await CategoryController.getRoots(req as Request, res as any);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.status().json).toHaveBeenCalledWith(
        expect.objectContaining({ success: false })
      );
    });
  });

  // --- getChildren ---
  describe("getChildren", () => {
    it("debe retornar error si ID inválido", async () => {
      req.params = { id: "invalid" };
      (ValidationUtils.isValidObjectId as jest.Mock).mockReturnValue(false);

      await CategoryController.getChildren(req as Request, res as any);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("debe retornar hijos correctamente", async () => {
      req.params = { id: "validId" };
      (ValidationUtils.isValidObjectId as jest.Mock).mockReturnValue(true);
      (CategoryService.getCategoryChildren as jest.Mock).mockResolvedValue([{ _id: "2" }]);

      await CategoryController.getChildren(req as Request, res as any);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: [{ _id: "2" }],
      });
    });
  });

  // --- update ---
  describe("update", () => {
    it("debe validar y actualizar correctamente", async () => {
      req.params = { id: "1" };
      req.body = { nombre: "Update", parentId: "2" };
      (ValidationUtils.isValidObjectId as jest.Mock).mockReturnValue(true);
      (ValidationUtils.isValidName as jest.Mock).mockReturnValue(true);
      (ValidationUtils.isSelfParent as jest.Mock).mockReturnValue(false);

      const updated = {
        _id: { toString: () => "1" },
        nombre: "Update",
        parentId: { toString: () => "2" },
      };
      (CategoryService.updateCategory as jest.Mock).mockResolvedValue(updated);

      await CategoryController.update(req as Request, res as any);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: { _id: "1", nombre: "Update", parentId: "2" },
      });
    });
  });

  // --- delete ---
  describe("delete", () => {
    it("debe evitar eliminar con hijos", async () => {
      req.params = { id: "1" };
      (ValidationUtils.isValidObjectId as jest.Mock).mockReturnValue(true);
      (CategoryService.hasChildren as jest.Mock).mockResolvedValue(true);

      await CategoryController.delete(req as Request, res as any);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("debe eliminar correctamente", async () => {
      req.params = { id: "1" };
      (ValidationUtils.isValidObjectId as jest.Mock).mockReturnValue(true);
      (CategoryService.hasChildren as jest.Mock).mockResolvedValue(false);
      const deleted = {
        _id: { toString: () => "1" },
        nombre: "Test",
        parentId: null,
      };
      (CategoryService.deleteCategory as jest.Mock).mockResolvedValue(deleted);

      await CategoryController.delete(req as Request, res as any);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "Categoría eliminada exitosamente",
        data: {
          _id: "1",
          nombre: "Test",
          parentId: null,
        },
      });
    });
  });

  // --- getParent ---
  describe("getParent", () => {
    it("debe manejar categoría raíz", async () => {
      req.params = { id: "1" };
      (ValidationUtils.isValidObjectId as jest.Mock).mockReturnValue(true);
      (CategoryService.getParentCategory as jest.Mock).mockResolvedValue({
        categoryExists: true,
        isRoot: true,
        parent: null,
      });

      await CategoryController.getParent(req as Request, res as any);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: null,
        message: "Esta es una categoría raíz (no tiene padre)",
      });
    });
  });
});
