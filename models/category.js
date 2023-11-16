import mongoose, { Schema, models, model } from "mongoose";

const CategorySchema = new Schema({
  name: { type: String, required: true },
  parentCategory: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  properties: [{ type: Object }],
  createdAt: { type: Date, default: Date.now },
});

export const Category = models?.Category || model("Category", CategorySchema);
