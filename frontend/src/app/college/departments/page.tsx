"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Building2, CalendarDays, GraduationCap, Pencil, Trash2 } from "lucide-react";
import api from "@/interceptors/axios";

type Department = {
  id: string;
  name: string;
  collegeId: string;
  createdAt: string;
};

type ApiErrorShape = {
  message?: string;
  response?: {
    data?: {
      message?: string;
    };
  };
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
    void fetchDepartments();
  }, [router]);

  const fetchDepartments = async () => {
    try {
      const colleges = await api.get("/colleges");
      const collegeId = colleges?.data?.[0]?.id as string | undefined;

      if (!collegeId) {
        throw new Error("No college found");
      }

      const res = await api.get(`/departments?collegeId=${collegeId}`);
      setDepartments(Array.isArray(res.data) ? res.data : []);
      setError("");
    } catch (err: unknown) {
      const e = err as ApiErrorShape;
      setError(e?.response?.data?.message || e?.message || "Failed to load departments");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm("Delete this department?");
    if (!confirmed) return;

    try {
      await api.delete(`/departments/${id}`);
      setDepartments((prev) => prev.filter((department) => department.id !== id));
    } catch (err: unknown) {
      const e = err as ApiErrorShape;
      window.alert(e?.response?.data?.message || e?.message || "Delete failed");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[220px] text-secondary">
        Loading departments...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[220px] text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="page space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">Departments</h1>
          <p className="page-subtitle">Manage all departments under your college.</p>
        </div>

        <button onClick={() => router.push("/college/departments/create")} className="btn btn-primary">
          + Add Department
        </button>
      </div>

      {departments.length === 0 && (
        <div className="card empty-state">
          <p className="text-lg font-medium text-primary">No departments found</p>
          <p className="mt-1">Start by adding your first department.</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {departments.map((department) => (
          <article
            key={department.id}
            className="card card-link p-0 overflow-hidden hover:shadow-md transition"
          >
            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-2 text-sm text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full">
                  <Building2 size={14} />
                  <span>Department</span>
                </div>
              </div>

              <h2 className="text-2xl font-bold leading-tight">{department.name}</h2>

              <div className="flex items-center gap-2 text-sm text-secondary">
                <CalendarDays size={14} />
                <span>Created: {new Date(department.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="px-5 py-4 border-t bg-slate-50/80 flex items-center justify-between gap-2">
              <Link href={`/college/departments/${department.id}/students`} className="btn btn-secondary">
                <GraduationCap size={15} />
                <span>Students</span>
              </Link>

              <div className="flex items-center gap-2">
                <Link href={`/college/departments/${department.id}/edit`} className="btn btn-secondary">
                  <Pencil size={14} />
                  <span>Edit</span>
                </Link>
                <button onClick={() => void handleDelete(department.id)} className="btn btn-danger">
                  <Trash2 size={14} />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
