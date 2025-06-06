import mongoose, { Document, Schema } from "mongoose";

export interface ISaleItem {
    itemId: mongoose.Types.ObjectId;
    amountOf: number;
    price: number;
}

export interface ISale extends Document {
    date: Date;
    sales: ISaleItem[];
    customerFullName: string;
    customerEmail: string;
    phoneNumber: string;
    total: number,
    salesman: mongoose.Types.ObjectId;
}

const saleItemSchema: Schema = new Schema({
    itemId: {
        type: Schema.Types.ObjectId,
        ref: 'Item',
        required: true,
    },
    amountOf: {
        type: Number,
        required: true,
        min: 1
    },
    price: {
        type: Number,
        required: true,
        min: 0
    }
});

const saleSchema: Schema<ISale> = new Schema({
    date: {
        type: Date,
        default: Date.now
    },
    sales: {
        type: [saleItemSchema],
        required: true,
        validate: {
            validator: (v: ISaleItem[]) => v.length > 0,
            message: 'At least one item is required'
        }
    },
    customerFullName: {
        type: String,
        required: true,
        trim: true
    },
    customerEmail: {
        type: String,
        required: true,
        trim: true
    },
    phoneNumber: {
        type: String,
        required: true,
        trim: true
    },
    salesman: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

saleSchema.virtual('total').get(function (this: ISale) {
    return this.sales.reduce((sum, item) => sum + (item.price * item.amountOf), 0);
});

saleSchema.pre('save', async function (next) {
    if (this.isNew) {
        const count = await Sale.countDocuments();
        this.set('saleId', count + 1);
    }
})

const Sale = mongoose.model<ISale>('Sale', saleSchema);
export default Sale;