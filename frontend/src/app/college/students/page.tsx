"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
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
    <div>
      <h1 className="text-2xl font-semibold mb-6">
        Students
      </h1>

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

      {/* Table */}
      <div className="bg-white border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="p-4">Email</th>
              <th className="p-4">Roll No</th>
              <th className="p-4">Year</th>
              <th className="p-4">Department</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredStudents.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="p-8 text-center text-gray-500"
                >
                  No students found.
                </td>
              </tr>
            ) : (
              filteredStudents.map((s) => (
                <tr
                  key={s.id}
                  className="border-t hover:bg-gray-50"
                >
                  <td className="p-4">
                    {s.user?.email}
                  </td>
                  <td className="p-4">
                    {s.rollNo}
                  </td>
                  <td className="p-4">
                    {s.year}
                  </td>
                  <td className="p-4">
                    {s.department?.name}
                  </td>

                  <td className="p-4 flex gap-4">
                    <button
                      onClick={() =>
                        router.push(
                          `/college/departments/${s.department?.id}/students/${s.id}/edit`
                        )
                      }
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>

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