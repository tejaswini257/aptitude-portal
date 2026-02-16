"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/interceptors/axios";

type Option = {
  id: string;
  optionCode: string;
  optionText: string;
};

type Question = {
  id: string;
  questionText: string;
  options: Option[];
};

type Section = {
  sectionId: string;
  sectionName: string;
  questions: Question[];
};

export default function StudentTestPage() {
  const params = useParams();
  const testId = params?.testId as string;
  const router = useRouter();

  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [currentSection, setCurrentSection] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(3600);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 1. Start submission & fetch questions
  useEffect(() => {
    if (!testId) return;

    const run = async () => {
      try {
        const [startRes, questionsRes] = await Promise.all([
          api.post("/submissions/start", { testId }),
          api.get(`/tests/${testId}/questions`),
        ]);
        setSubmissionId(startRes.data.id);
        setSections(questionsRes.data || []);
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to load test");
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [testId]);

  // Timer
  useEffect(() => {
    if (!submissionId || sections.length === 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [submissionId, sections.length]);

  // Auto-submit when time runs out
  useEffect(() => {
    if (timeLeft === 0 && submissionId) {
      handleSubmit();
    }
  }, [timeLeft, submissionId]);

  const handleOptionSelect = (questionId: string, selectedAnswer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: selectedAnswer }));
  };

  const handleSubmit = async () => {
    if (!submissionId) return;

    const answerList = Object.entries(answers).map(([questionId, selectedAnswer]) => ({
      questionId,
      selectedAnswer,
    }));

    try {
      await api.post(`/submissions/${submissionId}/submit-bulk`, {
        answers: answerList,
      });
      router.push("/student/dashboard");
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to submit test");
    }
  };

  const handleNext = () => {
    if (!sections[currentSection]) return;
    const section = sections[currentSection];

    if (currentQuestion < section.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
      setCurrentQuestion(0);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  if (loading) return <div className="p-8">Loading test…</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;
  if (sections.length === 0)
    return (
      <div className="p-8">
        <p className="text-gray-600">No questions in this test.</p>
        <button
          onClick={() => router.push("/student/dashboard")}
          className="mt-4 text-emerald-600 hover:underline"
        >
          ← Back to Dashboard
        </button>
      </div>
    );

  const section = sections[currentSection];
  const question = section?.questions[currentQuestion];

  if (!question) return null;

  return (
    <div className="flex h-screen">
      <div className="w-3/4 p-8 border-r">
        <div className="flex justify-between mb-6">
          <h2 className="text-xl font-semibold">{section.sectionName}</h2>
          <div className="text-red-600 font-semibold">⏳ {formatTime(timeLeft)}</div>
        </div>

        <div className="mb-6">
          <h3 className="font-medium mb-4">
            Q{currentQuestion + 1}. {question.questionText}
          </h3>

          <div className="space-y-3">
            {question.options.map((opt) => (
              <label
                key={opt.id}
                className={`block border p-3 rounded cursor-pointer ${
                  answers[question.id] === opt.optionCode
                    ? "border-emerald-600 bg-emerald-50"
                    : ""
                }`}
              >
                <input
                  type="radio"
                  name={question.id}
                  value={opt.optionCode}
                  checked={answers[question.id] === opt.optionCode}
                  onChange={() =>
                    handleOptionSelect(question.id, opt.optionCode)
                  }
                  className="mr-2"
                />
                {opt.optionText}
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-between">
          <button
            onClick={handleNext}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Save & Next
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-red-600 text-white rounded"
          >
            Submit Test
          </button>
        </div>
      </div>

      <div className="w-1/4 p-6 bg-gray-50 overflow-y-auto">
        <h3 className="font-semibold mb-4">Questions</h3>
        <div className="grid grid-cols-5 gap-3">
          {section.questions.map((q, index) => (
            <button
              key={q.id}
              onClick={() => setCurrentQuestion(index)}
              className={`p-2 rounded border text-sm ${
                answers[q.id] ? "bg-emerald-600 text-white" : "bg-white"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
