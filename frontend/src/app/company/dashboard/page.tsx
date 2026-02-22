"use client";

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
    api.get("/companies/dashboard").then((res) => setData(res.data));
  }, []);

  if (!data) return <p>Loading...</p>;

  return (
    <>
      <div className="page-header">
        <h2 className="page-title">Dashboard Overview</h2>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <StatCard title="Total Tests" value={data.totalTests} />
        <StatCard title="Total Drives" value={data.totalDrives} />
        <StatCard title="Total Candidates" value={data.totalCandidates} />
      </div>
    </>
  );
}

function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="dashboard-card">
      <div className="dashboard-card-title">{title}</div>
      <div className="dashboard-card-value">{value}</div>
    </div>
  );
}