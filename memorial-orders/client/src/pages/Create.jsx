import React from "react";
import PageLayout from "../components/PageLayout";

export default function Create() {
  return (
    <PageLayout title="Создать заказ">
      <form className="create-form">
        <input type="text" placeholder="Имя клиента" />
        <input type="text" placeholder="Описание заказа" />
        <button type="submit">Создать</button>
      </form>
    </PageLayout>
  );
}
