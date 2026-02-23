"use client";

import { useEffect, useState } from "react";
import { Users, TrendingUp, Target, Award, CalendarDays, ChevronRight, Briefcase, FileText } from "lucide-react";
import Link from "next/link";
import api from "@/interceptors/axios";

export default function CompanyAnalytics() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/company/dashboard")
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="page p-8 text-center text-secondary">Loading analytics...</div>;
  }

  if (!data) {
    return <div className="page p-8 text-center text-danger">Failed to load analytics data.</div>;
  }

  const passPercent = data.totalCandidates > 0 ? Math.round((data.passCount / data.totalCandidates) * 100) : 0;
  const failPercent = data.totalCandidates > 0 ? 100 - passPercent : 0;

  return (
    <div className="page space-y-8 pb-8">
      <div className="page-header">
        <div>
          <h2 className="page-title">Analytics & Insights</h2>
          <p className="page-subtitle">Track your recruitment pipeline performance and drive conversion rates.</p>
        </div>
        <button className="btn btn-primary">
          Download Report
        </button>
      </div>

      {/* Top Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Total Candidates" value={data.totalCandidates} trend="Live" isPositive={true} icon={<Users size={20} />} tone="info" />
        <MetricCard title="Passed Tests" value={data.passCount} trend={`${passPercent}%`} isPositive={true} icon={<Target size={20} />} tone="success" />
        <MetricCard title="Average Score" value={`${data.averageScore}%`} trend="Overall" isPositive={data.averageScore >= 60} icon={<Award size={20} />} tone={data.averageScore >= 60 ? "primary" : "warning"} />
        <MetricCard title="Active Drives" value={data.totalDrives} trend="Monitored" isPositive={true} icon={<Briefcase size={20} />} tone="info" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Funnel */}
        <div className="lg:col-span-1 card flex flex-col">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <TrendingUp size={18} className="text-blue-600" />
            Test Conversion Funnel
          </h3>
          <div className="space-y-6 flex-1">
            <FunnelStep label="Attempted Test" count={data.totalCandidates} percent={100} color="bg-blue-500" />
            <FunnelStep label="Passed Score" count={data.passCount} percent={passPercent} color="bg-emerald-500" />
            <FunnelStep label="Failed Score" count={data.failCount} percent={failPercent} color="bg-red-400" />
          </div>
        </div>

        {/* Right Col: Recent Submissions */}
        <div className="lg:col-span-2 card p-0 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <FileText size={18} className="text-indigo-600" />
              Recent Candidate Submissions
            </h3>
          </div>

          <div className="overflow-auto border-t border-gray-100 flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 text-xs uppercase tracking-wider text-gray-500 border-b border-gray-100">
                  <th className="px-6 py-4 font-semibold">Candidate Email</th>
                  <th className="px-6 py-4 font-semibold">Test Name</th>
                  <th className="px-6 py-4 font-semibold">Score</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.recentSubmissions && data.recentSubmissions.length > 0 ? (
                  data.recentSubmissions.map((sub: any) => (
                    <SubmissionRow key={sub.id} sub={sub} />
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                      No recent submissions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, trend, isPositive, icon, tone }: any) {
  const toneColors: Record<string, string> = {
    info: "text-blue-600 bg-blue-50 border-blue-100",
    success: "text-emerald-600 bg-emerald-50 border-emerald-100",
    warning: "text-amber-600 bg-amber-50 border-amber-100",
    primary: "text-indigo-600 bg-indigo-50 border-indigo-100",
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

      {/* Decorative background accent */}
      <div className={`absolute -bottom-6 -right-6 w-24 h-24 rounded-full opacity-[0.03] group-hover:opacity-[0.06] transition-opacity duration-300 pointer-events-none ${toneColors[tone].split(' ')[1]}`} />
    </div>
  );
}

function FunnelStep({ label, count, percent, color }: any) {
  return (
    <div className="relative">
      <div className="flex justify-between text-sm font-medium mb-1.5">
        <span className="text-gray-700">{label}</span>
        <span className="text-gray-900">{count} <span className="text-gray-400 font-normal ml-1">({percent}%)</span></span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
        <div className={`h-2.5 rounded-full ${color}`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

function SubmissionRow({ sub }: any) {
  const badgeColors: Record<string, string> = {
    Passed: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    Failed: "bg-red-50 text-red-700 border border-red-200",
  };

  return (
    <tr className="hover:bg-gray-50/80 transition-colors group cursor-pointer">
      <td className="px-6 py-4">
        <p className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{sub.studentName}</p>
      </td>
      <td className="px-6 py-4 text-sm text-gray-500">{sub.testName}</td>
      <td className="px-6 py-4 text-sm text-gray-700 font-medium">{sub.score}</td>
      <td className="px-6 py-4">
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide ${badgeColors[sub.status] || 'bg-gray-50'}`}>
          {sub.status}
        </span>
      </td>
    </tr>
  );
}
