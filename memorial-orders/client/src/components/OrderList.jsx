export default function OrderList({ orders }) {
  if (!orders || orders.length === 0) {
    return (
      <section>
        <h2>Список заказов</h2>
        <p>Пока заказов нет.</p>
      </section>
    );
  }

  return (
    <section>
      <h2>Список заказов</h2>
      <ul>
        {orders.map((o) => (
          <li key={o.id}>
            <strong>#{o.id}</strong> — {o.stone_type} {o.size_label}
            <div>Итого: {o.price_total} ₽</div>
          </li>
        ))}
      </ul>
    </section>
  );
}
