"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import api from "@/interceptors/axios";

type College = { id: string; collegeName: string };
type Department = { id: string; name: string };

export default function AddStudentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const prefilledDeptId = searchParams.get("departmentId") || "";

  const [colleges, setColleges] = useState<College[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [form, setForm] = useState({
    email: "",
    password: "",
    rollNo: "",
    year: 1,
    collegeId: "",
    departmentId: prefilledDeptId,
  });
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
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
        setColleges(list);
        if (list.length && !form.collegeId) {
          const firstId = list[0].id;
          setForm((f) => ({ ...f, collegeId: firstId }));
        }
      })
      .catch(() => setError("Failed to load colleges"))
      .finally(() => setLoadingData(false));
  }, [router]);

  useEffect(() => {
    if (prefilledDeptId) setForm((f) => ({ ...f, departmentId: prefilledDeptId }));
  }, [prefilledDeptId]);

  useEffect(() => {
    if (!form.collegeId) {
      setDepartments([]);
      return;
    }
    api
      .get(`/departments?collegeId=${form.collegeId}`)
      .then((res) => setDepartments(res.data || []))
      .catch(() => setDepartments([]));
  }, [form.collegeId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const name = e.target.name;
    const value = e.target.value;
    setForm((f) => ({
      ...f,
      [name]: name === "year" ? parseInt(value, 10) || 1 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password || !form.rollNo || !form.collegeId || !form.departmentId) {
      setError("Email, password, roll no, college and department are required.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (form.year < 1 || form.year > 4) {
      setError("Year must be between 1 and 4.");
      return;
    }
    try {
      setLoading(true);
      setError("");
      await api.post("/students", {
        email: form.email,
        password: form.password,
        rollNo: form.rollNo,
        year: form.year,
        collegeId: form.collegeId,
        departmentId: form.departmentId,
      });
      router.push("/college/students");
    } catch (err: any) {
      setError(
        err.response?.data?.message || err.message || "Failed to add student"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="flex items-center justify-center min-h-[200px] text-gray-500">
        Loading…
      </div>
    );
  }

  return (
    <div className="max-w-xl">
      <Link
        href={prefilledDeptId ? `/college/departments/${prefilledDeptId}/students` : "/college/students"}
        className="text-sm text-gray-500 hover:text-gray-900 mb-4 inline-block"
      >
        ← Back
      </Link>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Add Student</h1>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password * (min 6)</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500"
            required
            minLength={6}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Roll No *</label>
          <input
            name="rollNo"
            value={form.rollNo}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Year (1–4) *</label>
          <input
            type="number"
            name="year"
            min={1}
            max={4}
            value={form.year}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">College *</label>
          <select
            name="collegeId"
            value={form.collegeId}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500"
            required
          >
            <option value="">Select college</option>
            {colleges.map((c) => (
              <option key={c.id} value={c.id}>
                {c.collegeName}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Department *</label>
          <select
            name="departmentId"
            value={form.departmentId}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500"
            required
          >
            <option value="">Select department</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 disabled:opacity-60"
          >
            {loading ? "Saving…" : "Add Student"}
          </button>
        </div>
      </form>
    </div>
  );
}
