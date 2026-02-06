"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";

type Department = {
  id: string;
  name: string;
  studentsCount: number;
  verifiedCount: number;
  activeTests: number;
  placement: number;
  status: string;
};

export default function DepartmentsPage() {
  const router = useRouter();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      router.replace("/login");
      return;
    }
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const colleges = await api("/colleges");
      const collegeId = colleges?.[0]?.id;
      if (!collegeId) throw new Error("No college found");

      const data = await api(`/departments?collegeId=${collegeId}`);
      setDepartments(data || []);
    } catch (err: any) {
      setError(err.message || "Failed to load departments");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this department?")) return;
    try {
      await api(`/departments/${id}`, { method: "DELETE" });
      setDepartments((prev) => prev.filter((d) => d.id !== id));
    } catch (err: any) {
      alert(err.message || "Delete failed");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading departments…
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-8 py-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">
            Departments
          </h1>
          <p className="text-gray-500 mt-1">
            Manage all departments under your college
          </p>
        </div>

        <button
          onClick={() => router.push("/college/departments/create")}
          className="px-5 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 shadow-sm transition"
        >
          + Add Department
        </button>
      </div>

      {/* Empty */}
      {departments.length === 0 && (
        <div className="text-center text-gray-500 py-24">
          <p className="text-lg font-medium">No departments found</p>
          <p className="text-sm mt-2">
            Start by adding your first department
          </p>
        </div>
      )}

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {departments.map((d) => (
          <div
            key={d.id}
            className="group bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-2xl transition overflow-hidden"
          >
            <div className="p-6">
              {/* Status */}
              <span
                className={`inline-block mb-4 px-3 py-1 text-xs rounded-full font-medium
                  ${
                    d.status === "Inactive"
                      ? "bg-red-100 text-red-600"
                      : "bg-green-100 text-green-700"
                  }`}
              >
                {d.status || "Active"}
              </span>

              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {d.name}
              </h2>

              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Students</span>
                  <span className="font-medium">{d.studentsCount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Verified</span>
                  <span className="font-medium">{d.verifiedCount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Active Tests</span>
                  <span className="font-medium">{d.activeTests}</span>
                </div>
              </div>

              {/* Placement */}
              <div className="mt-6">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Placement Rate</span>
                  <span>{d.placement ?? 0}%</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-2 bg-green-500 rounded-full transition-all"
                    style={{ width: `${d.placement ?? 0}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t flex justify-between items-center text-sm bg-gray-50">
              <Link
                href={`/college/departments/${d.id}`}
                className="text-blue-600 font-medium hover:underline"
              >
                Open
              </Link>

              <Link
                href={`/college/departments/${d.id}/edit`}
                className="text-gray-600 hover:text-gray-900"
              >
                Edit
              </Link>

              <button
                onClick={() => handleDelete(d.id)}
                className="text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
