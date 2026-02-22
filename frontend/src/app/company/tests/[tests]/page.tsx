"use client";

import { useEffect, useState } from "react";
import api from "@/interceptors/axios";
import { useParams } from "next/navigation";

export default function SingleTestPage() {
  const { tests } = useParams();
  const [test, setTest] = useState<any>(null);

  useEffect(() => {
    if (!tests) return;

    const fetchTest = async () => {
      try {
        const res = await api.get(`/company/tests/${tests}`);
        setTest(res.data);
      } catch (err) {
        console.error("Single test error:", err);
      }
    };

    fetchTest();
  }, [tests]);

  if (!test) return <p className="text-gray-500">Loading test...</p>;

  return (
    <div>
      <h2 className="page-title mb-6">{test.name}</h2>

      <div className="card">
        <div className="detail-row">
          <span className="detail-label">Proctoring</span>
          <span className="detail-value">
            {test.proctoringEnabled ? (
              <span className="badge-success">Enabled</span>
            ) : (
              <span className="badge-warning">Disabled</span>
            )}
          </span>
        </div>

        <div className="detail-row">
          <span className="detail-label">Result Mode</span>
          <span className="detail-value">
            {test.showResultImmediately
              ? "Immediate"
              : "After Evaluation"}
          </span>
        </div>
      </div>
    </div>
  );
}