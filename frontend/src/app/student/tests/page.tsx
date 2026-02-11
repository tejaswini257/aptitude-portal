"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/interceptors/axios";
import TestCard from "../components/TestCard";

type TestItem = {
  id: string;
  name: string;
  createdAt: string;
  showResultImmediately?: boolean;
};

export default function TestsPage() {
  const router = useRouter();
  const [tests, setTests] = useState<TestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTests = async () => {
    try {
      const res = await api.get("/tests");
      setTests(res.data || []);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to load tests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTests();
  }, []);

  if (loading) {
    return <div className="p-6">Loading tests...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Available Tests</h1>

      {tests.length === 0 && (
        <p className="text-gray-500">No tests available</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tests.map((t) => (
          <TestCard
            key={t.id}
            title={t.name}
            deadline={new Date(t.createdAt).toLocaleDateString()}
            onStart={() => router.push(`/student/tests/${t.id}`)}
          />
        ))}
      </div>
    </div>
  );
}
