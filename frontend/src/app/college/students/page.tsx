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
    <div className="page space-y-6">
      <div className="page-header">
        <div>
          <h2 className="page-title">Students</h2>
          <p className="page-subtitle">Manage your college students and their details.</p>
        </div>
        <Link
          href="/college/students/add"
          className="btn btn-primary"
        >
          Add Student
        </Link>
      </div>

      <div className="table-card">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="table-head">Email</th>
              <th className="table-head">Roll No</th>
              <th className="table-head">Year</th>
              <th className="table-head">Department</th>
              <th className="table-head text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.length === 0 ? (
              <tr>
                <td colSpan={5} className="empty-state">
                  No students yet.
                </td>
              </tr>
            ) : (
              students.map((s) => (
                <tr key={s.id} className="table-row">
                  <td className="table-cell font-medium">{s.user?.email ?? "—"}</td>
                  <td className="table-cell">{s.rollNo}</td>
                  <td className="table-cell">{s.year}</td>
                  <td className="table-cell">{s.department?.name ?? "—"}</td>
                  <td className="table-cell text-center">
                    <Link
                      href={`/college/students/edit/${s.id}`}
                      className="table-link"
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
