"use client";

import { useParams } from "next/navigation";
import styles from "../../student.module.css";
import { useState } from "react";

const dummyQuestions = [
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
  const [selected, setSelected] = useState<{ [key: number]: string }>({});
  const [score, setScore] = useState<number | null>(null);

  const handleSubmit = () => {
    let total = 0;

    dummyQuestions.forEach((q) => {
      if (selected[q.id] === q.answer) {
        total++;
      }
    });

    setScore(total);
  };

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.sectionTitle}>
        {topic?.toString().toUpperCase()} Practice
      </h1>

      {dummyQuestions.map((q) => (
        <div key={q.id} className={`${styles.card} mb-6`}>
          <p className="font-medium mb-4">
            {q.id}. {q.question}
          </p>

          <div className="space-y-2">
            {q.options.map((option) => (
              <label key={option} className="block">
                <input
                  type="radio"
                  name={`question-${q.id}`}
                  value={option}
                  className="mr-2"
                  onChange={() =>
                    setSelected({ ...selected, [q.id]: option })
                  }
                />
                {option}
              </label>
            ))}
          </div>
        </div>
      ))}

      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-6 py-2 rounded-md"
      >
        Submit Answers
      </button>

      {score !== null && (
        <div className="mt-6 text-lg font-semibold">
          Your Score: {score} / {dummyQuestions.length}
        </div>
      )}
    </div>
  );
}
