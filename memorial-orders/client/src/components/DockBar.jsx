import React from "react";
import { FcKindle, FcPlus, FcCurrencyExchange, FcSupport } from "react-icons/fc";
import { Link } from "react-router-dom";
import "./DockBar.css";

export default function DockBar() {
  return (
    <nav className="dockbar">
      <Link to="/" className="dock-link">
        <FcKindle className="dock-icon" />
        <span>Заказы</span>
      </Link>
      
      <Link to="/create" className="dock-link">
        <FcPlus className="dock-icon" />
        <span>Создать</span>
      </Link>
      
      <Link to="/search" className="dock-link">
        <FcCurrencyExchange className="dock-icon" />
        <span>Цены</span>
      </Link>
      
      <Link to="/settings" className="dock-link">
        <FcSupport className="dock-icon" />
        <span>Настройки</span>
      </Link>
    </nav>
  );
}
