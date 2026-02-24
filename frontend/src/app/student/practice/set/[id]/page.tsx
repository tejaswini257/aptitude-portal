"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/interceptors/axios";

type Option = { id: string; optionCode: string; optionText: string };
type Question = { id: string; questionText: string; options: Option[] };

export default function PracticeSetPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Record<string, string>>({});
  const [score, setScore] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!id) return;
    api
      .get(`/practice-sets/${id}/questions`)
      .then((res) => setQuestions(res.data?.questions || []))
      .catch(() => setQuestions([]))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = () => {
    let correct = 0;
    questions.forEach((q) => {
      const ans = selected[q.id];
      if (ans) {
        const opt = q.options.find((o) => o.optionCode === ans);
        if (opt) correct++; // simplified - we don't have correctAnswer here
      }
    });
    setScore(correct);
    setSubmitted(true);
  };

  const progress =
    questions.length > 0
      ? (Object.keys(selected).length / questions.length) * 100
      : 0;

  if (loading) return <div className="p-6">Loading…</div>;
  if (questions.length === 0)
    return (
      <div className="p-6">
        <p className="text-gray-500">No questions in this practice set.</p>
        <button
          onClick={() => router.push("/student/practice")}
          className="mt-4 text-emerald-600 hover:underline"
        >
          ← Back
        </button>
      </div>
    );

  return (
    <div className="page space-y-6 max-w-4xl mx-auto">
      <div className="page-header border-b pb-4">
        <div>
          <h2 className="page-title">Practice</h2>
          <p className="page-subtitle">Progress: {Math.round(progress)}%</p>
        </div>
      </div>

      <div className="h-2 bg-gray-100 rounded-full mb-8 overflow-hidden">
        <div
          className="h-full bg-emerald-500 transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="space-y-6">
        {questions.map((q, idx) => (
          <div
            key={q.id}
            className="card p-6 border border-default shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex gap-4 mb-4">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50 text-indigo-700 font-semibold flex-shrink-0">
                {idx + 1}
              </span>
              <p className="font-medium text-lg leading-relaxed">{q.questionText}</p>
            </div>

            <div className="space-y-3 pl-12">
              {q.options.map((opt) => (
                <label
                  key={opt.id}
                  className={`flex items-center gap-3 border p-4 rounded-xl cursor-pointer transition-colors ${selected[q.id] === opt.optionCode
                      ? "border-emerald-500 bg-emerald-50 text-emerald-900 font-medium shadow-sm"
                      : "border-gray-200 hover:bg-gray-50 hover:border-emerald-200"
                    }`}
                >
                  <input
                    type="radio"
                    name={q.id}
                    value={opt.optionCode}
                    checked={selected[q.id] === opt.optionCode}
                    onChange={() =>
                      setSelected((prev) => ({ ...prev, [q.id]: opt.optionCode }))
                    }
                    className="w-5 h-5 text-emerald-600 border-gray-300 focus:ring-emerald-500 transition-shadow"
                  />
                  <span className="flex-1">{opt.optionText}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="card bg-gray-50 flex items-center justify-between p-6">
        <div>
          {submitted && score !== null ? (
            <p className="text-lg font-semibold text-emerald-700">
              Submitted! You selected {Object.keys(selected).length} answers.
            </p>
          ) : (
            <p className="text-secondary text-sm">Make sure to review all answers before submitting.</p>
          )}
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => router.push("/student/practice")}
            className="btn btn-outline"
          >
            ← Back to Practice Sets
          </button>

          {!submitted && (
            <button
              onClick={handleSubmit}
              className="btn btn-primary px-8"
              disabled={Object.keys(selected).length === 0}
            >
              Submit Practice
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
