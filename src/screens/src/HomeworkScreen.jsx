import React, { useState } from "react";
import HomeworkCard from "../../components/ui/HomeworkCard";
import "../../components/ui/homeworkcard.css";

export default function HomeworkScreen() {
  const [filter, setFilter] = useState("all");
  const [tasks, setTasks] = useState([
    {
      subject: "Программирование",
      description: "Реализовать сортировку массива",
      deadline: "2025-06-22",
      status: "in-progress"
    },
    {
      subject: "Критическое мышление",
      description: "Эссе",
      deadline: "2025-06-20",
      status: "done"
    },
    {
      subject: "Алгебра",
      description: "Задания §3.5",
      deadline: "2025-06-15",
      status: "overdue"
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ subject: "", deadline: "", status: "in-progress" });

  const filtered = tasks.filter(task => filter === "all" || task.status === filter);

  const handleSubmit = (e) => {
    e.preventDefault();
    setTasks(prev => [...prev, form]);
    setForm({ subject: "", deadline: "", status: "in-progress" });
    setShowModal(false);
  };

  return (
    <div className="content">
      <h2>Домашние задания</h2>

      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
        <div>
          <label>Фильтр: </label>
          <select value={filter} onChange={e => setFilter(e.target.value)}>
            <option value="all">Все</option>
            <option value="in-progress">В процессе</option>
            <option value="done">Выполнено</option>
            <option value="overdue">Просрочено</option>
          </select>
        </div>
        <button onClick={() => setShowModal(true)}>➕ Добавить домашку</button>
      </div>

      <div className="grades-grid">
        {filtered.map((task, index) => (
          <HomeworkCard key={index} {...task} />
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Добавить домашнее задание</h3>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Предмет"
                value={form.subject}
                onChange={e => setForm({ ...form, subject: e.target.value })}
                required
              />
              <input
                type="date"
                value={form.deadline}
                onChange={e => setForm({ ...form, deadline: e.target.value })}
                required
              />
              <select
                value={form.status}
                onChange={e => setForm({ ...form, status: e.target.value })}
              >
                <option value="in-progress">В процессе</option>
                <option value="done">Выполнено</option>
                <option value="overdue">Просрочено</option>
              </select>
              <div style={{ marginTop: "1rem", display: "flex", justifyContent: "space-between" }}>
                <button type="submit">Сохранить</button>
                <button type="button" onClick={() => setShowModal(false)}>Отмена</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
