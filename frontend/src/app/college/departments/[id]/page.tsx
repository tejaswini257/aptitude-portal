"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
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

export default function DepartmentDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [department, setDepartment] = useState<Department | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDepartment();
  }, []);

  const fetchDepartment = async () => {
    try {
      const data = await api(`/departments/${id}`);
      setDepartment(data);
    } catch (err: any) {
      setError(err.message || "Failed to load department");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-gray-500">Loading department...</div>;
  }

  if (error || !department) {
    return <div className="p-8 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold text-gray-900">
          {department.name}
        </h1>

        <button
          onClick={() => router.push(`/college/departments/${id}/edit`)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Edit Department
        </button>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InfoCard label="Status" value={department.status || "Active"} />
        <InfoCard label="Total Students" value={department.studentsCount} />
        <InfoCard label="Verified Students" value={department.verifiedCount} />
        <InfoCard label="Active Tests" value={department.activeTests} />
      </div>

      {/* Placement */}
      <div className="mt-8">
        <h2 className="text-lg font-medium mb-2">Placement</h2>
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Placement Rate</span>
          <span>{department.placement ?? 0}%</span>
        </div>
        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500"
            style={{ width: `${department.placement ?? 0}%` }}
          />
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="mt-10 flex gap-4">
        <button
          onClick={() => router.back()}
          className="px-4 py-2 border rounded-lg hover:bg-gray-100"
        >
          ← Back
        </button>

        <button
          onClick={async () => {
            if (!confirm("Delete this department?")) return;
            await api(`/departments/${id}`, { method: "DELETE" });
            router.push("/college/departments");
          }}
          className="px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50"
        >
          Delete Department
        </button>
      </div>
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: any }) {
  return (
    <div className="bg-white border rounded-xl p-6 shadow-sm">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className="text-xl font-semibold text-gray-900">{value}</p>
    </div>
  );
}
