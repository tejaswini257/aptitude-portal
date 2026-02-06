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
      <div className={styles.progress}>
        {Object.keys(selectedAnswers).length} / {questions.length} answered
      </div>

      <div className={styles.questionsContainer}>
        {questions.map((q, index) => (
          <div key={q.id} className={styles.card}>
            <div className={styles.questionTitle}>
              Q{index + 1}. {q.question}
            </div>

            <div className={styles.optionsContainer}>
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
                    className={`${styles.optionButton} ${
                      isCorrect ? styles.correct : ""
                    } ${isWrong ? styles.wrong : ""} ${
                      isSelected && !isCorrect && !isWrong
                        ? styles.selected
                        : ""
                    }`}
                    disabled={submitted}
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
          className={`${styles.submitButton} ${
            allAnswered ? styles.submitEnabled : styles.submitDisabled
          }`}
        >
          Submit Answers
        </button>
      )}

      {/* Result Card */}
      {submitted && (
        <div className={styles.resultCard}>
          <h3 className={styles.resultTitle}>
            Your Score
          </h3>
          <p className={styles.resultText}>
            {score} / {questions.length} correct
          </p>
        </div>
      )}
    </>
  );
}
