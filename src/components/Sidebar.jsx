import React from "react";
import { Link } from "react-router-dom";
import "../components/ui/navbar.css";

export default function Sidebar({ isOpen, setIsOpen, toggleTheme, theme, user }) {
  const menuItems = [
    { path: "/profile", label: "Личный кабинет" },
    { path: "/grades", label: "Оценки" },
    { path: "/homework", label: "Домашка" },
    { path: "/schedule", label: "Расписание" },
    { path: "/chat", label: "Чат" },
    { path: "/notifications", label: "Уведомления" },
    { path: "/news", label: "Новости" },
    ...(user?.role === "admin"
      ? [
          { path: "/admin", label: "Админка" },
          { path: "/all-homework", label: "Все домашки" },
        ]
      : []),
  ];

  return (
    <>
      <button
        className="menu-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Меню"
      >
        ☰
      </button>

      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <button onClick={() => setIsOpen(false)} className="close-btn">
            ✕ Закрыть
          </button>
          <img src="/logo.png" alt="AlmaU Logo" className="sidebar-logo" />
          <span className="sidebar-title">AlmaU</span>
        </div>

        <div className="sidebar-links">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className="sidebar-link"
            >
              {item.label}
            </Link>
          ))}
          <button onClick={toggleTheme} className="theme-btn">
            Сменить тему ({theme === "dark" ? "Тёмная" : "Светлая"})
          </button>
        </div>
      </div>
    </>
  );
}
