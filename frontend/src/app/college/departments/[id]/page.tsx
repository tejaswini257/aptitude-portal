"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import api from "@/interceptors/axios";

type Department = {
  id: string;
  name: string;
  collegeId: string;
  createdAt: string;
  hodName?: string;
  email?: string;
  phone?: string;
  totalStudents?: number;
  totalFaculty?: number;
};

export default function DepartmentDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [department, setDepartment] = useState<Department | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchDepartment = async () => {
      try {
        const res = await api.get(`/departments/${id}`);
        setDepartment(res.data);
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to load department");
      } finally {
        setLoading(false);
      }
    };

    fetchDepartment();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading department...
      </div>
    );
  }

  if (error || !department) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error || "Department not found"}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-8 py-10">
      <div className="max-w-5xl mx-auto bg-white shadow rounded-2xl p-8 space-y-8">

        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">
              {department.name}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Created on{" "}
              {new Date(department.createdAt).toLocaleDateString()}
            </p>
          </div>

          <button
            onClick={() =>
              router.push(`/college/departments/${department.id}/edit`)
            }
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Edit Department
          </button>
        </div>

        {/* Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <InfoCard label="HOD Name" value={department.hodName} />

          <InfoCard label="Email" value={department.email} />

          <InfoCard label="Phone" value={department.phone} />

          <InfoCard
            label="Total Students"
            value={department.totalStudents}
          />

          <InfoCard
            label="Total Faculty"
            value={department.totalFaculty}
          />

        </div>

        {/* Footer Buttons */}
        <div className="flex gap-4 pt-6 border-t">

          <button
            onClick={() => router.push("/college/departments")}
            className="px-4 py-2 border rounded-lg hover:bg-gray-100 transition"
          >
            ← Back to Departments
          </button>

          <button
            onClick={async () => {
              if (!confirm("Delete this department?")) return;

              try {
                await api.delete(`/departments/${department.id}`);
                router.push("/college/departments");
                router.refresh();
              } catch (err: any) {
                alert(
                  err?.response?.data?.message ||
                    "Failed to delete department"
                );
              }
            }}
            className="px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition"
          >
            Delete Department
          </button>

        </div>

      </div>
    </div>
  );
}

function InfoCard({
  label,
  value,
}: {
  label: string;
  value?: string | number;
}) {
  return (
    <div className="bg-gray-50 border rounded-xl p-6">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className="text-lg font-semibold text-gray-900">
        {value ?? "—"}
      </p>
    </div>
  );
}