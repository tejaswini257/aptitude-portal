"use client";

import { useParams } from "next/navigation";
import styles from "../../student.module.css";
import { useState } from "react";

type Question = {
  id: number;
  question: string;
  options: string[];
  answer: string;
};

const questions: Question[] = [
  {
    id: 1,
    question: "If the average of 5 numbers is 20, what is their total?",
    options: ["50", "80", "100", "120"],
    answer: "100",
  },
  {
    id: 2,
    question: "Find the missing number: 2, 6, 12, 20, ?",
    options: ["28", "30", "32", "36"],
    answer: "30",
  },
];

export default function PracticeTopicPage() {
  const { topic } = useParams();

  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, string>
  >({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const handleSelect = (questionId: number, option: string) => {
    if (submitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: option,
    }));
  };

  const handleSubmit = () => {
    let correct = 0;

    questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.answer) {
        correct++;
      }
    });

    setScore(correct);
    setSubmitted(true);
  };

  const allAnswered =
    Object.keys(selectedAnswers).length === questions.length;

  return (
    <>
      <h2 className={styles.title}>
        {topic?.toString().toUpperCase()} Practice
      </h2>

      {/* Progress */}
      <div style={{ marginBottom: "24px", color: "#64748b" }}>
        {Object.keys(selectedAnswers).length} / {questions.length} answered
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        {questions.map((q, index) => (
          <div key={q.id} className={styles.card}>
            <div
              style={{
                fontWeight: 600,
                marginBottom: "16px",
                fontSize: "16px",
              }}
            >
              Q{index + 1}. {q.question}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {q.options.map((option) => {
                const isSelected =
                  selectedAnswers[q.id] === option;

                const isCorrect =
                  submitted && option === q.answer;

                const isWrong =
                  submitted &&
                  isSelected &&
                  option !== q.answer;

                return (
                  <button
                    key={option}
                    onClick={() =>
                      handleSelect(q.id, option)
                    }
                    style={{
                      padding: "10px 14px",
                      borderRadius: "10px",
                      border: "1px solid #e5e7eb",
                      background: isCorrect
                        ? "#dcfce7"
                        : isWrong
                        ? "#fee2e2"
                        : isSelected
                        ? "#eef2ff"
                        : "#ffffff",
                      cursor: submitted
                        ? "default"
                        : "pointer",
                      textAlign: "left",
                      transition: "0.2s",
                    }}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Submit Button */}
      {!submitted && (
        <button
          onClick={handleSubmit}
          disabled={!allAnswered}
          style={{
            marginTop: "30px",
            padding: "12px 22px",
            borderRadius: "10px",
            background: allAnswered
              ? "linear-gradient(90deg,#2563eb,#7c3aed)"
              : "#cbd5e1",
            color: "#ffffff",
            border: "none",
            cursor: allAnswered ? "pointer" : "not-allowed",
            transition: "0.3s",
          }}
        >
          Submit Answers
        </button>
      )}

      {/* Result Card */}
      {submitted && (
        <div
          style={{
            marginTop: "30px",
            padding: "24px",
            borderRadius: "16px",
            background: "#ffffff",
            boxShadow:
              "0 8px 25px rgba(0,0,0,0.06)",
          }}
        >
          <h3 style={{ fontSize: "18px", fontWeight: 600 }}>
            Your Score
          </h3>
          <p style={{ marginTop: "10px", fontSize: "16px" }}>
            {score} / {questions.length} correct
          </p>
        </div>
      )}
    </>
  );
}
