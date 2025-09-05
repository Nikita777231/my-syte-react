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
    
    {/* Новые поля из БД */}
    {order.date_from && (
      <p><strong>Дата от:</strong> {new Date(order.date_from).toLocaleDateString()}</p>
    )}
    {order.date_to && (
      <p><strong>Дата до:</strong> {new Date(order.date_to).toLocaleDateString()}</p>
    )}
    
    <p><strong>Общая стоимость:</strong> {order.price_total} ₽</p>

    <div className="order-features">
      <h4>Дополнительные услуги:</h4>
      <div className="features-list">
        {order.flowerbed && <span className="feature-tag">Клумба</span>}
        {order.stand && <span className="feature-tag">Столик</span>}
        {order.applied_cross && <span className="feature-tag">Накладной крест</span>}
        {order.applied_photo && <span className="feature-tag">Фотография</span>}
      </div>
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