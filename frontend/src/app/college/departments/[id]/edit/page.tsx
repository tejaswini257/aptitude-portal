"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import api from "@/lib/api";

export default function EditDepartmentPage() {
  const router = useRouter();
  const params = useParams();
  const departmentId = params.id as string;

  const [form, setForm] = useState({
    name: "",
    hodName: "",
    email: "",
    phone: "",
    totalStudents: "",
    totalFaculty: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      router.replace("/login");
      return;
    }

    fetchDepartment();
  }, []);

  const fetchDepartment = async () => {
    try {
      const data = await api(`/departments/${departmentId}`);

      setForm({
        name: data.name || "",
        hodName: data.hodName || "",
        email: data.email || "",
        phone: data.phone || "",
        totalStudents: data.totalStudents || "",
        totalFaculty: data.totalFaculty || "",
      });
    } catch (err: any) {
      setError(err.message || "Failed to load department");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    if (!form.name.trim()) {
      setError("Department name is required");
      return;
    }

    try {
      setSaving(true);
      setError("");

      await api(`/departments/${departmentId}`, {
        method: "PUT",
        body: JSON.stringify({
          name: form.name.trim(), // 🔥 backend-supported field
        }),
      });

      router.push("/college/departments");
    } catch (err: any) {
      setError(err.message || "Failed to update department");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-gray-500">Loading department...</div>;
  }

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-md border border-gray-200 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">
            Edit Department
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Update department details
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-5 rounded-md bg-red-50 px-4 py-2 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Form */}
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

        {/* Actions */}
        <div className="flex gap-4 mt-8">
          <button
            onClick={() => router.back()}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            onClick={handleUpdate}
            disabled={saving}
            className="w-full rounded-lg bg-green-600 px-4 py-2 text-white font-medium hover:bg-green-700 disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
