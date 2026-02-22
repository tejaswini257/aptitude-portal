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
    <div className="card">
      <p className="text-sm text-gray-500">{title}</p>
      <h3 className="text-2xl font-semibold mt-2">{value}</h3>
    </div>
  );
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/admin/dashboard/stats")
      .then((res) => setStats(res.data))
      .catch((err) =>
        setError(
          err?.response?.data?.message ||
            (err?.response?.status === 403
              ? "Access denied. Super admin only."
              : "Failed to load dashboard stats")
        )
      )
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="text-gray-500">Loading dashboard...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="space-y-6">
      {/* Title */}
      <h2 className="text-2xl font-semibold">
        Dashboard Overview
      </h2>

      {/* Stats Grid */}
      <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Colleges" value={stats?.colleges ?? 0} />
        <StatCard title="Companies" value={stats?.companies ?? 0} />
        <StatCard title="Students" value={stats?.students ?? 0} />
      </div>
    </div>
  );
}