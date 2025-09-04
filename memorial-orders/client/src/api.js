// Базовый URL для API бэкенда
const API_BASE_URL = 'http://localhost:5000';

/**
 * Универсальная функция-обёртка для fetch запросов к API
 * @param {string} url - URL запроса (относительный или абсолютный)
 * @param {Object} options - Опции для fetch
 * @returns {Promise<any>} - Результат запроса
 */
export async function fetchJSON(url, options = {}) {
  // Формируем полный URL, если передан относительный путь
  const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`;
  
  try {
    const res = await fetch(fullUrl, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    // Если ответ не OK — пытаемся прочитать тело с ошибкой
    if (!res.ok) {
      let errorData;
      try {
        errorData = await res.json();
      } catch {
        errorData = { error: `HTTP error ${res.status} ${res.statusText}` };
      }
      throw new Error(errorData.error || errorData.message || `HTTP error ${res.status}`);
    }

    // Обрабатываем успешный ответ
    const text = await res.text();
    if (!text) return null; // Если тело ответа пустое

    try {
      return JSON.parse(text);
    } catch {
      return text; // Если не JSON — вернём текст
    }
  } catch (error) {
    // Обрабатываем сетевые ошибки и другие исключения
    if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
      throw new Error('Не удалось подключиться к серверу. Проверьте, запущен ли бэкенд.');
    }
    throw error;
  }
}

// API: получить конфиг цен
export function getPrices() {
  return fetchJSON('/api/prices');
}

// API: создать заказ
export function createOrder(formData) {
  // Для FormData не устанавливаем Content-Type, браузер сделает это сам
  const headers = formData instanceof FormData 
    ? {} 
    : { 'Content-Type': 'application/json' };
  
  const body = formData instanceof FormData 
    ? formData 
    : JSON.stringify(formData);

  return fetchJSON('/api/orders', {
    method: 'POST',
    headers,
    body,
  });
}

// API: получить заказ по id
export function getOrderById(id) {
  return fetchJSON(`/api/orders/${id}`);
}

// API: обновить заказ
export function updateOrder(id, formData) {
  const headers = formData instanceof FormData 
    ? {} 
    : { 'Content-Type': 'application/json' };
  
  const body = formData instanceof FormData 
    ? formData 
    : JSON.stringify(formData);

  return fetchJSON(`/api/orders/${id}`, {
    method: 'PUT',
    headers,
    body,
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

// API: получить все заказы (алиас для listOrders)
export function getAllOrders() {
  return listOrders();
}

// API: получить статистику
export function getStats() {
  return fetchJSON('/api/stats');
}