"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/interceptors/axios";

type College = {
  id: string;
  collegeName: string;
  collegeType: string;
  address: string;
  contactPerson: string;
  contactEmail: string;
  mobile: string;
  maxStudents: number;
  isApproved: boolean;
  orgId: string;
};

type Department = {
  id: string;
  name: string;
  collegeId: string;
};

export default function CollegeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [college, setCollege] = useState<College | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    Promise.all([
      api.get(`/colleges/${id}`),
      api.get(`/departments?collegeId=${id}`),
    ])
      .then(([colRes, deptRes]) => {
        setCollege(colRes.data);
        setDepartments(Array.isArray(deptRes.data) ? deptRes.data : []);
      })
      .catch((err) =>
        setError(
          err?.response?.data?.message || "Failed to load college"
        )
      )
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "#dc2626" }}>{error}</p>;
  if (!college) return null;

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
          href="/admin/colleges"
          style={{ color: "#64748b", textDecoration: "none", fontSize: "14px" }}
        >
          ← Back to Colleges
        </Link>
      </div>
      <h2 style={{ fontSize: "26px", fontWeight: 600, marginBottom: "24px" }}>
        {college.collegeName}
      </h2>

      <div style={cardStyle}>
        <h3 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "16px" }}>
          College Information
        </h3>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <tbody>
            <tr style={{ borderBottom: "1px solid #e2e8f0" }}>
              <td style={{ padding: "10px 0", color: "#64748b", width: "160px" }}>Type</td>
              <td style={{ padding: "10px 0" }}>{college.collegeType}</td>
            </tr>
            <tr style={{ borderBottom: "1px solid #e2e8f0" }}>
              <td style={{ padding: "10px 0", color: "#64748b" }}>Address</td>
              <td style={{ padding: "10px 0" }}>{college.address || "—"}</td>
            </tr>
            <tr style={{ borderBottom: "1px solid #e2e8f0" }}>
              <td style={{ padding: "10px 0", color: "#64748b" }}>Contact Person</td>
              <td style={{ padding: "10px 0" }}>{college.contactPerson || "—"}</td>
            </tr>
            <tr style={{ borderBottom: "1px solid #e2e8f0" }}>
              <td style={{ padding: "10px 0", color: "#64748b" }}>Contact Email</td>
              <td style={{ padding: "10px 0" }}>{college.contactEmail}</td>
            </tr>
            <tr style={{ borderBottom: "1px solid #e2e8f0" }}>
              <td style={{ padding: "10px 0", color: "#64748b" }}>Mobile</td>
              <td style={{ padding: "10px 0" }}>{college.mobile}</td>
            </tr>
            <tr style={{ borderBottom: "1px solid #e2e8f0" }}>
              <td style={{ padding: "10px 0", color: "#64748b" }}>Max Students</td>
              <td style={{ padding: "10px 0" }}>{college.maxStudents}</td>
            </tr>
            <tr style={{ borderBottom: "1px solid #e2e8f0" }}>
              <td style={{ padding: "10px 0", color: "#64748b" }}>Approved</td>
              <td style={{ padding: "10px 0" }}>{college.isApproved ? "Yes" : "No"}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style={cardStyle}>
        <h3 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "16px" }}>
          Departments
        </h3>
        {departments.length === 0 ? (
          <p style={{ color: "#64748b" }}>No departments yet.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {departments.map((d) => (
              <li
                key={d.id}
                style={{
                  padding: "12px 0",
                  borderBottom: "1px solid #e2e8f0",
                }}
              >
                {d.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
