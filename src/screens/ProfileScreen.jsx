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

  const handleEditClick = () => setIsEditing(true);
  const handleCancel = () => {
    setFormData({
      email: "example@almau.edu.kz",
      group: "ИТ-2206",
      faculty: "Факультет цифровых технологий",
    });
    setIsEditing(false);
  };
  const handleSave = () => {
    setIsEditing(false);
  };
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
      <div className="profile-container">
        <div className="avatar-container">
          <div className="avatar-edit">
            <div className="avatar-circle">
              {avatar ? <img src={avatar} alt="avatar" /> : <span>{initials}</span>}
            </div>
            <div className="avatar-overlay">
              <label htmlFor="avatar-upload" title="Загрузить">
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
        </div>

        {avatar && (
          <button onClick={handleAvatarDelete} className="delete-avatar-btn" title="Удалить аватар">
            <Trash2 size={16} /> Удалить аватар
          </button>
        )}

        {isEditing ? (
          <div className="edit-form">
            <input name="email" value={formData.email} onChange={handleChange} />
            <input name="group" value={formData.group} onChange={handleChange} />
            <input name="faculty" value={formData.faculty} onChange={handleChange} />
          </div>
        ) : (
          <>
            <p><User size={14} /> <strong>{storedUser.name} {storedUser.surname}</strong></p>
            <p><strong>Логин:</strong> {storedUser.username}</p>
            <p><strong>Роль:</strong> {storedUser.role}</p>
            <p><strong>Почта:</strong> <span className="blue">{formData.email}</span></p>
            <p><strong>Группа:</strong> {formData.group}</p>
            <p><strong>Факультет:</strong> {formData.faculty}</p>
          </>
        )}

        <div className="progress-section">
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

        <p>Выполнено домашних заданий: 12</p>

        <div className="action-buttons">
          {isEditing ? (
            <>
              <button className="edit-btn" onClick={handleSave}>Сохранить</button>
              <button className="logout-btn" onClick={handleCancel}>Отмена</button>
            </>
          ) : (
            <>
              <button className="edit-btn" onClick={handleEditClick}>Редактировать</button>
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
