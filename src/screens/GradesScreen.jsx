import React from "react";
import GradeCard from "../components/ui/GradeCard";

export default function GradesScreen() {
  const grades = [
    {
      subject: "Критическое мышление",
      teacher: "Третьякова М.С",
      color: "#f3c237",
      values: { srt1: 50, srt2: 61, rk1: 50, rk2: 60, exam: 60, rating: 66 },
    },
    {
      subject: "Программирование и алгоритмы",
      teacher: "Адильжан А.М",
      color: "#f3c237",
      values: { srt1: 50, srt2: 52, rk1: 50, rk2: 0, exam: 54, rating: 54 },
    },
    {
      subject: "Прикладная линейная алгебра",
      teacher: "Дюсембаева Г.С",
      color: "#ccc",
      values: { srt1: 0, srt2: 0, rk1: 0, rk2: 0, exam: 0, rating: 0 },
    },
  ];

  return (
    <div className="content">
      <h2>Оценки</h2>
      <div className="grades-grid">
        {grades.map((grade, index) => (
          <GradeCard key={index} {...grade} />
        ))}
      </div>
    </div>
  );
}
