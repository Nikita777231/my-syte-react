import express from 'express';
const router = express.Router();

// временные данные
let orders = [
  { id: 1, name: "Иван Иванов", description: "Памятник, гравировка" },
  { id: 2, name: "Петр Петров", description: "Установка ограды" },
];

// GET /api/orders/:id
export const getOrderById = (req, res) => {
  const { id } = req.params;
  const order = orders.find((o) => o.id.toString() === id);

  if (!order) {
    return res.status(404).json({ message: "Заказ не найден" });
  }
  res.json(order);
};

// GET /api/orders
export const getOrders = (req, res) => {
  res.json(orders);
};

// POST /api/orders
export const createOrder = (req, res) => {
  const { name, description } = req.body;

  if (!name || !description) {
    return res.status(400).json({ message: "Имя и описание обязательны" });
  }

  const newOrder = {
    id: Date.now(),
    name,
    description,
  };

  orders.push(newOrder);
  res.status(201).json(newOrder);
};

export default router;