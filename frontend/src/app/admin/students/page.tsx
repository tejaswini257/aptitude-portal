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

  if (loading) return <p>Loading students...</p>;
  if (error) return <p style={{ color: "#dc2626" }}>{error}</p>;

  return (
    <>
      <h2 style={{ fontSize: "26px", fontWeight: 600, marginBottom: "24px" }}>
        Students
      </h2>
      {students.length === 0 ? (
        <p style={{ color: "#64748b" }}>No students yet.</p>
      ) : (
        <div
          style={{
            background: "#fff",
            borderRadius: "12px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
            overflow: "hidden",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                <th style={{ padding: "12px 16px", textAlign: "left" }}>Email</th>
                <th style={{ padding: "12px 16px", textAlign: "left" }}>Roll No</th>
                <th style={{ padding: "12px 16px", textAlign: "left" }}>Year</th>
                <th style={{ padding: "12px 16px", textAlign: "left" }}>Department</th>
                <th style={{ padding: "12px 16px", textAlign: "left" }}>College</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.id} style={{ borderBottom: "1px solid #e2e8f0" }}>
                  <td style={{ padding: "12px 16px" }}>{s.user?.email ?? "—"}</td>
                  <td style={{ padding: "12px 16px" }}>{s.rollNo}</td>
                  <td style={{ padding: "12px 16px" }}>{s.year}</td>
                  <td style={{ padding: "12px 16px" }}>{s.department?.name ?? "—"}</td>
                  <td style={{ padding: "12px 16px" }}>{s.college?.collegeName ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
