import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import OrderForm from "./components/OrderForm";
import OrderList from "./components/OrderList";
import DockBar from "./components/DockBar";
import PageLayout from "./components/PageLayout";
import { usesEffect, useState } from "react";
import ThemeToggle from "./components/ThemeToggle";


/* Простые заглушки — можешь заменить на реальные компоненты */
 function Prices() {
  return(
    <PageLayout title="Цены">
      <p>Здесь список доступных размеров и цен</p>
    </PageLayout>
  );
}
function Settings() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else
    {
      document.documentElement.classList.remove(
        "dark"
      );
    }
  }, [dark]);

  return (
    <PageLayout title="Настройки">
      <div className="flex items-center gap-3">
        <span className="text-lg font-medium dark:text-gray-100">Тёмная тема</span>
        <ThemeToggle dark={dark} setDark={setDark} />
      </div>
    </PageLayout>
  );
}

export default function App() {
  // оставляем отступ снизу в контенте, чтобы док не перекрывал содержимое
  return (
    <>
      <div style={{ minHeight: "100vh", paddingTop: "100px" }}>
        <Routes>
          <Route path="/" element={<OrderForm />} />
          <Route path="/orders" element={<OrderList orders={[]} />} />
          <Route path="/prices" element={<Prices />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>

      <DockBar />
    </>
  );
}

