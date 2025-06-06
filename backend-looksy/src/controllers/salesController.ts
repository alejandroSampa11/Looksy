import { Request, Response } from 'express';
import Sale from '../models/Sale';
import { ISaleItem } from '../models/Sale'
import Item from '../models/Item';
import { IItem } from '../models/Item';
import User from '../models/user';

/**
 * @swagger
 * tags:
 *   name: Sales
 *   description: Sales management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     SaleItem:
 *       type: object
 *       required:
 *         - itemId
 *         - amountOf
 *         - price
 *       properties:
 *         itemId:
 *           type: string
 *           description: ID of the item being sold
 *           example: 665aa1d199a7f99ddab6b123
 *         amountOf:
 *           type: number
 *           description: Quantity of the item sold
 *           minimum: 1
 *           example: 2
 *         price:
 *           type: number
 *           description: Price per unit at time of sale
 *           minimum: 0
 *           example: 29.99
 *
 *     Sale:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated ID of the sale
 *           example: 665bb2e299a7f99ddab6b456
 *         date:
 *           type: string
 *           format: date-time
 *           description: The date when the sale was created
 *           example: 2024-05-31T14:30:00.000Z
 *         sales:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/SaleItem'
 *         customerFullName:
 *           type: string
 *           description: Full name of the customer
 *           example: John Doe
 *         customerEmail:
 *           type: string
 *           format: email
 *           description: Customer's email address
 *           example: john.doe@example.com
 *         phoneNumber:
 *           type: string
 *           description: Customer's phone number
 *           example: +1234567890
 *         total:
 *           type: number
 *           description: Calculated total price (virtual field)
 *           example: 59.98
 */

/**
 * @swagger
 * /api/sales:
 *   post:
 *     summary: Create a new sale
 *     tags: [Sales]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sales
 *               - customerFullName
 *               - customerEmail
 *               - phoneNumber
 *             properties:
 *               sales:
 *                 type: array
 *                 minItems: 1
 *                 items:
 *                   $ref: '#/components/schemas/SaleItem'
 *               customerFullName:
 *                 type: string
 *               customerEmail:
 *                 type: string
 *                 format: email
 *               phoneNumber:
 *                 type: string
 *     responses:
 *       201:
 *         description: Sale created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Sale'
 *       400:
 *         description: Missing fields or validation error
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
 *                   example: Missing required fields
 *       404:
 *         description: Item not found
 *       500:
 *         description: Server error
 */
export const createSale = async (req: Request, res: Response) => {
    try {
        const { sales, customerFullName, customerEmail, phoneNumber, salesman } = req.body as {
            sales: ISaleItem[];
            customerFullName: string;
            customerEmail: string;
            phoneNumber: string;
            salesman: string;
        }

        const missingFields = [];

        if (!sales) missingFields.push("Sales");
        if (!customerFullName) missingFields.push("customerFullName");
        if (!customerEmail) missingFields.push("customerEmail");
        if (!phoneNumber) missingFields.push("phoneNumber");
        if (!salesman) missingFields.push("salesman");
        if (missingFields.length > 0) {
            return res.status(400).json({ message: `Missing required fields: ${missingFields.join(', ')}` });
        }

        for (const saleItem of sales) {
            const item = await Item.findById(saleItem.itemId) as IItem;
            if (!item) {
                return res.status(404).json({ message: `Item with ID ${saleItem.itemId} not found` });
            }

            if (item.stock < saleItem.amountOf) {
                return res.status(400).json({ message: `Item ${item.nombre} trying to add more than stock (${item.stock})` });
            }

            const existingSalesman = await User.findById(salesman);
            if (!existingSalesman) {
                return res.status(404).json({ message: `Salesman with ID ${salesman} not found` });
            }

            const newSale = new Sale({
                sales,
                customerFullName,
                customerEmail,
                phoneNumber,
                salesman
            });

            const savedSale = await newSale.save();

            for (const saleItem of sales) {
                await Item.findByIdAndUpdate(
                    saleItem.itemId,
                    {
                        $inc: {
                            stock: -saleItem.amountOf,
                            sales: saleItem.amountOf
                        }
                    }
                )
            }

            const populatedSale = await Sale.findById(savedSale._id).populate('sales.itemId');
            return res.status(201).json(populatedSale);
        }
    } catch (err: any) {
        res.status(500).json({ message: err.message })
    }
}

export const getAllSales = async (req: Request, res: Response) => {
    try {
        const sales = await Sale.find()
            .sort({ date: -1 })
            .populate('sales.itemId');

        res.json(sales);
    } catch (err: any) {
        res.status(500).json({ message: err.message })
    }
}

export const getSale = async (req: Request, res: Response) => {
    try {
        const { saleId } = req.params

        if (!saleId) {
            return res.status(400).json({ message: 'Sale ID required' });
        }

        const sale = (await Sale.findById(saleId)).populated('sales.itemId');

        if (!sale) {
            return res.status(404).json({ message: 'Sale not found' });
        }

        res.json(sale);
    } catch (err: any) {
        res.status(500).json({ message: err.message })
    }
}