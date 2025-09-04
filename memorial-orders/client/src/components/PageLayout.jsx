import React from "react";
import "../styles/PageLayout.css";

/**
 * Универсальный макет для всех страниц
 * Центрирует контент и задаёт max-width.
 */

export default function PageLayout  ({ title ,children }) {
    return(
        <main className="page-layout">
            {title && <h2 className="page-title">{title}</h2>}
            <div className="page-content">{children}</div>
        </main>
    )
}