// RegisterScreen.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";

export default function RegisterScreen() {
  const [form, setForm] = useState({
    name: "",
    surname: "",
    username: "",
    password: "",
    role: "student",
    avatar: "", // ← добавлено
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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
    const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");

    if (existingUsers.some((user) => user.username === form.username)) {
      alert("Пользователь с таким логином уже существует!");
      return;
    }

    const newUser = { ...form };

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

      <input
        type="file"
        accept="image/*"
        onChange={handleAvatarChange}
        style={{ marginTop: "1rem" }}
      />

      {form.avatar && (
        <img
          src={form.avatar}
          alt="avatar preview"
          style={{ width: 60, height: 60, borderRadius: "50%", marginTop: 10 }}
        />
      )}

      <button onClick={handleRegister} style={{ marginTop: "1rem" }}>
        Зарегистрироваться
      </button>
    </div>
  );
}
