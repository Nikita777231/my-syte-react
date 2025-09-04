// Подключаем необходимые модули
const express = require('express');            // express для роутера
const router = express.Router();               // создаём роутер
const db = require('../db');                   // наш модуль работы с БД
const multer = require('multer');               // multer для загрузки фото
const path = require('path');                  // path для работы с путями

// импортируем конфиг цен и функцию computePrice
const { priceConfig, computePrice } = require('../config/prices');

// настраиваем multer — сохраняем файлы в папку uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', 'uploads')); // сохраняем в server/uploads
  },
  filename: function (req, file, cb) {
    // уникальное имя: timestamp-originalname
    const unique = Date.now() + '-' + file.originalname.replace(/\s+/g, '_');
    cb(null, unique);
  }
});
const upload = multer({ storage });

// ---------- Создание заказа (POST /api/orders) ----------
// Поддерживаем загрузку одного файла с полем 'photo'
router.post('/', upload.single('photo'), async (req, res) => {
  try {
    // данные могут прийти как multipart/form-data -> у нас req.body строки
    const body = req.body;

    // сбор details для расчёта цены — приводим нужные поля
    const details = {
      stone_type: body.stone_type,
      size_label: body.size_label,
      custom_height: body.custom_height,
      custom_width: body.custom_width,
      custom_thickness: body.custom_thickness,
      production_method: body.production_method,
      equipment_flowerbed: body.equipment_flowerbed || null,
      equipment_stand: body.equipment_stand === 'true' || body.equipment_stand === 'on',
      applied_cross: body.applied_cross === 'true' || body.applied_cross === 'on',
      applied_photo: !!req.file, // если файл загружен — фото true
      fio_text: body.fio_text || null,
      date_from: body.date_from || null,
      date_to: body.date_to || null,
      applied_flowers: body.applied_flowers || null,
      epitaph: body.epitaph || null
    };

    // расчитываем цену (может выкинуть ошибку при неверных данных)
    const prices = computePrice(details);

    // имя файла если загружено
    const photo_filename = req.file ? req.file.filename : null;

    // вставляем заказ в таблицу orders
    const insertSql = `
      INSERT INTO orders (
        stone_type, size_label, custom_height, custom_width, custom_thickness,
        production_method, equipment_flowerbed, equipment_stand,
        applied_cross, applied_photo, fio_text, date_from, date_to,
        applied_flowers, epitaph, photo_filename,
        price_stone, price_stand, price_flowerbed, price_cross,
        price_photo, price_fio, price_dates, price_flowers, price_epitaph, price_total
      ) VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,
        $17,$18,$19,$20,$21,$22,$23,$24,$25,$26
      ) RETURNING id
    `;

    const values = [
      details.stone_type, details.size_label, details.custom_height || null, details.custom_width || null, details.custom_thickness || null,
      details.production_method, details.equipment_flowerbed, details.equipment_stand,
      details.applied_cross, details.applied_photo, details.fio_text, details.date_from, details.date_to,
      details.applied_flowers, details.epitaph, photo_filename,
      prices.price_stone, prices.price_stand, prices.price_flowerbed, prices.price_cross,
      prices.price_photo, prices.price_fio, prices.price_dates, prices.price_flowers, prices.price_epitaph, prices.price_total
    ];

    const result = await db.query(insertSql, values);

    // возвращаем id созданного заказа и разбивку цен
    res.json({ id: result.rows[0].id, prices });
  } catch (err) {
    console.error('Error creating order:', err);
    res.status(400).json({ error: err.message || 'Ошибка при создании заказа' });
  }
});

// ---------- Получение заказа по id (GET /api/orders/:id) ----------
router.get('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    // выбираем заказ + данные клиента (если есть) через LEFT JOIN
    const sql = `
      SELECT o.*, c.full_name AS customer_name, c.phone AS customer_phone, c.city AS customer_city
      FROM orders o
      LEFT JOIN customers c ON o.customer_id = c.id
      WHERE o.id = $1
    `;
    const result = await db.query(sql, [id]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'Не найдено' });

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error get order:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// ---------- Поиск / список заказов (GET /api/orders) ----------
// опционально можно передать ?q=часть_ФИО_или_id
router.get('/', async (req, res) => {
  try {
    const q = (req.query.q || '').trim();
    if (!q) {
      // возвращаем последние 50 заказов
      const sql = `SELECT id, stone_type, size_label, created_at, price_total FROM orders ORDER BY created_at DESC LIMIT 50`;
      const r = await db.query(sql);
      return res.json(r.rows);
    } else {
      // поиск по id (если число) или по ФИО/город/камень
      if (/^\d+$/.test(q)) {
        const r = await db.query('SELECT id, stone_type, size_label, created_at, price_total FROM orders WHERE id = $1', [Number(q)]);
        return res.json(r.rows);
      } else {
        const like = `%${q}%`;
        const r = await db.query(`
          SELECT o.id,o.stone_type,o.size_label,o.created_at,o.price_total
          FROM orders o
          LEFT JOIN customers c ON o.customer_id = c.id
          WHERE o.fio_text ILIKE $1 OR c.full_name ILIKE $1 OR o.stone_type ILIKE $1
          ORDER BY o.created_at DESC LIMIT 50
        `, [like]);
        return res.json(r.rows);
      }
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// ---------- Обновление заказа (PUT /api/orders/:id) ----------
// поддерживаем изменение полей и замену фото (multipart/form-data)
router.put('/:id', upload.single('photo'), async (req, res) => {
  try {
    const id = Number(req.params.id);
    const body = req.body;

    // собираем детали как при создании
    const details = {
      stone_type: body.stone_type,
      size_label: body.size_label,
      custom_height: body.custom_height,
      custom_width: body.custom_width,
      custom_thickness: body.custom_thickness,
      production_method: body.production_method,
      equipment_flowerbed: body.equipment_flowerbed || null,
      equipment_stand: body.equipment_stand === 'true' || body.equipment_stand === 'on',
      applied_cross: body.applied_cross === 'true' || body.applied_cross === 'on',
      applied_photo: !!req.file,
      fio_text: body.fio_text || null,
      date_from: body.date_from || null,
      date_to: body.date_to || null,
      applied_flowers: body.applied_flowers || null,
      epitaph: body.epitaph || null
    };

    // пересчёт цен
    const prices = computePrice(details);

    // имя файла если загружено
    const photo_filename = req.file ? req.file.filename : null;

    // формируем SQL на обновление
    const updateSql = `
      UPDATE orders SET
        stone_type=$1, size_label=$2, custom_height=$3, custom_width=$4, custom_thickness=$5,
        production_method=$6, equipment_flowerbed=$7, equipment_stand=$8,
        applied_cross=$9, applied_photo=$10, fio_text=$11, date_from=$12, date_to=$13,
        applied_flowers=$14, epitaph=$15, photo_filename=COALESCE($16, photo_filename),
        price_stone=$17, price_stand=$18, price_flowerbed=$19, price_cross=$20,
        price_photo=$21, price_fio=$22, price_dates=$23, price_flowers=$24, price_epitaph=$25, price_total=$26
      WHERE id=$27
    `;

    const values = [
      details.stone_type, details.size_label, details.custom_height || null, details.custom_width || null, details.custom_thickness || null,
      details.production_method, details.equipment_flowerbed, details.equipment_stand,
      details.applied_cross, details.applied_photo, details.fio_text, details.date_from, details.date_to,
      details.applied_flowers, details.epitaph, photo_filename,
      prices.price_stone, prices.price_stand, prices.price_flowerbed, prices.price_cross,
      prices.price_photo, prices.price_fio, prices.price_dates, prices.price_flowers, prices.price_epitaph, prices.price_total,
      id
    ];

    await db.query(updateSql, values);

    res.json({ ok: true, prices });
  } catch (err) {
    console.error('Error updating order:', err);
    res.status(400).json({ error: err.message || 'Ошибка при изменении заказа' });
  }
});

// ---------- Удаление заказа (DELETE /api/orders/:id) ----------
router.delete('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    await db.query('DELETE FROM orders WHERE id=$1', [id]);
    res.json({ ok: true });
  } catch (err) {
    console.error('Error deleting order:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// ---------- Подтверждение заказа и запись данных клиента (POST /api/orders/:id/confirm) ----------
router.post('/:id/confirm', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { full_name, phone, city } = req.body;

    // вставляем клиента
    const r = await db.query(
      'INSERT INTO customers (full_name, phone, city) VALUES ($1,$2,$3) RETURNING id',
      [full_name, phone, city]
    );

    const customerId = r.rows[0].id;

    // обновляем заказ: связываем с клиентом
    await db.query('UPDATE orders SET customer_id=$1 WHERE id=$2', [customerId, id]);

    res.json({ ok: true, customerId });
  } catch (err) {
    console.error('Error confirming order:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

module.exports = router;