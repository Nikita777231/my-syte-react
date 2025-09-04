// Конфигурация цен и логика расчёта цены
// Вся валюта — рубли (₽)

// экспортируем объект с прайс-листом
const priceConfig = {
  // для стандартных размеров — словари по камням и размерам
  stonePrices: {
    // пример: для каждого камня указаны цены для стандартных размеров
    // эти числа — примеры, их можно изменить под реальные.
    "Гранит": {
      "60x40x3": 8000,
      "80x40x3": 10000,
      "80x40x5": 12000,
      "80x40x8": 15000,
      "100x50x5": 18000,
      "100x50x8": 22000,
      "120x60x8": 30000,
      // цена за кв.см для нестандартного (мы используем площадь в см^2 * rate)
      nonStandardPerSqCm: 0.5
    },
    "Мрамор": {
      "60x40x3": 9000,
      "80x40x3": 11000,
      "80x40x5": 13000,
      "80x40x8": 16000,
      "100x50x5": 19000,
      "100x50x8": 23000,
      "120x60x8": 32000,
      nonStandardPerSqCm: 0.6
    },
    "Диорит": {
      "60x40x3": 8500,
      "80x40x3": 10500,
      "80x40x5": 12500,
      "80x40x8": 15500,
      "100x50x5": 18500,
      "100x50x8": 22500,
      "120x60x8": 31000,
      nonStandardPerSqCm: 0.55
    },
    "Лабрадорит": {
      "60x40x3": 10000,
      "80x40x3": 12000,
      "80x40x5": 14500,
      "80x40x8": 17500,
      "100x50x5": 21000,
      "100x50x8": 25000,
      "120x60x8": 34000,
      nonStandardPerSqCm: 0.7
    },
    "Песчаник": {
      "60x40x3": 6000,
      "80x40x3": 7500,
      "80x40x5": 9000,
      "80x40x8": 11000,
      "100x50x5": 13000,
      "100x50x8": 16000,
      "120x60x8": 22000,
      nonStandardPerSqCm: 0.4
    },
    "Габбро": {
      "60x40x3": 7000,
      "80x40x3": 9000,
      "80x40x5": 10500,
      "80x40x8": 13000,
      "100x50x5": 15000,
      "100x50x8": 19000,
      "120x60x8": 26000,
      nonStandardPerSqCm: 0.45
    },
    "Известняк": {
      "60x40x3": 5500,
      "80x40x3": 7000,
      "80x40x5": 8500,
      "80x40x8": 10000,
      "100x50x5": 12000,
      "100x50x8": 15000,
      "120x60x8": 20000,
      nonStandardPerSqCm: 0.35
    }
  },

  // цены на комплектующие и услуги
  extras: {
    stand: 1500, // подставка
    flowerbed: { small: 1000, medium: 2000, large: 3000 }, // цветник/гробничка
    cross: 2000,
    photo: 1500,      // стоимость лазер/печати фото
    fioBase: 500,     // плата за ФИО (фиксированная) — можно заменить на per-char
    fioPerChar: 20,   // либо по символам
    dates: 300,       // цена за нанесение дат
    flowers: 700,
    candle: 200,
    epitaphPerChar: 10 // эпитафия — цена за символ
  }
};


// Функция computePrice(details)
// Получает объект details с информацией о заказе (камень/размер/комплектация/элементы)
// Возвращает объект с разбивкой по компонентам цены и total
function computePrice(details) {
  // начальные значения
  let price_stone = 0;
  let price_stand = 0;
  let price_flowerbed = 0;
  let price_cross = 0;
  let price_photo = 0;
  let price_fio = 0;
  let price_dates = 0;
  let price_flowers = 0;
  let price_epitaph = 0;

  // Определяем цену камня:
  const stoneSet = priceConfig.stonePrices[details.stone_type];
  if (!stoneSet) {
    // если неизвестный тип камня — выбрасываем ошибку
    throw new Error('Unknown stone type: ' + details.stone_type);
  }

  if (details.size_label && details.size_label !== 'НЕСТАНДАРТ') {
    // если стандартный размер — берём цену из таблицы
    const val = stoneSet[details.size_label];
    if (typeof val === 'number') {
      price_stone = val;
    } else {
      throw new Error('Unknown size for stone: ' + details.size_label);
    }
  } else {
    // нестандарт: ожидаем custom_height и custom_width (мм)
    const h = Number(details.custom_height || 0);
    const w = Number(details.custom_width || 0);
    if (!h || !w) {
      throw new Error('Для нестандартного размера нужно указывать высоту и ширину (мм)');
    }
    // площадь в см^2 (мм -> см => /10)
    const areaSqCm = (h/10) * (w/10);
    // ставка за кв.см
    const perSq = stoneSet.nonStandardPerSqCm || 0.5;
    price_stone = Math.round(areaSqCm * perSq * 100) / 100;
  }

  // подставка
  if (details.equipment_stand) price_stand = priceConfig.extras.stand;

  // цветник / гробничка
  if (details.equipment_flowerbed && priceConfig.extras.flowerbed[details.equipment_flowerbed]) {
    price_flowerbed = priceConfig.extras.flowerbed[details.equipment_flowerbed];
  }

  // крест
  if (details.applied_cross) price_cross = priceConfig.extras.cross;

  // фото
  if (details.applied_photo) price_photo = priceConfig.extras.photo;

  // ФИО — если есть текст, считаем либо фикс+по символам, либо только per char
  if (details.fio_text && details.fio_text.trim().length > 0) {
    const len = details.fio_text.trim().length;
    price_fio = priceConfig.extras.fioBase + (len * priceConfig.extras.fioPerChar);
  }

  // даты — если заполнены обе
  if (details.date_from || details.date_to) price_dates = priceConfig.extras.dates;

  // цветы / свеча
  if (details.applied_flowers === 'flowers') price_flowers = priceConfig.extras.flowers;
  if (details.applied_flowers === 'candle') price_flowers = priceConfig.extras.candle;

  // эпитафия
  if (details.epitaph && details.epitaph.trim().length > 0) {
    const len = details.epitaph.trim().length;
    price_epitaph = len * priceConfig.extras.epitaphPerChar;
  }

  // сумма
  const total = Number((
    price_stone + price_stand + price_flowerbed + price_cross +
    price_photo + price_fio + price_dates + price_flowers + price_epitaph
  ).toFixed(2));

  // возвращаем разбивку
  return {
    price_stone,
    price_stand,
    price_flowerbed,
    price_cross,
    price_photo,
    price_fio,
    price_dates,
    price_flowers,
    price_epitaph,
    price_total: total
  };
}

// экспортируем конфиг и функцию
module.exports = {
  priceConfig,
  computePrice
};