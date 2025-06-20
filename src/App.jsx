// App.jsx
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from "react-router-dom";
import "./index.css";
import logo from "./assets/logo.jpg";

// Экраны
import Home from "./screens/Home";
import ScheduleScreen from "./screens/ScheduleScreen";
import GradesScreen from "./screens/GradesScreen";
import HomeworkScreen from "./screens/src/HomeworkScreen";
import ProfileScreen from "./screens/ProfileScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import AdminPanel from "./screens/AdminPanel"; // 👈 добавляем

function Sidebar({ toggleTheme, theme, user }) {
  return (
    <div className="sidebar">
      <Link to="/" className="logo-link">
        <img src={logo} alt="AlmaU Logo" className="logo-img" />
      </Link>
      <h2><Link to="/" className="logo-text">AlmaU</Link></h2>
      <nav>
        <Link to="/profile">Личный кабинет</Link>
        <Link to="/grades">Оценки</Link>
        <Link to="/homework">Домашка</Link>
        <Link to="/schedule">Расписание</Link>
        {user?.role === "admin" && <Link to="/admin">Админка</Link>} {/* 👈 только для админа */}
      </nav>
      <button onClick={toggleTheme}>
        Сменить тему ({theme === "light" ? "Светлая" : "Тёмная"})
      </button>
    </div>
  );
}

export default function App() {
  const [theme, setTheme] = useState("dark");

  const [loggedUser, setLoggedUser] = useState(() => {
    const stored = localStorage.getItem("loggedUser");
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const isLoggedIn = !!loggedUser;

  return (
    <Router>
      <div className="app-container">
        {isLoggedIn && <Sidebar toggleTheme={toggleTheme} theme={theme} user={loggedUser} />}
        <Routes>
          <Route
            path="/"
            element={isLoggedIn ? <Home user={loggedUser} /> : <Navigate to="/login" />}
          />
          <Route
            path="/login"
            element={<LoginScreen setLoggedUser={setLoggedUser} />}
          />
          <Route path="/register" element={<RegisterScreen />} />
          <Route
            path="/profile"
            element={isLoggedIn ? <ProfileScreen user={loggedUser} /> : <Navigate to="/login" />}
          />
          <Route
            path="/grades"
            element={isLoggedIn ? <GradesScreen /> : <Navigate to="/login" />}
          />
          <Route
            path="/homework"
            element={isLoggedIn ? <HomeworkScreen /> : <Navigate to="/login" />}
          />
          <Route
            path="/schedule"
            element={isLoggedIn ? <ScheduleScreen /> : <Navigate to="/login" />}
          />
          <Route
            path="/admin"
            element={
              isLoggedIn && loggedUser.role === "admin" ? (
                <AdminPanel user={loggedUser} />
              ) : (
                <Navigate to="/" />
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
}
