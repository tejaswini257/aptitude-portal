"use client";

import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
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
      message?: string;
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

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [test, setTest] = useState<TestMeta | null>(null);
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
      const res = await api.post("/submissions/start", { testId });
      setSubmissionId(res.data.id as string);
    } catch (err: unknown) {
      const e = err as ApiErrorShape;
      setError(e?.response?.data?.message || "Failed to start test.");
      setLoading(false);
    }
  }, [testId]);

  const fetchData = useCallback(async () => {
    try {
      const [testRes, questionsRes] = await Promise.all([api.get(`/tests/${testId}`), api.get(`/tests/${testId}/questions`)]);
      setTest(testRes.data as TestMeta);
      const sections = (questionsRes.data || []) as SectionWithQuestions[];
      setQuestions(flattenQuestions(sections));
    } catch (err: unknown) {
      const e = err as ApiErrorShape;
      setError(e?.response?.data?.message || "Failed to load test.");
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

  const handleAnswer = async (questionId: string, selectedAnswer: string) => {
    if (!submissionId || submitted) return;
    try {
      await api.post(`/submissions/${submissionId}/answer`, {
        questionId,
        selectedAnswer,
      });

      if (currentIndex < questions.length - 1) {
        setCurrentIndex((index) => index + 1);
      } else {
        setSubmitted(true);
      }
    } catch (err: unknown) {
      const e = err as ApiErrorShape;
      window.alert(e?.response?.data?.message || "Failed to submit answer.");
    }
  };

  if (loading) return <p className="text-secondary">Loading test...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  if (questions.length === 0) {
    return (
      <div className="page space-y-4">
        <p className="text-secondary">No questions in this test yet.</p>
        <button onClick={() => router.push("/student/tests")} className="btn btn-secondary">
          Back to Tests
        </button>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="page">
        <div className="card max-w-xl mx-auto text-center space-y-3">
          <h2 className="text-2xl font-semibold">Test Submitted</h2>
          {test?.showResultImmediately && finalScore != null ? (
            <p className="text-2xl font-bold text-blue-600">Your Score: {finalScore}</p>
          ) : (
            <p className="text-secondary">Result will be available once evaluation is completed.</p>
          )}
          <button onClick={() => router.push("/student/dashboard")} className="btn btn-primary">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

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

        <div className="grid gap-2">
          {(currentQuestion.options || []).map((option) => (
            <button
              key={option.id}
              onClick={() => void handleAnswer(currentQuestion.id, option.optionText)}
              className="btn btn-secondary justify-start text-left"
            >
              {option.optionText}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
