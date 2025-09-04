import React, { useState } from "react";

export default function OrderForm({ onOrderCreated }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // создаем заказ
    const response = await fetch("http://localhost:5000/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description }),
    });

    const newOrder = await response.json();

    // загружаем файл (если есть)
    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      await fetch("http://localhost:5000/api/orders/upload", {
        method: "POST",
        body: formData,
      });
    }

    // обновляем список заказов
    if (onOrderCreated) {
      onOrderCreated(newOrder);
    }

    setName("");
    setDescription("");
    setFile(null);
  };

  return (
    <form className="order-form" onSubmit={handleSubmit}>
      <h2>Создать заказ</h2>
      <input
        type="text"
        placeholder="Имя клиента"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <textarea
        placeholder="Описание заказа"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button type="submit">Создать</button>
    </form>
  );
}
