"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/interceptors/axios";

type DashboardStats = {
  testsAttempted: number;
  averageScore: number;
};

type TestItem = {
  id: string;
  name: string;
  createdAt: string;
};

type ApiErrorShape = {
  response?: {
    data?: {
      message?: string;
    };
  };
};

function StatCard({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="card p-6">
      <p className="text-sm text-secondary">{title}</p>
      <h3 className="text-2xl font-bold mt-1">{value}</h3>
    </div>
  );
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [tests, setTests] = useState<TestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboard = async () => {
    try {
      const [statsRes, testsRes] = await Promise.all([
        api.get("/students/me/dashboard"),
        api.get("/tests"),
      ]);
      setStats(statsRes.data);
      setTests(testsRes.data || []);
    } catch (err: unknown) {
      const error = err as ApiErrorShape;
      setError(error?.response?.data?.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px] text-secondary">
        Loading...
      </div>
    );
  }

  return (
    <div className="page space-y-8">
      <h2 className="page-title">Student Overview</h2>

      {error && <p className="text-red-500">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Tests Attempted" value={stats?.testsAttempted ?? 0} />
        <StatCard
          title="Average Score"
          value={stats?.averageScore != null ? `${stats.averageScore}%` : "--"}
        />
        <StatCard title="Available Tests" value={tests.length} />
      </div>

      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-4">Available Tests</h3>
        {tests.length === 0 ? (
          <p className="text-secondary">No tests available at the moment.</p>
        ) : (
          <div className="space-y-3">
            {tests.slice(0, 5).map((test) => (
              <div
                key={test.id}
                className="flex justify-between items-center border border-default rounded-lg p-4 hover:bg-slate-50"
              >
                <div>
                  <p className="font-medium">{test.name}</p>
                  <p className="text-sm text-secondary">
                    Created: {new Date(test.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <Link href={`/student/tests/${test.id}`} className="btn btn-primary">
                  Start Test
                </Link>
              </div>
            ))}
          </div>
        )}
        {tests.length > 0 && (
          <Link
            href="/student/tests"
            className="inline-block mt-4 text-blue-600 hover:underline text-sm font-medium"
          >
            View all tests {"->"}
          </Link>
        )}
      </div>

      <div className="flex flex-wrap gap-4">
        <Link href="/student/tests" className="btn btn-primary">
          All Tests
        </Link>
        <Link href="/student/practice" className="btn btn-secondary">
          Practice
        </Link>
        <Link href="/student/analytics" className="btn btn-secondary">
          Analytics
        </Link>
      </div>
    </div>
  );
}
