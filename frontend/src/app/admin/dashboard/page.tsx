"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import api from "@/interceptors/axios";
import { Building2, School, Users, FileText, CheckCircle, BarChart3 } from "lucide-react";

type Stats = {
  colleges: number;
  companies: number;
  students: number;
  totalTests: number;
  totalSubmissions: number;
  averageScore: number;
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/admin/dashboard/stats").then((res) => {
      setStats(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="page p-8 text-center text-secondary">Loading dashboard metrics...</div>;

  return (
    <div className="page space-y-8 pb-8">
      <div className="page-header">
        <div>
          <h2 className="page-title">Platform Overview</h2>
          <p className="page-subtitle">Monitor total usage and high-level platform analytics.</p>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">User Acquisition</h3>
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <MetricLinkCard title="Registered Colleges" value={stats?.colleges ?? 0} href="/admin/colleges" icon={<School size={20} />} tone="primary" />
          <MetricLinkCard title="Partner Companies" value={stats?.companies ?? 0} href="/admin/companies" icon={<Building2 size={20} />} tone="info" />
          <MetricLinkCard title="Total Students" value={stats?.students ?? 0} href="/admin/students" icon={<Users size={20} />} tone="success" />
        </div>
      </div>

      <div className="space-y-6 pt-4">
        <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">Platform Test Analytics</h3>
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <MetricCard title="Total Tests Published" value={stats?.totalTests ?? 0} trend="Platform Load" icon={<FileText size={20} />} tone="primary" />
          <MetricCard title="Total Test Submissions" value={stats?.totalSubmissions ?? 0} trend="Engagement" icon={<CheckCircle size={20} />} tone="info" />
          <MetricCard title="Platform Average Score" value={`${stats?.averageScore ?? 0}%`} trend="Performance" icon={<BarChart3 size={20} />} tone={(stats?.averageScore ?? 0) >= 60 ? "success" : "warning"} />
        </div>
      </div>
    </div>
  );
}

function MetricLinkCard({ title, value, href, icon, tone }: any) {
  const toneColors: Record<string, string> = {
    info: "text-blue-600 bg-blue-50 border-blue-100",
    success: "text-emerald-600 bg-emerald-50 border-emerald-100",
    primary: "text-indigo-600 bg-indigo-50 border-indigo-100",
  };

  return (
    <Link href={href} className="card p-5 hover:shadow-lg transition-shadow duration-200 border border-gray-100 relative overflow-hidden group block">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-2.5 rounded-lg border ${toneColors[tone]}`}>
          {icon}
        </div>
        <div className="text-sm font-medium px-2 py-0.5 rounded-full text-gray-500 bg-gray-50 opacity-0 group-hover:opacity-100 transition-opacity">
          View all →
        </div>
      </div>
      <h4 className="text-gray-500 text-sm font-medium mb-1">{title}</h4>
      <p className="text-3xl font-bold text-gray-900 tracking-tight">{value}</p>

      <div className={`absolute -bottom-6 -right-6 w-24 h-24 rounded-full opacity-[0.03] group-hover:opacity-[0.06] transition-opacity duration-300 pointer-events-none ${toneColors[tone].split(' ')[1]}`} />
    </Link>
  );
}

function MetricCard({ title, value, trend, icon, tone }: any) {
  const toneColors: Record<string, string> = {
    info: "text-blue-600 bg-blue-50 border-blue-100",
    success: "text-emerald-600 bg-emerald-50 border-emerald-100",
    warning: "text-amber-600 bg-amber-50 border-amber-100",
    primary: "text-indigo-600 bg-indigo-50 border-indigo-100",
  };

  return (
    <div className="card p-5 border border-gray-100 relative overflow-hidden group">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-2.5 rounded-lg border ${toneColors[tone]}`}>
          {icon}
        </div>
        <div className="text-sm font-medium px-2 py-0.5 rounded-full text-gray-500 bg-gray-50">
          {trend}
        </div>
      </div>
      <h4 className="text-gray-500 text-sm font-medium mb-1">{title}</h4>
      <p className="text-3xl font-bold text-gray-900 tracking-tight">{value}</p>

      <div className={`absolute -bottom-6 -right-6 w-24 h-24 rounded-full opacity-[0.03] pointer-events-none ${toneColors[tone].split(' ')[1]}`} />
    </div>
  );
}
