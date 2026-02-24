"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/interceptors/axios";
import { Users, Building2, Briefcase, Database, Activity, ArrowRight } from "lucide-react";

type Stats = {
  students: number;
  departments: number;
  companies: number;
  ongoingDrives: number;
};

type ApiErrorShape = {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
};

type DashboardCard = {
  title: string;
  value: number;
  path: string;
  tone: "info" | "success" | "accent";
};

export default function CollegeDashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      router.replace("/login");
      return;
    }

    const loadStats = async () => {
      try {
        const res = await api.get("/colleges/dashboard/stats");
        setStats(res.data);
      } catch (err: any) {
        setError(
          err.response?.data?.message || err.message || "Failed to load stats"
        );
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px] text-secondary">
        Loading dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[200px] text-red-500">
        {error}
      </div>
    );
  }

  const s = stats || {
    students: 0,
    departments: 0,
    companies: 0,
    ongoingDrives: 0,
  };

  const cards = [
    {
      title: "Active Students",
      value: s.students,
      path: "/college/students",
      color: "bg-blue-500/10 text-blue-600 border-blue-100",
      icon: Users
    },
    {
      title: "Departments",
      value: s.departments,
      path: "/college/departments",
      color: "bg-emerald-500/10 text-emerald-600 border-emerald-100",
      icon: Building2
    },
    {
      title: "Partner Companies",
      value: s.companies,
      path: "/college/companies",
      color: "bg-violet-500/10 text-violet-600 border-violet-100",
      icon: Briefcase
    },
    {
      title: "Live Drives",
      value: s.ongoingDrives,
      path: "/college/drives",
      color: "bg-amber-500/10 text-amber-600 border-amber-100",
      icon: Activity
    },
  ];

  return (
    <div className="page space-y-8 animate-in fade-in duration-500">
      <div className="page-header border-none pb-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Real-time overview of your college metrics and activities.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <Link
              key={c.title}
              href={c.path}
              className="group relative overflow-hidden bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl border ${c.color} transition-colors`}>
                  <Icon size={24} strokeWidth={2} />
                </div>
              </div>

              <div>
                <h3 className="text-3xl font-bold text-gray-900 mb-1">{c.value}</h3>
                <p className="text-sm font-medium text-gray-500">{c.title}</p>
              </div>

              {/* Subtle decorative background blur */}
              <div className={`absolute -bottom-8 -right-8 w-24 h-24 rounded-full blur-2xl opacity-20 ${c.color.split(' ')[0]}`} />
            </Link>
          );
        })}
      </div>

      {/* Quick Actions / Recent Activity Stubs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <div className="lg:col-span-2 card shadow-sm">
          <h3 className="font-semibold text-lg border-b pb-4 mb-4">Recent Activity</h3>
          <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
            No recent activity detected.
          </div>
        </div>
        <div className="card shadow-sm">
          <h3 className="font-semibold text-lg border-b pb-4 mb-4">Quick Links</h3>
          <div className="space-y-3">
            <Link href="/college/students/add" className="flex items-center gap-3 text-gray-600 hover:text-primary p-2 hover:bg-gray-50 rounded-lg transition">
              <Users size={18} />
              <span className="text-sm font-medium">Add New Student</span>
            </Link>
            <Link href="/college/tests/create" className="flex items-center gap-3 text-gray-600 hover:text-primary p-2 hover:bg-gray-50 rounded-lg transition">
              <Database size={18} />
              <span className="text-sm font-medium">Create Assessment</span>
            </Link>
            <Link href="/college/companies" className="flex items-center gap-3 text-gray-600 hover:text-primary p-2 hover:bg-gray-50 rounded-lg transition">
              <Briefcase size={18} />
              <span className="text-sm font-medium">Browse Companies</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
