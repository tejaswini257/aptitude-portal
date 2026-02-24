"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/interceptors/axios";
import { AlertCircle, ArrowLeft } from "lucide-react";

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
    <div className="flex h-screen bg-surface">
      <div className="w-3/4 p-8 border-r border-default bg-white flex flex-col">
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-default">
          <h2 className="text-2xl font-semibold text-primary">{section.sectionName}</h2>
          <div className="text-red-500 font-semibold px-4 py-2 bg-red-50 rounded-full border border-red-100 flex items-center gap-2">
            <span>⏳</span> {formatTime(timeLeft)}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-medium text-lg text-primary mb-6">
            <span className="text-secondary mr-2">Q{currentQuestion + 1}.</span>
            {question.questionText}
          </h3>

          <div className="space-y-3">
            {question.options.map((opt) => (
              <label
                key={opt.id}
                className={`block border p-4 rounded-xl cursor-pointer transition-all duration-200 ${answers[question.id] === opt.optionCode
                  ? "border-emerald-500 bg-emerald-50/50 shadow-sm"
                  : "border-default hover:border-gray-300 hover:bg-gray-50"
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

        <div className="flex justify-between mt-auto pt-6 border-t border-default">
          <button
            onClick={handleNext}
            className="btn btn-primary"
          >
            Save & Next
          </button>
          <button
            onClick={handleSubmit}
            className="btn btn-danger"
          >
            Submit Test
          </button>
        </div>
      </div>

      <div className="w-1/4 p-6 bg-surface overflow-y-auto border-l border-default">
        <h3 className="font-semibold text-primary mb-6">Question Palette</h3>
        <div className="grid grid-cols-5 gap-3">
          {section.questions.map((q, index) => (
            <button
              key={q.id}
              onClick={() => setCurrentQuestion(index)}
              className={`aspect-square flex items-center justify-center rounded-lg border font-medium text-sm transition-colors ${answers[q.id]
                  ? "bg-emerald-500 border-emerald-500 text-white shadow-sm"
                  : "bg-white border-default text-secondary hover:border-gray-400"
                } ${currentQuestion === index ? "ring-2 ring-emerald-500/30 ring-offset-1" : ""}`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div >
  );
}
