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

  if (loading) return <p className="text-gray-500">Loading dashboard...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!data) return <p className="text-gray-500">No dashboard data found.</p>;

  return (
    <div>
      <h2 className="page-title mb-6">Dashboard Overview</h2>

      <div className="grid grid-cols-3 gap-6">
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
    <div className="dashboard-card">
      <p className="dashboard-card-title">{title}</p>
      <h3 className="dashboard-card-value">{value}</h3>
    </div>
  );
}