import { useState } from "react";
import { createOrder } from "../api";

export default function OrderForm() {
  const [stoneType, setStoneType] = useState("");
  const [sizeLabel, setSizeLabel] = useState("");
  const [customHeight, setCustomHeight] = useState("");
  const [customWidth, setCustomWidth] = useState("");
  const [productionMethod, setProductionMethod] = useState("");
  const [flowerbed, setFlowerbed] = useState("none");
  const [stand, setStand] = useState(false);
  const [appliedCross, setAppliedCross] = useState(false);
  const [appliedPhotoFile, setAppliedPhotoFile] = useState(null);
  const [fioText, setFioText] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [flowersOrCandle, setFlowersOrCandle] = useState("");
  const [epitaph, setEpitaph] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const fd = new FormData();
    fd.append("stone_type", stoneType);
    fd.append("size_label", sizeLabel);
    if (sizeLabel === "НЕСТАНДАРТ") {
      fd.append("custom_height", String(customHeight || ""));
      fd.append("custom_width", String(customWidth || ""));
    }
    fd.append("production_method", productionMethod);
    fd.append("equipment_flowerbed", flowerbed);
    fd.append("equipment_stand", String(stand));
    fd.append("applied_cross", String(appliedCross));
    if (appliedPhotoFile) fd.append("photo", appliedPhotoFile);
    fd.append("fio_text", fioText);
    fd.append("date_from", dateFrom);
    fd.append("date_to", dateTo);
    fd.append("applied_flowers", flowersOrCandle);
    fd.append("epitaph", epitaph);

    try {
      const res = await createOrder(fd);
      setMessage(`Заказ сохранён (ID: ${res.id})`);
    } catch (err) {
      setMessage(`Ошибка: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Создать заказ</h2>

      <label>
        Тип камня:
        <input value={stoneType} onChange={(e) => setStoneType(e.target.value)} />
      </label>

      <label>
        Размер:
        <input value={sizeLabel} onChange={(e) => setSizeLabel(e.target.value)} />
      </label>

      {sizeLabel === "НЕСТАНДАРТ" && (
        <>
          <label>
            Высота:
            <input type="number" value={customHeight} onChange={(e) => setCustomHeight(e.target.value)} />
          </label>
          <label>
            Ширина:
            <input type="number" value={customWidth} onChange={(e) => setCustomWidth(e.target.value)} />
          </label>
        </>
      )}

      <label>
        Метод изготовления:
        <input value={productionMethod} onChange={(e) => setProductionMethod(e.target.value)} />
      </label>

      <label>
        Цветник:
        <select value={flowerbed} onChange={(e) => setFlowerbed(e.target.value)}>
          <option value="none">Без цветника</option>
          <option value="small">Малый</option>
          <option value="large">Большой</option>
        </select>
      </label>

      <label>
        Подставка:
        <input type="checkbox" checked={stand} onChange={(e) => setStand(e.target.checked)} />
      </label>

      <label>
        Крест:
        <input type="checkbox" checked={appliedCross} onChange={(e) => setAppliedCross(e.target.checked)} />
      </label>

      <label>
        Фото:
        <input type="file" onChange={(e) => setAppliedPhotoFile(e.target.files[0])} />
      </label>

      <label>
        ФИО:
        <input value={fioText} onChange={(e) => setFioText(e.target.value)} />
      </label>

      <label>
        Дата "с":
        <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
      </label>

      <label>
        Дата "по":
        <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
      </label>

      <label>
        Цветы/свеча:
        <input value={flowersOrCandle} onChange={(e) => setFlowersOrCandle(e.target.value)} />
      </label>

      <label>
        Эпитафия:
        <input value={epitaph} onChange={(e) => setEpitaph(e.target.value)} />
      </label>

      <button type="submit" disabled={loading}>
        {loading ? "Отправка..." : "Создать заказ"}
      </button>

      {message && <p>{message}</p>}
    </form>
  );
}
