// ProfileScreen.jsx
import React, { useState, useEffect } from "react";
import { User, LogOut, Camera, Trash2 } from "lucide-react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import "./profile.css";

export default function ProfileScreen() {
  const storedUser = JSON.parse(localStorage.getItem("loggedUser"));
  if (!storedUser) return <p style={{ padding: "2rem" }}>Пользователь не авторизован</p>;

  const [formData, setFormData] = useState({
    email: "example@almau.edu.kz",
    group: "ИТ-2206",
    faculty: "Факультет цифровых технологий",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [avatar, setAvatar] = useState(localStorage.getItem("avatar") || null);

  useEffect(() => {
    const savedAvatar = localStorage.getItem("avatar");
    if (savedAvatar) setAvatar(savedAvatar);
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setAvatar(reader.result);
      localStorage.setItem("avatar", reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleAvatarDelete = () => {
    setAvatar(null);
    localStorage.removeItem("avatar");
  };

  const initials = `${storedUser?.name?.[0] || ""}${storedUser?.surname?.[0] || ""}`.toUpperCase();

  return (
    <div className="content">
      <h2>Личный кабинет</h2>

      <div className="profile-card">
        <div style={{ position: "relative" }}>
          {avatar ? (
            <img src={avatar} alt="avatar" />
          ) : (
            <div className="avatar-circle">{initials}</div>
          )}
          <label htmlFor="avatar-upload" className="avatar-upload-icon" title="Загрузить аватар">
            <Camera size={18} />
          </label>
          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleAvatarUpload}
          />
        </div>

        {avatar && (
          <button onClick={handleAvatarDelete} className="delete-avatar-btn">
            <Trash2 size={14} /> Удалить аватар
          </button>
        )}

        <h2>{storedUser.name} {storedUser.surname}</h2>
        <p><span className="label">Логин:</span> {storedUser.username}</p>
        <p><span className="label">Роль:</span> {storedUser.role}</p>

        {isEditing ? (
          <>
            <input name="email" value={formData.email} onChange={handleChange} />
            <input name="group" value={formData.group} onChange={handleChange} />
            <input name="faculty" value={formData.faculty} onChange={handleChange} />
          </>
        ) : (
          <>
            <p><span className="label">Почта:</span> {formData.email}</p>
            <p><span className="label">Группа:</span> {formData.group}</p>
            <p><span className="label">Факультет:</span> {formData.faculty}</p>
          </>
        )}

        <div className="progress-container">
          <CircularProgressbar
            value={80}
            text={`80%`}
            styles={buildStyles({
              pathColor: "#28a745",
              textColor: "#28a745",
              trailColor: "#eee",
            })}
          />
        </div>

        <p style={{ marginTop: "0.5rem" }}>Выполнено домашних заданий: 12</p>

        <div className="actions">
          {isEditing ? (
            <>
              <button className="edit" onClick={() => setIsEditing(false)}>Сохранить</button>
              <button className="logout" onClick={() => setIsEditing(false)}>Отмена</button>
            </>
          ) : (
            <>
              <button className="edit" onClick={() => setIsEditing(true)}>Редактировать</button>
              <button
                className="logout"
                onClick={() => {
                  localStorage.removeItem("loggedUser");
                  window.location.href = "/login";
                }}
              >
                <LogOut size={14} /> Выйти
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
