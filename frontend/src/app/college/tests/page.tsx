"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/interceptors/axios";

type TestItem = {
  id: string;
  name: string;
  createdAt: string;
  showResultImmediately: boolean;
  attemptCount?: number;
};

export default function CollegeTestsPage() {
  const router = useRouter();
  const [tests, setTests] = useState<TestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: "",
    showResultImmediately: true,
  });
  const [creating, setCreating] = useState(false);

  const fetchTests = async () => {
    try {
      const res = await api.get("/tests?withAttemptCount=true");
      setTests(res.data || []);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to load tests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTests();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createForm.name.trim()) return;
    try {
      setCreating(true);
      await api.post("/tests", {
        name: createForm.name.trim(),
        showResultImmediately: createForm.showResultImmediately,
      });
      setShowCreate(false);
      setCreateForm({ name: "", showResultImmediately: true });
      fetchTests();
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to create test");
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px] text-gray-500">
        Loading tests…
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Tests</h1>
        <button
          onClick={() => setShowCreate(true)}
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700"
        >
          + Create Test
        </button>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {showCreate && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-xl font-semibold mb-4">Create Test</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Test Name *
                </label>
                <input
                  type="text"
                  value={createForm.name}
                  onChange={(e) =>
                    setCreateForm((f) => ({ ...f, name: e.target.value }))
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="e.g. Mid Sem Assessment"
                  required
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="showResult"
                  checked={createForm.showResultImmediately}
                  onChange={(e) =>
                    setCreateForm((f) => ({
                      ...f,
                      showResultImmediately: e.target.checked,
                    }))
                  }
                />
                <label htmlFor="showResult" className="text-sm text-gray-700">
                  Show result immediately after submit
                </label>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreate(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-60"
                >
                  {creating ? "Creating…" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr className="text-left">
              <th className="p-4">Test Name</th>
              <th className="p-4">Created</th>
              <th className="p-4">Students Attempted</th>
              <th className="p-4">Show Result</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {tests.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">
                  No tests yet. Create one to get started.
                </td>
              </tr>
            ) : (
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
                  <td className="p-4">{t.attemptCount ?? 0}</td>
                  <td className="p-4">
                    {t.showResultImmediately ? "Yes" : "No"}
                  </td>
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
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
