import React from "react";
import PageLayout from "../components/PageLayout";
import ThemeToggle from "../components/ThemeToggle";

export default function Settings({ dark, setDark }) {
  return (
    <PageLayout title="Настройки">
      <div className="flex items-center gap-3">
        <span className="text-lg font-medium dark:text-gray-100">Тёмная тема</span>
        <ThemeToggle dark={dark} setDark={setDark} />
      </div>
    </PageLayout>
  );
}
