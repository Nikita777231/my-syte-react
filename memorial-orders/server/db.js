// Подключаем dotenv чтобы читать переменные окружения из .env
require('dotenv').config();

// Подключаем Pool из pg для управления соединениями с PostgreSQL
const { Pool } = require('pg');

// Создаём пул соединений, используя строку подключения из env (DATABASE_URL)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Экспортируем удобную функцию query для выполнения SQL запросов
module.exports = {
  query: (text, params) => pool.query(text, params),
  pool, // экспортируем сам пул (если нужно напрямую)
};