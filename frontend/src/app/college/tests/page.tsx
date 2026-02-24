"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/interceptors/axios";
import { toast } from "react-hot-toast";

type TestItem = {
  id: string;
  name: string;
  createdAt: string;
  showResultImmediately: boolean;
  attemptCount?: number;
  isPublished: boolean;
  isActive: boolean;
};

type ApiErrorShape = {
  response?: {
    data?: {
      message?: string;
    };
  };
};

export default function CollegeTestsPage() {
  const router = useRouter();

  const [tests, setTests] = useState<TestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ================= Fetch Tests =================
  const fetchTests = async () => {
    try {
      const res = await api.get("/tests?withAttemptCount=true");
      setTests(Array.isArray(res.data) ? res.data : []);
    } catch (err: unknown) {
      const e = err as ApiErrorShape;
      setError(e?.response?.data?.message || "Failed to load tests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTests();
  }, []);

  if (loading) return <p className="text-secondary">Loading tests...</p>;

  return (
    <div className="page space-y-6">
      {/* ================= HEADER ================= */}
      <div className="page-header">
        <div>
          <h2 className="page-title">Manage Tests</h2>
          <p className="page-subtitle">
            Create, configure, and publish assessments.
          </p>
        </div>

        <button
          onClick={() => router.push("/college/tests/create")}
          className="btn btn-primary"
        >
          Create Test
        </button>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      {/* ================= TABLE ================= */}
      <div className="table-card">
        <table className="table w-full">
          <thead>
            <tr>
              <th className="table-head">Name</th>
              <th className="table-head">Attempts</th>
              <th className="table-head">Status</th>
              <th className="table-head">Action</th>
            </tr>
          </thead>

          <tbody>
            {tests.length === 0 ? (
              <tr>
                <td className="table-cell" colSpan={4}>
                  No tests found
                </td>
              </tr>
            ) : (
              tests.map((t) => (
                <tr key={t.id} className="table-row">
                  <td className="table-cell">{t.name}</td>

                  <td className="table-cell">{t.attemptCount ?? 0}</td>

                  <td className="table-cell">
                    {t.isPublished ? (
                      <span className="badge-success">Published</span>
                    ) : (
                      <span className="badge-warning">Draft</span>
                    )}
                  </td>

                  <td className="table-cell">
                    <Link
                      href={`/college/tests/${t.id}`}
                      className="btn btn-primary"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}