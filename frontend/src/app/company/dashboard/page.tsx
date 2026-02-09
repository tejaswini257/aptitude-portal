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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get("/companies/dashboard");
        setData(res.data);
      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) return <p>Loading dashboard...</p>;
  if (!data) return <p>Failed to load dashboard</p>;

  return (
    <>
      <h2 style={{ fontSize: "26px", fontWeight: 600, marginBottom: "30px" }}>
        Dashboard Overview
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "20px",
        }}
      >
        <StatCard title="Total Tests" value={data.totalTests} />
        <StatCard title="Total Drives" value={data.totalDrives} />
        <StatCard title="Total Candidates" value={data.totalCandidates} />
      </div>
    </>
  );
}

function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <div
      style={{
        background: "#ffffff",
        padding: "24px",
        borderRadius: "16px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
      }}
    >
      <p style={{ color: "#64748b", fontSize: "14px" }}>{title}</p>
      <h3 style={{ fontSize: "28px", marginTop: "10px" }}>{value}</h3>
    </div>
  );
}
