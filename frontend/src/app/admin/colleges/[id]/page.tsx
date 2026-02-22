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
        setError(err?.response?.data?.message || "Failed to load college")
      )
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="text-gray-500">Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!college) return null;

  return (
    <div className="space-y-6">
      {/* Back */}
      <Link
        href="/admin/colleges"
        className="text-sm text-gray-500 hover:underline"
      >
        ← Back to Colleges
      </Link>

      {/* Title */}
      <h2 className="text-2xl font-semibold">
        {college.collegeName}
      </h2>

      {/* College Info */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">
          College Information
        </h3>

        <table className="w-full border-collapse">
          <tbody className="divide-y">
            <tr>
              <td className="py-2 text-gray-500 w-40">Type</td>
              <td className="py-2">{college.collegeType}</td>
            </tr>

            <tr>
              <td className="py-2 text-gray-500">Address</td>
              <td className="py-2">{college.address || "—"}</td>
            </tr>

            <tr>
              <td className="py-2 text-gray-500">Contact Person</td>
              <td className="py-2">{college.contactPerson || "—"}</td>
            </tr>

            <tr>
              <td className="py-2 text-gray-500">Contact Email</td>
              <td className="py-2">{college.contactEmail}</td>
            </tr>

            <tr>
              <td className="py-2 text-gray-500">Mobile</td>
              <td className="py-2">{college.mobile}</td>
            </tr>

            <tr>
              <td className="py-2 text-gray-500">Max Students</td>
              <td className="py-2">{college.maxStudents}</td>
            </tr>

            <tr>
              <td className="py-2 text-gray-500">Approved</td>
              <td className="py-2">{college.isApproved ? "Yes" : "No"}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Departments */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">
          Departments
        </h3>

        {departments.length === 0 ? (
          <p className="text-gray-500">No departments yet.</p>
        ) : (
          <ul className="divide-y">
            {departments.map((d) => (
              <li key={d.id} className="py-3">
                {d.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}