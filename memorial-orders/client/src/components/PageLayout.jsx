import React from "react";
import "../styles/PageLayout.css";

export default function PageLayout({ title, children }) {
  return (
    <main className="page-layout">
      {title && <h1 className="page-title">{title}</h1>}
      <div className="page-content">{children}</div>
    </main>
  );
}
