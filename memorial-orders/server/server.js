import express from 'express';
import cors from 'cors';
import pkg from 'pg';

const {Pool} = pkg;

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool ({
    user: "postgres",
    host: "localhost",
    database: "memorial_db",
    port: 5432
})

app.post('/api/orders', async (req, res) => {
    try{
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
   VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
   RETURNING *`,
  [
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
    date_from || null,
    date_to || null,
    flowers_or_candle,
    epitaph,
    price_total
  ]
);

    res.json(result.rows[0]);
    } catch (err){
        console.error("Ошибка при добавлении заказа", err);
        res.status(500).json({error: "Ошибка сервера"});
    }
});

app.get('/api/orders', async (req, res) => {
    const result = await pool.query("SELECT * FROM orders ORDER BY id DESC");
    res.json(result.rows);
});

app.listen(4000, () => {
    console.log("Сервер запущен на http://localhost:4000");
});