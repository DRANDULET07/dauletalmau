// LoginScreen.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./login.css";

export default function LoginScreen({ setLoggedUser }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const user = users.find(
      (u) => u.username === username && u.password === password
    );

    if (user) {
      localStorage.setItem("loggedUser", JSON.stringify(user));
      setLoggedUser(user); // сохраняем весь объект пользователя
      navigate("/");
    } else {
      alert("Неверное имя пользователя или пароль");
    }
  };

  return (
    <div
      className="content"
      style={{
        display: "grid", // flex было -> grid поставил
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <div className="card" style={{ padding: "2rem", minWidth: "300px" }}>
        <h2 style={{ textAlign: "center" }}>Вход</h2>

        <input
          type="text"
          placeholder="Логин"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{
            padding: "0.5rem",
            width: "100%",
            marginBottom: "0.5rem",
            borderRadius: "8px",
          }}
        />

        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            padding: "0.5rem",
            width: "100%",
            marginBottom: "1rem",
            borderRadius: "8px",
          }}
        />

        <button
          className="notify-btn"
          onClick={handleLogin}
          style={{ width: "100%" }}
        >
          Войти
        </button>

        <p style={{ marginTop: "1rem", textAlign: "center" }}>
          Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
        </p>
      </div>
    </div>
  );
}
