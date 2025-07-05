// Sidebar.jsx — адаптивная версия с поддержкой overlay и анимаций
import React from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css";
import logo from "./assets/logo.jpg";
// import { X } from "lucide-react"; // Временно отключаю для диагностики

export default function Sidebar({ toggleTheme, theme, user, isOpen, setIsOpen, isMobile }) {
  // Блокировка скролла body при открытом меню на мобильных
  React.useEffect(() => {
    if (isMobile && isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMobile, isOpen]);

  return (
    <>
      {/* Оверлей для мобильных */}
      {isMobile && (
        <div className={`sidebar-overlay${isOpen ? ' open' : ''}`} onClick={() => setIsOpen(false)} />
      )}
      <aside className={`sidebar${isMobile ? (isOpen ? ' open slide-in' : '') : ' open'}`}>
        {/* Кнопка закрытия только на мобильных */}
        {isMobile && (
          <button className="sidebar-close" onClick={() => setIsOpen(false)}>
            <span style={{fontSize: 20, fontWeight: 'bold'}}>✕</span>
          </button>
        )}
        <div className="sidebar-logo">
          <img src={logo} alt="logo" />
          <h1>AlmaU</h1>
        </div>
        <nav className="sidebar-links">
          <Link to="/" onClick={() => isMobile && setIsOpen(false)}>Главная</Link>
          <Link to="/profile" onClick={() => isMobile && setIsOpen(false)}>Профиль</Link>
          <Link to="/grades" onClick={() => isMobile && setIsOpen(false)}>Оценки</Link>
          <Link to="/homework" onClick={() => isMobile && setIsOpen(false)}>Домашка</Link>
          <Link to="/schedule" onClick={() => isMobile && setIsOpen(false)}>Расписание</Link>
          <Link to="/chat" onClick={() => isMobile && setIsOpen(false)}>Чат</Link>
          <Link to="/notifications" onClick={() => isMobile && setIsOpen(false)}>Уведомления</Link>
          {user?.role === "admin" && <Link to="/admin" onClick={() => isMobile && setIsOpen(false)}>Админка</Link>}
          {user?.role === "admin" && <Link to="/all-homework" onClick={() => isMobile && setIsOpen(false)}>Все домашки</Link>}
        </nav>
        <div className="theme-toggle">
          <button className="theme-button" onClick={toggleTheme}>
            Сменить тему ({theme === "dark" ? "Тёмная" : "Светлая"})
          </button>
        </div>
      </aside>
    </>
  );
}
