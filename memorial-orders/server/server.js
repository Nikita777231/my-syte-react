import express from 'express';
import cors from 'cors';
import pkg from 'pg';
import dotenv from 'dotenv';
import multer from 'multer';

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




// Настройка multer для загрузки файлов
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'photo-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limit: {fileSize: 5 * 1024 * 1024}, // 5MB
});
// POST новый заказ
app.post('/api/orders', upload.single('photo'), async (req, res) => {
  try {
    const orderData = {
      stone_type: req.body.stone_type,
      size_label: req.body.size_label,
      custom_height: req.body.custom_height,
      custom_width: req.body.custom_width,
      production_method: req.body.production_method,
      fio: req.body.fio,
      epitaph: req.body.epitaph,
      flowers_or_candle: req.body.flowers_or_candle,
      date_from: req.body.date_from,
      date_to: req.body.date_to,
      flowerbed: req.body.flowerbed === 'on',
      stand: req.body.stand === 'on',
      applied_cross: req.body.applied_cross === 'on',
      applied_photo: req.body.applied_photo === 'on',
      price_total: req.body.price_total,
      photo_filename: req.file ? req.file.filename : null
    };

    const newOrder = await Order.create(orderData);
    res.status(201).json(newOrder);
    
  } catch (error) {
    res.status(500).json({ error: error.message });
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