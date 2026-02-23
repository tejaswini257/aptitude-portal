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
import { Target, Award, PlayCircle, TrendingUp } from "lucide-react";
import api from "@/interceptors/axios";
import Link from "next/link";

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
    return <div className="page p-8 text-center text-secondary">Loading analytics...</div>;
  }

  const submissions = data?.submissions ?? [];
  const chartData = submissions.map((s) => ({
    name: s.testName.slice(0, 12) + (s.testName.length > 12 ? "…" : ""),
    fullName: s.testName,
    score: s.score,
    date: new Date(s.submittedAt).toLocaleDateString(),
  }));

  const latestScore = submissions.length > 0 ? submissions[submissions.length - 1].score : 0;
  const isPassing = (data?.averageScore || 0) >= 60;

  return (
    <div className="page space-y-8 pb-8">
      <div className="page-header">
        <div>
          <h2 className="page-title">Personal Analytics</h2>
          <p className="page-subtitle">Track your performance and progress over time.</p>
        </div>
        <Link href="/student/tests" className="btn btn-primary">
          <PlayCircle size={16} className="mr-2" />
          Take a Test
        </Link>
      </div>

      {error && <div className="p-4 bg-red-50 text-red-600 rounded-md border border-red-200">{error}</div>}

      {/* Summary stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <MetricCard title="Tests Attempted" value={data?.testsAttempted ?? 0} trend="Total" isPositive={true} icon={<Target size={20} />} tone="primary" />
        <MetricCard title="Average Score" value={data?.averageScore != null ? `${data.averageScore}%` : "—"} trend="Overall" isPositive={isPassing} icon={<Award size={20} />} tone={isPassing ? "success" : "warning"} />
        <MetricCard title="Latest Score" value={`${latestScore}%`} trend="Recent" isPositive={latestScore >= 60} icon={<TrendingUp size={20} />} tone={latestScore >= 60 ? "success" : "danger"} />
      </div>

      {submissions.length === 0 ? (
        <div className="card text-center p-12 empty-state">
          <Target size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-lg font-medium text-primary mb-2">No test attempts yet</p>
          <p className="text-secondary mb-6">Take your first aptitude or coding test to see your performance charts here.</p>
          <Link href="/student/tests" className="btn btn-primary">Browse Tests</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card flex flex-col">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Award size={18} className="text-indigo-600" />
              Score by Test
            </h3>
            <div className="flex-1">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <Bar dataKey="score" fill="var(--color-primary)" radius={[6, 6, 0, 0]} />
                  <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: "var(--color-text-secondary)" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: "var(--color-text-secondary)" }} axisLine={false} tickLine={false} />
                  <Tooltip
                    cursor={{ fill: "var(--color-primary-soft)" }}
                    formatter={(value: number) => [`${value}%`, "Score"]}
                    labelFormatter={(_, payload) =>
                      payload?.[0]?.payload?.fullName ?? ""
                    }
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card flex flex-col">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <TrendingUp size={18} className="text-emerald-600" />
              Progress Timeline
            </h3>
            <div className="flex-1">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="var(--color-success)"
                    strokeWidth={3}
                    dot={{ fill: "var(--color-success)", r: 4, strokeWidth: 0 }}
                    activeDot={{ r: 6, stroke: "var(--color-surface)", strokeWidth: 2 }}
                  />
                  <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 12, fill: "var(--color-text-secondary)" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: "var(--color-text-secondary)" }} axisLine={false} tickLine={false} />
                  <Tooltip
                    formatter={(value: number) => [`${value}%`, "Score"]}
                    labelFormatter={(_, payload) =>
                      payload?.[0]?.payload?.fullName ?? ""
                    }
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card lg:col-span-2 p-0 overflow-hidden">
            <div className="p-6 border-b border-default bg-surface-muted border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">
                Recent Submissions
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50/50">
                  <tr className="border-b border-default text-sm tracking-wider uppercase text-secondary">
                    <th className="font-semibold py-4 px-6 border-gray-100">Test Name</th>
                    <th className="font-semibold py-4 px-6 border-gray-100">Score</th>
                    <th className="font-semibold py-4 px-6 border-gray-100">Date Submitted</th>
                    <th className="font-semibold py-4 px-6 text-center border-gray-100">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {[...submissions].reverse().map((s) => (
                    <tr key={s.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-6 font-medium text-primary">{s.testName}</td>
                      <td className="py-4 px-6 font-semibold">{s.score}%</td>
                      <td className="py-4 px-6 text-secondary">
                        {new Date(s.submittedAt).toLocaleString()}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${(s.score || 0) >= 60 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                          }`}>
                          {(s.score || 0) >= 60 ? 'Passed' : 'Failed'}
                        </span>
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

function MetricCard({ title, value, trend, isPositive, icon, tone }: any) {
  const toneColors: Record<string, string> = {
    info: "text-blue-600 bg-blue-50 border-blue-100",
    success: "text-emerald-600 bg-emerald-50 border-emerald-100",
    warning: "text-amber-600 bg-amber-50 border-amber-100",
    primary: "text-indigo-600 bg-indigo-50 border-indigo-100",
    danger: "text-red-600 bg-red-50 border-red-100",
  };

  return (
    <div className="card p-5 hover:shadow-lg transition-shadow duration-200 border border-gray-100 relative overflow-hidden group">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-2.5 rounded-lg border ${toneColors[tone]}`}>
          {icon}
        </div>
        <div className={`text-sm font-medium px-2 py-0.5 rounded-full ${isPositive ? 'text-emerald-700 bg-emerald-50' : 'text-red-700 bg-red-50'}`}>
          {trend}
        </div>
      </div>
      <h4 className="text-gray-500 text-sm font-medium mb-1">{title}</h4>
      <p className="text-3xl font-bold text-gray-900 tracking-tight">{value}</p>

      <div className={`absolute -bottom-6 -right-6 w-24 h-24 rounded-full opacity-[0.03] group-hover:opacity-[0.06] transition-opacity duration-300 pointer-events-none ${toneColors[tone]?.split(' ')[1]}`} />
    </div>
  );
}
