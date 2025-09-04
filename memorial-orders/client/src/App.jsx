import React from "react";
import { Routes, Route } from "react-router-dom";
import DockBar from "./components/DockBar";
import Orders from "./pages/Orders";
import Create from "./pages/Create";
import Search from "./pages/Search";
import Settings from "./pages/Settings";

export default function App({ dark, setDark }) {
  return (
    <div className="app">
      <DockBar />
      <Routes>
        <Route path="/" element={<Orders />} />
        <Route path="/create" element={<Create />} />
        <Route path="/search" element={<Search />} />
        <Route path="/settings" element={<Settings dark={dark} setDark={setDark} />} />
      </Routes>
    </div>
  );
}
