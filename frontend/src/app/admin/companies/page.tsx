"use client";

import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/interceptors/axios";
import { toast } from "react-hot-toast";

type Company = {
  id: string;
  name: string;
  type: string;
  createdAt: string;
  users?: Array<{ id: string; email: string }>;
};

type ApiErrorShape = {
  response?: {
    data?: {
      message?: string;
    };
    status?: number;
  };
};

export default function AdminCompaniesPage() {
  const router = useRouter();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchCompanies = async () => {
    try {
      const res = await api.get("/companies");
      setCompanies(Array.isArray(res.data) ? res.data : []);
      setError("");
    } catch (err: unknown) {
      const e = err as ApiErrorShape;
      setError(
        e?.response?.data?.message ||
        (e?.response?.status === 403 ? "Access denied." : "Failed to load companies")
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const filteredCompanies = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return companies;
    return companies.filter((company) => {
      const companyName = company.name.toLowerCase();
      const adminEmails = company.users?.map((user) => user.email.toLowerCase()).join(" ") ?? "";
      return companyName.includes(term) || adminEmails.includes(term);
    });
  }, [companies, query]);

  const handleDelete = async (company: Company) => {
    const confirmed = window.confirm(`Delete ${company.name}? This action cannot be undone.`);
    if (!confirmed) return;

    setDeletingId(company.id);
    try {
      await api.delete(`/companies/${company.id}`);
      setCompanies((prev) => prev.filter((c) => c.id !== company.id));
    } catch (err: unknown) {
      const e = err as ApiErrorShape;
      toast.error(e?.response?.data?.message || "Failed to delete company.");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <p className="text-secondary">Loading companies...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="page space-y-6">
      <div className="page-header">
        <div>
          <h2 className="page-title">Companies</h2>
          <p className="page-subtitle">Manage recruiter organizations and their admin accounts.</p>
        </div>

        <Link href="/admin/companies/add" className="btn btn-primary">
          Add Company
        </Link>
      </div>

      <div className="card">
        <div className="grid gap-4 md:grid-cols-[1fr_auto]">
          <input
            className="input"
            placeholder="Search by company name or admin email"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <div className="text-sm text-secondary flex items-center">
            Total: <strong className="ml-1 text-primary">{filteredCompanies.length}</strong>
          </div>
        </div>
      </div>

      <div className="table-card">
        <div className="table-toolbar">
          <h3 className="font-semibold">Company Directory</h3>
        </div>

        {filteredCompanies.length === 0 ? (
          <p className="empty-state">No companies found.</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-head">Company</th>
                <th className="table-head">Type</th>
                <th className="table-head">Admin Accounts</th>
                <th className="table-head">Created</th>
                <th className="table-head">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCompanies.map((company) => (
                <tr
                  key={company.id}
                  className="table-row"
                  onClick={() => router.push(`/admin/companies/${company.id}`)}
                >
                  <td className="table-cell">
                    <div className="font-semibold">{company.name}</div>
                  </td>
                  <td className="table-cell">{company.type}</td>
                  <td className="table-cell">{company.users?.length ?? 0}</td>
                  <td className="table-cell">
                    {new Date(company.createdAt).toLocaleDateString()}
                  </td>
                  <td className="table-cell">
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/companies/${company.id}`}
                        className="btn btn-secondary"
                        onClick={(event) => event.stopPropagation()}
                      >
                        View
                      </Link>
                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={(event) => {
                          event.stopPropagation();
                          void handleDelete(company);
                        }}
                        disabled={deletingId === company.id}
                      >
                        {deletingId === company.id ? "Deleting..." : "Delete"}
                      </button>
                    </div>
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
