"use client";

import api from "@/interceptors/axios";
import { useEffect, useState } from "react";

type DashboardStats = {
  totalDrives: number;
  activeDrives: number;
  totalTests: number;
  totalCandidates: number;
};

export default function CompanyDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboardStats = async () => {
    try {
      const res = await api.get("/companies/dashboard/stats");
      setStats(res.data);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.status === 403
          ? "Access denied. Company admin only."
          : "Failed to load dashboard stats";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  if (loading) {
    return <p className="loading">Loading dashboard...</p>;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  return (
    <div className="page-container">
      <h1 className="page-title">Company Dashboard</h1>

      {/* STATS GRID */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Drives</h3>
          <p>{stats?.totalDrives}</p>
        </div>

        <div className="stat-card">
          <h3>Active Drives</h3>
          <p>{stats?.activeDrives}</p>
        </div>

        <div className="stat-card">
          <h3>Total Tests</h3>
          <p>{stats?.totalTests}</p>
        </div>

        <div className="stat-card">
          <h3>Total Candidates</h3>
          <p>{stats?.totalCandidates}</p>
        </div>
      </div>

      {/* EMPTY STATE SECTION (for later) */}
      <div className="card mt-4">
        <h2>Recent Drives</h2>
        <p className="muted-text">No drives created yet.</p>
      </div>
    </div>
  );
}
