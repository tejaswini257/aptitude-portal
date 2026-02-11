"use client";

import { useEffect, useState } from "react";
import api from "@/interceptors/axios";

type Test = {
  id: string;
  name: string;
  type?: string;
  status?: string;
  duration?: number;
  createdBy?: { email: string };
};

export default function AdminTestsPage() {
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/tests")
      .then((res) => setTests(Array.isArray(res.data) ? res.data : []))
      .catch((err) =>
        setError(
          err?.response?.data?.message ||
            (err?.response?.status === 403
              ? "Access denied."
              : "Failed to load tests")
        )
      )
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading tests...</p>;
  if (error) return <p style={{ color: "#dc2626" }}>{error}</p>;

  return (
    <>
      <h2 style={{ fontSize: "26px", fontWeight: 600, marginBottom: "24px" }}>
        Tests
      </h2>
      {tests.length === 0 ? (
        <p style={{ color: "#64748b" }}>No tests yet.</p>
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
                <th style={{ padding: "12px 16px", textAlign: "left" }}>Name</th>
                <th style={{ padding: "12px 16px", textAlign: "left" }}>Type</th>
                <th style={{ padding: "12px 16px", textAlign: "left" }}>Status</th>
                <th style={{ padding: "12px 16px", textAlign: "left" }}>Duration</th>
                <th style={{ padding: "12px 16px", textAlign: "left" }}>Created by</th>
              </tr>
            </thead>
            <tbody>
              {tests.map((t) => (
                <tr key={t.id} style={{ borderBottom: "1px solid #e2e8f0" }}>
                  <td style={{ padding: "12px 16px" }}>{t.name}</td>
                  <td style={{ padding: "12px 16px" }}>{t.type ?? "—"}</td>
                  <td style={{ padding: "12px 16px" }}>{t.status ?? "—"}</td>
                  <td style={{ padding: "12px 16px" }}>{t.duration ?? "—"}</td>
                  <td style={{ padding: "12px 16px" }}>{t.createdBy?.email ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
