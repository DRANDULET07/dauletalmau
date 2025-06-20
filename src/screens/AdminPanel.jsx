// src/screens/AdminPanel.jsx
import React, { useEffect, useState } from "react";
import "./admin.css";

export default function AdminPanel({ user }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");
    setUsers(storedUsers);
  }, []);

  const handleDelete = (usernameToDelete) => {
    if (usernameToDelete === user.username) {
      alert("Нельзя удалить самого себя.");
      return;
    }

    const updatedUsers = users.filter((u) => u.username !== usernameToDelete);
    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    alert("Пользователь удалён.");
  };

  return (
    <div className="content">
      <h2>Админ-панель</h2>
      <p>
        Добро пожаловать, <strong>{user.name} {user.surname}</strong>!
      </p>
      <p>Ваша роль: <strong>{user.role}</strong></p>

      <div className="admin-section">
        <h3>👥 Пользователи ({users.length})</h3>
        <table className="user-table">
          <thead>
            <tr>
              <th>Имя</th>
              <th>Фамилия</th>
              <th>Логин</th>
              <th>Роль</th>
              <th>Действие</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.username}>
                <td>{u.name}</td>
                <td>{u.surname}</td>
                <td>{u.username}</td>
                <td>{u.role}</td>
                <td>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(u.username)}
                  >
                    Удалить
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="admin-section">
        <h3>📢 Объявления</h3>
        <p>Скоро будет добавлена возможность публиковать новости и уведомления для студентов.</p>
      </div>
    </div>
  );
}
