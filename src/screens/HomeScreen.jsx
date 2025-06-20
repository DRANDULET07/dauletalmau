// src/screens/HomeScreen.jsx
import React from "react";
import { CalendarDays, BookOpen, UserCircle2 } from "lucide-react";
import "./home.css";

export default function HomeScreen() {
  const upcomingTasks = [
    { subject: "Программирование", deadline: "2025-06-22" },
    { subject: "Анализ данных", deadline: "2025-06-24" },
  ];

  const news = [
    "📢 Заседание кафедры — 21 июня в 15:00",
    "✅ Сессия завершена: поздравляем студентов!",
    "🎓 Выпускной состоится 30 июня в 11:00",
  ];

  return (
    <div className="content">
      <h2>Добро пожаловать в AlmaU!</h2>

      <div className="home-grid">
        <div className="card">
          <h3>Новости</h3>
          <ul>
            {news.map((item, idx) => <li key={idx}>{item}</li>)}
          </ul>
        </div>

        <div className="card">
          <h3>Ближайшие дедлайны</h3>
          <ul>
            {upcomingTasks.map((task, idx) => (
              <li key={idx}>{task.subject} — <strong>{task.deadline}</strong></li>
            ))}
          </ul>
        </div>

        <div className="quick-links">
          <a href="/profile" className="link-box"><UserCircle2 /> Профиль</a>
          <a href="/grades" className="link-box"><BookOpen /> Оценки</a>
          <a href="/schedule" className="link-box"><CalendarDays /> Расписание</a>
        </div>
      </div>
    </div>
  );
}
