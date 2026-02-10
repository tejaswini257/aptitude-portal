"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/interceptors/axios";

type DashboardData = {
  totalTests: number;
  totalDrives: number;
  totalCandidates: number;
};

export default function CompanyDashboard() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        // 🔐 Check token first
        const token = localStorage.getItem("accessToken");

        if (!token) {
          router.push("/login");
          return;
        }

        const res = await api.get("/companies/dashboard");

        setData(res.data);
      } catch (err: any) {
        console.error("Dashboard error:", err);

        if (err.response?.status === 401) {
          router.push("/login");
        } else {
          setError("Failed to load dashboard");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [router]);

  if (loading) return <p>Loading dashboard...</p>;
  if (error) return <p>{error}</p>;
  if (!data) return <p>No dashboard data found.</p>;

  return (
    <div>
      <h2
        style={{
          fontSize: "26px",
          fontWeight: 600,
          marginBottom: "30px",
        }}
      >
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
    </div>
  );
}

function StatCard({
  title,
  value,
}: {
  title: string;
  value: number;
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
