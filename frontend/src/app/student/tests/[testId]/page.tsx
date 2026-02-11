"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/interceptors/axios";

type Option = { id: string; optionText: string };

type Question = {
  id: string;
  questionText: string;
  options: Option[];
};

type SectionWithQuestions = {
  sectionId: string;
  sectionName: string;
  questions: Question[];
};

function flattenQuestions(sections: SectionWithQuestions[]): Question[] {
  return sections.flatMap((s) => s.questions || []);
}

export default function TestDetailPage() {
  const params = useParams();
  const router = useRouter();
  const testId = params.testId as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [test, setTest] = useState<{ showResultImmediately?: boolean } | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [finalScore, setFinalScore] = useState<number | null>(null);

  const startTest = async () => {
    try {
      const res = await api.post("/submissions/start", { testId });
      setSubmissionId(res.data.id);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to start test");
      setLoading(false);
    }
  };

  const fetchData = async () => {
    try {
      const [testRes, questionsRes] = await Promise.all([
        api.get(`/tests/${testId}`),
        api.get(`/tests/${testId}/questions`),
      ]);
      setTest(testRes.data);
      const sections = questionsRes.data || [];
      const flat = flattenQuestions(sections);
      setQuestions(flat);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    startTest();
    fetchData();
  }, [testId]);

  const handleAnswer = async (questionId: string, selectedAnswer: string) => {
    if (!submissionId) return;

    try {
      const res = await api.post(`/submissions/${submissionId}/answer`, {
        questionId,
        selectedAnswer,
      });

      if (currentIndex < questions.length - 1) {
        setCurrentIndex((i) => i + 1);
      } else {
        setSubmitted(true);
        if (test?.showResultImmediately) {
          const subRes = await api.get("/submissions/me");
          const mySub = (subRes.data || []).find((s: any) => s.id === submissionId);
          if (mySub?.score != null) setFinalScore(mySub.score);
          else setFinalScore(0);
        }
      }
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to submit answer");
    }
  };

  const goToDashboard = () => {
    router.push("/student/dashboard");
  };

  if (loading) return <div className="p-6">Loading test...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (questions.length === 0)
    return (
      <div className="p-6">
        <p className="text-gray-500">No questions in this test yet.</p>
        <button
          onClick={() => router.push("/student/tests")}
          className="mt-4 text-emerald-600 hover:underline"
        >
          ← Back to Tests
        </button>
      </div>
    );

  if (submitted) {
    return (
      <div className="p-6 max-w-md mx-auto">
        <div className="bg-white p-8 rounded-xl shadow border text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Test Submitted!
          </h2>
          {test?.showResultImmediately && finalScore != null ? (
            <p className="text-2xl font-bold text-emerald-600 mb-4">
              Your Score: {finalScore}
            </p>
          ) : (
            <p className="text-gray-600 mb-4">
              Results will be available when the college admin publishes them.
            </p>
          )}
          <button
            onClick={goToDashboard}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const q = questions[currentIndex];
  if (!q) return null;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Test in Progress</h1>

      <div className="bg-white p-6 rounded-lg shadow border">
        <p className="text-sm text-gray-500 mb-2">
          Question {currentIndex + 1} / {questions.length}
        </p>

        <h2 className="text-lg font-semibold mb-4">{q.questionText}</h2>

        <div className="space-y-2">
          {(q.options || []).map((opt) => (
            <button
              key={opt.id}
              onClick={() => handleAnswer(q.id, opt.optionText)}
              className="block w-full text-left border p-3 rounded-lg hover:bg-emerald-50 hover:border-emerald-300 transition"
            >
              {opt.optionText}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
