import React from "react";
import { CheckCircle, Clock, XCircle, Calendar } from "lucide-react";
import "./homeworkcard.css";

export default function HomeworkCard({ subject, deadline, status }) {
  const getStatusContent = () => {
    switch (status) {
      case "done":
        return { icon: <CheckCircle size={16} />, label: "Выполнено", className: "done" };
      case "in-progress":
        return { icon: <Clock size={16} />, label: "В процессе", className: "in-progress" };
      case "overdue":
        return { icon: <XCircle size={16} />, label: "Просрочено", className: "overdue" };
      default:
        return { label: "Неизвестно", className: "" };
    }
  };

  const getDeadlineData = () => {
    const today = new Date();
    const due = new Date(deadline);
    const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24));

    let deadlineClass = "deadline-green";
    if (diffDays < 0) deadlineClass = "deadline-red";
    else if (diffDays <= 2) deadlineClass = "deadline-yellow";

    return {
      className: deadlineClass,
      tooltip: diffDays < 0
        ? `Просрочено на ${Math.abs(diffDays)} дн.`
        : `Осталось ${diffDays} дн.`
    };
  };

  const { icon, label, className } = getStatusContent();
  const { className: deadlineClass, tooltip } = getDeadlineData();

  return (
    <div className={`homework-card ${className}`}>
      <h3>{subject}</h3>
      <p className={`deadline ${deadlineClass}`} title={tooltip}>
        <Calendar size={16} style={{ marginRight: "4px", verticalAlign: "middle" }} />
        <strong>Срок:</strong> {deadline}
      </p>
      <p className="status">{icon} {label}</p>
    </div>
  );
}
