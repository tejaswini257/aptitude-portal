"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/interceptors/axios";


type TestItem = {
  id: string;
  name: string;
  createdAt: string;
  showResultImmediately?: boolean;
};

type ApiErrorShape = {
  response?: {
    data?: {
      message?: string;
    };
  };
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
    } catch (err: unknown) {
      const error = err as ApiErrorShape;
      setError(error?.response?.data?.message || "Failed to load tests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTests();
  }, []);

  if (loading) {
    return <div className="text-secondary">Loading tests...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="page space-y-6">
      <h1 className="page-title">Available Tests</h1>

      {tests.length === 0 && (
        <p className="text-secondary">No tests available</p>
      )}

      {tests.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tests.map((test) => (
            <div key={test.id} className="card p-5 space-y-3">
              <div>
                <h2 className="font-semibold">{test.name}</h2>
                <p className="text-sm text-secondary">
                  Published: {new Date(test.createdAt).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => router.push(`/student/tests/${test.id}`)}
                className="btn btn-primary"
              >
                Start Test
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
