// Простой wrapper для fetch запросов к нашему backend
export async function fetchJSON(url, options = {}) {
  const res = await fetch(url, options);
  // если ответ не OK — пытаемся прочитать тело с ошибкой
  if (!res.ok) {
    let data;
    // eslint-disable-next-line no-unused-vars
    try { data = await res.json(); } catch (_) { data = null; }
    const msg = data && data.error ? data.error : `HTTP error ${res.status}`;
    throw new Error(msg);
  }
  // если тело есть — возвращаем parsed json
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    // если не JSON — вернём текст
    return text;
  }
}

// API: получить конфиг цен
export function getPrices() {
  return fetchJSON('/api/prices');
}

// API: создать заказ (FormData возможен)
export function createOrder(formData) {
  return fetchJSON('/api/orders', {
    method: 'POST',
    body: formData
  });
}

// API: получить заказ по id
export function getOrder(id) {
  return fetchJSON(`/api/orders/${id}`);
}

// API: обновить заказ (formData)
export function updateOrder(id, formData) {
  return fetchJSON(`/api/orders/${id}`, {
    method: 'PUT',
    body: formData
  });
}

// API: удалить заказ
export function deleteOrder(id) {
  return fetchJSON(`/api/orders/${id}`, {
    method: 'DELETE'
  });
}

// API: подтвердить заказ и добавить клиента
export function confirmOrder(id, customer) {
  return fetchJSON(`/api/orders/${id}/confirm`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(customer)
  });
}

// API: поиск заказов
export function listOrders(q = '') {
  const url = q ? `/api/orders?q=${encodeURIComponent(q)}` : '/api/orders';
  return fetchJSON(url);
}
