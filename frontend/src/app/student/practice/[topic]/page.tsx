"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import api from "@/interceptors/axios";

type QuestionOption = {
  id: string;
  optionText: string;
};

type PracticeQuestion = {
  id: string;
  questionText: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  correctAnswer: string | null;
  options: QuestionOption[];
};

const DIFFICULTY_OPTIONS = ["EASY", "MEDIUM", "HARD"] as const;
type ApiErrorShape = {
  response?: {
    data?: {
      message?: string;
    };
  };
};

export default function PracticeTopicPage() {
  const params = useParams<{ topic: string }>();
  const topic = decodeURIComponent(params.topic || "");
  const [difficulty, setDifficulty] = useState<(typeof DIFFICULTY_OPTIONS)[number]>("EASY");
  const [questions, setQuestions] = useState<PracticeQuestion[]>([]);
  const [selected, setSelected] = useState<Record<string, string>>({});
  const [score, setScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchQuestions = useCallback(async (difficultyLevel: (typeof DIFFICULTY_OPTIONS)[number]) => {
    setLoading(true);
    try {
      const res = await api.get("/questions/practice", {
        params: {
          topic,
          difficulty: difficultyLevel,
          limit: 15,
        },
      });
      setQuestions(Array.isArray(res.data) ? (res.data as PracticeQuestion[]) : []);
      setSelected({});
      setScore(null);
      setError("");
    } catch (err: unknown) {
      const e = err as ApiErrorShape;
      setError(e?.response?.data?.message || "Failed to load practice questions.");
    } finally {
      setLoading(false);
    }
  }, [topic]);

  useEffect(() => {
    void fetchQuestions(difficulty);
  }, [topic, difficulty, fetchQuestions]);

  const handleSubmit = () => {
    let total = 0;
    questions.forEach((question) => {
      if (selected[question.id] === question.correctAnswer) total += 1;
    });
    setScore(total);
  };

  const attempted = Object.keys(selected).length;
  const progress = questions.length ? (attempted / questions.length) * 100 : 0;

  const scorePercent = useMemo(() => {
    if (score == null || questions.length === 0) return null;
    return Math.round((score / questions.length) * 100);
  }, [score, questions.length]);

  return (
    <div className="page space-y-6">
      <div className="page-header">
        <div>
          <h2 className="page-title">{topic} Practice</h2>
          <p className="page-subtitle">Choose difficulty and attempt topic-focused questions.</p>
        </div>

        <select
          className="input max-w-[180px]"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value as (typeof DIFFICULTY_OPTIONS)[number])}
        >
          {DIFFICULTY_OPTIONS.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-2 text-sm text-secondary">
          <span>Progress</span>
          <span>
            {attempted}/{questions.length}
          </span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {loading ? <p className="text-secondary">Loading questions...</p> : null}
      {error ? <p className="text-red-500">{error}</p> : null}

      {!loading && !error && questions.length === 0 ? (
        <div className="card empty-state">No questions available for this topic and difficulty.</div>
      ) : null}

      <div className="space-y-4">
        {questions.map((question, index) => (
          <article key={question.id} className="card space-y-3">
            <div className="flex items-center justify-between gap-3">
              <p className="font-semibold">
                Q{index + 1}. {question.questionText}
              </p>
              <span className="badge-warning">{question.difficulty}</span>
            </div>

            <div className="grid gap-2">
              {question.options.map((option) => (
                <label key={option.id} className="check-field">
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    checked={selected[question.id] === option.optionText}
                    onChange={() => setSelected((prev) => ({ ...prev, [question.id]: option.optionText }))}
                  />
                  <span>{option.optionText}</span>
                </label>
              ))}
            </div>
          </article>
        ))}
      </div>

      {questions.length > 0 ? (
        <div className="flex items-center gap-3">
          <button className="btn btn-primary" onClick={handleSubmit}>
            Submit Practice
          </button>
          <button className="btn btn-secondary" onClick={() => void fetchQuestions(difficulty)}>
            Reload Questions
          </button>
        </div>
      ) : null}

      {score != null ? (
        <div className="card">
          <h3 className="font-semibold text-lg">Practice Result</h3>
          <p className="mt-2 text-secondary">
            Score: <strong className="text-primary">{score}</strong> / {questions.length}
            {scorePercent != null ? ` (${scorePercent}%)` : ""}
          </p>
        </div>
      ) : null}
    </div>
  );
}
