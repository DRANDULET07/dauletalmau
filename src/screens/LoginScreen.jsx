import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./login.css";
import { db } from "../firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export default function LoginScreen({ setLoggedUser }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!username || !password) {
      setError("Пожалуйста, заполните все поля");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const user = users.find(
        (u) => u.username === username && u.password === password
      );

      if (user) {
        localStorage.setItem("loggedUser", JSON.stringify(user));
        setLoggedUser(user);

        try {
          const userRef = doc(db, "users", user.name || user.username);
          await setDoc(
            userRef,
            {
              name: user.name || user.username,
              role: user.role || "student",
              isOnline: true,
              lastActive: serverTimestamp(),
            },
            { merge: true }
          );
        } catch (e) {
          console.error("Ошибка при установке статуса онлайн:", e);
        }

        navigate("/");
      } else {
        setError("Неверное имя пользователя или пароль");
      }
    } catch (err) {
      setError("Произошла ошибка при входе");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Вход в систему</h2>

        {error && <div className="error-message">{error}</div>}

        <div className="form-group">
          <label htmlFor="username">Логин</label>
          <input
            id="username"
            type="text"
            placeholder="Введите ваш логин"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Пароль</label>
          <input
            id="password"
            type="password"
            placeholder="Введите ваш пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </div>

        <button
          className="login-btn"
          onClick={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? "Вход..." : "Войти"}
        </button>

        <div className="register-link">
          Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
        </div>
      </div>
    </div>
  );
}
