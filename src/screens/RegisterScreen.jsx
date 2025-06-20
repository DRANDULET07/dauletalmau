// RegisterScreen.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// import "../index.css"; хз зач тебе импортировать индекс-css, если у тебя стиль в login-css
import "./login.css";

export default function RegisterScreen() {
  const [form, setForm] = useState({
    name: "",
    surname: "",
    username: "",
    password: "",
    role: "student",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = () => {
    const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");

    if (existingUsers.some((user) => user.username === form.username)) {
      alert("Пользователь с таким логином уже существует!");
      return;
    }

    const newUser = {
      name: form.name,
      surname: form.surname,
      username: form.username,
      password: form.password,
      role: form.role,
    };

    localStorage.setItem("users", JSON.stringify([...existingUsers, newUser]));
    alert("Регистрация прошла успешно!");
    navigate("/login");
  };

  return (
    <div className="login-container">
      <h2>Регистрация</h2>

      <input
        type="text"
        name="name"
        placeholder="Имя"
        value={form.name}
        onChange={handleChange}
      />

      <input
        type="text"
        name="surname"
        placeholder="Фамилия"
        value={form.surname}
        onChange={handleChange}
      />

      <input
        type="text"
        name="username"
        placeholder="Логин"
        value={form.username}
        onChange={handleChange}
      />

      <input
        type="password"
        name="password"
        placeholder="Пароль"
        value={form.password}
        onChange={handleChange}
      />

      <select name="role" value={form.role} onChange={handleChange}>
        <option value="student">Студент</option>
        <option value="admin">Администратор</option>
      </select>

      <button onClick={handleRegister}>Зарегистрироваться</button>
    </div>
  );
}
