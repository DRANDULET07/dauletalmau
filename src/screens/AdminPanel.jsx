import React, { useEffect, useState } from "react";
import "./admin.css";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

export default function AdminPanel({ user }) {
  const [users, setUsers] = useState([]);
  const [notifText, setNotifText] = useState("");
  const [notifUser, setNotifUser] = useState("");

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

  const handleSendNotification = async () => {
    if (!notifText || !notifUser) {
      alert("Пожалуйста, заполните оба поля.");
      return;
    }

    try {
      await addDoc(collection(db, "notifications"), {
        userId: notifUser,
        text: notifText,
        timestamp: serverTimestamp(),
      });
      alert("Уведомление отправлено!");
      setNotifText("");
      setNotifUser("");
    } catch (e) {
      console.error("Ошибка при отправке уведомления:", e);
      alert("Ошибка при отправке.");
    }
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
        <h3>📢 Отправить уведомление</h3>
        <input
          type="text"
          placeholder="Логин получателя (userId)"
          value={notifUser}
          onChange={(e) => setNotifUser(e.target.value)}
          className="admin-input"
        />
        <textarea
          placeholder="Текст уведомления"
          value={notifText}
          onChange={(e) => setNotifText(e.target.value)}
          className="admin-textarea"
        />
        <button className="send-btn" onClick={handleSendNotification}>
          Отправить уведомление
        </button>
      </div>
    </div>
  );
}
