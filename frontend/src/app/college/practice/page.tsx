"use client";

import { useEffect, useState } from "react";
import api from "@/interceptors/axios";

type Section = { id: string; sectionName: string };
type PracticeSet = { id: string; name: string; sectionTimer: number };

export default function CollegePracticePage() {
  const [sections, setSections] = useState<Section[]>([]);
  const [practiceSets, setPracticeSets] = useState<PracticeSet[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    name: "",
    sectionId: "",
    sectionTimer: 30,
    visibility: "PRIVATE",
  });

  const fetch = async () => {
    try {
      const [sectionsRes, setsRes] = await Promise.all([
        api.get("/sections"),
        api.get("/practice-sets"),
      ]);
      setSections(sectionsRes.data || []);
      setPracticeSets(setsRes.data || []);
    } catch {
      console.error("Failed to fetch");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.sectionId) return;
    try {
      setCreating(true);
      await api.post("/practice-sets", {
        name: form.name.trim(),
        sectionId: form.sectionId,
        sectionTimer: form.sectionTimer,
        visibility: form.visibility,
      });
      setShowCreate(false);
      setForm({ name: "", sectionId: "", sectionTimer: 30, visibility: "PRIVATE" });
      fetch();
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to create");
    } finally {
      setCreating(false);
    }
  };

  if (loading) return <div className="p-6">Loading…</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Practice Sets</h1>
        <button
          onClick={() => setShowCreate(true)}
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700"
        >
          + Create Practice Set
        </button>
      </div>

      {showCreate && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-xl font-semibold mb-4">Create Practice Set</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="e.g. Quantitative Aptitude"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Section *</label>
                <select
                  value={form.sectionId}
                  onChange={(e) => setForm((f) => ({ ...f, sectionId: e.target.value }))}
                  className="w-full border rounded-lg px-3 py-2"
                  required
                >
                  <option value="">Select Section</option>
                  {sections.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.sectionName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time (mins)</label>
                <input
                  type="number"
                  value={form.sectionTimer}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, sectionTimer: Number(e.target.value) }))
                  }
                  className="w-full border rounded-lg px-3 py-2"
                  min={1}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Visibility</label>
                <select
                  value={form.visibility}
                  onChange={(e) => setForm((f) => ({ ...f, visibility: e.target.value }))}
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <option value="PUBLIC">Public (visible to students)</option>
                  <option value="PRIVATE">Private</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
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
                  {creating ? "Creating…" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr className="text-left">
              <th className="p-4">Name</th>
              <th className="p-4">Section Timer (mins)</th>
            </tr>
          </thead>
          <tbody>
            {practiceSets.length === 0 ? (
              <tr>
                <td colSpan={2} className="p-8 text-center text-gray-500">
                  No practice sets yet. Create one from a section.
                </td>
              </tr>
            ) : (
              practiceSets.map((ps) => (
                <tr key={ps.id} className="border-t">
                  <td className="p-4 font-medium">{ps.name}</td>
                  <td className="p-4">{ps.sectionTimer}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
