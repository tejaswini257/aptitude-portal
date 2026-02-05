"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { useRouter } from "next/navigation";

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
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  const fetchDepartments = async () => {
    try {
      const colleges = await api("/colleges");
      const collegeId = colleges[0]?.id;

      if (!collegeId) {
        throw new Error("No college found");
      }

      const data = await api(`/departments?collegeId=${collegeId}`);
      setDepartments(data);
    } catch (err: any) {
      setError(err.message || "Failed to load departments");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    // 🔐 Guard: no token → go to login
    if (!token) {
      router.replace("/login");
      return;
    }

    fetchDepartments();
  }, [router]);

  if (loading) {
    return <div className="page text-gray-500">Loading departments...</div>;
  }

  if (error) {
    return <div className="page text-red-500">Failed to load: {error}</div>;
  }

  return (
    <div className="page">
      <div className="flex justify-between items-center mb-6">
        <h1 className="page-title">Departments</h1>

        <button
          onClick={() => router.push("/college/departments/create")}
          className="btn btn-primary"
        >
          + Add Department
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {departments.map((d) => (
          <div key={d.id} className="flex justify-center">
            <div className="department-card">
              {/* Header */}
              <div className="p-5">
                <div className="flex justify-between items-center mb-3">
                  <span className="department-badge">
                    {d.status}
                  </span>
                  <span className="text-sm text-gray-400">#{d.id}</span>
                </div>

                <h2 className="font-semibold text-lg mb-2">{d.name}</h2>

                <div className="department-meta">
                  <div>{d.studentsCount} Students</div>
                  <div>{d.verifiedCount} Verified</div>
                  <div>{d.activeTests} Active Tests</div>
                </div>

                {/* Placement bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Placement</span>
                    <span>{d.placement}%</span>
                  </div>
                  <div className="progress-track">
                    <div
                      className="progress-fill"
                      style={{ width: `${d.placement}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-auto flex justify-between items-center px-5 py-4 border-t dark:border-[#1f2937]">
                <Link
                  href={`/college/departments/${d.id}`}
                  className="btn-link"
                >
                  Open →
                </Link>

                <Link
                  href={`/college/departments/${d.id}/students`}
                  className="btn-link"
                >
                  Students
                </Link>

                <button
                  onClick={async () => {
                    if (!confirm("Delete this department?")) return;

                    try {
                      await api(`/departments/${d.id}`, {
                        method: "DELETE",
                      });

                      setDepartments((prev) =>
                        prev.filter((item) => item.id !== d.id)
                      );
                    } catch (err: any) {
                      alert(err.message || "Failed to delete department");
                    }
                  }}
                  className="btn btn-danger"
                >
                  Delete
                </button>

                <button
                  onClick={() =>
                    router.push(`/college/departments/${d.id}`)
                  }
                  className="btn-link"
                >
                  Edit
                </button>
              </div>

              <div className="h-1 bg-green-500" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}