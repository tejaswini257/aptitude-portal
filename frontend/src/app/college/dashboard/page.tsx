"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/interceptors/axios";

type Stats = {
  students: number;
  departments: number;
  companies: number;
  ongoingDrives: number;
};

type ApiErrorShape = {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
};

type DashboardCard = {
  title: string;
  value: number;
  path: string;
  tone: "info" | "success" | "accent";
};

export default function CollegeDashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      router.replace("/login");
      return;
    }

    const loadStats = async () => {
      try {
        const res = await api.get("/colleges/dashboard/stats");
        setStats(res.data as Stats);
      } catch (err: unknown) {
        const e = err as ApiErrorShape;
        setError(e?.response?.data?.message || e?.message || "Failed to load stats.");
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px] text-secondary">
        Loading dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[200px] text-red-500">
        {error}
      </div>
    );
  }

  const summary = stats ?? { students: 0, departments: 0, companies: 0, ongoingDrives: 0 };
  const cards: DashboardCard[] = [
    { title: "Students", value: summary.students, path: "/college/students", tone: "success" },
    {
      title: "Departments",
      value: summary.departments,
      path: "/college/departments",
      tone: "info",
    },
    { title: "Companies", value: summary.companies, path: "/college/companies", tone: "accent" },
    { title: "Ongoing Drives", value: summary.ongoingDrives, path: "/college/drives", tone: "info" },
  ];

  return (
    <div className="page space-y-6">
      <div className="page-header">
        <div>
          <h2 className="page-title">College Dashboard</h2>
          <p className="page-subtitle">Overview of student participation, departments, and placement activities.</p>
        </div>
      </div>

      <div className="dashboard-grid-3">
        {cards.map((card) => (
          <Link key={card.title} href={card.path} className={`dashboard-card tone-${card.tone} card-link`}>
            <p className="dashboard-card-title">{card.title}</p>
            <h3 className="dashboard-card-value">{card.value}</h3>
          </Link>
        ))}
      </div>
    </div>
  );
}
