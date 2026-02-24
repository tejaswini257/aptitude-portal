"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/interceptors/axios";

type Student = {
  id: string;
  rollNo: string;
  year: number;
  user?: { email: string };
  department?: { id: string; name: string };
};

export default function StudentsPage() {
  const router = useRouter();

  const [students, setStudents] = useState<Student[]>([]);
  const [departments, setDepartments] = useState<
    { id: string; name: string }[]
  >([]);

  const [search, setSearch] = useState("");
  const [selectedDept, setSelectedDept] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch all students + departments
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentsRes, deptRes] = await Promise.all([
          api.get("/students"),
          api.get("/departments"),
        ]);

        setStudents(studentsRes.data || []);
        setDepartments(deptRes.data || []);
      } catch (err: any) {
        setError("Failed to load students");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filtering logic
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchesSearch =
        s.user?.email
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        s.department?.name
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        String(s.year).includes(search);

      const matchesDept = selectedDept
        ? s.department?.id === selectedDept
        : true;

      const matchesYear = selectedYear
        ? String(s.year) === selectedYear
        : true;

      return matchesSearch && matchesDept && matchesYear;
    });
  }, [students, search, selectedDept, selectedYear]);

  // Delete student
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this student?")) return;

    try {
      await api.delete(`/students/${id}`);

      setStudents((prev) =>
        prev.filter((s) => s.id !== id)
      );
    } catch (err: any) {
      alert(
        err.response?.data?.message ||
        "Failed to delete student"
      );
    }
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  return (
    <div className="page space-y-6">
      <div className="page-header">
        <div>
          <h2 className="page-title">Students</h2>
          <p className="page-subtitle">Manage your college students and their details.</p>
        </div>
        <Link
          href="/college/students/add"
          className="btn btn-primary"
        >
          Add Student
        </Link>
      </div>

      {/* Filters Section */}
      <div className="flex flex-wrap gap-4 mb-6">
        {/* Search */}
        <input
          placeholder="Search by email, department, year..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded w-64"
        />

        {/* Department Filter */}
        <select
          value={selectedDept}
          onChange={(e) => setSelectedDept(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="">All Departments</option>
          {departments.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>

        {/* Year Filter */}
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="">All Years</option>
          <option value="1">Year 1</option>
          <option value="2">Year 2</option>
          <option value="3">Year 3</option>
          <option value="4">Year 4</option>
        </select>
      </div>

      <div className="table-card">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="table-head">Email</th>
              <th className="table-head">Roll No</th>
              <th className="table-head">Year</th>
              <th className="table-head">Department</th>
              <th className="table-head text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredStudents.length === 0 ? (
              <tr>
                <td colSpan={5} className="empty-state">
                  No students yet.
                </td>
              </tr>
            ) : (
              filteredStudents.map((s) => (
                <tr key={s.id} className="table-row">
                  <td className="table-cell font-medium">{s.user?.email ?? "—"}</td>
                  <td className="table-cell">{s.rollNo}</td>
                  <td className="table-cell">{s.year}</td>
                  <td className="table-cell">{s.department?.name ?? "—"}</td>
                  <td className="table-cell text-center flex gap-2 justify-center">
                    <Link
                      href={`/college/departments/${s.department?.id}/students/${s.id}/edit`}
                      className="table-link mr-2 text-blue-600 hover:underline"
                    >
                      Edit
                    </Link>

                    <button
                      onClick={() =>
                        handleDelete(s.id)
                      }
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
