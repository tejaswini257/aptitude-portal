"use client";

<<<<<<< HEAD
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
=======
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
>>>>>>> d91389d827f612a3fc5abc416ed8d834194b8ae9
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

<<<<<<< HEAD
type TestMeta = {
  name?: string;
  showResultImmediately?: boolean;
  sections?: Array<{ timeLimit?: number }>;
};

type MySubmission = {
  id: string;
  score?: number;
};

type ApiErrorShape = {
  response?: {
    data?: {
      message?: string | string[];
    };
  };
};

function flattenQuestions(sections: SectionWithQuestions[]): Question[] {
  return sections.flatMap((section) => section.questions || []);
}

function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const secs = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${mins}:${secs}`;
}

export default function TestDetailPage() {
  const params = useParams<{ testId: string }>();
  const router = useRouter();
  const testId = params.testId;
=======
export default function StudentTestPage() {
  const params = useParams();
  const testId = params?.testId as string;
  const router = useRouter();
>>>>>>> d91389d827f612a3fc5abc416ed8d834194b8ae9

  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [currentSection, setCurrentSection] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(3600);
  const [loading, setLoading] = useState(true);
<<<<<<< HEAD
  const [error, setError] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [test, setTest] = useState<TestMeta | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [finalScore, setFinalScore] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);

  const computedDurationSeconds = useMemo(() => {
    const sectionMinutes = (test?.sections || []).reduce((sum, section) => sum + (section.timeLimit || 0), 0);
    if (sectionMinutes > 0) return sectionMinutes * 60;
    if (questions.length > 0) return questions.length * 60;
    return 30 * 60;
  }, [questions.length, test?.sections]);

  useEffect(() => {
    if (!computedDurationSeconds) return;
    setTimeLeft(computedDurationSeconds);
  }, [computedDurationSeconds]);

  useEffect(() => {
    if (submitted || timeLeft <= 0) return;
    const timer = window.setInterval(() => {
      setTimeLeft((prev) => Math.max(prev - 1, 0));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [submitted, timeLeft]);

  useEffect(() => {
    if (timeLeft !== 0 || submitted) return;
    setSubmitted(true);
  }, [submitted, timeLeft]);

  const startTest = useCallback(async () => {
    try {
      if (!submissionId) {
        const res = await api.post("/submissions/start", { testId });
        setSubmissionId(res.data.id as string);
      }
    } catch (err: unknown) {
      const e = err as ApiErrorShape;
      const msg = e?.response?.data?.message;
      const errorStr = Array.isArray(msg) ? msg.join(", ") : (msg || "Failed to start test.");
      setError(errorStr);
      toast.error(`Attempt Error: ${errorStr}`);
    }
  }, [testId, submissionId]);

  const fetchData = useCallback(async () => {
    try {
      const [testRes, questionsRes] = await Promise.all([api.get(`/tests/${testId}`), api.get(`/tests/${testId}/questions`)]);
      setTest(testRes.data as TestMeta);
      const sections = (questionsRes.data || []) as SectionWithQuestions[];
      setQuestions(flattenQuestions(sections));
    } catch (err: unknown) {
      const e = err as ApiErrorShape;
      const msg = e?.response?.data?.message;
      const errorStr = Array.isArray(msg) ? msg.join(", ") : (msg || "Failed to load test metadata.");
      setError(errorStr);
      toast.error(`Loading Error: ${errorStr}`);
    } finally {
      setLoading(false);
    }
  }, [testId]);

  useEffect(() => {
    void startTest();
    void fetchData();
  }, [fetchData, startTest]);

  const fetchScoreIfVisible = useCallback(async () => {
    if (!test?.showResultImmediately || !submissionId) return;
    const subRes = await api.get("/submissions/me");
    const mySub = ((subRes.data || []) as MySubmission[]).find((item) => item.id === submissionId);
    setFinalScore(mySub?.score ?? 0);
  }, [submissionId, test?.showResultImmediately]);

  useEffect(() => {
    if (!submitted) return;
    void fetchScoreIfVisible();
  }, [fetchScoreIfVisible, submitted]);

  const handleNextQuestion = async () => {
    if (!submissionId || submitted || !selectedAnswer) return;
    try {
      const currentQuestion = questions[currentIndex];
      await api.post(`/submissions/${submissionId}/answer`, {
        questionId: currentQuestion.id,
        selectedAnswer,
      });

      setSelectedAnswer(null);
      if (currentIndex < questions.length - 1) {
        setCurrentIndex((index) => index + 1);
      }
    } catch (err: unknown) {
      const e = err as ApiErrorShape;
      const msg = e?.response?.data?.message;
      toast.error(Array.isArray(msg) ? msg.join(", ") : (msg || "Failed to submit answer."));
    }
  };

  const handleTestSubmit = async () => {
    if (!submissionId || submitted || !selectedAnswer) return;
    try {
      const currentQuestion = questions[currentIndex];
      await api.post(`/submissions/${submissionId}/answer`, {
        questionId: currentQuestion.id,
        selectedAnswer,
      });

      setSubmitted(true);
      if (!test?.showResultImmediately) {
        router.replace('/student/analytics');
      } else {
        toast.success("Test Submitted Successfully!");
      }
    } catch (err: unknown) {
      const e = err as ApiErrorShape;
      const msg = e?.response?.data?.message;
      toast.error(Array.isArray(msg) ? msg.join(", ") : (msg || "Failed to submit final answer."));
    }
  };

  if (loading) return (
    <div className="page flex items-center justify-center p-12">
      <div className="animate-pulse flex flex-col items-center gap-3 text-secondary">
        <div className="w-8 h-8 rounded-full border-4 border-t-blue-600 border-blue-200 animate-spin"></div>
        <p className="font-medium text-lg">Initializing Examination...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="page flex flex-col items-center justify-center p-12 max-w-2xl mx-auto text-center space-y-4">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-600 mb-2">
        <AlertCircle size={32} />
      </div>
      <h2 className="text-2xl font-bold text-gray-900">Unable to Start Test</h2>
      <p className="text-gray-600 mb-6 bg-red-50 p-4 rounded-lg border border-red-100 w-full font-mono text-sm">
        {error}
      </p>
      <button onClick={() => router.push("/student/dashboard")} className="btn bg-gray-900 text-white hover:bg-gray-800 flex items-center gap-2">
        <ArrowLeft size={16} /> Return to Dashboard
      </button>
    </div>
  );

  if (questions.length === 0) {
    return (
      <div className="page space-y-4">
        <p className="text-secondary">No questions in this test yet.</p>
        <button onClick={() => router.push("/student/tests")} className="btn btn-secondary">
          Back to Tests
=======
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
>>>>>>> d91389d827f612a3fc5abc416ed8d834194b8ae9
        </button>
      </div>
    );
  }

<<<<<<< HEAD
  if (submitted) {
    return (
      <div className="page">
        <div className="card max-w-xl mx-auto text-center space-y-3">
          <h2 className="text-2xl font-semibold">Test Submitted</h2>
          {test?.showResultImmediately && finalScore != null ? (
            <p className="text-2xl font-bold text-blue-600">Your Score: {finalScore}</p>
          ) : (
            <p className="text-secondary">Result recorded successfully. You are being redirected to your scorecard...</p>
          )}
          <button onClick={() => router.replace("/student/analytics")} className="btn btn-primary">
            View Analytics
=======
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
>>>>>>> d91389d827f612a3fc5abc416ed8d834194b8ae9
          </button>
        </div>
      </div>

<<<<<<< HEAD
  const currentQuestion = questions[currentIndex];
  if (!currentQuestion) return null;

  return (
    <div className="page space-y-6">
      <div className="page-header">
        <div>
          <h2 className="page-title">{test?.name || "Test Attempt"}</h2>
          <p className="page-subtitle">Read instructions and answer each question within time.</p>
        </div>
        <div className="card px-4 py-3">
          <p className="text-xs text-secondary">Time Remaining</p>
          <p className="font-bold text-lg">{formatTime(timeLeft)}</p>
        </div>
      </div>

      <div className="card">
        <h3 className="font-semibold text-lg mb-2">Instructions</h3>
        <ul className="text-sm text-secondary space-y-1">
          <li>Answer all questions within the allotted time.</li>
          <li>Each question can be answered once in this flow.</li>
          <li>Keep a stable internet connection while attempting the test.</li>
        </ul>
      </div>

      <div className="card space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-secondary">
            Question {currentIndex + 1} of {questions.length}
          </p>
          <div className="text-sm text-secondary">{Math.round(((currentIndex + 1) / questions.length) * 100)}% complete</div>
        </div>

        <h3 className="text-lg font-semibold">{currentQuestion.questionText}</h3>

        <div className="grid gap-3 mb-6">
          {(currentQuestion.options || []).map((option) => {
            const isSelected = selectedAnswer === option.optionText;
            return (
              <button
                key={option.id}
                onClick={() => setSelectedAnswer(option.optionText)}
                className={`w-full p-4 text-left border rounded-xl transition-all ${isSelected
                  ? "border-indigo-600 bg-indigo-50 ring-2 ring-indigo-600/20 text-indigo-900 font-medium"
                  : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50 text-gray-700"
                  }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-indigo-600' : 'border-gray-300'}`}>
                    {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-indigo-600" />}
                  </div>
                  <span>{option.optionText}</span>
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-100">
          {currentIndex < questions.length - 1 ? (
            <button
              onClick={handleNextQuestion}
              disabled={!selectedAnswer}
              className="btn btn-secondary disabled:opacity-50 min-w-32"
            >
              Next Question
=======
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
>>>>>>> d91389d827f612a3fc5abc416ed8d834194b8ae9
            </button>
          ) : (
            <button
              onClick={handleTestSubmit}
              disabled={!selectedAnswer}
              className="btn btn-primary bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 min-w-32"
            >
              Submit Test
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
