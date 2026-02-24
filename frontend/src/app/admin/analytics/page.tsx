"use client";

import { useEffect, useState } from "react";
import { Users, TrendingUp, Target, Award, Globe, FileText, CheckCircle2 } from "lucide-react";
import api from "@/interceptors/axios";
import Link from "next/link";

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/admin/analytics/overview")
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load platform analytics.");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex animate-pulse flex-col space-y-4">
        <div className="h-24 bg-gray-100 rounded-xl"></div>
        <div className="h-64 bg-gray-100 rounded-xl"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl">
        <p className="font-semibold">Error Loading Analytics</p>
        <p className="text-sm mt-1">{error}</p>
      </div>
    );
  }

  const passPercent = data.totalSubmissions > 0 ? Math.round((data.passCount / data.totalSubmissions) * 100) : 0;
  const failPercent = data.totalSubmissions > 0 ? 100 - passPercent : 0;

  return (
    <div className="page space-y-8 pb-8">
      <div className="page-header">
        <div>
          <h2 className="page-title text-3xl">Platform Analytics</h2>
          <p className="page-subtitle mt-1">Cross-organization metrics, platform adoption, and global test performance.</p>
        </div>
        <button className="btn btn-primary shadow-sm hover:shadow-md transition-shadow">
          Export Global Report
        </button>
      </div>

      {/* Top Level Platform Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Total Candidates" value={data.totalCandidates} trend="Enrolled" isPositive={true} icon={<Users size={20} />} tone="info" />
        <MetricCard title="Tests Created" value={data.totalTests} trend="Active" isPositive={true} icon={<CheckCircle2 size={20} />} tone="success" />
        <MetricCard title="Completed Submissions" value={data.totalSubmissions} trend="Global" isPositive={true} icon={<Globe size={20} />} tone="primary" />
        <MetricCard title="Platform Avg Score" value={`${data.averageScore}%`} trend="Performance" isPositive={data.averageScore >= 60} icon={<Award size={20} />} tone={data.averageScore >= 60 ? "success" : "warning"} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Platform Funnel */}
        <div className="lg:col-span-1 card flex flex-col border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <TrendingUp size={18} className="text-indigo-600" />
            Global Evaluation Funnel
          </h3>
          <div className="space-y-6 flex-1">
            <FunnelStep label="Total Submissions" count={data.totalSubmissions} percent={100} color="bg-indigo-500" />
            <FunnelStep label="Passed Overall (>=60)" count={data.passCount} percent={passPercent} color="bg-emerald-500" />
            <FunnelStep label="Failed Overall" count={data.failCount} percent={failPercent} color="bg-rose-400" />
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100">
            <div className="bg-blue-50/50 rounded-lg p-4 border border-blue-100/50">
              <h4 className="text-sm font-semibold text-blue-900 mb-1">Platform Impact</h4>
              <p className="text-xs text-blue-700 leading-relaxed">
                These funnels represent the aggregated success rates of all candidates across every organization registered on the platform.
              </p>
            </div>
          </div>
        </div>

        {/* Right Col: Global Submissions Feed */}
        <div className="lg:col-span-2 card p-0 overflow-hidden flex flex-col border border-gray-100 shadow-sm">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <FileText size={18} className="text-blue-600" />
              Recent Global Activity
            </h3>
            <Link href="/admin/tests" className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
              View All Tests &rarr;
            </Link>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 text-xs uppercase tracking-wider text-gray-500 border-b border-gray-100">
                  <th className="px-6 py-4 font-semibold">Candidate Identifier</th>
                  <th className="px-6 py-4 font-semibold">Test & Origin</th>
                  <th className="px-6 py-4 font-semibold">Score</th>
                  <th className="px-6 py-4 font-semibold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {data.recentSubmissions && data.recentSubmissions.length > 0 ? (
                  data.recentSubmissions.map((sub: any) => (
                    <SubmissionRow key={sub.id} sub={sub} />
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                          <FileText size={24} className="text-gray-400" />
                        </div>
                        <p className="font-medium text-gray-900">No submissions active yet.</p>
                      </div>
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

// ------------------------
// UI Components
// ------------------------

function MetricCard({ title, value, trend, isPositive, icon, tone }: any) {
  const toneColors: Record<string, string> = {
    info: "text-blue-600 bg-blue-50 border-blue-100",
    success: "text-emerald-600 bg-emerald-50 border-emerald-100",
    warning: "text-amber-600 bg-amber-50 border-amber-100",
    primary: "text-indigo-600 bg-indigo-50 border-indigo-100",
  };

  return (
    <div className="card p-5 hover:shadow-lg transition-all duration-300 border border-gray-100 relative overflow-hidden group bg-white">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-2.5 rounded-lg border shadow-sm ${toneColors[tone]}`}>
          {icon}
        </div>
        <div className={`text-xs font-bold tracking-wide px-2.5 py-1 rounded-full uppercase ${isPositive ? 'text-emerald-700 bg-emerald-50' : 'text-rose-700 bg-rose-50'}`}>
          {trend}
        </div>
      </div>
      <h4 className="text-gray-500 text-sm font-semibold mb-1">{title}</h4>
      <p className="text-3xl font-bold text-gray-900 tracking-tight">{value}</p>

      {/* Decorative gradient overlay */}
      <div className={`absolute -bottom-10 -right-10 w-32 h-32 rounded-full opacity-[0.03] group-hover:opacity-[0.06] transition-opacity duration-500 pointer-events-none ${toneColors[tone].split(' ')[1]}`} style={{ filter: 'blur(20px)' }} />
    </div>
  );
}

function FunnelStep({ label, count, percent, color }: any) {
  return (
    <div className="relative group">
      <div className="flex justify-between text-sm font-semibold mb-2">
        <span className="text-gray-800">{label}</span>
        <span className="text-gray-900">{count} <span className="text-gray-400 font-medium ml-1">({percent}%)</span></span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden shadow-inner">
        <div className={`h-full rounded-full ${color} transition-all duration-1000 ease-out`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

function SubmissionRow({ sub }: any) {
  const isPassed = sub.status === 'Passed';

  return (
    <tr className="hover:bg-blue-50/50 transition-colors group cursor-default">
      <td className="px-6 py-4">
        <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-700 transition-colors truncate max-w-[200px]" title={sub.studentName}>
          {sub.studentName}
        </p>
      </td>
      <td className="px-6 py-4">
        <div className="text-sm font-medium text-gray-900 truncate max-w-[200px]" title={sub.testName}>{sub.testName}</div>
        <div className="text-xs font-medium text-gray-500 mt-0.5 truncate max-w-[200px]" title={sub.orgName}>{sub.orgName}</div>
      </td>
      <td className="px-6 py-4">
        <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-gray-50 border border-gray-100 text-sm font-bold text-gray-700">
          {sub.score} <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">pts</span>
        </div>
      </td>
      <td className="px-6 py-4 text-right">
        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold tracking-wide shadow-sm ${isPassed
            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/50'
            : 'bg-rose-50 text-rose-700 border border-rose-200/50'
          }`}>
          {isPassed ? <CheckCircle2 size={14} className="text-emerald-600" /> : <Target size={14} className="text-rose-600" />}
          {sub.status}
        </span>
      </td>
    </tr>
  );
}