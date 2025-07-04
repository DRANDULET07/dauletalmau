// Sidebar.jsx — исправленная версия
import React from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css";
import logo from "./assets/logo.jpg";
import { X } from "lucide-react";

export default function Sidebar({ toggleTheme, theme, user, isOpen, setIsOpen }) {
  return (
    <aside className={`sidebar ${isOpen ? "open" : ""}`}>
      <button className="close-button" onClick={() => setIsOpen(false)}>
        <X size={20} />
      </button>
      <div className="sidebar-header">
        <img src={logo} alt="logo" className="logo" />
        <h3>AlmaU</h3>
      </div>
      <nav className="sidebar-links">
        <Link to="/" onClick={() => setIsOpen(false)}>🏠 Главная</Link>
        <Link to="/profile" onClick={() => setIsOpen(false)}>👤 Профиль</Link>
        <Link to="/grades" onClick={() => setIsOpen(false)}>📊 Оценки</Link>
        <Link to="/homework" onClick={() => setIsOpen(false)}>📘 Домашка</Link>
        <Link to="/schedule" onClick={() => setIsOpen(false)}>🗓️ Расписание</Link>
        <Link to="/chat" onClick={() => setIsOpen(false)}>💬 Чат</Link>
        <Link to="/notifications" onClick={() => setIsOpen(false)}>🔔 Уведомления</Link>
        {user?.role === "admin" && <Link to="/admin" onClick={() => setIsOpen(false)}>🛠️ Админка</Link>}
        {user?.role === "admin" && <Link to="/all-homework" onClick={() => setIsOpen(false)}>📚 Все домашки</Link>}
      </nav>
      <button className="theme-button" onClick={toggleTheme}>
        Сменить тему ({theme === "dark" ? "Тёмная" : "Светлая"})
      </button>
    </aside>
  );
}
