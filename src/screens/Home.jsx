import React from "react";
import { Link } from "react-router-dom";
import { User, BookOpen, Calendar, Info, AlertTriangle } from "lucide-react";
import "./home.css";

export default function Home({ user }) {
  const showNotification = () => {
    alert(`🔔 Уведомление для ${user?.name || "пользователя"}`);
  };

  return (
    <div className="content">
      <div className="top-banner">
        <h1>Добро пожаловать, {user?.name || ""} {user?.surname || ""}!</h1>
        <p><strong>Роль:</strong> {user?.role || "Не указана"}</p>
        <button className="notify-btn" onClick={showNotification}>
          <AlertTriangle size={16} /> Показать уведомление
        </button>
      </div>

      <div className="home-grid">
        <div className="card">
          <h3>🗞 Новости</h3>
          <ul>
            <li>📢 Заседание кафедры — 21 июня в 15:00</li>
            <li>✅ Сессия завершена: поздравляем студентов!</li>
            <li>🎓 Выпускной состоится 30 июня в 11:00</li>
          </ul>
        </div>

        <div className="card">
          <h3>📅 Ближайшие дедлайны</h3>
          <ul>
            <li>Программирование — <strong>2025-06-22</strong></li>
            <li>Анализ данных — <strong>2025-06-24</strong></li>
          </ul>
        </div>

        <div className="card">
          <h3>📌 Предстоящие события</h3>
          <ul>
            <li>🎤 Встреча с выпускниками — <strong>2025-06-25</strong></li>
            <li>🧪 Хакатон AlmaU — <strong>2025-07-03</strong></li>
          </ul>
        </div>

        <div className="card">
          <h3>📚 Домашние задания</h3>
          <ul>
            <li>
              Программирование — <strong>2025-06-21</strong> —{" "}
              <span className="status pending">не сдано</span>
            </li>
            <li>
              Анализ данных — <strong>2025-06-23</strong> —{" "}
              <span className="status done">сдано</span>
            </li>
            <li>
              UX/UI — <strong>2025-06-26</strong> —{" "}
              <span className="status checking">на проверке</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="quick-links">
        <Link to="/profile" className="link-box">
          <User size={18} /> Профиль
        </Link>
        <Link to="/grades" className="link-box">
          <BookOpen size={18} /> Оценки
        </Link>
        <Link to="/schedule" className="link-box">
          <Calendar size={18} /> Расписание
        </Link>
      </div>

      <div className="courses-section">
        <h2>🧠 Мои курсы</h2>
        <div className="courses-grid">
          <Link to="/course/programming" className="course-card">
            <Info size={18} />
            <span>Программирование</span>
          </Link>
          <Link to="/course/data" className="course-card">
            <Info size={18} />
            <span>Анализ данных</span>
          </Link>
          <Link to="/course/uiux" className="course-card">
            <Info size={18} />
            <span>UX/UI дизайн</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
