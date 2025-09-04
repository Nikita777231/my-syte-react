import React from "react";
import { NavLink } from "react-router-dom";
import "./DockBar.css";

/**
 * Простой фиксированный док внизу экрана.
 * Использует NavLink для подсветки активной кнопки.
 * Легко расширяется — просто добавляй новые записи в items.
 */

const items = [
  { to: "/", label: "Создать", icon: "📋" },
  { to: "/orders", label: "Заказы", icon: "📦" },
  { to: "/prices", label: "Цены", icon: "💲" },
  { to: "/settings", label: "Настройки", icon: "⚙️" },
];

export default function DockBar() {
  return (
    <nav className="dockbar" role="navigation" aria-label="Главное меню">
      <ul className="dockbar-list">
        {items.map((it) => (
          <li key={it.to} className="dockbar-item">
            <NavLink
              to={it.to}
              className={({ isActive }) =>
                "dockbar-link" + (isActive ? " dockbar-link--active" : "")
              }
              aria-current="page"
            >
              <span className="dockbar-icon" aria-hidden>
                {it.icon}
              </span>
              <span className="dockbar-label">{it.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
