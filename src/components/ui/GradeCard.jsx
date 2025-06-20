import { useEffect, useState } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import "./gradecard.css";

export default function GradeCard({ subject, teacher, values, color }) {
  const rating = values?.rating || 0;
  const [theme, setTheme] = useState("light");

  // Определение текста и цвета по рейтингу
  let gradeText = "";
  let gradeClass = "";

  if (rating >= 85) {
    gradeText = "Отлично";
    gradeClass = "excellent";
  } else if (rating >= 70) {
    gradeText = "Хорошо";
    gradeClass = "good";
  } else if (rating >= 50) {
    gradeText = "Удовлетворительно";
    gradeClass = "satisfactory";
  } else {
    gradeText = "Неудовлетворительно";
    gradeClass = "unsatisfactory";
  }

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setTheme(document.body.className || "light");
    });

    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    setTheme(document.body.className || "light");

    return () => observer.disconnect();
  }, []);

  return (
    <div className="grade-card">
      <h3>{subject}</h3>
      <p>{teacher}</p>
      <div style={{ width: 80, margin: "10px auto" }}>
        <CircularProgressbar
          value={rating}
          text={`${rating}%`}
          styles={buildStyles({
            pathColor: color || "#f3c237",
            textColor: theme === "dark" ? "#ffffff" : "#111111",
            trailColor: "#e0e0e0",
          })}
        />
      </div>
      <p className={`grade-status ${gradeClass}`}>{gradeText}</p>
      <div className="grade-values">
        <p>Ср.тек. 1: {values.srt1}</p>
        <p>Ср.тек. 2: {values.srt2}</p>
        <p>РК 1: {values.rk1}</p>
        <p>РК 2: {values.rk2}</p>
        <p>Экз.: {values.exam}</p>
        <p><strong>Рейтинг: {values.rating}</strong></p>
      </div>
    </div>
  );
}
