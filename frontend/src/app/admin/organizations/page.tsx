"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

type Organization = {
  id: string;
  name: string;
  type: "COLLEGE" | "COMPANY";
  createdAt: string;
};

export default function OrganizationsPage() {
  const router = useRouter();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrganizations = async () => {
    try {
      const data = await api("/organizations");
      setOrganizations(data);
    } catch (err: any) {
      setError(err.message || "Failed to load organizations");
    } finally {
      setLoading(false);
    }
  };

  const deleteOrganization = async (id: string) => {
    if (!confirm("Delete this organization? This action cannot be undone.")) return;

    await api(`/organizations/${id}`, { method: "DELETE" });
    setOrganizations((prev) => prev.filter((o) => o.id !== id));
  };

  useEffect(() => {
    fetchOrganizations();
  }, []);

  if (loading) return <p className="status">Loading organizations…</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="container">
      <div className="header">
        <h2>Organizations</h2>
        <button
          className="primary-btn"
          onClick={() => router.push("/admin/organizations/create")}
        >
          + Add Organization
        </button>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Created</th>
              <th className="actions-col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {organizations.map((org) => (
              <tr key={org.id}>
                <td className="name">{org.name}</td>
                <td>
                  <span className={`badge ${org.type.toLowerCase()}`}>
                    {org.type}
                  </span>
                </td>
                <td>{new Date(org.createdAt).toLocaleDateString()}</td>
                <td className="actions">
                  <button
                    className="secondary-btn"
                    onClick={() =>
                      router.push(`/admin/organizations/edit/${org.id}`)
                    }
                  >
                    Edit
                  </button>
                  <button
                    className="danger-btn"
                    onClick={() => deleteOrganization(org.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {organizations.length === 0 && (
          <div className="empty">
            No organizations found.
          </div>
        )}
      </div>

      <style jsx>{`
        .container {
          padding: 24px 32px;
          max-width: 100%;
          
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        h2 {
          font-size: 24px;
          font-weight: 600;
          color: #1f2937;
        }

        .primary-btn {
          background: #2563eb;
          color: white;
          border: none;
          padding: 10px 16px;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
        }

        .primary-btn:hover {
          background: #1e40af;
        }

        .table-wrapper {
          background: white;
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid #e5e7eb;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        thead {
          background: #f9fafb;
        }

        th {
          text-align: left;
          padding: 14px 16px;
          font-size: 13px;
          font-weight: 600;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        td {
          padding: 14px 16px;
          font-size: 14px;
          color: #374151;
          border-top: 1px solid #e5e7eb;
        }

        tr:hover {
          background: #f9fafb;
        }

        .name {
          font-weight: 500;
        }

        .badge {
          padding: 4px 10px;
          font-size: 12px;
          border-radius: 999px;
          font-weight: 500;
        }

        .badge.college {
          background: #ecfeff;
          color: #0369a1;
        }

        .badge.company {
          background: #f0fdf4;
          color: #15803d;
        }

        .actions {
          display: flex;
          gap: 8px;
        }

        .secondary-btn {
          background: #f3f4f6;
          border: 1px solid #e5e7eb;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 13px;
          cursor: pointer;
        }

        .secondary-btn:hover {
          background: #e5e7eb;
        }

        .danger-btn {
          background: #fee2e2;
          color: #b91c1c;
          border: 1px solid #fecaca;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 13px;
          cursor: pointer;
        }

        .danger-btn:hover {
          background: #fecaca;
        }

        .status {
          padding: 24px;
          text-align: center;
          color: #6b7280;
        }

        .error {
          padding: 24px;
          color: #b91c1c;
          background: #fee2e2;
          border-radius: 6px;
        }

        .empty {
          padding: 24px;
          text-align: center;
          color: #6b7280;
          font-size: 14px;
        }
      `}</style>
    </div>
  );
}
