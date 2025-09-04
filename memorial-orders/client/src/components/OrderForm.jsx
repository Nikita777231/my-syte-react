import React, { useState, useMemo, useEffect } from "react";

export default function OrderForm({ priceConfig, onCreate }) {
  // ===== все хуки строго сверху =====
  const [stoneType, setStoneType] = useState("");
  const [sizeLabel, setSizeLabel] = useState("60x40x3");
  const [customHeight, setCustomHeight] = useState("");
  const [customWidth, setCustomWidth] = useState("");
  const [productionMethod, setProductionMethod] = useState("односторонняя полировка");

  const [flowerbed, setFlowerbed] = useState("none");
  const [stand, setStand] = useState(false);

  const [appliedCross, setAppliedCross] = useState(false);
  const [appliedPhotoFile, setAppliedPhotoFile] = useState(null);
  const [fioText, setFioText] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [flowersOrCandle, setFlowersOrCandle] = useState("none");
  const [epitaph, setEpitaph] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const standardSizes = [
    "60x40x3","80x40x3","80x40x5","80x40x8",
    "100x50x5","100x50x8","120x60x8","НЕСТАНДАРТ"
  ];
  const productionOptions = [
    "односторонняя полировка",
    "2-х сторонняя полировка",
    "3-х сторонняя полировка",
    "4-х сторонняя полировка",
    "5 стороняя полировка"
  ];

  // инициализируем stoneType при загрузке priceConfig
  useEffect(() => {
    if (priceConfig && priceConfig.stonePrices && !stoneType) {
      const firstStone = Object.keys(priceConfig.stonePrices)[0];
      if (firstStone) setStoneType(firstStone);
    }
  }, [priceConfig, stoneType]);

  // если priceConfig ещё нет, показываем заглушку
  if (!priceConfig || !priceConfig.stonePrices) {
    return (
      <section className="order-form">
        <h2>Создать новый заказ</h2>
        <p>Конфигурация цен недоступна</p>
      </section>
    );
  }

  // расчёт цены
  const estimatedPrice = useMemo(() => {
    try {
      const stoneSet = priceConfig.stonePrices[stoneType] || {};
      let price_stone = 0;

      if (sizeLabel !== "НЕСТАНДАРТ") {
        price_stone = Number(stoneSet[sizeLabel] || 0);
      } else {
        const h = Number(customHeight || 0);
        const w = Number(customWidth || 0);
        if (h > 0 && w > 0) {
          const area = (h / 10) * (w / 10); // мм → см^2
          price_stone = Math.round(area * (stoneSet.nonStandardPerSqCm || 0.5));
        }
      }

      const extras = priceConfig.extras;
      const price_stand = stand ? extras.stand : 0;
      const price_flowerbed = extras.flowerbed[flowerbed] || 0;
      const price_cross = appliedCross ? extras.cross : 0;
      const price_photo = appliedPhotoFile ? extras.photo : 0;
      const price_fio = fioText.trim()
        ? extras.fioBase + fioText.trim().length * extras.fioPerChar
        : 0;
      const price_dates = dateFrom || dateTo ? extras.dates : 0;
      const price_flowers =
        flowersOrCandle === "flowers"
          ? extras.flowers
          : flowersOrCandle === "candle"
          ? extras.candle
          : 0;
      const price_epitaph = epitaph.trim()
        ? epitaph.trim().length * extras.epitaphPerChar
        : 0;

      return {
        price_total:
          price_stone +
          price_stand +
          price_flowerbed +
          price_cross +
          price_photo +
          price_fio +
          price_dates +
          price_flowers +
          price_epitaph
      };
    } catch {
      return { price_total: 0 };
    }
  }, [
    stoneType,sizeLabel,customHeight,customWidth,stand,
    flowerbed,appliedCross,appliedPhotoFile,fioText,
    dateFrom,dateTo,flowersOrCandle,epitaph,priceConfig
  ]);

  // отправка формы
  async function handleSubmit(e) {
    e.preventDefault();

    const newOrder = {
      stone_type: stoneType,
      size_label: sizeLabel,
      custom_height: sizeLabel === "НЕСТАНДАРТ" ? customHeight : null,
      custom_width: sizeLabel === "НЕСТАНДАРТ" ? customWidth : null,
      production_method: productionMethod,
      flowerbed,
      stand,
      applied_cross: appliedCross,
      applied_photo: appliedPhotoFile ? appliedPhotoFile.name : null,
      fio: fioText,
      date_from: dateFrom,
      date_to: dateTo,
      flowers_or_candle: flowersOrCandle,
      epitaph,
      price_total: estimatedPrice.price_total
    };

    try{
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(newOrder)
      });
      const saved = await res.json();

      setMessage(`Заказ сохранен в БД (ID: ${saved.id})`);
    } catch (err){
      setMessage("Ошибка при сохранении заказа");
      console.error(err);
    }
  }
  // форма
  return (
    <section className="order-form">
      <h2>Создать новый заказ</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Вид камня:
          <select value={stoneType} onChange={e => setStoneType(e.target.value)}>
            {Object.keys(priceConfig.stonePrices).map(k => (
              <option key={k} value={k}>{k}</option>
            ))}
          </select>
        </label>
        <label>
          Размер:
          <select value={sizeLabel} onChange={e => setSizeLabel(e.target.value)}>
            {standardSizes.map(sz => <option key={sz} value={sz}>{sz}</option>)}
          </select>
        </label>
        {sizeLabel === "НЕСТАНДАРТ" && (
          <div>
            <label>Высота (мм):
              <input type="number" value={customHeight} onChange={e => setCustomHeight(e.target.value)} />
            </label>
            <label>Ширина (мм):
              <input type="number" value={customWidth} onChange={e => setCustomWidth(e.target.value)} />
            </label>
          </div>
        )}
        <label>
          Способ производства:
          <select value={productionMethod} onChange={e => setProductionMethod(e.target.value)}>
            {productionOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </label>

        <fieldset>
          <legend>Комплектация</legend>
          <label>
            Цветник/гробничка:
            <select value={flowerbed} onChange={e => setFlowerbed(e.target.value)}>
              <option value="none">нет</option>
              <option value="small">маленькая</option>
              <option value="medium">средняя</option>
              <option value="large">большая</option>
            </select>
          </label>
          <label>
            Подставка:
            <input type="checkbox" checked={stand} onChange={() => setStand(!stand)} />
          </label>
        </fieldset>

        <fieldset>
          <legend>Нанесение</legend>
          <label>
            Крестик:
            <input type="checkbox" checked={appliedCross} onChange={() => setAppliedCross(!appliedCross)}  />
          </label>
          <label>
            Фотография:
            <input type="file" accept="image/*" onChange={e => setAppliedPhotoFile(e.target.files[0] || null)} />
            {appliedPhotoFile && (
              <img src={URL.createObjectURL(appliedPhotoFile)} alt="Предпросмотр" style={{maxWidth: 120, marginTop:8, borderRadius: 4}}/>
            )}
          </label>
          <label>
            ФИО:
            <input  type="text" value={fioText} onChange={e => setFioText(e.target.value)} />
          </label>
          <label>
            Дата рождения:
            <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
          </label>
          <label>
            Дата смерти:
            <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} />
          </label>
          <label>
            Цветы/свеча:
            <select value={flowersOrCandle} onChange={e => setFlowersOrCandle(e.target.value)}>
              <option value="none">нет</option>
              <option value="flowers">цветы</option>
              <option value="candle">свеча</option>
            </select>
          </label>
          <label>
            Эпитафия:
            <textarea value={epitaph} onChange={e => setEpitaph(e.target.value)} />
          </label>
        </fieldset>

        <h3>Итог: {estimatedPrice.price_total} ₽</h3>
        <button type="submit" disabled={loading}>
          {loading ? "Создаём..." : "Создать заказ"}
        </button>
        {message && <div className="message">{message}</div>}
      </form>
    </section>
  );
}
