import { Schema, model, models } from "mongoose";

const OrderSchema = new Schema({
  line_items: Object,
  name: String,
  email: String,
  city: String,
  postalCode: String,
  streetAddress: String,
  apartment: String,
  country: String,
  products: String,
  paid: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const Order = models.Order || model("Order", OrderSchema);
