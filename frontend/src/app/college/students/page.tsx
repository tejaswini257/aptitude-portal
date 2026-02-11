"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/interceptors/axios";

type Student = {
  id: string;
  rollNo: string;
  year: number;
  user?: { email: string };
  department?: { name: string };
};

export default function CollegeStudentsPage() {
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      router.replace("/login");
      return;
    }
    (async () => {
      try {
        const collegesRes = await api.get("/colleges");
        const collegeId = collegesRes?.data?.[0]?.id;
        if (!collegeId) {
          setStudents([]);
          setLoading(false);
          return;
        }
        const res = await api.get(`/students?collegeId=${collegeId}`);
        setStudents(res.data || []);
      } catch (err: any) {
        setError(err.response?.data?.message || err.message || "Failed to load students");
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px] text-gray-500">
        Loading students…
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Students</h1>
        <Link
          href="/college/students/add"
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700"
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
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">
                  No students yet.
                </td>
              </tr>
            ) : (
              students.map((s) => (
                <tr key={s.id} className="border-t hover:bg-gray-50">
                  <td className="p-4">{s.user?.email ?? "—"}</td>
                  <td className="p-4">{s.rollNo}</td>
                  <td className="p-4">{s.year}</td>
                  <td className="p-4">{s.department?.name ?? "—"}</td>
                  <td className="p-4">
                    <Link
                      href={`/college/students/edit/${s.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
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
