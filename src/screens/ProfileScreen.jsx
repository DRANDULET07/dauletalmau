import React, { useState, useEffect } from "react";
import { LogOut, Camera, Trash2 } from "lucide-react";
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
  const [avatar, setAvatar] = useState(() => localStorage.getItem("avatar") || null);
  const [progress, setProgress] = useState(0); // замените на актуальные данные при необходимости

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

  const getProgressColor = (value) => {
    if (value >= 75) return "#28a745"; // green
    if (value >= 40) return "#ffc107"; // yellow
    return "#dc3545"; // red
  };

  return (
    <div className="content">
      <h2>Личный кабинет</h2>

      <div className="profile-container">
        <div className="avatar-container">
          <div className="avatar-edit">
            {avatar ? (
              <img src={avatar} alt="avatar" className="avatar-circle" />
            ) : (
              <div className="avatar-circle">{initials}</div>
            )}
            <label htmlFor="avatar-upload" className="avatar-overlay" title="Загрузить аватар">
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
        </div>

        {avatar && (
          <button onClick={handleAvatarDelete} className="delete-avatar-btn">
            <Trash2 size={14} /> Удалить аватар
          </button>
        )}

        <h2>{storedUser.name} {storedUser.surname}</h2>
        <p><span className="label">Логин:</span> {storedUser.username}</p>
        <p><span className="label">Роль:</span> {storedUser.role}</p>
        <p><span className="label">Статус:</span> online</p>

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

        <div className="progress-section">
          <CircularProgressbar
            value={progress}
            text={`${progress}%`}
            strokeWidth={10}
            styles={buildStyles({
              pathColor: getProgressColor(progress),
              textColor: getProgressColor(progress),
              trailColor: "#3a3a3a",
              textSize: "18px",
              pathTransitionDuration: 0.8,
            })}
          />
        </div>
        <p>Выполнено домашних заданий: {progress}%</p>

        <div className="action-buttons">
          {isEditing ? (
            <>
              <button className="edit-btn" onClick={() => setIsEditing(false)}>Сохранить</button>
              <button className="logout-btn" onClick={() => setIsEditing(false)}>Отмена</button>
            </>
          ) : (
            <>
              <button className="edit-btn" onClick={() => setIsEditing(true)}>Редактировать</button>
              <button
                className="logout-btn"
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
