import React, { useEffect, useState } from "react";

export default function OrderList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/orders")
      .then((res) => res.json())
      .then((data) => {
        setOrders(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Ошибка загрузки заказов:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Загрузка...</p>;

  return (
    <div className="order-list">
      <h2>Список заказов</h2>
      {orders.length === 0 ? (
        <p>Заказов пока нет</p>
      ) : (
        <ul>
          {orders.map((order) => (
            <li key={order.id}>
              <strong>{order.name}</strong> — {order.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
