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
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Practice</h2>
      <div className="h-2 bg-gray-200 rounded mb-6 overflow-hidden">
        <div
          className="h-full bg-emerald-600 transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      {questions.map((q) => (
        <div
          key={q.id}
          className="bg-white p-6 rounded-xl border mb-4 shadow-sm"
        >
          <p className="font-medium mb-3">{q.questionText}</p>
          <div className="space-y-2">
            {q.options.map((opt) => (
              <label
                key={opt.id}
                className={`block border p-3 rounded cursor-pointer ${
                  selected[q.id] === opt.optionCode
                    ? "border-emerald-600 bg-emerald-50"
                    : ""
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
                  className="mr-2"
                />
                {opt.optionText}
              </label>
            ))}
          </div>
        </div>
      ))}

      {!submitted && (
        <button
          onClick={handleSubmit}
          className="px-5 py-2 bg-emerald-600 text-white rounded-lg font-medium"
        >
          Submit
        </button>
      )}

      {submitted && score !== null && (
        <p className="mt-4 text-lg font-semibold">
          Submitted! You selected {Object.keys(selected).length} answers.
        </p>
      )}

      <button
        onClick={() => router.push("/student/practice")}
        className="mt-6 text-emerald-600 hover:underline"
      >
        ← Back to Practice Sets
      </button>
    </div>
  );
}
