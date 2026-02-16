"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/interceptors/axios";

export default function CreateDepartmentPage() {
  const router = useRouter();
  const [form, setForm] = useState({
  name: "",
  hodName: "",
  email: "",
  phone: "",
  totalStudents: "",
  totalFaculty: "",
});

const [collegeId, setCollegeId] = useState("");
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

    await api.post("/departments", {
      name: form.name.trim(),
      collegeId,
      hodName: form.hodName || null,
      email: form.email || null,
      phone: form.phone || null,
      totalStudents: form.totalStudents
        ? Number(form.totalStudents)
        : null,
      totalFaculty: form.totalFaculty
        ? Number(form.totalFaculty)
        : null,
    });

    router.push("/college/departments");
  } catch (err: any) {
    setError(
      err.response?.data?.message ||
        err.message ||
        "Failed to create department"
    );
  } finally {
    setLoading(false);
  }
};



  if (loadingCollege) {
    return (
      <div className="p-8 text-gray-500">Loading college details...</div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gray-50 px-4 py-10">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-md border border-gray-200 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">
            Create Department
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Add department information and internal details
          </p>
        </div>

        {error && (
          <div className="mb-5 rounded-md bg-red-50 px-4 py-2 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="form-label">Department Name *</label>
            <input
              name="name"
              className="input"
              value={form.name}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="form-label">HOD / Faculty In-Charge</label>
            <input
              name="hodName"
              className="input"
              value={form.hodName}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="form-label">Department Email</label>
            <input
              name="email"
              type="email"
              className="input"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="form-label">Contact Number</label>
            <input
              name="phone"
              className="input"
              value={form.phone}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="form-label">Total Students</label>
            <input
              name="totalStudents"
              type="number"
              className="input"
              value={form.totalStudents}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="form-label">Total Faculty</label>
            <input
              name="totalFaculty"
              type="number"
              className="input"
              value={form.totalFaculty}
              onChange={handleChange}
            />
          </div>
        </div>

                <div className="flex gap-4 mt-8">
          <button
            onClick={() => router.back()}
            disabled={loading}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            onClick={handleCreate}
            disabled={loading}
            className="w-full rounded-lg bg-green-600 px-4 py-2 text-white font-medium hover:bg-green-700 disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create Department"}
          </button>
        </div>
      </div>
    </div>
  );
}
