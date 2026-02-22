"use client";

import { useEffect, useState } from "react";
import api from "@/interceptors/axios";

type Stats = {
  colleges: number;
  companies: number;
  students: number;
};

function StatCard({
  title,
  value,
}: {
  title: string;
  value: number | string;
}) {
  return (
    <div className="bg-white p-6 rounded-xl border shadow-sm hover:shadow-md transition">
      <p className="text-sm text-gray-500">{title}</p>

      <div className="flex items-center justify-between mt-2">
        <h3 className="text-3xl font-bold text-gray-900">{value}</h3>

        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
          {title[0]}
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/admin/dashboard/stats").then((res) => {
      setStats(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) return <p className="text-gray-500">Loading...</p>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Dashboard Overview</h2>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Colleges" value={stats?.colleges ?? 0} />
        <StatCard title="Companies" value={stats?.companies ?? 0} />
        <StatCard title="Students" value={stats?.students ?? 0} />
      </div>
    </div>
  );
}