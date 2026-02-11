"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/interceptors/axios";

type Student = {
  id: string;
  rollNo: string;
  year: number;
  user?: { email: string };
  department?: { name: string };
};

export default function DepartmentStudentsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [deptName, setDeptName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      router.replace("/login");
      return;
    }
    if (!id) return;
    (async () => {
      try {
        const [studentsRes, deptRes] = await Promise.all([
          api.get(`/students?departmentId=${id}`),
          api.get(`/departments/${id}`).catch(() => ({ data: null })),
        ]);
        setStudents(studentsRes.data || []);
        if (deptRes?.data?.name) setDeptName(deptRes.data.name);
      } catch (err: any) {
        setError(err.response?.data?.message || err.message || "Failed to load");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px] text-gray-500">
        Loading…
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500">
        {error}
        <Link href="/college/departments" className="block mt-2 text-blue-600">
          ← Back to Departments
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link
        href="/college/departments"
        className="text-sm text-gray-500 hover:text-gray-900 mb-4 inline-block"
      >
        ← Back to Departments
      </Link>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          {deptName ? `${deptName} – Students` : "Students"}
        </h1>
        <Link
          href={`/college/students/add?departmentId=${id}`}
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 inline-block w-fit"
        >
          + Add Student
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr className="text-left">
              <th className="p-4">Email</th>
              <th className="p-4">Roll No</th>
              <th className="p-4">Year</th>
              <th className="p-4">Department</th>
            </tr>
          </thead>
          <tbody>
            {students.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-gray-500">
                  No students in this department yet.
                </td>
              </tr>
            ) : (
              students.map((s) => (
                <tr key={s.id} className="border-t hover:bg-gray-50">
                  <td className="p-4">{s.user?.email ?? "—"}</td>
                  <td className="p-4">{s.rollNo}</td>
                  <td className="p-4">{s.year}</td>
                  <td className="p-4">{s.department?.name ?? "—"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
