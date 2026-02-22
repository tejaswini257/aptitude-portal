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

  if (loading) return <p className="text-gray-500">Loading tests...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="space-y-6">
      {/* Title */}
      <h2 className="text-2xl font-semibold">Tests</h2>

      {tests.length === 0 ? (
        <p className="text-gray-500">No tests yet.</p>
      ) : (
        <div className="card p-0 overflow-hidden">
          <table className="w-full border-collapse">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Duration
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Created by
                </th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {tests.map((t) => (
                <tr key={t.id}>
                  <td className="px-4 py-3">{t.name}</td>
                  <td className="px-4 py-3">{t.type ?? "—"}</td>
                  <td className="px-4 py-3">{t.status ?? "—"}</td>
                  <td className="px-4 py-3">{t.duration ?? "—"}</td>
                  <td className="px-4 py-3">{t.createdBy?.email ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}