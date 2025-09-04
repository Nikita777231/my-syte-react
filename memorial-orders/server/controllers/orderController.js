// временные данные (позже заменим на БД)
let orders = [
  { id: 1, name: "Иван Иванов", description: "Памятник, гравировка" },
  { id: 2, name: "Петр Петров", description: "Установка ограды" },
];

// GET /api/orders
export const getOrderById = (req, res) => {
  consts = {id} = req.params;
  const order = orders.find((o) => o.id.toString() === id);

  if (!order) {
    return res.status(404).json({message: "Заказ не найден"});
  }
  res.json(order);
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

// POST /api/orders/upload
export const uploadFile = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Файл не загружен" });
  }

  res.json({
    message: "Файл успешно загружен",
    fileUrl: `/uploads/${req.file.filename}`,
  });
};
