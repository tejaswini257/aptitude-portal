"use client";

import { useEffect, useState } from "react";
import api from "@/interceptors/axios";

type Student = {
  id: string;
  rollNo: string;
  year: number;
  user?: { email: string };
  department?: { name: string };
  college?: { collegeName: string };
};

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/students")
      .then((res) => setStudents(Array.isArray(res.data) ? res.data : []))
      .catch((err) =>
        setError(
          err?.response?.data?.message ||
            (err?.response?.status === 403
              ? "Access denied."
              : "Failed to load students")
        )
      )
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-gray-500">Loading students...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="space-y-6">
      {/* Title */}
      <h2 className="text-2xl font-semibold">Students</h2>

      {students.length === 0 ? (
        <p className="text-gray-500">No students yet.</p>
      ) : (
        <div className="card p-0 overflow-hidden">
          <table className="w-full border-collapse">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Roll No
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Year
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Department
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  College
                </th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {students.map((s) => (
                <tr key={s.id}>
                  <td className="px-4 py-3">{s.user?.email ?? "—"}</td>
                  <td className="px-4 py-3">{s.rollNo}</td>
                  <td className="px-4 py-3">{s.year}</td>
                  <td className="px-4 py-3">{s.department?.name ?? "—"}</td>
                  <td className="px-4 py-3">{s.college?.collegeName ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}