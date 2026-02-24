"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/interceptors/axios";
import { toast } from "react-hot-toast";

type TestItem = {
  id: string;
  name: string;
  createdAt: string;
  showResultImmediately: boolean;
  attemptCount?: number;
  isPublished: boolean;
  isActive: boolean;
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

type SectionItem = {
  id: string;
  sectionName: string;
};

export default function CollegeTestsPage() {
  const router = useRouter();

  const [tests, setTests] = useState<TestItem[]>([]);
  const [sections, setSections] = useState<SectionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newSectionName, setNewSectionName] = useState("");

  const [form, setForm] = useState({
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
    sections: [
      {
        sectionId: "",
        timeLimit: 30,
      },
    ],
  });

  const togglePublish = async (id: string) => {
    try {
      await api.patch(`/tests/${id}/toggle-publish`, {});
      fetchTests();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to toggle publish");
    }
  };

  const toggleActive = async (id: string) => {
    try {
      await api.patch(`/tests/${id}/toggle-active`, {});
      fetchTests();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to toggle active");
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
      toast.error("Failed to create section");
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
      });

      setShowCreate(false);
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
      toast.error(err?.response?.data?.message || "Failed to create test");
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
          <h2 className="page-title">Manage Tests</h2>
          <p className="page-subtitle">Create, configure, and publish assessments.</p>
        </div>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="btn btn-primary"
        >
          {showCreate ? "Cancel" : "Create New Test"}
        </button>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      {showCreate && (

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
            </div>
          </div>

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
              type="submit"
              disabled={creating}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg disabled:opacity-60"
            >
              {creating ? "Creating…" : "Save Test Configuration"}
            </button>
          </div>

        </form>
            </td>

            {/* View Details */ }
  <td className="table-cell">
    <Link
      href={`/college/tests/${t.id}`}
      className="table-link"
      onClick={(e) => e.stopPropagation()}
    >
      View Details
    </Link>
  </td>
          </tr >
        ))
      )
}
    </tbody >
  </table >
</div >
    </div >
  );
}