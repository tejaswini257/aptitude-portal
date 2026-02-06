"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

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

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreate = async () => {
    const {
      name,
      hodName,
      email,
      phone,
      totalStudents,
      totalFaculty,
    } = form;

    if (!name || !hodName) {
      setError("Department name and HOD name are required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await api("/departments", {
        method: "POST",
        body: JSON.stringify({
          name,
          hodName,
          email,
          phone,
          totalStudents: Number(totalStudents),
          totalFaculty: Number(totalFaculty),
        }),
      });

      router.push("/college/departments");
    } catch (err: any) {
      setError(err.message || "Failed to create department");
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Department Name */}
          <div>
            <label className="form-label">
              Department Name *
            </label>
            <input
              name="name"
              placeholder="Computer Science"
              className="input focus:ring-2 focus:ring-green-500"
              value={form.name}
              onChange={handleChange}
            />
          </div>

          {/* HOD */}
          <div>
            <label className="form-label">
              HOD / Faculty In-Charge *
            </label>
            <input
              name="hodName"
              placeholder="Dr. Rahul Sharma"
              className="input focus:ring-2 focus:ring-green-500"
              value={form.hodName}
              onChange={handleChange}
            />
          </div>

          {/* Email */}
          <div>
            <label className="form-label">
              Department Email
            </label>
            <input
              name="email"
              type="email"
              placeholder="cs@college.edu"
              className="input focus:ring-2 focus:ring-green-500"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          {/* Phone */}
          <div>
            <label className="form-label">
              Contact Number
            </label>
            <input
              name="phone"
              placeholder="+91 98765 43210"
              className="input focus:ring-2 focus:ring-green-500"
              value={form.phone}
              onChange={handleChange}
            />
          </div>

          {/* Total Students */}
          <div>
            <label className="form-label">
              Total Students
            </label>
            <input
              name="totalStudents"
              type="number"
              placeholder="180"
              className="input focus:ring-2 focus:ring-green-500"
              value={form.totalStudents}
              onChange={handleChange}
            />
          </div>

          {/* Total Faculty */}
          <div>
            <label className="form-label">
              Total Faculty
            </label>
            <input
              name="totalFaculty"
              type="number"
              placeholder="22"
              className="input focus:ring-2 focus:ring-green-500"
              value={form.totalFaculty}
              onChange={handleChange}
            />
          </div>
        </div>

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
