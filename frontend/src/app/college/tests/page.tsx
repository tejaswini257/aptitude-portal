"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/interceptors/axios";

type TestItem = {
  id: string;
  name: string;
  createdAt: string;
  showResultImmediately: boolean;
  attemptCount?: number;
  rules?: {
    marksPerQuestion?: number;
    negativeMarking?: boolean;
    negativeMarks?: number | null;
  };
  sections?: Array<{ timeLimit?: number }>;
};

type ApiErrorShape = {
  response?: {
    data?: {
      message?: string;
    };
  };
};

export default function CollegeTestsPage() {
  const router = useRouter();
  const [tests, setTests] = useState<TestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: "",
    durationMinutes: 30,
    marksPerQuestion: 1,
    negativeMarking: false,
    negativeMarks: 0,
    showResultImmediately: true,
    proctoringEnabled: false,
  });

  const fetchTests = async () => {
    try {
      const res = await api.get("/tests?withAttemptCount=true");
      setTests(Array.isArray(res.data) ? (res.data as TestItem[]) : []);
    } catch (err: unknown) {
      const e = err as ApiErrorShape;
      setError(e?.response?.data?.message || "Failed to load tests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchTests();
  }, []);

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!createForm.name.trim()) return;
    try {
      setCreating(true);
      await api.post("/tests", {
        name: createForm.name.trim(),
        durationMinutes: createForm.durationMinutes,
        marksPerQuestion: createForm.marksPerQuestion,
        negativeMarking: createForm.negativeMarking,
        negativeMarks: createForm.negativeMarking ? createForm.negativeMarks : null,
        showResultImmediately: createForm.showResultImmediately,
        proctoringEnabled: createForm.proctoringEnabled,
      });
      setShowCreate(false);
      setCreateForm({
        name: "",
        durationMinutes: 30,
        marksPerQuestion: 1,
        negativeMarking: false,
        negativeMarks: 0,
        showResultImmediately: true,
        proctoringEnabled: false,
      });
      await fetchTests();
    } catch (err: unknown) {
      const e = err as ApiErrorShape;
      window.alert(e?.response?.data?.message || "Failed to create test");
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return <div className="text-secondary">Loading tests...</div>;
  }

  return (
    <div className="page space-y-6">
      <div className="page-header">
        <div>
          <h2 className="page-title">College Tests</h2>
          <p className="page-subtitle">Create structured tests with duration and marking policy.</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="btn btn-primary">
          + Create Test
        </button>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      {showCreate && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="card w-full max-w-xl">
            <h3 className="font-semibold text-xl mb-4">Create Test</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="field-label">Test Name *</label>
                <input
                  className="input"
                  value={createForm.name}
                  onChange={(e) => setCreateForm((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Mid Sem Assessment"
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-3">
                <div>
                  <label className="field-label">Duration (minutes)</label>
                  <input
                    className="input"
                    type="number"
                    min={5}
                    value={createForm.durationMinutes}
                    onChange={(e) =>
                      setCreateForm((prev) => ({ ...prev, durationMinutes: Number(e.target.value) }))
                    }
                  />
                </div>
                <div>
                  <label className="field-label">Marks/Question</label>
                  <input
                    className="input"
                    type="number"
                    min={1}
                    value={createForm.marksPerQuestion}
                    onChange={(e) =>
                      setCreateForm((prev) => ({ ...prev, marksPerQuestion: Number(e.target.value) }))
                    }
                  />
                </div>
              </div>

              <label className="check-field">
                <input
                  type="checkbox"
                  checked={createForm.negativeMarking}
                  onChange={(e) =>
                    setCreateForm((prev) => ({ ...prev, negativeMarking: e.target.checked }))
                  }
                />
                <span>Enable negative marking</span>
              </label>

              <div>
                <label className="field-label">Negative Marks</label>
                <input
                  className="input"
                  type="number"
                  min={0}
                  value={createForm.negativeMarks}
                  disabled={!createForm.negativeMarking}
                  onChange={(e) =>
                    setCreateForm((prev) => ({ ...prev, negativeMarks: Number(e.target.value) }))
                  }
                />
              </div>

              <label className="check-field">
                <input
                  type="checkbox"
                  checked={createForm.showResultImmediately}
                  onChange={(e) =>
                    setCreateForm((prev) => ({
                      ...prev,
                      showResultImmediately: e.target.checked,
                    }))
                  }
                />
                <span>Show result immediately</span>
              </label>

              <label className="check-field">
                <input
                  type="checkbox"
                  checked={createForm.proctoringEnabled}
                  onChange={(e) =>
                    setCreateForm((prev) => ({
                      ...prev,
                      proctoringEnabled: e.target.checked,
                    }))
                  }
                />
                <span>Enable proctoring</span>
              </label>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowCreate(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={creating} className="btn btn-primary">
                  {creating ? "Creating..." : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="table-card">
        <div className="table-toolbar">
          <h3 className="font-semibold">Tests</h3>
        </div>
        <table className="w-full">
          <thead>
            <tr>
              <th className="table-head">Test Name</th>
              <th className="table-head">Duration</th>
              <th className="table-head">Marking</th>
              <th className="table-head">Students Attempted</th>
              <th className="table-head">Action</th>
            </tr>
          </thead>
          <tbody>
            {tests.length === 0 ? (
              <tr>
                <td colSpan={5} className="table-cell text-center text-secondary">
                  No tests yet. Create one to get started.
                </td>
              </tr>
            ) : (
              tests.map((test) => (
                <tr
                  key={test.id}
                  className="table-row cursor-pointer"
                  onClick={() => router.push(`/college/tests/${test.id}`)}
                >
                  <td className="table-cell font-semibold">{test.name}</td>
                  <td className="table-cell">{test.sections?.[0]?.timeLimit ?? 0} min</td>
                  <td className="table-cell">
                    +{test.rules?.marksPerQuestion ?? 1} /{" "}
                    {test.rules?.negativeMarking ? `-${test.rules?.negativeMarks ?? 0}` : "0"}
                  </td>
                  <td className="table-cell">{test.attemptCount ?? 0}</td>
                  <td className="table-cell">
                    <Link
                      href={`/college/tests/${test.id}`}
                      className="table-link"
                      onClick={(e) => e.stopPropagation()}
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
