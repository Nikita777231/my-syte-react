import React from "react";
import { Link } from "react-router-dom";
import "./DockBar.css";

export default function DockBar() {
  return (
    <nav className="dockbar">
      <Link to="/">Заказы</Link>
      <Link to="/create">Создать</Link>
      <Link to="/search">Цены</Link>
      <Link to="/settings">Настройки</Link>
    </nav>
  );
}
