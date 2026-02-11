"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import api from "@/interceptors/axios";

type College = { id: string; collegeName: string };
type Department = { id: string; name: string };

export default function AddStudentForm() {
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
          setForm((f) => ({ ...f, collegeId: list[0].id }));
        }
      })
      .catch(() => setError("Failed to load colleges"))
      .finally(() => setLoadingData(false));
  }, []);

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
    const { name, value } = e.target;
    setForm((f) => ({
      ...f,
      [name]: name === "year" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await api.post("/students", form);
      router.push("/college/students");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to add student");
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) return <div>Loading…</div>;

  return (
    <div className="max-w-xl">
      <Link href="/college/students" className="text-sm text-gray-500">
        ← Back
      </Link>

      <h1 className="text-2xl font-semibold mt-4 mb-6">Add Student</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="email" placeholder="Email" onChange={handleChange} required />
        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />
        <input name="rollNo" placeholder="Roll No" onChange={handleChange} required />
        <input
          type="number"
          name="year"
          min={1}
          max={4}
          value={form.year}
          onChange={handleChange}
          required
        />

        <select name="collegeId" value={form.collegeId} onChange={handleChange}>
          {colleges.map((c:College ) => (
            <option key={c.id} value={c.id}>
              {c.collegeName}
            </option>
          ))}
        </select>

        <select
          name="departmentId"
          value={form.departmentId}
          onChange={handleChange}
          required
        >
          <option value="">Select department</option>
          {departments.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>

        <button type="submit" disabled={loading}>
          {loading ? "Saving…" : "Add Student"}
        </button>
      </form>
    </div>
  );
}
