"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import api from "@/interceptors/axios";

type SubmissionItem = {
  id: string;
  testId: string;
  testName: string;
  score: number;
  submittedAt: string;
};

type AnalyticsData = {
  testsAttempted: number;
  averageScore: number;
  submissions: SubmissionItem[];
};

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/students/me/analytics")
      .then((res) => setData(res.data))
      .catch((err) =>
        setError(err?.response?.data?.message || "Failed to load analytics")
      )
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px] text-gray-500">
        Loading…
      </div>
    );
  }

  const submissions = data?.submissions ?? [];
  const chartData = submissions.map((s) => ({
    name: s.testName.slice(0, 12) + (s.testName.length > 12 ? "…" : ""),
    fullName: s.testName,
    score: s.score,
    date: new Date(s.submittedAt).toLocaleDateString(),
  }));

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        Performance Analytics
      </h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Summary stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Tests Attempted</p>
          <p className="text-2xl font-bold text-gray-900">
            {data?.testsAttempted ?? 0}
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Average Score</p>
          <p className="text-2xl font-bold text-gray-900">
            {data?.averageScore != null ? `${data.averageScore}%` : "—"}
          </p>
        </div>
      </div>

      {submissions.length === 0 ? (
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center text-gray-500">
          No test attempts yet. Take a test to see your analytics here.
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Score by Test
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <Bar dataKey="score" fill="#4f46e5" radius={[6, 6, 0, 0]} />
                <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  formatter={(value: number) => [`${value}%`, "Score"]}
                  labelFormatter={(_, payload) =>
                    payload?.[0]?.payload?.fullName ?? ""
                  }
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Score Progress (chronological)
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#7c3aed"
                  strokeWidth={2}
                />
                <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip
                  formatter={(value: number) => [`${value}%`, "Score"]}
                  labelFormatter={(_, payload) =>
                    payload?.[0]?.payload?.fullName ?? ""
                  }
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Recent Submissions
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-2">Test</th>
                    <th className="text-left py-3 px-2">Score</th>
                    <th className="text-left py-3 px-2">Submitted</th>
                  </tr>
                </thead>
                <tbody>
                  {[...submissions].reverse().map((s) => (
                    <tr key={s.id} className="border-b border-gray-100">
                      <td className="py-3 px-2">{s.testName}</td>
                      <td className="py-3 px-2">{s.score}%</td>
                      <td className="py-3 px-2 text-gray-500">
                        {new Date(s.submittedAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
