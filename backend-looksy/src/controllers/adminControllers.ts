import Item from '../models/Item';
import User from '../models/user';
import Sale from '../models/Sale';


export const getTop10Sales = async (req, res) => {
    try {
        const topSales = await Sale.aggregate([
            { $unwind: '$sales' },
            {
                $group: {
                    _id: '$sales.itemId',
                    totalSold: { $sum: '$sales.amountOf' },
                    totalRevenue: { $sum: { $multiply: ['$sales.price', '$sales.amountOf'] } }
                }
            },
            {
                $lookup: {
                    from: 'items',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'item'
                }
            },
            { $unwind: '$item' },
            { $sort: { totalRevenue: -1 } },
            { $limit: 10 },
            {
                $project: {
                    _id: 0,
                    itemId: '$item._id',
                    itemName: '$item.nombre',
                    totalSold: 1,
                    totalRevenue: 1
                }
            }
        ]);
        res.json(topSales);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching top 10 sales', error: error.message });
    }
}

export const getStockItems = async (req, res) => {
    try {
        const items = await Item.find({}, { nombre: 1, stock: 1 }).sort({stock: 1});
        if(!items || items.length === 0) {
            return res.status(404).json({ message: 'No iteems found' });
        }
        return res.status(200).json(items);
    } catch (error: any) {
        res.status(500).json({message: `Error `})
    }
}

export const getTopSalesman = async (req, res) => {
    try {
        const topSalesman = await Sale.aggregate([
            { $unwind: '$sales' },
            {
                $group: {
                    _id: '$salesman',
                    totalRevenue: { $sum: { $multiply: ['$sales.price', '$sales.amountOf'] } }
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'salesman'
                }
            },
            { $unwind: '$salesman' },
            { $sort: { totalRevenue: -1 } },
            {
                $project: {
                    _id: 0,
                    salesmanId: '$salesman._id',
                    salesmanName: { $concat: ['$salesman.firstName', ' ', '$salesman.lastName'] },
                    totalRevenue: 1
                }
            }
        ]);

        res.json(topSalesman)
    } catch (error: any) {
        res.status(500).json({ message: `Error fetching top salesman: ${error.message}` });
    }
}