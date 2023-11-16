import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/product";
// import { isAdminRequest } from "./auth/[...nextauth]";

export default async function handler(req, res) {
  const { method } = req;
  await mongooseConnect();
  // await isAdminRequest(req, res);

  if (method === "POST") {
    const { title, description, price, categoryName, categoryID, images } =
      req.body;
    const productDoc = await Product.create({
      title,
      description,
      price,
      categoryName,
      category: categoryID,
      images,
    });
    res.status(200).json({ message: "Product saved", productDoc });
  }
  if (method === "GET") {
    const { id } = req.query;
    if (id) {
      const data = await Product.findById(id);
      res.status(200).json({ data });
    } else {
      const products = await Product.find({});
      res.status(200).json({ products });
    }
  }
  if (method === "PUT") {
    const { _id, title, description, price, categoryName, categoryID, images } =
      req.body;
    try {
      const updatedProduct = await Product.findByIdAndUpdate(
        _id,
        {
          title,
          description,
          price,
          categoryName,
          category: categoryID,
          images,
          updatedAt: Date.now(),
        },
        { new: true }
      );
      res.status(200).json({ message: "Product updated", updatedProduct });
    } catch (error) {
      res.status(400).json({ message: "Product not updated", error });
    }
  }
  if (method === "DELETE") {
    const { id } = req.query;
    try {
      const deletedProduct = await Product.findByIdAndDelete(id);
      res.status(200).json({ message: "Product deleted", deletedProduct });
    } catch (error) {
      res.status(400).json({ message: "Product not deleted", error });
    }
  }
}
