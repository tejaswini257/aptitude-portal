"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/interceptors/axios";

type Question = {
  id: string;
  questionText: string;
  options: {
    id: string;
    optionText: string;
  }[];
};

export default function TestDetailPage() {
  const params = useParams();
  const router = useRouter();
  const testId = params.testId as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [submissionId, setSubmissionId] = useState<string | null>(null);

  // 1️⃣ Start submission when page loads
  const startTest = async () => {
    try {
      const res = await api.post("/submissions/start", { testId });
      setSubmissionId(res.data.id);
    } catch (err) {
      setError("Failed to start test");
    }
  };

  // 2️⃣ Fetch questions of this test
  const fetchQuestions = async () => {
    try {
      const res = await api.get(`/questions/test/${testId}`);
      setQuestions(res.data || []);
    } catch (err) {
      setError("Failed to load questions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    startTest();
    fetchQuestions();
  }, []);

  const handleAnswer = async (questionId: string, selectedAnswer: string) => {
    if (!submissionId) return;

    try {
      await api.post(`/submissions/${submissionId}/answer`, {
        questionId,
        selectedAnswer,
      });

      // Move to next question
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        router.push("/student/dashboard"); // finish test
      }
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to submit answer");
    }
  };

  if (loading) return <div className="p-6">Loading test...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (questions.length === 0)
    return <div className="p-6">No questions in this test</div>;

  const q = questions[currentIndex];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Test in Progress</h1>

      <div className="bg-white p-6 rounded-lg shadow">
        <p className="text-sm text-gray-500 mb-2">
          Question {currentIndex + 1} / {questions.length}
        </p>

        <h2 className="text-lg font-semibold mb-4">
          {q.questionText}
        </h2>

        <div className="space-y-2">
          {q.options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => handleAnswer(q.id, opt.optionText)}
              className="block w-full text-left border p-3 rounded hover:bg-blue-50"
            >
              {opt.optionText}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
