import mongoose from "mongoose";

export class ValidationUtils {
  static isValidObjectId(id: string): boolean {
    return mongoose.Types.ObjectId.isValid(id);
  }

  static isValidName(name: string): boolean {
    return !!(name && name.trim() !== '');
  }

  static sanitizeName(name: string): string {
    return name.trim();
  }

  static isSelfParent(categoryId: string, parentId: string): boolean {
    return categoryId === parentId;
  }
}