"use client";

import { useEffect, useState,useMemo } from "react";
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
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
const [form, setForm] = useState({
  name: "",
  hodName: "",
  email: "",
  phone: "",
  totalStudents: "",
  totalFaculty: "",
});


const filteredDepartments = useMemo(() => {
  return departments.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase())
  );
}, [search, departments]);




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
<<<<<<< HEAD
    <div className="page space-y-6">
      <div className="page-header">
        <div>
          <h2 className="page-title">Departments</h2>
          <p className="page-subtitle">Manage all departments under your college.</p>
        </div>

        <button onClick={() => router.push("/college/departments/create")} className="btn btn-primary">
          Add Department
        </button>
      </div>
=======
    <div className="min-h-screen bg-gray-50 px-8 py-10">
      {/* Header */}
      <div className="flex flex-col gap-4 mb-6">
  <div className="flex items-center justify-between">
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Departments</h1>
      <p className="text-gray-500">
        Manage all departments under your college
      </p>
    </div>

    <button
      onClick={() => router.push("/college/departments/create")}
      className="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition"
    >
      + Add Department
    </button>
  </div>

  {/* ✅ SEARCH BAR - NOW BELOW THE LINE */}
  <input
    type="text"
    placeholder="Search departments..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="border border-gray-300 rounded-lg px-4 py-2 w-full md:w-1/2"
  />
</div>

>>>>>>> d91389d827f612a3fc5abc416ed8d834194b8ae9

      {departments.length === 0 && (
        <div className="card empty-state">
          <p className="text-lg font-medium text-primary">No departments found</p>
          <p className="mt-1">Start by adding your first department.</p>
        </div>
      )}

<<<<<<< HEAD
      <div className="dashboard-grid-3">
        {departments.map((department) => (
          <article
            key={department.id}
            className="card card-link p-0 overflow-hidden flex flex-col"
          >
            <div className="p-5 flex-1 space-y-4">
              <div className="flex items-center justify-between">
                <div className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 uppercase tracking-wide">
                  <Building2 size={13} />
                  <span>Department</span>
                </div>
              </div>

              <h3 className="text-xl font-bold text-primary leading-tight">
                {department.name}
              </h3>

              <div className="flex items-center gap-1.5 text-sm text-secondary">
                <CalendarDays size={14} />
                <span>Created: {new Date(department.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="px-5 py-4 border-t border-default bg-surface flex flex-wrap items-center justify-between gap-3">
              <Link
                href={`/college/departments/${department.id}/students`}
                className="btn btn-secondary"
              >
                <GraduationCap size={15} className="mr-1.5" />
                Students
              </Link>

              <div className="flex items-center gap-2">
                <Link
                  href={`/college/departments/${department.id}/edit`}
                  className="btn btn-secondary"
                  aria-label="Edit department"
                >
                  <Pencil size={15} />
                </Link>
                <button
                  onClick={() => void handleDelete(department.id)}
                  className="btn btn-danger"
                  aria-label="Delete department"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          </article>
        ))}
=======
      {/* Department Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
  {filteredDepartments.map((d) => (
    <div
      key={d.id}
      onClick={() => router.push(`/college/departments/${d.id}`)}
      className="group bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-2xl transition overflow-hidden"
    >
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          {d.name}
        </h2>

        <p className="text-sm text-gray-500">
          Created: {new Date(d.createdAt).toLocaleDateString()}
        </p>
>>>>>>> d91389d827f612a3fc5abc416ed8d834194b8ae9
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t flex justify-between items-center text-sm bg-gray-50" onClick={(e) => e.stopPropagation()}>
        
        <Link
          href={`/college/departments/${d.id}/students`}
          className="text-blue-600 font-medium hover:underline"
        >
          View Students
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
