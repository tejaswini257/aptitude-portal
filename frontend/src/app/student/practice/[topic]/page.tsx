"use client";

import { useParams } from "next/navigation";
import { useState } from "react";

const questionBank: any = {
  logical: [
    {
      id: 1,
      question: "Find the next number: 2, 6, 12, 20, ?",
      options: ["28", "30", "32", "36"],
      answer: "30",
    },
    {
      id: 2,
      question: "If A=1, B=2 then CAT = ?",
      options: ["24", "20", "26", "23"],
      answer: "24",
    },
  ],
  quantitative: [
    {
      id: 1,
      question: "Average of 5 numbers is 20. Total?",
      options: ["80", "100", "120", "90"],
      answer: "100",
    },
  ],
verbal: [
  {
    id: 1,
    question: "Which of the following is a synonym of 'Happy'?",
    options: ["Sad", "Joyful", "Angry", "Tired"],
    answer: "Joyful",
  },
],
};

export default function PracticeTopicPage() {
  const { topic } = useParams();
  const questions = questionBank[topic as string] || [];

  const [selected, setSelected] = useState<any>({});
  const [score, setScore] = useState<number | null>(null);

  const handleSubmit = () => {
    let total = 0;
    questions.forEach((q: any) => {
      if (selected[q.id] === q.answer) total++;
    });
    setScore(total);
  };

  const progress =
    questions.length > 0
      ? (Object.keys(selected).length / questions.length) * 100
      : 0;

  return (
    <>
      <h2 style={{ fontSize: "26px", marginBottom: "20px" }}>
        {topic?.toString().toUpperCase()} Practice
      </h2>

      {/* Progress Bar */}
      <div
        style={{
          height: "8px",
          background: "#e5e7eb",
          borderRadius: "6px",
          marginBottom: "30px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${progress}%`,
            background: "linear-gradient(90deg,#4f46e5,#7c3aed)",
            transition: "width 0.4s ease",
          }}
        />
      </div>

      {questions.map((q: any) => (
        <div
          key={q.id}
          style={{
            background: "#fff",
            padding: "24px",
            borderRadius: "14px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
            marginBottom: "20px",
          }}
        >
          <p style={{ fontWeight: 600, marginBottom: "12px" }}>
            {q.id}. {q.question}
          </p>

          {q.options.map((option: string) => (
            <label
              key={option}
              style={{
                display: "block",
                marginBottom: "8px",
                cursor: "pointer",
              }}
            >
              <input
                type="radio"
                name={`question-${q.id}`}
                value={option}
                onChange={() =>
                  setSelected({ ...selected, [q.id]: option })
                }
              />{" "}
              {option}
            </label>
          ))}
        </div>
      ))}

      {questions.length > 0 && (
        <button
          onClick={handleSubmit}
          style={{
            padding: "12px 20px",
            background: "linear-gradient(90deg,#4f46e5,#7c3aed)",
            border: "none",
            color: "#fff",
            borderRadius: "10px",
            cursor: "pointer",
          }}
        >
          Submit
        </button>
      )}

      {score !== null && (
        <div
          style={{
            marginTop: "20px",
            fontSize: "18px",
            fontWeight: 600,
          }}
        >
          Your Score: {score} / {questions.length}
        </div>
      )}
    </>
  );
}
