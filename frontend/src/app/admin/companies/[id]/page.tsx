"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import api from "@/interceptors/axios";

type Company = {
  id: string;
  name: string;
  type: string;
  createdAt: string;
};

export default function CompanyDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    api
      .get(`/companies/${id}`)
      .then((res) => setCompany(res.data))
      .catch((err) =>
        setError(err?.response?.data?.message || "Failed to load company")
      )
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "#dc2626" }}>{error}</p>;
  if (!company) return null;

  const cardStyle = {
    background: "#fff",
    padding: "24px",
    borderRadius: "12px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
    marginBottom: "24px",
  };

  return (
    <>
      <div style={{ marginBottom: "24px" }}>
        <Link
          href="/admin/companies"
          style={{ color: "#64748b", textDecoration: "none", fontSize: "14px" }}
        >
          ← Back to Companies
        </Link>
      </div>
      <h2 style={{ fontSize: "26px", fontWeight: 600, marginBottom: "24px" }}>
        {company.name}
      </h2>

      <div style={cardStyle}>
        <h3 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "16px" }}>
          Company Information
        </h3>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <tbody>
            <tr style={{ borderBottom: "1px solid #e2e8f0" }}>
              <td style={{ padding: "10px 0", color: "#64748b", width: "160px" }}>Name</td>
              <td style={{ padding: "10px 0" }}>{company.name}</td>
            </tr>
            <tr style={{ borderBottom: "1px solid #e2e8f0" }}>
              <td style={{ padding: "10px 0", color: "#64748b" }}>Type</td>
              <td style={{ padding: "10px 0" }}>{company.type}</td>
            </tr>
            <tr style={{ borderBottom: "1px solid #e2e8f0" }}>
              <td style={{ padding: "10px 0", color: "#64748b" }}>Created</td>
              <td style={{ padding: "10px 0" }}>
                {new Date(company.createdAt).toLocaleString()}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
