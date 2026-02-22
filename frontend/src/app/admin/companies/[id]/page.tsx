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

  if (loading) return <p className="text-gray-500">Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!company) return null;

  return (
    <div className="space-y-6">
      {/* Back */}
      <Link
        href="/admin/companies"
        className="text-sm text-gray-500 hover:underline"
      >
        ← Back to Companies
      </Link>

      {/* Title */}
      <h2 className="text-2xl font-semibold">{company.name}</h2>

      {/* Card */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">
          Company Information
        </h3>

        <table className="w-full border-collapse">
          <tbody className="divide-y">
            <tr>
              <td className="py-2 text-gray-500 w-40">Name</td>
              <td className="py-2">{company.name}</td>
            </tr>

            <tr>
              <td className="py-2 text-gray-500">Type</td>
              <td className="py-2">{company.type}</td>
            </tr>

            <tr>
              <td className="py-2 text-gray-500">Created</td>
              <td className="py-2">
                {new Date(company.createdAt).toLocaleString()}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}