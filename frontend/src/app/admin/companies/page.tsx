"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/interceptors/axios";

type Company = {
  id: string;
  name: string;
  type: string;
  createdAt: string;
};

export default function AdminCompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/companies")
      .then((res) => setCompanies(Array.isArray(res.data) ? res.data : []))
      .catch((err) =>
        setError(
          err?.response?.data?.message ||
            (err?.response?.status === 403
              ? "Access denied."
              : "Failed to load companies")
        )
      )
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading companies...</p>;
  if (error) return <p style={{ color: "#dc2626" }}>{error}</p>;

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <h2 style={{ fontSize: "26px", fontWeight: 600, margin: 0 }}>
          Companies
        </h2>
        <Link
          href="/admin/companies/add"
          style={{
            padding: "10px 20px",
            background: "#4f46e5",
            color: "#fff",
            borderRadius: "8px",
            fontWeight: 500,
            textDecoration: "none",
          }}
        >
          ADD Company
        </Link>
      </div>
      {companies.length === 0 ? (
        <p style={{ color: "#64748b" }}>No companies yet.</p>
      ) : (
        <div
          style={{
            background: "#fff",
            borderRadius: "12px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
            overflow: "hidden",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                <th style={{ padding: "12px 16px", textAlign: "left" }}>Name</th>
                <th style={{ padding: "12px 16px", textAlign: "left" }}>Type</th>
                <th style={{ padding: "12px 16px", textAlign: "left" }}>Created</th>
              </tr>
            </thead>
            <tbody>
              {companies.map((c) => (
                <tr
                  key={c.id}
                  style={{
                    borderBottom: "1px solid #e2e8f0",
                    cursor: "pointer",
                  }}
                  onClick={() => window.location.assign(`/admin/companies/${c.id}`)}
                >
                  <td style={{ padding: "12px 16px" }}>
                    <Link
                      href={`/admin/companies/${c.id}`}
                      style={{ color: "#4f46e5", textDecoration: "none", fontWeight: 500 }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {c.name}
                    </Link>
                  </td>
                  <td style={{ padding: "12px 16px" }}>{c.type}</td>
                  <td style={{ padding: "12px 16px" }}>
                    {new Date(c.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
