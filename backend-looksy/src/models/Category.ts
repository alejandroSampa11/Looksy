import express from 'express';
import mongoose, { Document, Schema } from 'mongoose';

export interface ICategory extends Document {
  _id: mongoose.Types.ObjectId;
  nombre: string;
  parentId: mongoose.Types.ObjectId | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICategoryResponse {
  _id: string;
  nombre: string;
  parentId: string | null;
  hasChildren?: boolean;
  children?: ICategoryResponse[];
}

export interface IApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

const categorySchema = new Schema<ICategory>({
  nombre: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    default: null,
  },
}, {
  timestamps: true
});


export const Category = mongoose.model<ICategory>('Category', categorySchema);