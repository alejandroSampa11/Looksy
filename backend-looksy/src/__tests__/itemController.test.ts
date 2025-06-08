import request from "supertest";
import app from "../app";
import Item from "../models/Item";
import mongoose from "mongoose";

// Mock the models
jest.mock("../models/Item");
jest.mock("../models/StockUpdate");
jest.mock("jsonwebtoken");

describe("Item Controller Tests", () => {
  const mockItem = {
    _id: "507f1f77bcf86cd799439011",
    nombre: "Test Item",
    categoria: 1,
    precio: 100,
    stock: 10,
    descripcion: "Test description",
    imageUrl: "/uploads/test.jpg",
    save: jest.fn().mockResolvedValue(true),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /api/item/:id", () => {
    it("should return 404 if item not found", async () => {
      (Item.findById as jest.Mock).mockResolvedValue(null);
      const res = await request(app).get("/api/item/507f1f77bcf86cd799439011");
      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Item no encontrado");
    });

    it("should return 200 with item data if found", async () => {
      (Item.findById as jest.Mock).mockResolvedValue(mockItem);
      const res = await request(app).get("/api/item/507f191e810c19729de860ea");
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe("GET /api/item/category/:category", () => {
    it("should return 400 for invalid category", async () => {
      const res = await request(app).get("/api/item/category/invalid");
      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it("should return items for valid category", async () => {
      (Item.find as jest.Mock).mockResolvedValue([mockItem]);
      const res = await request(app).get("/api/item/category/1");
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe("GET /api/item", () => {
    it("should return all items", async () => {
      (Item.find as jest.Mock).mockResolvedValue([mockItem]);
      const res = await request(app).get("/api/item");
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe("POST /api/item", () => {
    it("should return 400 for missing fields", async () => {
      const res = await request(app).post("/api/item").send({});
      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.missingFields).toEqual([
        "Nombre del Producto",
        "Categoría",
        "Precio",
        "Stock",
        "Descripción",
        "Imagen",
      ]);
    });

    it("should create item with valid data", async () => {
      (Item as unknown as jest.Mock).mockImplementation(() => mockItem);
      const res = await request(app)
        .post("/api/item")
        .field("nombre", "Test Item")
        .field("categoria", "1")
        .field("precio", "100")
        .field("stock", "10")
        .field("descripcion", "Test description")
        .attach("image", Buffer.from("test"), "test.jpg");

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe("Item created successfully");
    });
  });

  describe("PUT /api/item", () => {
    it("should update item with valid data", async () => {
      (Item.findByIdAndUpdate as jest.Mock).mockResolvedValue(mockItem);
      const res = await request(app).put("/api/item").send({
        id: "507f1f77bcf86cd799439011",
        nombre: "Updated Item",
        categoria: 1,
        precio: 150,
        stock: 15,
        descripcion: "Updated description",
        urlImage: "/uploads/updated.jpg",
      });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe("Item updated successfully");
    });
  });

  describe("DELETE /api/item", () => {
    it("should delete item with valid ID", async () => {
      (Item.findByIdAndDelete as jest.Mock).mockResolvedValue(mockItem);
      const res = await request(app)
        .delete("/api/item")
        .send({ id: "507f1f77bcf86cd799439011" });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe("Item deleted successfully");
    });
  });

});
