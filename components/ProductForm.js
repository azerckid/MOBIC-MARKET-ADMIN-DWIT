import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Spinner from "./spinner";
import { ReactSortable } from "react-sortablejs";

export default function ProductForm({
  _id,
  title: existingTitle,
  description: existingDescription,
  price: existingPrice,
  categoryName: existingCategoryName,
  category: existingCategory,
  images: existingImages,
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [images, setImages] = useState([]);

  const [goToProducts, setGoToProducts] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [categories, setCategories] = useState([]);

  // const assinged = categories.find((cat) => cat._id === existingCategory);
  // const assingedCategory = assinged?.name;

  const [category, setCategory] = useState(existingCategory);
  const [categoryName, setCategoryName] = useState(existingCategoryName);

  const router = useRouter();

  async function saveProduct(event) {
    event.preventDefault();
    const categoryID = categories.find((cat) => cat.name === category);
    const product = {
      title,
      description,
      price,
      categoryName,
      categoryID,
      images,
    };
    if (_id) {
      await axios
        .put("/api/products", { ...product, _id })
        .then((res) => console.log(res))
        .catch((err) => console.log(err));
    } else {
      await axios
        .post("/api/products", product)
        .then((res) => console.log(res))
        .catch((err) => console.log(err));
    }
    setGoToProducts(true);
  }

  if (goToProducts) {
    router.push("/products");
  }

  async function uploadImage(event) {
    const files = event.target?.files;
    if (!files) return;
    if (files?.length > 0) {
      setIsUploading(true);
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
      setImages((oldImages) => [...oldImages, ...response.data.links]);
      setIsUploading(false);
    }
  }
  function uploadImagesOrder(images) {
    setImages(images);
  }
  //  04:57분 부터 다시 보기
  // todo : product properties save
  const propertiesToFill = [];
  console.log("WHAT IS THIS", category);
  const selectedCategory = categories.find((cat) => cat.name === category);
  console.log("selectedCategory", selectedCategory);
  // propertiesToFill.push(...selectedCategory?.properties);
  if (categories.length > 0 && selectedCategory) {
    let catInfo = categories.find((cat) => cat._id === selectedCategory._id);
    console.log("catInfoProperties", catInfo.properties);
    propertiesToFill.push(...catInfo.properties);
  }

  useEffect(() => {
    setTitle(existingTitle);
    setDescription(existingDescription);
    setCategoryName(existingCategoryName);
    setPrice(existingPrice);
    setCategory(existingCategory);
    setImages(existingImages);
  }, [existingTitle, existingDescription, existingPrice, existingImages]);

  useEffect(() => {
    axios.get("/api/categories").then((res) => setCategories(res.data));
  }, []);

  return (
    <form onSubmit={saveProduct}>
      <h1 className="text-blue-800 mb-2">Edit Product</h1>
      <label>Product Name</label>
      <input
        type="text"
        placeholder={existingTitle}
        value={title}
        onChange={(event) => setTitle(event.target.value)}
      ></input>
      <label>Category</label>
      <select
        value={category}
        onChange={(event) => {
          setCategory(event.target.value);
          setCategoryName(event.target.value);
        }}
        className="mb-0 py-1.5"
      >
        <option>{existingCategoryName}</option>
        {categories.length > 0 &&
          categories?.map((category) => (
            <option key={category._id}>{category.name}</option>
          ))}
      </select>

      <div className="m-4">
        <h2 className="mt-2 text-lg">properties</h2>
        {categories.length === 0 && <p>No categories created</p>}
        {propertiesToFill.length > 0 &&
          propertiesToFill?.map((property) => (
            <div key={property.name} className="">
              <span className="m-0">- {property.name} : </span>
              <span className="m-0">{property.value}</span>
            </div>
          ))}
      </div>

      <label>Product Photos</label>
      <div className="mb-2 flex flex-wrap gap-1">
        <ReactSortable
          list={images}
          setList={uploadImagesOrder}
          className="flex"
        >
          {images?.map((image) => (
            <img
              key={image}
              src={image}
              alt="product"
              className="h-24 rounded-md mr-2"
            />
          ))}
        </ReactSortable>
        {isUploading && (
          <div className="h-24 flex justify-center items-center">
            <Spinner></Spinner>
          </div>
        )}
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
        placeholder={existingDescription}
        value={description}
        onChange={(event) => setDescription(event.target.value)}
      ></textarea>
      <label>Product Price</label>
      <input
        type="number"
        placeholder={existingPrice}
        value={price}
        onChange={(event) => setPrice(event.target.value)}
      ></input>
      <button type="submit" className="btn-primary">
        save
      </button>
    </form>
  );
}
