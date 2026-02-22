"use client";

import { useEffect, useState } from "react";
import api from "@/interceptors/axios";

type Test = {
  id: string;
  name: string;
  createdAt: string;
  showResultImmediately: boolean;
  proctoringEnabled: boolean;
};

export default function CompanyTestsPage() {
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      const res = await api.get("/tests");
      setTests(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Tests fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTest = async () => {
    try {
      await api.post("/tests", {
        name: "New Test",
        rulesId: "PUT_VALID_RULE_ID_HERE",
        showResultImmediately: false,
        proctoringEnabled: false,
      });

      fetchTests();
    } catch (err) {
      console.error("Create error:", err);
    }
  };

  if (loading) return <p className="text-gray-500">Loading tests...</p>;

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">Company Tests</h2>

        <button onClick={handleCreateTest} className="btn-primary">
          + Create Test
        </button>
      </div>

      <div className="table-card">
        {tests.length === 0 ? (
          <p className="p-6 text-gray-500">No tests created yet.</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-head">Name</th>
                <th className="table-head">Proctoring</th>
                <th className="table-head">Result Mode</th>
                <th className="table-head">Created</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {tests.map((test) => (
                <tr key={test.id} className="table-row">
                  <td className="table-cell">{test.name}</td>

                  <td className="table-cell">
                    <span
                      className={
                        test.proctoringEnabled
                          ? "badge-success"
                          : "badge-warning"
                      }
                    >
                      {test.proctoringEnabled
                        ? "Enabled"
                        : "Disabled"}
                    </span>
                  </td>

                  <td className="table-cell">
                    {test.showResultImmediately
                      ? "Immediate"
                      : "After Evaluation"}
                  </td>

                  <td className="table-cell">
                    {new Date(test.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}