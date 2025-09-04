import { Outlet, NavLink } from "react-router-dom";
import '../styles/layout.css';

export default function Layout() {
    return (
        <>
        <nav className="dock-bar">
            <NavLink to="/create">Создать</NavLink>
            <NavLink to="/search">Найти / Изменить</NavLink>
        </nav>

        <main className="page">
            <Outlet />
        </main>
        </>
    );
}