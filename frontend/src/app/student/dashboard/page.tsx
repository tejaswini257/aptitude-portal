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

function StatCard({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <p className="text-sm text-gray-500">{title}</p>
      <h3 className="text-2xl font-bold text-gray-900 mt-1">{value}</h3>
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
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px] text-gray-500">
        Loading…
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        Dashboard Overview
      </h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Tests Attempted" value={stats?.testsAttempted ?? 0} />
        <StatCard
          title="Average Score"
          value={stats?.averageScore != null ? `${stats.averageScore}%` : "—"}
        />
        <StatCard title="Available Tests" value={tests.length} />
      </div>

      {/* Available Tests */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Available Tests
        </h3>
        {tests.length === 0 ? (
          <p className="text-gray-500">No tests available at the moment.</p>
        ) : (
          <div className="space-y-3">
            {tests.slice(0, 5).map((t) => (
              <div
                key={t.id}
                className="flex justify-between items-center border border-gray-100 rounded-lg p-4 hover:bg-gray-50"
              >
                <div>
                  <p className="font-medium text-gray-900">{t.name}</p>
                  <p className="text-sm text-gray-500">
                    Created: {new Date(t.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <Link
                  href={`/student/tests/${t.id}`}
                  className="px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700"
                >
                  Start Test
                </Link>
              </div>
            ))}
          </div>
        )}
        {tests.length > 0 && (
          <Link
            href="/student/tests"
            className="inline-block mt-4 text-emerald-600 hover:underline text-sm font-medium"
          >
            View all tests →
          </Link>
        )}
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-4">
        <Link
          href="/student/tests"
          className="px-5 py-2.5 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700"
        >
          All Tests
        </Link>
        <Link
          href="/student/practice"
          className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
        >
          Practice
        </Link>
        <Link
          href="/student/analytics"
          className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
        >
          Analytics
        </Link>
      </div>
    </div>
  );
}
