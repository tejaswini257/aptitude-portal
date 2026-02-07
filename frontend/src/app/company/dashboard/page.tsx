"use client";

import { useEffect, useState } from "react";

type DashboardData = {
  totalTests: number;
  activeTests: number;
  totalCandidates: number;
};

export default function CompanyDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          "http://localhost:3000/companies/dashboard",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error("Failed to fetch dashboard");
        }

        const result = await res.json();
        setData(result);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) return <p>Loading dashboard...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!data) return <p>No dashboard data available</p>;

  return (
    <>
      <h2 style={{ fontSize: "26px", fontWeight: 600, marginBottom: "30px" }}>
        Dashboard Overview
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: "20px",
        }}
      >
        <StatCard title="Active Tests" value={data.activeTests} />
        <StatCard title="Total Candidates" value={data.totalCandidates} />
        <StatCard title="Total Tests Created" value={data.totalTests} />
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
        transition: "0.3s ease",
      }}
    >
      <p style={{ color: "#64748b", fontSize: "14px" }}>{title}</p>
      <h3 style={{ fontSize: "28px", marginTop: "10px" }}>{value}</h3>
    </div>
  );
}
