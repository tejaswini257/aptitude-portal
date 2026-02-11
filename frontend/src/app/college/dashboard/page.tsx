"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/interceptors/axios";

type Stats = {
  students: number;
  departments: number;
  companies: number;
  ongoingDrives: number;
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
    (async () => {
      try {
        const res = await api.get("/colleges/dashboard/stats");
        setStats(res.data);
      } catch (err: any) {
        setError(err.response?.data?.message || err.message || "Failed to load stats");
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px] text-gray-500">
        Loading dashboard…
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

  const s = stats || { students: 0, departments: 0, companies: 0, ongoingDrives: 0 };

  const cards = [
    { title: "Students", value: s.students, path: "/college/students", color: "bg-emerald-500" },
    { title: "Departments", value: s.departments, path: "/college/departments", color: "bg-blue-500" },
    { title: "Companies", value: s.companies, path: "/college/companies", color: "bg-violet-500" },
    { title: "Ongoing Drives", value: s.ongoingDrives, path: "/college/drives", color: "bg-amber-500" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-2">Dashboard</h1>
      <p className="text-gray-500 mb-8">Overview of your college</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((c) => (
          <Link
            key={c.title}
            href={c.path}
            className="block bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition"
          >
            <div className={`w-10 h-10 rounded-lg ${c.color} opacity-90 mb-4`} />
            <div className="text-2xl font-bold text-gray-900">{c.value}</div>
            <div className="text-sm text-gray-500">{c.title}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
