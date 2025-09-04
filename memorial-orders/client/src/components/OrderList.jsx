import PageLayout from "./PageLayout";

export default function OrderList({ orders }) {
  if (!orders || orders.length === 0) {
    return (
      <PageLayout title="Список заказов">
        <p>Пока заказов нет.</p>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Список заказов">
      <ul className="order-list">
        {orders.map((o) => (
          <li key={o.id} className="order-card">
            <strong>#{o.id}</strong>
            <p>{o.stone_type} {o.size_label}</p>
            <p>Итого: {o.price_total} ₽</p>
          </li>
        ))}
      </ul>
    </PageLayout>
  );
}
