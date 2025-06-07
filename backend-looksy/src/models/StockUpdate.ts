import { Schema, model, Document, Types } from 'mongoose';

export interface IStockUpdate extends Document {
    item: Types.ObjectId;
    user: Types.ObjectId;
    stock: number;
    updatedAt: Date;
}

const stockUpdateSchema = new Schema<IStockUpdate>({
    item: { type: Schema.Types.ObjectId, ref: 'Item', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    stock: { type: Number, required: true },
    updatedAt: { type: Date, default: Date.now }
});

export default model<IStockUpdate>('StockUpdate', stockUpdateSchema);