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
    return (
      <p style={{ color: "#64748b" }}>Loading dashboard...</p>
    );
  }

  if (error) {
    return (
      <p style={{ color: "#dc2626" }}>{error}</p>
    );
  }

  return (
    <>
      <h2 style={{ fontSize: "26px", fontWeight: 600, marginBottom: "30px" }}>
        Dashboard Overview
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "20px",
        }}
      >
        <StatCard title="Colleges" value={stats?.colleges ?? 0} />
        <StatCard title="Companies" value={stats?.companies ?? 0} />
        <StatCard title="Students" value={stats?.students ?? 0} />
      </div>
    </>
  );
}
