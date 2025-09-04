import React from "react";
import PageLayout from "../components/PageLayout";

export default function Search() {
  return (
    <PageLayout title="Цены">
      <table className="price-table">
        <thead>
          <tr>
            <th>Услуга</th>
            <th>Цена</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Установка памятника</td>
            <td>10 000 ₽</td>
          </tr>
          <tr>
            <td>Гравировка</td>
            <td>5 000 ₽</td>
          </tr>
        </tbody>
      </table>
    </PageLayout>
  );
}
