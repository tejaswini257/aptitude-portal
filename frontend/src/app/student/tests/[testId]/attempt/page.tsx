"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/interceptors/axios";
import { useRouter } from "next/navigation";

export default function AttemptTestPage() {
  const { id } = useParams();
  const router = useRouter();

  const [test, setTest] = useState<any>(null);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const startTest = async () => {
  const res = await api.post("/submissions/start", { testId: id });
  setSubmissionId(res.data.id);
};

  // ================================
  // FETCH TEST
  // ================================
  useEffect(() => {
    fetchTest();
  }, []);

  const fetchTest = async () => {
    try {
      const res = await api.get(`/tests/${id}/questions`);
      const data = res.data;

      setTest(data);

      if (data.sections.length > 0) {
        setTimeLeft(data.sections[0].timeLimit * 60);
      }
    } catch {
      alert("Failed to load test");
    } finally {
      setLoading(false);
    }
  };

  // ================================
  // TIMER (Section-Based)
  // ================================
  useEffect(() => {
    if (!test) return;

    if (timeLeft <= 0) {
      moveToNextSection();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Reset timer when section changes
  useEffect(() => {
    if (test) {
      setTimeLeft(test.sections[currentSectionIndex].timeLimit * 60);
      setCurrentQuestionIndex(0);
    }
  }, [currentSectionIndex]);

  const moveToNextSection = async () => {
  // If NOT last section → just move
  if (currentSectionIndex < test.sections.length - 1) {
    setCurrentSectionIndex(prev => prev + 1);
    setCurrentQuestionIndex(0);
    return;
  }

  // 🔥 LAST SECTION → Finish test
  try {
    await api.post(`/submissions/${submissionId}/finish`);

    alert("Test submitted successfully");

    router.push(`/student/tests/${id}/result`);
  } catch (err) {
    alert("Failed to submit test");
  }
};

  // ================================
  // SAVE ANSWER
  // ================================
  const handleAnswer = (questionId: string, optionCode: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionCode,
    }));
  };

  // ================================
  // SUBMIT
  // ================================
  const handleSubmit = async () => {
    try {
      await api.post("/submissions", {
        testId: id,
        answers: Object.entries(answers).map(([questionId, selectedOption]) => ({
          questionId,
          selectedOption,
        })),
      });

      alert("Test submitted successfully!");
    } catch {
      alert("Submission failed");
    }
  };

  // ================================
  // LOADING STATES
  // ================================
  if (loading) return <div className="p-8">Loading test...</div>;
  if (!test) return <div className="p-8">Test not available</div>;

  const section = test.sections[currentSectionIndex];
  const questions = section.section.questions;
  const question = questions[currentQuestionIndex];

  // ================================
  // FORMAT TIMER
  // ================================
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="flex h-screen">

      {/* ================= Sidebar ================= */}
      <div className="w-64 bg-gray-100 p-4 border-r">
        <h2 className="font-semibold mb-4">Sections</h2>

        {test.sections.map((sec: any, index: number) => (
          <button
            key={sec.id}
            onClick={() => setCurrentSectionIndex(index)}
            className={`block w-full text-left p-2 rounded mb-2 ${
              currentSectionIndex === index
                ? "bg-emerald-600 text-white"
                : "hover:bg-gray-200"
            }`}
          >
            {sec.section.sectionName}
          </button>
        ))}
      </div>

      {/* ================= Main ================= */}
      <div className="flex-1 p-8">

        {/* Timer */}
        <div className="flex justify-between mb-6">
          <h3 className="text-lg font-semibold">
            Question {currentQuestionIndex + 1} of {questions.length}
          </h3>

          <div className="text-red-600 font-bold text-lg">
            ⏳ {minutes}:{seconds.toString().padStart(2, "0")}
          </div>
        </div>

        {/* Question */}
        <div className="mb-6 text-lg">
          {question.questionText}
        </div>

        {/* Options */}
        <div className="space-y-3">
          {question.options.map((opt: any) => (
            <label
              key={opt.optionCode}
              className={`block border rounded p-3 cursor-pointer ${
                answers[question.id] === opt.optionCode
                  ? "bg-emerald-100 border-emerald-500"
                  : "hover:bg-gray-50"
              }`}
            >
              <input
                type="radio"
                name={`question-${question.id}`}
                value={opt.optionCode}
                checked={answers[question.id] === opt.optionCode}
                onChange={() =>
                  handleAnswer(question.id, opt.optionCode)
                }
                className="mr-2"
              />
              {opt.optionCode}. {opt.optionText}
            </label>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <button
            disabled={currentQuestionIndex === 0}
            onClick={() =>
              setCurrentQuestionIndex((prev) => prev - 1)
            }
            className="px-4 py-2 border rounded"
          >
            Previous
          </button>

          {currentQuestionIndex < questions.length - 1 ? (
            <button
              onClick={() =>
                setCurrentQuestionIndex((prev) => prev + 1)
              }
              className="px-4 py-2 bg-emerald-600 text-white rounded"
            >
              Next
            </button>
          ) : (
            <button
              onClick={moveToNextSection}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              {currentSectionIndex < test.sections.length - 1
                ? "Next Section"
                : "Submit Test"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}