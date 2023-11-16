import Layout from "@/components/Layout";
import ProductForm from "@/components/ProductForm";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function EditProductPage() {
  const [productInfo, setProductInfo] = useState({});

  const router = useRouter();
  console.log("QUERY", router.query);
  let id;
  if (router.query?.editproduct) {
    id = router?.query?.editproduct[0];
  } else {
    id = router?.query;
  }

  console.log("ID", id);
  useEffect(() => {
    if (!id) return;
    axios
      .get("/api/products?id=" + id)
      .then((res) => {
        console.log("RES.DATA", res.data);
        setProductInfo(res.data.data);
        // console.log(res.data.oneproduct);
      })
      .catch((err) => console.log(err));
  }, [id]);
  console.log("PRODUCTINFO", productInfo);
  return (
    <Layout>
      <ProductForm {...productInfo}></ProductForm>
    </Layout>
  );
}
