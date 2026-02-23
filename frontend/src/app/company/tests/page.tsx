"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import api from "@/interceptors/axios";

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

export default function CompanyTestsPage() {
  const [tests, setTests] = useState<CompanyTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const [form, setForm] = useState({
    name: "",
    durationMinutes: 30,
    marksPerQuestion: 1,
    negativeMarking: false,
    negativeMarks: 0,
    showResultImmediately: false,
    proctoringEnabled: true,
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

  const handleCreateTest = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError("");

    if (!form.name.trim()) {
      setFormError("Test name is required.");
      return;
    }
    if (form.durationMinutes < 5) {
      setFormError("Duration must be at least 5 minutes.");
      return;
    }
    if (form.marksPerQuestion < 1) {
      setFormError("Marks per question must be at least 1.");
      return;
    }
    if (form.negativeMarking && form.negativeMarks < 0) {
      setFormError("Negative marks cannot be negative.");
      return;
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
      });

      setForm({
        name: "",
        durationMinutes: 30,
        marksPerQuestion: 1,
        negativeMarking: false,
        negativeMarks: 0,
        showResultImmediately: false,
        proctoringEnabled: true,
      });
      await fetchTests();
    } catch (err: unknown) {
      const e = err as ApiErrorShape;
      setFormError(e?.response?.data?.message || "Unable to create test.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page space-y-6">
      <div className="page-header">
        <div>
          <h2 className="page-title">Assessment Tests</h2>
          <p className="page-subtitle">
            Create structured tests with duration and marking rules for recruitment rounds.
          </p>
        </div>
      </div>

      <form onSubmit={handleCreateTest} className="card grid md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <h3 className="font-semibold text-lg">Create New Test</h3>
        </div>

        <div className="md:col-span-2">
          <label className="field-label">Test Name *</label>
          <input
            className="input"
            value={form.name}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
            placeholder="Example: Graduate Aptitude Round 1"
          />
        </div>

        <div>
          <label className="field-label">Duration (minutes) *</label>
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

        <label className="check-field">
          <input
            type="checkbox"
            checked={form.negativeMarking}
            onChange={(e) => setForm((prev) => ({ ...prev, negativeMarking: e.target.checked }))}
          />
          <span>Enable negative marking</span>
        </label>

        <div>
          <label className="field-label">Negative Marks</label>
          <input
            className="input"
            type="number"
            min={0}
            max={10}
            value={form.negativeMarks}
            disabled={!form.negativeMarking}
            onChange={(e) => setForm((prev) => ({ ...prev, negativeMarks: Number(e.target.value) }))}
          />
        </div>

        <label className="check-field">
          <input
            type="checkbox"
            checked={form.proctoringEnabled}
            onChange={(e) => setForm((prev) => ({ ...prev, proctoringEnabled: e.target.checked }))}
          />
          <span>Enable proctoring</span>
        </label>

        <label className="check-field">
          <input
            type="checkbox"
            checked={form.showResultImmediately}
            onChange={(e) => setForm((prev) => ({ ...prev, showResultImmediately: e.target.checked }))}
          />
          <span>Show result immediately</span>
        </label>

        {formError && <p className="text-sm text-red-500 md:col-span-2">{formError}</p>}

        <div className="md:col-span-2">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? "Creating..." : "Create Test"}
          </button>
        </div>
      </form>

      <div className="table-card">
        <div className="table-toolbar">
          <h3 className="font-semibold">Existing Tests</h3>
        </div>

        {loading ? (
          <p className="empty-state">Loading tests...</p>
        ) : error ? (
          <p className="empty-state text-red-500">{error}</p>
        ) : tests.length === 0 ? (
          <p className="empty-state">No tests created yet.</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-head">Name</th>
                <th className="table-head">Duration</th>
                <th className="table-head">Marking Scheme</th>
                <th className="table-head">Created</th>
              </tr>
            </thead>
            <tbody>
              {tests.map((test) => (
                <tr key={test.id} className="table-row">
                  <td className="table-cell">
                    <Link href={`/company/tests/${test.id}`} className="table-link">
                      {test.name}
                    </Link>
                  </td>
                  <td className="table-cell">{test.sections?.[0]?.timeLimit ?? 0} min</td>
                  <td className="table-cell">
                    +{test.rules?.marksPerQuestion ?? 1} /{" "}
                    {test.rules?.negativeMarking ? `-${test.rules?.negativeMarks ?? 0}` : "0"}
                  </td>
                  <td className="table-cell">{new Date(test.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
