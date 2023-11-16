import Layout from "@/components/Layout";
import axios from "axios";
import { useRouter } from "next/router";

import { useState } from "react";

export default function NewProduct() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [images, setImages] = useState([]);
  const [goToProducts, setGoToProducts] = useState(false);
  const router = useRouter();

  async function saveProduct(event) {
    event.preventDefault();

    const product = { title, description, price, images };
    await axios
      .post("/api/products", product)
      .then((res) => console.log(res))
      .catch((err) => console.log(err));

    setGoToProducts(true);
  }
  if (goToProducts) {
    router.push("/products");
  }

  async function uploadImage(event) {
    const files = event.target?.files;
    if (!files) return;
    if (files?.length > 0) {
      const formData = new FormData();
      for (const file of files) {
        formData.append("file", file);
      }
      //   const response = await fetch("/api/upload", {
      //     method: "POST",
      //     body: formData,
      //   });
      //   console.log(response);
      const response = await axios
        .post("/api/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .catch((err) => console.log(err));
      console.log(response.data.links);
      setImages([...images, ...response.data.links]);
    }
  }

  return (
    <Layout>
      <form onSubmit={saveProduct}>
        <h1 className="text-blue-800 mb-2">New Product</h1>
        <label>Product Name</label>
        <input
          type="text"
          placeholder="product name"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        ></input>
        <label>Product Photos</label>
        <div className="mb-2 flex flex-wrap gap-1">
          {images?.map((image) => (
            <img
              key={image}
              src={image}
              alt="product"
              className="h-24 rounded-md mr-2"
            />
          ))}
          <label className="w-24 h-24 border flex justify-center items-center rounded-md bg-gray-300 cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15m0-3l-3-3m0 0l-3 3m3-3V15"
              />
            </svg>
            <div>upload</div>
            <input type="file" onChange={uploadImage} className="hidden" />
          </label>

          {!images?.length && <p>No images uploaded</p>}
        </div>
        <label>Product Description</label>
        <textarea
          placeholder="product description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        ></textarea>
        <label>Product Price</label>
        <input
          type="number"
          placeholder="product price"
          value={price}
          onChange={(event) => setPrice(event.target.value)}
        ></input>
        <button type="submit" className="btn-primary">
          save
        </button>
      </form>
    </Layout>
  );
}
