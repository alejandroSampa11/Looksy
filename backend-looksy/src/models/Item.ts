import mongoose, { Document, Schema } from "mongoose";
export interface IItem extends Document {
  id: string;
  nombre: string;
  categoria: string;
  subcategoria?: mongoose.Types.ObjectId;
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
    type: String,
    required: true,
  },
  subcategoria: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: false, // Opcional porque no todos los items tienen subcategoría
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
    max: 5,
  },
});

const Item = mongoose.model<IItem>("Item", itemSchema);
export default Item;
