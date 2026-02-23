"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import api from "@/interceptors/axios";
import { Plus, Trash2, CheckCircle, Circle } from "lucide-react";
import toast from "react-hot-toast";

type CompanyTest = {
  id: string;
  name: string;
  createdAt: string;
  showResultImmediately: boolean;
  proctoringEnabled: boolean;
  rules?: {
    marksPerQuestion?: number;
    negativeMarking?: boolean;
    negativeMarks?: number | null;
  };
  sections?: Array<{
    timeLimit?: number;
    section?: { sectionName?: string };
  }>;
};

type ApiErrorShape = {
  response?: {
    data?: {
      message?: string;
    };
  };
};

type QuestionForm = {
  title: string;
  type: "MCQ";
  difficulty: "EASY" | "MEDIUM" | "HARD";
  correctAnswer: string;
  options: string[];
};

export default function CompanyTestsPage() {
  const [tests, setTests] = useState<CompanyTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    durationMinutes: 30,
    marksPerQuestion: 1,
    negativeMarking: false,
    negativeMarks: 0,
    showResultImmediately: false,
    proctoringEnabled: true,
    questions: [] as QuestionForm[],
  });

  const fetchTests = async () => {
    try {
      const res = await api.get("/company/tests");
      setTests(Array.isArray(res.data) ? (res.data as CompanyTest[]) : []);
      setError("");
    } catch (err: unknown) {
      const e = err as ApiErrorShape;
      setError(e?.response?.data?.message || "Failed to load tests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchTests();
  }, []);

  const handleAddQuestion = () => {
    setForm((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          title: "",
          type: "MCQ",
          difficulty: "MEDIUM",
          correctAnswer: "",
          options: ["", "", "", ""],
        },
      ],
    }));
  };

  const handleRemoveQuestion = (index: number) => {
    setForm((prev) => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index),
    }));
  };

  const handleQuestionChange = (index: number, key: keyof QuestionForm, value: any) => {
    setForm((prev) => {
      const q = [...prev.questions];
      q[index] = { ...q[index], [key]: value };
      return { ...prev, questions: q };
    });
  };

  const handleOptionChange = (qIndex: number, optIndex: number, value: string) => {
    setForm((prev) => {
      const q = [...prev.questions];
      const newOpts = [...q[qIndex].options];
      newOpts[optIndex] = value;
      q[qIndex] = { ...q[qIndex], options: newOpts };
      return { ...prev, questions: q };
    });
  };

  const setCorrectOption = (qIndex: number, optValue: string) => {
    setForm((prev) => {
      const q = [...prev.questions];
      q[qIndex] = { ...q[qIndex], correctAnswer: optValue };
      return { ...prev, questions: q };
    });
  };

  const handleCreateTest = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!form.name.trim()) return toast.error("Test name is required.");
    if (form.durationMinutes < 5) return toast.error("Duration must be at least 5 minutes.");
    if (form.marksPerQuestion < 1) return toast.error("Marks per question must be at least 1.");
    if (form.negativeMarking && form.negativeMarks < 0) return toast.error("Negative marks cannot be negative.");

    for (let i = 0; i < form.questions.length; i++) {
      const q = form.questions[i];
      if (!q.title.trim()) return toast.error(`Question ${i + 1} is missing a title.`);
      if (q.options.some(o => !o.trim())) return toast.error(`Question ${i + 1} has empty options.`);
      if (!q.correctAnswer) return toast.error(`Question ${i + 1} is missing a correct answer selection.`);
    }

    setSaving(true);
    try {
      await api.post("/company/tests", {
        name: form.name.trim(),
        durationMinutes: form.durationMinutes,
        marksPerQuestion: form.marksPerQuestion,
        negativeMarking: form.negativeMarking,
        negativeMarks: form.negativeMarking ? form.negativeMarks : null,
        showResultImmediately: form.showResultImmediately,
        proctoringEnabled: form.proctoringEnabled,
        questions: form.questions,
      });

      setForm({
        name: "",
        durationMinutes: 30,
        marksPerQuestion: 1,
        negativeMarking: false,
        negativeMarks: 0,
        showResultImmediately: false,
        proctoringEnabled: true,
        questions: [],
      });
      toast.success("Test created successfully!");
      await fetchTests();
    } catch (err: unknown) {
      const e = err as ApiErrorShape;
      toast.error(e?.response?.data?.message || "Unable to create test.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page space-y-8">
      <div className="page-header">
        <div>
          <h2 className="page-title">Assessment Tests</h2>
          <p className="page-subtitle">
            Create structured tests with duration and marking rules for recruitment rounds.
          </p>
        </div>
      </div>

      <form onSubmit={handleCreateTest} className="grid lg:grid-cols-3 gap-6">
        {/* Left Column: Test Configuration */}
        <div className="lg:col-span-1 space-y-6">
          <div className="card space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2">Test Settings</h3>

            <div>
              <label className="field-label">Test Name *</label>
              <input
                className="input"
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Example: Software Engineer Round 1"
              />
            </div>

            <div>
              <label className="field-label">Global Duration (minutes) *</label>
              <input
                className="input"
                type="number"
                min={5}
                max={300}
                value={form.durationMinutes}
                onChange={(e) => setForm((prev) => ({ ...prev, durationMinutes: Number(e.target.value) }))}
              />
            </div>

            <div>
              <label className="field-label">Marks Per Question *</label>
              <input
                className="input"
                type="number"
                min={1}
                max={20}
                value={form.marksPerQuestion}
                onChange={(e) => setForm((prev) => ({ ...prev, marksPerQuestion: Number(e.target.value) }))}
              />
            </div>

            <div className="pt-2 border-t space-y-2">
              <label className="check-field">
                <input
                  type="checkbox"
                  checked={form.negativeMarking}
                  onChange={(e) => setForm((prev) => ({ ...prev, negativeMarking: e.target.checked }))}
                />
                <span className="font-medium text-sm">Enable negative marking</span>
              </label>
              {form.negativeMarking && (
                <div className="ml-6">
                  <label className="field-label text-xs">Penalty Marks</label>
                  <input
                    className="input form-input-sm w-24"
                    type="number"
                    min={0}
                    max={10}
                    value={form.negativeMarks}
                    onChange={(e) => setForm((prev) => ({ ...prev, negativeMarks: Number(e.target.value) }))}
                  />
                </div>
              )}
            </div>

            <div className="pt-2 border-t space-y-3">
              <label className="check-field">
                <input
                  type="checkbox"
                  checked={form.proctoringEnabled}
                  onChange={(e) => setForm((prev) => ({ ...prev, proctoringEnabled: e.target.checked }))}
                />
                <span className="text-sm">Enable AI Proctoring</span>
              </label>

              <label className="check-field">
                <input
                  type="checkbox"
                  checked={form.showResultImmediately}
                  onChange={(e) => setForm((prev) => ({ ...prev, showResultImmediately: e.target.checked }))}
                />
                <span className="text-sm">Show results immediately</span>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Question Builder */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <h3 className="font-semibold text-lg">Question Builder</h3>
                <p className="text-sm text-gray-500 mt-1">Add multiple choice questions to your assessment directly.</p>
              </div>
            </div>

            {form.questions.length === 0 ? (
              <div className="text-center py-10 border-2 border-dashed rounded-xl border-gray-200 bg-gray-50/50">
                <p className="text-gray-500 mb-4">No questions added yet.</p>
                <button type="button" onClick={handleAddQuestion} className="btn btn-primary inline-flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Add First Question
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {form.questions.map((q, qIndex) => (
                  <div key={qIndex} className="p-5 border rounded-xl bg-white shadow-sm space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="badge bg-blue-100 text-blue-700 font-medium">Q{qIndex + 1}</span>
                          <select
                            className="input form-input-sm w-32 bg-gray-50 border-transparent"
                            value={q.difficulty}
                            onChange={(e) => handleQuestionChange(qIndex, 'difficulty', e.target.value)}
                          >
                            <option value="EASY">Easy</option>
                            <option value="MEDIUM">Medium</option>
                            <option value="HARD">Hard</option>
                          </select>
                        </div>
                        <textarea
                          className="input min-h-[80px]"
                          placeholder="Enter your question text here..."
                          value={q.title}
                          onChange={(e) => handleQuestionChange(qIndex, 'title', e.target.value)}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveQuestion(qIndex)}
                        className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-colors"
                        title="Remove Question"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-700">Options (Select the correct one)</p>
                      <div className="grid md:grid-cols-2 gap-3">
                        {q.options.map((opt, optIndex) => {
                          const isCorrect = q.correctAnswer === opt && opt.trim() !== "";
                          return (
                            <div
                              key={optIndex}
                              className={`flex items-center gap-3 p-2 rounded-lg border focus-within:ring-2 focus-within:ring-blue-500/20 transition-all ${isCorrect ? 'border-green-500 bg-green-50/30' : 'border-gray-200 bg-gray-50/50 hover:border-gray-300'
                                }`}
                            >
                              <button
                                type="button"
                                onClick={() => opt.trim() && setCorrectOption(qIndex, opt)}
                                disabled={!opt.trim()}
                                className={`flex-shrink-0 transition-colors ${!opt.trim() ? "opacity-30 cursor-not-allowed" : ""}`}
                              >
                                {isCorrect ? (
                                  <CheckCircle className="w-5 h-5 text-green-500" />
                                ) : (
                                  <Circle className="w-5 h-5 text-gray-300 hover:text-green-400" />
                                )}
                              </button>
                              <input
                                className="w-full bg-transparent border-none p-1 text-sm focus:outline-none focus:ring-0"
                                placeholder={`Option ${String.fromCharCode(65 + optIndex)}`}
                                value={opt}
                                onChange={(e) => {
                                  handleOptionChange(qIndex, optIndex, e.target.value);
                                  // If they edit the correct option, unset it to avoid sync issues.
                                  if (isCorrect) setCorrectOption(qIndex, "");
                                }}
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ))}

                <div className="flex items-center justify-between pt-4">
                  <button type="button" onClick={handleAddQuestion} className="btn btn-outline inline-flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Add Another Question
                  </button>
                  <button type="submit" className="btn btn-primary px-8" disabled={saving}>
                    {saving ? "Saving Test..." : form.questions.length > 0 ? `Publish Test with ${form.questions.length} Qs` : "Create Empty Test"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </form>

      <div className="table-card">
        <div className="table-toolbar">
          <h3 className="font-semibold">Existing Tests Archive</h3>
        </div>

        {loading ? (
          <p className="empty-state">Loading tests...</p>
        ) : error ? (
          <p className="empty-state text-red-500">{error}</p>
        ) : tests.length === 0 ? (
          <p className="empty-state">No tests in the system yet.</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-head">Name</th>
                <th className="table-head">Duration</th>
                <th className="table-head">Marking Scheme</th>
                <th className="table-head">Questions</th>
                <th className="table-head">Created</th>
              </tr>
            </thead>
            <tbody>
              {tests.map((test) => (
                <tr key={test.id} className="table-row">
                  <td className="table-cell font-medium">
                    <Link href={`/company/tests/${test.id}`} className="text-blue-600 hover:underline">
                      {test.name}
                    </Link>
                  </td>
                  <td className="table-cell">{test.sections?.[0]?.timeLimit ?? 0} min</td>
                  <td className="table-cell">
                    <span className="badge bg-green-100 text-green-700">+{test.rules?.marksPerQuestion ?? 1}</span>
                    {test.rules?.negativeMarking && <span className="badge bg-red-100 text-red-700 ml-1">-{test.rules?.negativeMarks ?? 0}</span>}
                  </td>
                  <td className="table-cell">-</td>
                  <td className="table-cell text-gray-500">{new Date(test.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
