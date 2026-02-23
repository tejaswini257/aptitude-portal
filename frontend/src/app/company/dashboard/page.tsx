"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import api from "@/interceptors/axios";

type DashboardData = {
  totalTests: number;
  totalDrives: number;
  totalCandidates: number;
};

export default function CompanyDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    api.get("/company/dashboard").then((res) => setData(res.data));
  }, []);

  if (!data) return <p className="text-secondary">Loading dashboard...</p>;

  return (
    <div className="page space-y-8">
      <div className="page-header">
        <div>
          <h2 className="page-title">Recruitment Overview</h2>
          <p className="page-subtitle">Track your hiring pipeline with real-time test and drive metrics.</p>
        </div>
      </div>

      <div className="dashboard-grid-3">
        <StatCard title="Total Tests" value={data.totalTests} tone="info" />
        <StatCard title="Active Drives" value={data.totalDrives} tone="success" />
        <StatCard title="Candidates" value={data.totalCandidates} tone="accent" />
      </div>

      <div className="card">
        <h3 className="font-semibold text-lg">Quick Actions</h3>
        <div className="flex flex-wrap gap-3 mt-4">
          <Link href="/company/tests" className="btn btn-primary">
            Create Test
          </Link>
          <Link href="/company/drives" className="btn btn-secondary">
            Launch Drive
          </Link>
          <Link href="/company/analytics" className="btn btn-secondary">
            View Analytics
          </Link>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  tone,
}: {
  title: string;
  value: number;
  tone: "info" | "success" | "accent";
}) {
  return (
    <div className={`dashboard-card tone-${tone}`}>
      <div className="dashboard-card-title">{title}</div>
      <div className="dashboard-card-value">{value}</div>
    </div>
  );
}
