import React, { useState } from "react";
import { getOrder, updateOrder, deleteOrder, confirmOrder } from "../api";

/*
  OrderSearch — компонент, позволяющий:
    - Ввести ID заказа и получить данные
    - Изменить заказ (здесь реализована простая модель: при получении данных можно открыть форму изменения полями)
    - Удалить заказ
    - Подтвердить заказ: ввести данные клиента и привязать их к заказу
*/
export default function OrderSearch() {
  // номер для поиска
  const [searchId, setSearchId] = useState("");
  // загруженный заказ
  const [order, setOrder] = useState(null);
  // режим редактирования
  const [editing, setEditing] = useState(false);
  // локальное состояние полей при редактировании (упрощённо)
  const [local, setLocal] = useState({});
  // статус/сообщения
  const [msg, setMsg] = useState(null);

  // данные клиента при подтверждении
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientCity, setClientCity] = useState('');

  // загрузка заказа
  async function handleLoad(e) {
    e && e.preventDefault();
    try {
      const data = await getOrder(searchId);
      setOrder(data);
      setLocal({
        stone_type: data.stone_type,
        size_label: data.size_label,
        custom_height: data.custom_height || '',
        custom_width: data.custom_width || '',
        production_method: data.production_method,
        equipment_flowerbed: data.equipment_flowerbed || 'none',
        equipment_stand: data.equipment_stand,
        applied_cross: data.applied_cross,
        fio_text: data.fio_text || '',
        date_from: data.date_from || '',
        date_to: data.date_to || '',
        applied_flowers: data.applied_flowers || 'none',
        epitaph: data.epitaph || ''
      });
      setMsg(null);
      setEditing(false);
    } catch (err) {
      setMsg('Ошибка при получении заказа: ' + err.message);
      setOrder(null);
    }
  }

  // удаление
  async function handleDelete() {
    if (!order) return;
    if (!confirm(`Точно удалить заказ №${order.id}?`)) return;
    try {
      await deleteOrder(order.id);
      setMsg('Заказ удалён');
      setOrder(null);
    } catch (err) {
      setMsg('Ошибка при удалении: ' + err.message);
    }
  }

  // простое обновление (формируем FormData даже без файла)
  async function handleSaveChanges(e) {
    e.preventDefault();
    try {
      const fd = new FormData();
      Object.keys(local).forEach(k => fd.append(k, local[k]));
      // если есть флаг со строкой 'true'/'false' — оставляем как есть
      const res = await updateOrder(order.id, fd);
      setMsg('Изменения сохранены. Новая сумма: ' + res.prices.price_total + ' ₽');
      // перезагрузим заказ
      await handleLoad();
      setEditing(false);
    } catch (err) {
      setMsg('Ошибка при сохранении: ' + err.message);
    }
  }

  // подтверждение — записываем клиента
  async function handleConfirm(e) {
    e.preventDefault();
    if (!order) return;
    try {
      const res = await confirmOrder(order.id, { full_name: clientName, phone: clientPhone, city: clientCity });
      setMsg('Заказ подтверждён. ID клиента: ' + res.customerId);
      await handleLoad();
    } catch (err) {
      setMsg('Ошибка при подтверждении: ' + err.message);
    }
  }

  return (
    <section className="order-search">
      <h2>Найти / Изменить заказ</h2>

      <form onSubmit={handleLoad}>
        <label>
          Номер заказа:
          <input type="number" value={searchId} onChange={e => setSearchId(e.target.value)} required />
        </label>
        <button type="submit">Найти</button>
      </form>

      {msg && <div className="message">{msg}</div>}

      {order && (
        <div className="order-detail">
          <h3>Заказ №{order.id}</h3>
          <p>Камень: {order.stone_type} — {order.size_label}</p>
          <p>Цена: {order.price_total} ₽</p>
          <p>Клиент: {order.customer_name || 'не указан'}</p>

          <div className="order-actions">
            <button onClick={() => setEditing(!editing)}>{editing ? 'Отменить' : 'Изменить'}</button>
            <button onClick={handleDelete}>Удалить</button>
          </div>

          {editing && (
            <form onSubmit={handleSaveChanges} className="edit-form">
              {/* упрощённый набор полей для редактирования */}
              <label>
                Вид камня:
                <input type="text" value={local.stone_type || ''} onChange={e => setLocal({...local, stone_type: e.target.value})} />
              </label>

              <label>
                Размер:
                <input type="text" value={local.size_label || ''} onChange={e => setLocal({...local, size_label: e.target.value})} />
              </label>

              <label>
                Комплектация (цветник):
                <select value={local.equipment_flowerbed || 'none'} onChange={e => setLocal({...local, equipment_flowerbed: e.target.value})}>
                  <option value="none">нет</option>
                  <option value="small">маленькая</option>
                  <option value="medium">средняя</option>
                  <option value="large">большая</option>
                </select>
              </label>

              <label>
                Подставка:
                <input type="checkbox" checked={!!local.equipment_stand} onChange={e => setLocal({...local, equipment_stand: e.target.checked})} />
              </label>

              <button type="submit">Сохранить изменения</button>
            </form>
          )}

          {/* Подтверждение: заполнение данных клиента */}
          <div className="confirm-client">
            <h4>Подтвердить заказ (записать данные клиента)</h4>
            <form onSubmit={handleConfirm}>
              <label>ФИО: <input type="text" value={clientName} onChange={e => setClientName(e.target.value)} required /></label>
              <label>Телефон: <input type="text" value={clientPhone} onChange={e => setClientPhone(e.target.value)} required /></label>
              <label>Город: <input type="text" value={clientCity} onChange={e => setClientCity(e.target.value)} /></label>
              <button type="submit">Подтвердить и сохранить клиента</button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
