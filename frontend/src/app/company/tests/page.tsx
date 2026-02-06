"use client";

import { useEffect, useState } from "react";
import api from "@/interceptors/axios";

type Test = {
  id: string;
  name: string;
  type: string;
  status: string;
  duration: number;
  createdAt: string;
  createdBy?: { email: string };
};

export default function CompanyTestsPage() {
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

  if (loading) return <p className="p-6">Loading tests...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="page-container">
      <h1 className="page-title">Tests</h1>
      {tests.length === 0 ? (
        <div className="card">
          <p className="muted-text">No tests yet. Create tests from the main Tests module and link them to your company.</p>
        </div>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Status</th>
              <th>Duration (min)</th>
              <th>Created by</th>
            </tr>
          </thead>
          <tbody>
            {tests.map((t) => (
              <tr key={t.id}>
                <td>{t.name}</td>
                <td>{t.type}</td>
                <td>{t.status}</td>
                <td>{t.duration}</td>
                <td>{t.createdBy?.email ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
