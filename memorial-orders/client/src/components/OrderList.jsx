import React from "react";

export default function OrderList({ orders }) {
  if (!orders || orders.length === 0) {
    return (
      <section className="order-list">
        <h2>Список заказов</h2>
        <p>Пока заказов нет.</p>
      </section>
    );
  }

  return (
    <section className="order-list">
      <h2>Список заказов</h2>
      <div className="order-cards">
        {orders.map(o => (
          <div className="card" key={o.id}>
            <strong>#{o.id}</strong> - {o.stoneType} {o.sizeLabel}
            <div>{o.fioText}</div>
            <div>{o.price_total} ₽</div>
      </div>
              ))}
              </div>
    </section>
  );
}
