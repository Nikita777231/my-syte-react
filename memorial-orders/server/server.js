import express from 'express';
import cors from 'cors';
import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg;
const app = express();
const PORT = 5000;

// Подключение к PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'memorial_db',
  password: process.env.DB_PASSWORD || 'your_password',
  port: process.env.DB_PORT || 5432,
});

// Проверка подключения к БД
pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Ошибка подключения к БД:', err.stack);
  } else {
    console.log('✅ Подключение к PostgreSQL установлено');
    release();
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
// GET все заказы
app.get('/api/orders', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM orders ORDER BY id DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Ошибка при получении заказов:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// GET заказ по ID
app.get('/api/orders/:id', async (req, res) => {
  try {
    const orderId = parseInt(req.params.id);
    const result = await pool.query('SELECT * FROM orders WHERE id = $1', [orderId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Заказ не найден' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Ошибка при получении заказа:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// POST новый заказ
app.post('/api/orders', async (req, res) => {
  try {
    const {
      stone_type,
      size_label,
      custom_height,
      custom_width,
      production_method,
      flowerbed,
      stand,
      applied_cross,
      applied_photo,
      fio,
      date_from,
      date_to,
      flowers_or_candle,
      epitaph,
      price_total
    } = req.body;

    const result = await pool.query(
      `INSERT INTO orders 
       (stone_type, size_label, custom_height, custom_width, production_method,
        flowerbed, stand, applied_cross, applied_photo, fio,
        date_from, date_to, flowers_or_candle, epitaph, price_total) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) 
       RETURNING *`,
      [
        stone_type,
        size_label,
        custom_height || null,
        custom_width || null,
        production_method,
        flowerbed,
        stand,
        applied_cross,
        applied_photo,
        fio,
        date_from || null,
        date_to || null,
        flowers_or_candle,
        epitaph,
        price_total
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Ошибка при создании заказа:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// GET проверка работы сервера и БД
app.get('/api/test', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW() as current_time, version() as pg_version');
    res.json({ 
      message: 'Сервер и БД работают!',
      database: result.rows[0],
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка подключения к БД' });
  }
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`✅ Сервер запущен на http://localhost:${PORT}`);
  console.log(`📋 API доступно по: http://localhost:${PORT}/api/orders`);
  console.log(`🧪 Тест БД: http://localhost:${PORT}/api/test`);
});