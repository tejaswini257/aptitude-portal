"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/interceptors/axios";

type College = {
  id: string;
  collegeName: string;
  collegeType: string;
  isApproved: boolean;
};

export default function AdminCollegesPage() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/colleges")
      .then((res) => setColleges(Array.isArray(res.data) ? res.data : []))
      .catch((err) =>
        setError(
          err?.response?.data?.message ||
            (err?.response?.status === 403
              ? "Access denied."
              : "Failed to load colleges")
        )
      )
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-gray-500">Loading colleges...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Colleges</h2>

        <Link href="/admin/colleges/add" className="btn-primary w-auto px-4">
          Add College
        </Link>
      </div>

      {/* Empty */}
      {colleges.length === 0 ? (
        <p className="text-gray-500">No colleges yet.</p>
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
                  Approved
                </th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {colleges.map((c) => (
                <tr
                  key={c.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() =>
                    window.location.assign(`/admin/colleges/${c.id}`)
                  }
                >
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/colleges/${c.id}`}
                      className="text-blue-600 font-medium hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {c.collegeName}
                    </Link>
                  </td>

                  <td className="px-4 py-3">{c.collegeType}</td>

                  <td className="px-4 py-3">
                    {c.isApproved ? "Yes" : "No"}
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