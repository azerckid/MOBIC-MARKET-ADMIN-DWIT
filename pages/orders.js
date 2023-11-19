import Layout from "@/components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios.get("/api/order").then((res) => {
      console.log(res.data);
      setOrders(res.data);
    });
  }, []);

  return (
    <Layout title="Product" description="Product" keywords="Product">
      <h1>Orders</h1>
      <table className="basic">
        <tr>
          <th>DATE</th>
          <th>PAID</th>
          <th>Customer</th>
          <th>Products</th>
        </tr>
        <tbody>
          {orders.length > 0 &&
            orders.map((order) => (
              <tr key={order._id}>
                <td>{new Date(order.createdAt).toLocaleString("ko-KR")}</td>
                <td>{order.paid ? "Paid" : "Not Paid"}</td>
                <td>
                  {order.name}
                  <br />
                  {order.email}
                  <br />
                  {order.city}
                  <br />
                  {order.postalCode}
                  <br />
                  {order.streetAddress}
                  <br />
                  {order.apartment}
                  <br />
                  {order.country}
                </td>
                <td>
                  {order.line_items.map((line) => (
                    <div key={line._id}>
                      {line.price_data.product_data?.name} x {line.quantity}개
                      <br />
                    </div>
                  ))}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </Layout>
  );
}
