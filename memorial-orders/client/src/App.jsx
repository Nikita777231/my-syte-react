import React, { useState } from "react";
import OrderForm from "./components/OrderForm";
import OrderList from "./components/OrderList";

// Простейшая "моковая" конфигурация цен
const mockPriceConfig = {
  stonePrices: {
    "Гранит": { "60x40x3": 5000, "80x40x3": 7000, "80x40x5": 12000, nonStandardPerSqCm: 0.6 },
    "Мрамор": { "60x40x3": 4500, "80x40x3": 6500, "80x40x5": 11000, nonStandardPerSqCm: 0.5 },
    "Диорит": { "60x40x3": 4000, "80x40x3": 6000, nonStandardPerSqCm: 0.45 },
    "Лабрадорит": { "60x40x3": 5500, "80x40x3": 8000, nonStandardPerSqCm: 0.65 },
    "Песчаник": { "60x40x3": 3000, "80x40x3": 4500, nonStandardPerSqCm: 0.3 },
    "Габбро": { "60x40x3": 5200, "80x40x3": 7500, nonStandardPerSqCm: 0.55 },
    "Известняк": { "60x40x3": 2800, "80x40x3": 4000, nonStandardPerSqCm: 0.25 }
  },
  extras: {
    stand: 1000,
    flowerbed: { small: 2000, medium: 3000, large: 4000 },
    cross: 800,
    photo: 1500,
    fioBase: 500,
    fioPerChar: 50,
    dates: 700,
    flowers: 500,
    candle: 400,
    epitaphPerChar: 30
  }
};

export default function App() {
  const [orders, setOrders] = useState([]);

  function handleCreateOrder(order) {
    setOrders(prev => [
      ...prev,
      { id: prev.length + 1, createdAt: new Date().toISOString(), ...order }
    ]);
  }

  return (
    <div className="app-container">
      <header>
        <h1>Система управления заказами</h1>
      </header>
      <main>
        <OrderForm priceConfig={mockPriceConfig} onCreate={handleCreateOrder} />
        <hr />
        <OrderList orders={orders} />
      </main>
    </div>
  );
}
