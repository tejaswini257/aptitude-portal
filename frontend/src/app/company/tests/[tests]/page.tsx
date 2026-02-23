"use client";

import { useEffect, useState } from "react";
import api from "@/interceptors/axios";
import { useParams } from "next/navigation";

type CompanyTestDetail = {
  id: string;
  name: string;
  showResultImmediately: boolean;
  proctoringEnabled: boolean;
  createdAt?: string;
};

export default function SingleTestPage() {
  const { tests } = useParams<{ tests: string }>();
  const [test, setTest] = useState<CompanyTestDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!tests) return;

    const fetchTest = async () => {
      try {
        const res = await api.get(`/company/tests/${tests}`);
        setTest(res.data as CompanyTestDetail);
      } catch (err) {
        console.error("Single test error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTest();
  }, [tests]);

  if (loading) return <p className="text-secondary">Loading test...</p>;
  if (!test) return <p className="text-red-500">Test not found.</p>;

  return (
    <div className="page space-y-6">
      <h2 className="page-title">{test.name}</h2>

      <div className="card">
        <div className="detail-row">
          <span className="detail-label">Proctoring</span>
          <span className="detail-value">
            <span className={test.proctoringEnabled ? "badge-success" : "badge-warning"}>
              {test.proctoringEnabled ? "Enabled" : "Disabled"}
            </span>
          </span>
        </div>

        <div className="detail-row">
          <span className="detail-label">Result Mode</span>
          <span className="detail-value">
            {test.showResultImmediately ? "Immediate" : "After Evaluation"}
          </span>
        </div>

        {test.createdAt && (
          <div className="detail-row">
            <span className="detail-label">Created On</span>
            <span className="detail-value">{new Date(test.createdAt).toLocaleString()}</span>
          </div>
        )}
      </div>
    </div>
  );
}
