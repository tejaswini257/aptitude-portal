"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/interceptors/axios";

type Company = {
  id: string;
  name: string;
  type: string;
  createdAt: string;
  users?: Array<{
    id: string;
    email: string;
  }>;
};

type ApiErrorShape = {
  response?: {
    data?: {
      message?: string;
    };
  };
};

export default function CompanyDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params?.id;

  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!id) return;

    api
      .get(`/companies/${id}`)
      .then((res) => setCompany(res.data as Company))
      .catch((err: ApiErrorShape) => {
        setError(err?.response?.data?.message || "Failed to load company.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!company) return;
    const confirmed = window.confirm(`Delete ${company.name}? This action cannot be undone.`);
    if (!confirmed) return;

    setDeleting(true);
    try {
      await api.delete(`/companies/${company.id}`);
      router.push("/admin/companies");
    } catch (err: unknown) {
      const e = err as ApiErrorShape;
      setError(e?.response?.data?.message || "Failed to delete company.");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <p className="text-secondary">Loading company...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!company) return <p className="text-secondary">Company not found.</p>;

  return (
    <div className="page space-y-6">
      <div className="page-header">
        <div>
          <h2 className="page-title">{company.name}</h2>
          <p className="page-subtitle">Company profile and admin access details.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/companies" className="btn btn-secondary">
            Back
          </Link>
          <button type="button" className="btn btn-danger" disabled={deleting} onClick={() => void handleDelete()}>
            {deleting ? "Deleting..." : "Delete Company"}
          </button>
        </div>
      </div>

      <div className="card">
        <h3 className="font-semibold text-lg mb-4">Company Information</h3>
        <div className="detail-row">
          <span className="detail-label">Name</span>
          <span className="detail-value">{company.name}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Type</span>
          <span className="detail-value">{company.type}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Created</span>
          <span className="detail-value">{new Date(company.createdAt).toLocaleString()}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Admin Accounts</span>
          <span className="detail-value">{company.users?.length ?? 0}</span>
        </div>
      </div>

      <div className="table-card">
        <div className="table-toolbar">
          <h3 className="font-semibold">Admin Users</h3>
        </div>
        {!company.users || company.users.length === 0 ? (
          <p className="empty-state">No admin users found.</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-head">Email</th>
                <th className="table-head">User ID</th>
              </tr>
            </thead>
            <tbody>
              {company.users.map((user) => (
                <tr key={user.id} className="table-row">
                  <td className="table-cell">{user.email}</td>
                  <td className="table-cell">{user.id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
