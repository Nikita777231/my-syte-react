import React, { useState } from "react";
import "../styles/orders.css";
import { getOrderById } from "../api";

export default function Orders() {
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    setError("");
    setOrder(null);

    try {
      const data = await getOrderById(orderId);
      setOrder(data)
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="orders-page">
      <form className="order-form" onSubmit={handleSearch}>
        <h2>Найти заказ</h2>
        <input
          type="text"
          placeholder="Введите ID заказа"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          required
        />
        <button type="submit">Найти</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {order && (
        <div className="order-list">
          <h2>Результат</h2>
          <p>
            <strong>ID:</strong> {order.id}
          </p>
          <p>
            <strong>Имя:</strong> {order.name}
          </p>
          <p>
            <strong>Описание:</strong> {order.description}
          </p>
        </div>
      )}
    </div>
  );
}
