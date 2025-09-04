// инициализация конфигурации из .env
require('dotenv').config();

// импорт библиотек
const express = require('express');
const cors = require('cors');
const path = require('path');

// импорт роутера заказов
const ordersRouter = require('./routes/orders');

// создаём приложение express
const app = express();

// получаем порт из env или 4000 по умолчанию
const PORT = process.env.PORT || 4000;

// общие middlewares
app.use(cors());                // разрешаем CORS (для dev между client<->server)
app.use(express.json());        // умеем парсить JSON
app.use(express.urlencoded({ extended: true })); // парсим urlencoded (формы)

// отдаём статически загруженные файлы (фото) из папки uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// роуты
app.use('/api/orders', ordersRouter);

// опционально отдаём конфиг цен через API (полезно фронту)
app.get('/api/prices', (req, res) => {
  const { priceConfig } = require('./config/prices');
  res.json(priceConfig);
});

// корневой маршрут — простая подсказка
app.get('/', (req, res) => {
  res.send('Memorial Orders API. Use /api/orders');
});

// запуск сервера
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});