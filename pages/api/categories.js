import { Category } from "@/models/category";

export default async function handler(req, res) {
  const method = req.method;
  // await isAdminRequest(req, res);

  if (method === "GET") {
    const { id } = req.query;
    if (id) {
      const data = await Category.findById(id);
      res.status(200).json({ data });
    }
    const categories = await Category.find({}).populate("parentCategory");
    res.status(200).json(categories);
  }

  if (method === "POST") {
    const { name, parentCategory, properties } = req.body;
    const CategoryDoc = await Category.create({
      name,
      parentCategory: parentCategory || undefined,
      properties,
    });
    res.status(200).json(CategoryDoc);
  }

  if (method === "DELETE") {
    // const { id } = req.query;
    const { id } = req.body;
    try {
      const deletedCategory = await Category.findByIdAndDelete(id);
      res.status(200).json({ message: "Category deleted", deletedCategory });
    } catch (error) {
      res.status(400).json({ message: "Category not deleted", error });
    }
  }

  if (method === "PUT") {
    const { name, parentCategory, properties, _id } = req.body;
    const CategoryDoc = await Category.findByIdAndUpdate(
      { _id },
      {
        name,
        parentCategory: parentCategory || undefined,
        properties,
      }
    );
    res.status(200).json(CategoryDoc);
  }
}
