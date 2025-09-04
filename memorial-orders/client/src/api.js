const API_BASE_URL = 'http://localhost:5000';

// Простая функция для запросов
export async function fetchJSON(url, options = {}) {
  const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`;
  
  const response = await fetch(fullUrl, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || `HTTP error ${response.status}`);
  }

  return response.json();
}

// API функции
export const getOrderById = (id) => fetchJSON(`/api/orders/${id}`);
export const getOrders = () => fetchJSON('/api/orders');
export const createOrder = (data) => fetchJSON('/api/orders', {
  method: 'POST',
  body: JSON.stringify(data),
});