"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/interceptors/axios";

export default function CreateDepartmentPage() {
  const router = useRouter();
  const [collegeId, setCollegeId] = useState("");
  const [form, setForm] = useState({ name: "" });
  const [loading, setLoading] = useState(false);
  const [loadingCollege, setLoadingCollege] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      router.replace("/login");
      return;
    }
    api
      .get("/colleges")
      .then((res) => {
        const list = res.data || [];
        if (list.length) setCollegeId(list[0].id);
      })
      .catch(() => setError("Failed to load college"))
      .finally(() => setLoadingCollege(false));
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreate = async () => {
    if (!form.name.trim()) {
      setError("Department name is required");
      return;
    }
    if (!collegeId) {
      setError("College not found");
      return;
    }
    try {
      setLoading(true);
      setError("");
      await api.post("/departments", { name: form.name.trim(), collegeId });
      router.push("/college/departments");
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to create department");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gray-50 px-4 py-10">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
        {/* Header */}
        <div className="mb-8 border-b pb-4">
          <h1 className="text-2xl font-semibold text-gray-900">
            Create Department
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Add department information and internal details
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 border border-red-200">
            {error}
          </div>
        )}

        {/* Form */}
        {loadingCollege ? (
          <p className="text-gray-500">Loading…</p>
        ) : (
          <div>
            <div>
              <label className="form-label">Department Name *</label>
              <input
                name="name"
                placeholder="e.g. Computer Science"
                className="input focus:ring-2 focus:ring-green-500 w-full max-w-md"
                value={form.name}
                onChange={handleChange}
              />
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mt-10">
          <button
            onClick={() => router.back()}
            disabled={loading}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition"
          >
            Cancel
          </button>

          <button
            onClick={handleCreate}
            disabled={loading}
            className="w-full rounded-lg bg-green-600 px-4 py-2.5 text-white font-medium hover:bg-green-700 shadow-sm transition disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create Department"}
          </button>
        </div>
      </div>
    </div>
  );
}
