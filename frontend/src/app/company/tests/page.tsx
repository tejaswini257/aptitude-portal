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
      const res = await api.get("/tests"); // ✅ NO /api
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
        rulesId: "PUT_VALID_RULE_ID_HERE", // must exist in DB
        showResultImmediately: false,
        proctoringEnabled: false,
      });

      fetchTests();
    } catch (err) {
      console.error("Create error:", err);
    }
  };

  if (loading) return <p>Loading tests...</p>;

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2 style={{ fontSize: "26px", fontWeight: 600 }}>
          Company Tests
        </h2>

        <button
          onClick={handleCreateTest}
          style={{
            padding: "8px 16px",
            background: "#6366f1",
            color: "#fff",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
          }}
        >
          + Create Test
        </button>
      </div>

      <div style={{ marginTop: "30px" }}>
        {tests.length === 0 ? (
          <p>No tests created yet.</p>
        ) : (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr style={{ borderBottom: "1px solid #ddd" }}>
                <th>Name</th>
                <th>Proctoring</th>
                <th>Result Mode</th>
                <th>Created</th>
              </tr>
            </thead>

            <tbody>
              {tests.map((test) => (
                <tr key={test.id}>
                  <td>{test.name}</td>
                  <td>
                    {test.proctoringEnabled ? "Enabled" : "Disabled"}
                  </td>
                  <td>
                    {test.showResultImmediately
                      ? "Immediate"
                      : "After Evaluation"}
                  </td>
                  <td>
                    {new Date(test.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
