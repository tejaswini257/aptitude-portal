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

  if (loading) return <p className="text-gray-500">Loading companies...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Companies</h2>

        <Link href="/admin/companies/add" className="btn-primary w-auto px-4">
          Add Company
        </Link>
      </div>

      {/* Empty */}
      {companies.length === 0 ? (
        <p className="text-gray-500">No companies yet.</p>
      ) : (
        <div className="card p-0 overflow-hidden">
          <table className="w-full border-collapse">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Created
                </th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {companies.map((c) => (
                <tr
                  key={c.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() =>
                    window.location.assign(`/admin/companies/${c.id}`)
                  }
                >
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/companies/${c.id}`}
                      className="text-blue-600 font-medium hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {c.name}
                    </Link>
                  </td>

                  <td className="px-4 py-3">{c.type}</td>

                  <td className="px-4 py-3">
                    {new Date(c.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}