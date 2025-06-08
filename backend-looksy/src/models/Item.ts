import mongoose, { Document, Schema } from "mongoose";
export interface IItem extends Document {
  id: string;
  nombre: string;
  categoria: number;
  precio: number;
  stock: number;
  descripcion: string;
  imageUrl: string;
  sales: number;
  rating: number;
}
const itemSchema: Schema<IItem> = new Schema({
  nombre: {
    type: String,
    trim: true,
    required: true,
  },
  categoria: {
    type: Number,
    required: true,
  },
  precio: {
    type: Number,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  descripcion: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  sales: {
    type: Number,
    default: 0,
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  }
});

const Item = mongoose.model<IItem>("Item", itemSchema);
export default Item;
