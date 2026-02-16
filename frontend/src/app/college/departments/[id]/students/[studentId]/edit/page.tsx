"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/interceptors/axios";

export default function EditStudentPage() {
  const router = useRouter();
  const params = useParams();

  const departmentId = params.id as string;        // from departments/[id]
  const studentId = params.studentId as string;

  const [form, setForm] = useState({
    email: "",
    rollNo: "",
    year: "",     // keep as string for controlled input
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ Fetch student
  useEffect(() => {
    if (!studentId) return;

    const fetchStudent = async () => {
      try {
        const res = await api.get(`/students/${studentId}`);

        setForm({
          email: res.data.user?.email || "",
          rollNo: res.data.rollNo || "",
          year: String(res.data.year ?? ""),  // convert to string
        });
      } catch (err: any) {
        setError("Failed to load student");
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [studentId]);

  // ✅ Handle change (proper version)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await api.put(`/students/${studentId}`, {
        rollNo: form.rollNo,
        year: Number(form.year),   // convert to number here
      });

      router.push(`/college/departments/${departmentId}/students`);
      router.refresh();

    } catch (err: any) {
      setError(
        err.response?.data?.message ||
        "Failed to update student"
      );
    }
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-semibold mb-6">
        Edit Student
      </h1>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Email (read-only) */}
        <input
          name="email"
          value={form.email}
          disabled
          className="w-full border rounded px-3 py-2 bg-gray-100"
        />

        {/* Roll No */}
        <input
          name="rollNo"
          value={form.rollNo}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />

        {/* Year */}
        <input
          type="number"
          name="year"
          min={1}
          max={4}
          value={form.year}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />

        <button
          type="submit"
          className="px-4 py-2 bg-emerald-600 text-white rounded"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}