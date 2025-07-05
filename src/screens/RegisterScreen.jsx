// RegisterScreen.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./login.css";

export default function RegisterScreen() {
  const [form, setForm] = useState({
    name: "",
    surname: "",
    username: "",
    password: "",
    role: "student",
    avatar: "",
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(""); // Очищаем ошибку при изменении полей
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setForm((prev) => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRegister = () => {
    // Валидация
    if (!form.name || !form.surname || !form.username || !form.password) {
      setError("Пожалуйста, заполните все обязательные поля");
      return;
    }

    if (form.password.length < 6) {
      setError("Пароль должен содержать минимум 6 символов");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");

      if (existingUsers.some((user) => user.username === form.username)) {
        setError("Пользователь с таким логином уже существует!");
        return;
      }

      const newUser = { ...form };
      localStorage.setItem("users", JSON.stringify([...existingUsers, newUser]));
      
      alert("Регистрация прошла успешно!");
      navigate("/login");
    } catch (err) {
      setError("Произошла ошибка при регистрации");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleRegister();
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Регистрация</h2>

        {error && <div className="error-message">{error}</div>}

        <div className="form-group">
          <label htmlFor="name">Имя *</label>
          <input
            id="name"
            type="text"
            name="name"
            placeholder="Введите ваше имя"
            value={form.name}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
          />
        </div>

        <div className="form-group">
          <label htmlFor="surname">Фамилия *</label>
          <input
            id="surname"
            type="text"
            name="surname"
            placeholder="Введите вашу фамилию"
            value={form.surname}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
          />
        </div>

        <div className="form-group">
          <label htmlFor="username">Логин *</label>
          <input
            id="username"
            type="text"
            name="username"
            placeholder="Придумайте логин"
            value={form.username}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Пароль *</label>
          <input
            id="password"
            type="password"
            name="password"
            placeholder="Придумайте пароль (минимум 6 символов)"
            value={form.password}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
          />
        </div>

        <div className="form-group">
          <label htmlFor="role">Роль</label>
          <select
            id="role"
            name="role"
            value={form.role}
            onChange={handleChange}
            className="form-group input"
            style={{
              padding: "1.2rem 1.5rem",
              border: "2px solid var(--border-color)",
              borderRadius: "12px",
              background: "var(--card-bg)",
              color: "var(--text-color)",
              fontSize: "1.1rem",
              transition: "var(--transition)",
              boxSizing: "border-box",
              width: "100%"
            }}
          >
            <option value="student">Студент</option>
            <option value="admin">Администратор</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="avatar">Аватар (необязательно)</label>
          <input
            id="avatar"
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            style={{
              padding: "1rem",
              border: "2px dashed var(--border-color)",
              borderRadius: "12px",
              background: "rgba(37, 99, 235, 0.05)",
              cursor: "pointer",
              transition: "var(--transition)",
              width: "100%",
              boxSizing: "border-box"
            }}
          />
        </div>

        {form.avatar && (
          <div style={{ textAlign: "center", marginBottom: "1rem" }}>
            <img
              src={form.avatar}
              alt="avatar preview"
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                border: "3px solid var(--border-color)",
                boxShadow: "var(--shadow-medium)"
              }}
            />
          </div>
        )}

        <button
          className="login-btn"
          onClick={handleRegister}
          disabled={isLoading}
        >
          {isLoading ? "Регистрация..." : "Зарегистрироваться"}
        </button>

        <div className="register-link">
          Уже есть аккаунт? <Link to="/login">Войти</Link>
        </div>
      </div>
    </div>
  );
}
