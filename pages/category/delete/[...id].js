import Layout from "@/components/Layout";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function DeleteCategoryPage() {
  const [productInfo, setProductInfo] = useState({});
  const [categoryInfo, setCategoryInfo] = useState({}); // [null, setCategoryInfo
  const router = useRouter();
  const { id } = router.query;
  console.log("id", id);

  useEffect(() => {
    if (!id) return;
    axios
      .get("/api/categories?id=" + id)
      .then((res) => {
        console.log(res);
        setCategoryInfo(res.data.data);
      })
      .catch((err) => console.log(err));
  }, [id]);

  function goBack() {
    router.push("/categories");
  }
  function deleteCategory() {
    axios
      .delete("/api/categories?id=" + id)
      .then((res) => {
        console.log(res);
        router.push("/categories");
      })
      .catch((err) => console.log(err));
  }

  return (
    <Layout>
      <h1 className="text-blue-800 mb-2">Delete Category</h1>
      <p>
        Do you sure you want to delete &quot; {categoryInfo?.name} &quot;
        category?
      </p>
      <div className="flex space-x-3 mt-4">
        <button onClick={deleteCategory} className="btn-primary">
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
