-- Создание таблицы customers (клиенты)
CREATE TABLE IF NOT EXISTS customers (
  id SERIAL PRIMARY KEY,                           -- уникальный идентификатор клиента
  full_name TEXT NOT NULL,                         -- ФИО клиента
  phone VARCHAR(32) NOT NULL,                      -- телефон
  city VARCHAR(128),                               -- город проживания
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()-- время создания записи
);

-- Создание таблицы orders (заказы)
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,                           -- id заказа
  stone_type VARCHAR(64) NOT NULL,                 -- вид камня (Гранит/Мрамор/...)
  size_label VARCHAR(32) NOT NULL,                 -- стандартный размер (например 60x40x3) или 'НЕСТАНДАРТ'
  custom_height INT NULL,                          -- если нестандарт — высота (мм)
  custom_width INT NULL,                           -- ширина (мм)
  custom_thickness INT NULL,                       -- толщина (мм)
  production_method VARCHAR(64),                   -- способ полировки
  equipment_flowerbed VARCHAR(16),                 -- 'none'|'small'|'medium'|'large'
  equipment_stand BOOLEAN DEFAULT FALSE,           -- есть ли подставка
  applied_cross BOOLEAN DEFAULT FALSE,            -- крестик
  applied_photo BOOLEAN DEFAULT FALSE,            -- есть ли фотография
  fio_text TEXT,                                   -- текст ФИО (если нужно хранить)
  date_from DATE,                                  -- дата рождения
  date_to DATE,                                    -- дата смерти
  applied_flowers VARCHAR(16),                     -- 'flowers'|'candle'|NULL
  epitaph TEXT,                                    -- эпитафия
  photo_filename TEXT,                             -- имя файла фото (если загружали)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  customer_id INT REFERENCES customers(id) ON DELETE SET NULL,
  -- разбивка на компоненты цены (для прозрачности)
  price_stone NUMERIC(10,2) DEFAULT 0,
  price_stand NUMERIC(10,2) DEFAULT 0,
  price_flowerbed NUMERIC(10,2) DEFAULT 0,
  price_cross NUMERIC(10,2) DEFAULT 0,
  price_photo NUMERIC(10,2) DEFAULT 0,
  price_fio NUMERIC(10,2) DEFAULT 0,
  price_dates NUMERIC(10,2) DEFAULT 0,
  price_flowers NUMERIC(10,2) DEFAULT 0,
  price_epitaph NUMERIC(10,2) DEFAULT 0,
  price_total NUMERIC(10,2) DEFAULT 0
);
