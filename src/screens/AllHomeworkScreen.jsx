import React, { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { Pie } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
Chart.register(ArcElement, Tooltip, Legend);
import "./allhomework.css";

export default function AllHomeworkScreen() {
  const [allTasks, setAllTasks] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "homework"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setAllTasks(data);
    });
    return () => unsub();
  }, []);

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Все домашние задания студентов", 14, 16);
    doc.autoTable({
      startY: 20,
      head: [["Студент", "Предмет", "Срок", "Статус", "Файл"]],
      body: allTasks.map((task) => [
        task.student || "—",
        task.subject,
        task.deadline,
        getLabel(task.status),
        task.fileUrl ? "Ссылка есть" : "—"
      ]),
    });
    doc.save("homework-report.pdf");
  };

  const statusStats = {
    done: allTasks.filter((t) => t.status === "done").length,
    "in-progress": allTasks.filter((t) => t.status === "in-progress").length,
    overdue: allTasks.filter((t) => t.status === "overdue").length,
  };

  const pieData = {
    labels: ["Выполнено", "В процессе", "Просрочено"],
    datasets: [
      {
        label: "Количество",
        data: [statusStats.done, statusStats["in-progress"], statusStats.overdue],
        backgroundColor: ["#28a745", "#ffc107", "#dc3545"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="content all-homework">
      <h2>Все домашние задания студентов</h2>

      <div className="action-buttons">
        <button onClick={exportToPDF}>📄 Скачать PDF</button>
      </div>

      {/* 📊 График */}
      <div className="chart-container">
        <h4>Статистика по статусу</h4>
        <Pie data={pieData} />
      </div>

      {/* Десктопная таблица */}
      <table className="hw-table">
        <thead>
          <tr>
            <th>Студент</th>
            <th>Предмет</th>
            <th>Срок</th>
            <th>Статус</th>
            <th>Файл</th>
          </tr>
        </thead>
        <tbody>
          {allTasks.map((task) => (
            <tr key={task.id}>
              <td>{task.student}</td>
              <td>{task.subject}</td>
              <td>{task.deadline}</td>
              <td className={`status ${task.status}`}>{getLabel(task.status)}</td>
              <td>
                {task.fileUrl ? (
                  <a href={task.fileUrl} target="_blank" rel="noreferrer">📎 Скачать</a>
                ) : (
                  "—"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Мобильные карточки */}
      <div className="mobile-cards">
        {allTasks.map((task) => (
          <div key={task.id} className="homework-card">
            <div className="homework-card-header">
              <div className="homework-card-title">{task.subject}</div>
              <div className={`homework-card-status status ${task.status}`}>
                {getLabel(task.status)}
              </div>
            </div>
            <div className="homework-card-details">
              <div className="homework-card-detail">
                <span className="homework-card-label">Студент:</span>
                <span className="homework-card-value">{task.student || "—"}</span>
              </div>
              <div className="homework-card-detail">
                <span className="homework-card-label">Срок:</span>
                <span className="homework-card-value">{task.deadline}</span>
              </div>
              <div className="homework-card-detail">
                <span className="homework-card-label">Файл:</span>
                <span className="homework-card-value">
                  {task.fileUrl ? (
                    <a href={task.fileUrl} target="_blank" rel="noreferrer">📎 Скачать</a>
                  ) : (
                    "—"
                  )}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function getLabel(status) {
  switch (status) {
    case "done":
      return "Выполнено";
    case "in-progress":
      return "В процессе";
    case "overdue":
      return "Просрочено";
    default:
      return "—";
  }
}
