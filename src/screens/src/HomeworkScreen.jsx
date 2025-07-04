// HomeworkScreen.jsx (обновлённый)
import React, { useState, useEffect } from "react";
import { collection, addDoc, onSnapshot, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import HomeworkCard from "../../components/ui/HomeworkCard";
import { db, storage } from "../../firebase";
import "../allhomework.css"; // ✅ Правильный путь

export default function HomeworkScreen() {
  const [filter, setFilter] = useState("all");
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    subject: "",
    description: "",
    deadline: "",
    status: "in-progress",
  });
  const [file, setFile] = useState(null);

  const user = JSON.parse(localStorage.getItem("loggedUser"));

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "homework"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setTasks(data.filter(task => task.student === user.name));
    });
    return () => unsub();
  }, [user.name]);

  const filtered = tasks.filter(task => filter === "all" || task.status === filter);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let fileUrl = "";

    try {
      if (file) {
        const storageRef = ref(storage, `homework/${user.name}-${file.name}`);
        await uploadBytes(storageRef, file);
        fileUrl = await getDownloadURL(storageRef);
      }

      await addDoc(collection(db, "homework"), {
        ...form,
        student: user.name,
        fileUrl,
        timestamp: serverTimestamp(),
      });

      setForm({ subject: "", description: "", deadline: "", status: "in-progress" });
      setFile(null);
      setShowModal(false);
    } catch (err) {
      console.error("Ошибка при добавлении:", err);
    }
  };

  return (
    <div className="content all-homework">
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

      <table className="hw-table">
        <thead>
          <tr>
            <th>Предмет</th>
            <th>Описание</th>
            <th>Дедлайн</th>
            <th>Статус</th>
            <th>Файл</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(task => (
            <tr key={task.id}>
              <td>{task.subject}</td>
              <td>{task.description}</td>
              <td>{task.deadline}</td>
              <td>
                <span className={`status ${task.status}`}>{
                  task.status === "done" ? "Выполнено" :
                  task.status === "overdue" ? "Просрочено" : "В процессе"
                }</span>
              </td>
              <td>
                {task.fileUrl ? <a href={task.fileUrl} target="_blank" rel="noopener noreferrer">Скачать</a> : "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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
              <textarea
                placeholder="Описание"
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                style={{ resize: "vertical", height: "80px", marginTop: "0.5rem" }}
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

              <input
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                accept=".pdf,.doc,.docx,.txt"
                style={{ marginTop: "0.5rem" }}
              />

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
