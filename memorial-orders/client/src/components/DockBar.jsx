import React from 'react';
import "/.DockBar.css";

export default function DockBar() {
    const scrollTo = (id) => {
        document.getElementById(id).scrollIntoView({behavior: 'smooth'});
    };

    return (
        <aside className="dock-bar">
            <button onClick={() => scrollTo("create")}>Создать новый заказ</button>
            <button onClick={() => scrollTo("search")}>Найти заказ</button>
            <button onClick={() => scrollTo("edit")}>Изменить существующий заказ</button>
        </aside>
    )
}