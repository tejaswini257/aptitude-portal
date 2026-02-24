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
<<<<<<< HEAD
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
=======
  isPublished: boolean;
  isActive: boolean;
};

type SectionItem = {
  id: string;
  sectionName: string;
>>>>>>> d91389d827f612a3fc5abc416ed8d834194b8ae9
};

export default function CollegeTestsPage() {
  const router = useRouter();

  const [tests, setTests] = useState<TestItem[]>([]);
  const [sections, setSections] = useState<SectionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
<<<<<<< HEAD
  const [createForm, setCreateForm] = useState({
=======
  const [newSectionName, setNewSectionName] = useState("");

  const [form, setForm] = useState({
>>>>>>> d91389d827f612a3fc5abc416ed8d834194b8ae9
    name: "",
    durationMinutes: 30,
    marksPerQuestion: 1,
    negativeMarking: false,
    negativeMarks: 0,
    showResultImmediately: true,
    proctoringEnabled: false,
<<<<<<< HEAD
=======
    rules: {
      totalMarks: 100,
      negativeMarking: false,
      negativeMarks: 0,
    },
    durationMode: "GLOBAL",
    totalDuration: 60,
    resultPublishTime: "",
    sections: [
      {
        sectionId: "",
        timeLimit: 30,
      },
    ],
>>>>>>> d91389d827f612a3fc5abc416ed8d834194b8ae9
  });

  const togglePublish = async (id: string) => {
    try {
      await api.patch(`/tests/${id}/toggle-publish`, {});
      fetchTests();
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to toggle publish");
    }
  };

  const toggleActive = async (id: string) => {
    try {
      await api.patch(`/tests/${id}/toggle-active`, {});
      fetchTests();
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to toggle active");
    }
  };

  // ==============================
  // Fetch Tests
  // ==============================
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

  // ==============================
  // Fetch Sections
  // ==============================
  const fetchSections = async () => {
    try {
      const res = await api.get("/sections");
      setSections(res.data || []);
    } catch (err: any) {
      console.error("Failed to fetch sections", err?.response?.data?.message);
    }
  };

  useEffect(() => {
<<<<<<< HEAD
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
=======
    fetchTests();
    fetchSections();
  }, []);

  // ==============================
  // Add Section Row
  // ==============================
  const addSection = () => {
    setForm((prev) => ({
      ...prev,
      sections: [
        ...prev.sections,
        { sectionId: "", timeLimit: 30 },
      ],
    }));
  };

  const createSection = async () => {
  if (!newSectionName.trim()) return;

  try {
    const res = await api.post("/sections", {
      sectionName: newSectionName,
    });

    setSections((prev) => [...prev, res.data]);
    setNewSectionName("");
  } catch {
    alert("Failed to create section");
  }
};

  // ==============================
  // Create Test
  // ==============================
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim()) return;

    try {
      setCreating(true);

      const res = await api.post("/tests", {
        name: form.name,
        showResultImmediately: form.showResultImmediately,
        proctoringEnabled: form.proctoringEnabled,
        rules: form.rules,
        durationMode: form.durationMode,
        totalDuration: form.durationMode === "GLOBAL" ? form.totalDuration : null,
        resultPublishTime: !form.showResultImmediately ? form.resultPublishTime : null,
        sections: form.sections,
>>>>>>> d91389d827f612a3fc5abc416ed8d834194b8ae9
      });

      setShowCreate(false);
<<<<<<< HEAD
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
=======
      setForm({
        name: "",
        showResultImmediately: true,
        proctoringEnabled: false,
        rules: {
          totalMarks: 100,
          negativeMarking: false,
          negativeMarks: 0,
        },
        durationMode: "GLOBAL",
        totalDuration: 60,
        resultPublishTime: "",
        sections: [{ sectionId: "", timeLimit: 30 }],
      });

      fetchTests();
      if (res.data?.id) {
        router.push(`/college/tests/${res.data.id}/builder`);
      }
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to create test");
>>>>>>> d91389d827f612a3fc5abc416ed8d834194b8ae9
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return <div className="text-secondary">Loading tests...</div>;
  }

  return (
<<<<<<< HEAD
    <div className="page space-y-6">
      <div className="page-header">
        <div>
          <h2 className="page-title">College Tests</h2>
          <p className="page-subtitle">Create structured tests with duration and marking policy.</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="btn btn-primary">
=======
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Tests</h1>
        <button
          onClick={() => setShowCreate(true)}
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700"
        >
>>>>>>> d91389d827f612a3fc5abc416ed8d834194b8ae9
          + Create Test
        </button>
      </div>

<<<<<<< HEAD
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
=======
      {/* Modal */}
      {/* Modal */}
{showCreate && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-6">
    <div className="bg-white rounded-xl w-full max-w-3xl shadow-xl max-h-[90vh] overflow-y-auto">

      <div className="p-6 border-b">
        <h2 className="text-xl font-semibold">Create Test</h2>
      </div>

      <form onSubmit={handleCreate} className="p-6 space-y-8">

        {/* ================= Test Details ================= */}
        <div>
          <h3 className="font-semibold mb-4 text-gray-800">Test Details</h3>

          <input
            placeholder="Test Name"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
            className="w-full border rounded-lg px-3 py-2 mb-4"
            required
          />

          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.showResultImmediately}
                onChange={(e) =>
                  setForm({
                    ...form,
                    showResultImmediately: e.target.checked,
                  })
                }
              />
              Show result immediately
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.proctoringEnabled}
                onChange={(e) =>
                  setForm({
                    ...form,
                    proctoringEnabled: e.target.checked,
                  })
                }
              />
              Enable Proctoring
            </label>
          </div>

          {!form.showResultImmediately && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Result Publish Time
              </label>
              <input
                type="datetime-local"
                value={form.resultPublishTime}
                onChange={(e) =>
                  setForm({ ...form, resultPublishTime: e.target.value })
                }
                className="w-full border rounded-lg px-3 py-2"
                required={!form.showResultImmediately}
              />
            </div>
          )}

          {/* Duration Settings */}
          <div className="mt-4 border-t pt-4">
            <h4 className="font-medium text-gray-800 mb-3">Duration Settings</h4>
            <div className="flex gap-4 mb-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="durationMode"
                  value="GLOBAL"
                  checked={form.durationMode === "GLOBAL"}
                  onChange={(e) =>
                    setForm({ ...form, durationMode: e.target.value })
                  }
                />
                Global Duration
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="durationMode"
                  value="SECTION"
                  checked={form.durationMode === "SECTION"}
                  onChange={(e) =>
                    setForm({ ...form, durationMode: e.target.value })
                  }
                />
                Section-wise Duration
              </label>
            </div>
            
            {form.durationMode === "GLOBAL" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total Test Duration (minutes)
                </label>
                <input
                  type="number"
                  value={form.totalDuration}
                  onChange={(e) =>
                    setForm({ ...form, totalDuration: Number(e.target.value) })
                  }
                  className="w-full sm:w-1/2 border rounded-lg px-3 py-2"
                  min={1}
                />
              </div>
            )}
>>>>>>> d91389d827f612a3fc5abc416ed8d834194b8ae9
          </div>
        </div>

<<<<<<< HEAD
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
=======
        {/* ================= Rules ================= */}
        <div>
          <h3 className="font-semibold mb-4 text-gray-800">Rules</h3>

          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              placeholder="Total Marks"
              value={form.rules.totalMarks}
              onChange={(e) =>
                setForm({
                  ...form,
                  rules: {
                    ...form.rules,
                    totalMarks: Number(e.target.value),
                  },
                })
              }
              className="border rounded-lg px-3 py-2"
            />
          </div>

          <div className="mt-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.rules.negativeMarking}
                onChange={(e) =>
                  setForm({
                    ...form,
                    rules: {
                      ...form.rules,
                      negativeMarking: e.target.checked,
                    },
                  })
                }
              />
              Enable Negative Marking
            </label>

            {form.rules.negativeMarking && (
              <input
                type="number"
                placeholder="Negative Marks"
                value={form.rules.negativeMarks}
                onChange={(e) =>
                  setForm({
                    ...form,
                    rules: {
                      ...form.rules,
                      negativeMarks: Number(e.target.value),
                    },
                  })
                }
                className="border rounded-lg px-3 py-2 mt-3 w-1/2"
              />
            )}
          </div>
        </div>

        {/* ================= Sections ================= */}
        <div>
          <h3 className="font-semibold mb-4 text-gray-800">Sections</h3>

          {form.sections.map((sec, index) => (
            <div key={index} className="flex gap-3 items-center mb-3">

              <select
                value={sec.sectionId}
                onChange={(e) => {
                  const updated = [...form.sections];
                  updated[index].sectionId = e.target.value;
                  setForm({ ...form, sections: updated });
                }}
                className="border rounded-lg px-3 py-2 w-1/2"
              >
                <option value="">Select Section</option>
                {sections.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.sectionName}
                  </option>
                ))}
              </select>

              {form.durationMode === "SECTION" && (
                <input
                  type="number"
                  placeholder="Time (mins)"
                  value={sec.timeLimit}
                  onChange={(e) => {
                    const updated = [...form.sections];
                    updated[index].timeLimit = Number(e.target.value);
                    setForm({ ...form, sections: updated });
                  }}
                  className="border rounded-lg px-3 py-2 w-1/3"
                />
              )}

              <button
                type="button"
                onClick={() => {
                  const updated = form.sections.filter((_, i) => i !== index);
                  setForm({ ...form, sections: updated });
                }}
                className="text-red-600 text-sm"
              >
                Remove
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={addSection}
            className="text-blue-600 text-sm mt-2"
          >
            + Add Section
          </button>

          {/* Create Section Inline */}
          <div className="mt-6 border-t pt-4">
            <h4 className="font-medium mb-2">Create New Section</h4>

            <div className="flex gap-3">
              <input
                value={newSectionName}
                onChange={(e) => setNewSectionName(e.target.value)}
                placeholder="New Section Name"
                className="border rounded-lg px-3 py-2 flex-1"
              />
              <button
                type="button"
                onClick={createSection}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                Add
              </button>
            </div>
          </div>
        </div>

        {/* ================= Buttons ================= */}
        <div className="flex justify-end gap-3 border-t pt-4">
          <button
            type="button"
            onClick={() => setShowCreate(false)}
            className="px-4 py-2 border rounded-lg"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={creating}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg disabled:opacity-60"
          >
            {creating ? "Creating…" : "Create Test"}
          </button>
        </div>

      </form>
    </div>
  </div>
)}

      {/* Tests Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr className="text-left">
              <th className="p-4">Test Name</th>
              <th className="p-4">Created</th>
              <th className="p-4">Students Attempted</th>
              <th className="p-4">Show Result</th>
              <th className="p-4">Action</th>
>>>>>>> d91389d827f612a3fc5abc416ed8d834194b8ae9
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
<<<<<<< HEAD
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
=======
              tests.map((t) => (
  <tr
    key={t.id}
    className="border-t hover:bg-gray-50 cursor-pointer"
    onClick={() => router.push(`/college/tests/${t.id}`)}
  >
    <td className="p-4 font-medium">{t.name}</td>

    <td className="p-4">
      {new Date(t.createdAt).toLocaleDateString()}
    </td>

    <td className="p-4">
      {t.attemptCount ?? 0}
    </td>

    <td className="p-4">
      {t.showResultImmediately ? "Yes" : "No"}
    </td>

    {/* Publish Toggle */}
    <td className="p-4">
      <button
        onClick={(e) => {
          e.stopPropagation();
          togglePublish(t.id);
        }}
        className={`px-3 py-1 rounded text-sm font-medium ${
          t.isPublished
            ? "bg-green-600 text-white"
            : "bg-gray-300 text-gray-700"
        }`}
      >
        {t.isPublished ? "Published" : "Unpublished"}
      </button>
    </td>

    {/* Active Toggle */}
    <td className="p-4">
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleActive(t.id);
        }}
        className={`px-3 py-1 rounded text-sm font-medium ${
          t.isActive
            ? "bg-emerald-600 text-white"
            : "bg-gray-300 text-gray-700"
        }`}
      >
        {t.isActive ? "Active" : "Inactive"}
      </button>
    </td>

    {/* View Details */}
    <td className="p-4">
      <Link
        href={`/college/tests/${t.id}`}
        className="text-emerald-600 hover:underline"
        onClick={(e) => e.stopPropagation()}
      >
        View Details
      </Link>
    </td>
  </tr>
))
>>>>>>> d91389d827f612a3fc5abc416ed8d834194b8ae9
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}