import React from "react";
import "../styles/ThemeToggle.css";

export default function ThemeToggle({ dark, setDark }) {
  return (
    <label className="switch">
      <input
        type="checkbox"
        checked={dark}
        onChange={(e) => setDark(e.target.checked)}
      />
      <span className="slider"></span>
    </label>
  );
}
