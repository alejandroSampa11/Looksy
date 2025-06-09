import * as AdminController from "../controllers/adminControllers";
import { Request, Response } from "express";
import Sale from "../models/Sale";
import Item from '../models/Item';

const mockResponse = () => {
  const json = jest.fn();
  const status = jest.fn(() => ({ json }));
  return { json, status };
};

describe("AdminController", () => {
  let req: Partial<Request>;
  let res: ReturnType<typeof mockResponse>;

  beforeEach(() => {
    req = {};
    res = mockResponse();
  });

  // --- getTop10Sales ---
  describe("getTop10Sales", () => {
    it("should return top 10 sales", async () => {
      // Mock Sale.aggregate to return your expected data
      const mockData = [
        {
          totalSold: 9,
          totalRevenue: 157500,
          itemId: "68462079399e2f723dcee59f",
          itemName: "Area"
        },
        {
          totalSold: 15,
          totalRevenue: 97500,
          itemId: "684620e3399e2f723dcee5c1",
          itemName: "Ferea"
        },
        {
          totalSold: 14,
          totalRevenue: 21000,
          itemId: "68462299399e2f723dcee5ff",
          itemName: "Tercia"
        }
      ];
      jest.spyOn(Sale, "aggregate").mockResolvedValueOnce(mockData);

      await AdminController.getTop10Sales(req as Request, res as any);

      expect(res.json).toHaveBeenCalledWith(mockData);
    });

    it("should handle errors", async () => {
      jest.spyOn(Sale, "aggregate").mockRejectedValueOnce(new Error("DB error"));

      await AdminController.getTop10Sales(req as Request, res as any);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.status().json).toHaveBeenCalledWith(
        expect.objectContaining({ message: expect.stringContaining("Error fetching top 10 sales") })
      );
    });
  });

  // --- getStockItems ---
  describe("getStockItems", () => {
    it("should return items sorted by stock", async () => {
      const mockItems = [
        {
          "_id": "6845f70091c2abf8647c4705",
          "nombre": "Anillo Oro",
          "stock": 5
        },
        {
          "_id": "6845fdb491c2abf8647c4929",
          "nombre": "Esmeralda",
          "stock": 7
        },
        {
          "_id": "6845fa8491c2abf8647c484c",
          "nombre": "Sosa",
          "stock": 9
        },
        {
          "_id": "68463668399e2f723dcee878",
          "nombre": "Antero",
          "stock": 10
        },
        {
          "_id": "684621e8399e2f723dcee5f0",
          "nombre": "Iberia",
          "stock": 10
        },
        {
          "_id": "684620e3399e2f723dcee5c1",
          "nombre": "Ferea",
          "stock": 10
        },
        {
          "_id": "6846211f399e2f723dcee5cd",
          "nombre": "Eva",
          "stock": 10
        },
        {
          "_id": "68462079399e2f723dcee59f",
          "nombre": "Area",
          "stock": 11
        },
        {
          "_id": "6846215b399e2f723dcee5dc",
          "nombre": "Mira",
          "stock": 12
        },
        {
          "_id": "68462c7161164de6809d6822",
          "nombre": "Aneq123",
          "stock": 12
        },
        {
          "_id": "6845f1dfa720d8de2f811577",
          "nombre": "Manzana",
          "stock": 12
        },
        {
          "_id": "68462213399e2f723dcee5f5",
          "nombre": "Gotera",
          "stock": 14
        },
        {
          "_id": "684627bb399e2f723dcee6a6",
          "nombre": "Balea",
          "stock": 14
        },
        {
          "_id": "68462239399e2f723dcee5f8",
          "nombre": "Galatea",
          "stock": 20
        },
        {
          "_id": "68462190399e2f723dcee5df",
          "nombre": "Fave",
          "stock": 23
        },
        {
          "_id": "6846212061164de6809d6499",
          "nombre": "Lapiz",
          "stock": 24
        },
        {
          "_id": "68462022399e2f723dcee594",
          "nombre": "Garoa",
          "stock": 30
        },
        {
          "_id": "68462269399e2f723dcee5fc",
          "nombre": "Solea",
          "stock": 35
        },
        {
          "_id": "68462771399e2f723dcee687",
          "nombre": "Rova",
          "stock": 35
        },
        {
          "_id": "68462299399e2f723dcee5ff",
          "nombre": "Tercia",
          "stock": 36
        },
        {
          "_id": "6845ff1791c2abf8647c4982",
          "nombre": "Rubí",
          "stock": 40
        },
        {
          "_id": "6845f03f4ebc40b25aae82cb",
          "nombre": "Manzana23",
          "stock": 124
        }
      ];
      const sortMock = jest.fn().mockResolvedValueOnce(mockItems);
      const findMock = jest.spyOn(Item, "find").mockReturnValue({ sort: sortMock } as any);

      await AdminController.getStockItems(req as Request, res as any);

      expect(findMock).toHaveBeenCalledWith({}, { nombre: 1, stock: 1 });
      expect(sortMock).toHaveBeenCalledWith({ stock: 1 });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockItems);
    });

    it("should handle not found", async () => {
    const sortMock = jest.fn().mockResolvedValueOnce([]);
    jest.spyOn(Item, "find").mockReturnValue({ sort: sortMock } as any);

    await AdminController.getStockItems(req as Request, res as any);

    expect(res.status).toHaveBeenCalledWith(404);
  });
  });

  // --- getTopSalesman ---
  describe("getTopSalesman", () => {
    it("should return top salesmen", async () => {
      const mockSalesmen = [/* ...fill with expected salesmen... */];
      jest.spyOn(Sale, "aggregate").mockResolvedValueOnce(mockSalesmen);

      await AdminController.getTopSalesman(req as Request, res as any);

      expect(res.json).toHaveBeenCalledWith(mockSalesmen);
    });

    it("should handle errors", async () => {
      jest.spyOn(Sale, "aggregate").mockRejectedValueOnce(new Error("DB error"));

      await AdminController.getTopSalesman(req as Request, res as any);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.status().json).toHaveBeenCalledWith(
        expect.objectContaining({ message: expect.stringContaining("Error fetching top salesman") })
      );
    });
  });

  // --- getTotalRevenuePerYear ---
  describe("getTotalRevenuePerYear", () => {
    it("should return total revenue per year", async () => {
      const mockRevenue = [
        {
          "_id": {
            "year": 2024
          },
          "totalRevenue": 78000
        },
        {
          "_id": {
            "year": 2025
          },
          "totalRevenue": 392250
        }
      ];
      jest.spyOn(Sale, "aggregate").mockResolvedValueOnce(mockRevenue);

      await AdminController.getTotalRevenuePerYear(req as Request, res as any);

      expect(res.json).toHaveBeenCalledWith(mockRevenue);
    });

    it("should handle errors", async () => {
      jest.spyOn(Sale, "aggregate").mockRejectedValueOnce(new Error("DB error"));

      await AdminController.getTotalRevenuePerYear(req as Request, res as any);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.status().json).toHaveBeenCalledWith(
        expect.objectContaining({ message: expect.stringContaining("Error fetching top salesman") })
      );
    });
  });
});