import Layout from "@/components/Layout";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function DeleteProductPage() {
  const [productInfo, setProductInfo] = useState({});
  const router = useRouter();
  const { id } = router.query;
  useEffect(() => {
    if (!id) return;
    axios
      .get("/api/products?id=" + id)
      .then((res) => {
        setProductInfo(res.data.oneproduct);
      })
      .catch((err) => console.log(err));
  }, [id]);

  function goBack() {
    router.push("/products");
  }
  function deleteProduct() {
    axios
      .delete("/api/products?id=" + id)
      .then((res) => {
        console.log(res);
        router.push("/products");
      })
      .catch((err) => console.log(err));
  }

  return (
    <Layout>
      <h1 className="text-blue-800 mb-2">Delete Product</h1>
      <p>Do you sure you want to delete "{productInfo?.title}" product? </p>
      <div className="flex space-x-3 mt-4">
        <button onClick={deleteProduct} className="btn-primary">
          Yes
        </button>
        <button
          onClick={goBack}
          className="bg-red-600 px-4 rounded-md text-white"
        >
          No
        </button>
      </div>
    </Layout>
  );
}
