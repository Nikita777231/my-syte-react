import React, { useState } from "react";
import "../styles/orders.css";
import { getOrderById } from "../api";

export default function Orders() {
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setError("");
    setOrder(null);
    setLoading(true);

    try {
      const data = await getOrderById(orderId);
      setOrder(data);
    } catch (err) {
      setError(err.message || "Ошибка при поиске заказа");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="orders-page">
      <form className="order-form" onSubmit={handleSearch}>
        <h2>Найти заказ</h2>
        <input
          type="number"
          placeholder="Введите ID заказа"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          required
          min="1"
        />
        <button type="submit" disabled={loading}>
          {loading ? "Поиск..." : "Найти"}
        </button>
      </form>

      {error && <p className="error-message">{error}</p>}

      {order && (
        <div className="order-details">
          <h2>Данные заказа #{order.id}</h2>
          <div className="order-info">
            <p><strong>Тип камня:</strong> {order.stone_type}</p>
            <p><strong>Размер:</strong> {order.size_label}</p>
            {order.custom_height && order.custom_width && (
              <p><strong>Кастомный размер:</strong> {order.custom_height} x {order.custom_width} см</p>
            )}
            <p><strong>Метод производства:</strong> {order.production_method}</p>
            <p><strong>ФИО:</strong> {order.fio}</p>
            {order.epitaph && <p><strong>Эпитафия:</strong> {order.epitaph}</p>}
            <p><strong>Цветы/свеча:</strong> {order.flowers_or_candle}</p>
            <p><strong>Общая стоимость:</strong> {order.price_total} ₽</p>
            
            <div className="order-features">
              <h4>Дополнительные услуги:</h4>
              {order.flowerbed && <span>Клумба</span>}
              {order.stand && <span>Столик</span>}
              {order.applied_cross && <span>Накладной крест</span>}
              {order.applied_photo && <span>Фотография</span>}
            </div>
            
            {order.created_at && (
              <p><strong>Дата создания:</strong> {new Date(order.created_at).toLocaleDateString()}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}