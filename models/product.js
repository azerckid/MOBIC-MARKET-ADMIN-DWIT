import mongoose, { Schema, models, model } from "mongoose";

const ProductSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  categoryName: { type: String },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  images: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const Product = models.Product || model("Product", ProductSchema);
