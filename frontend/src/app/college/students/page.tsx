"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/interceptors/axios";
import styles from "./list.module.css";

type Student = {
  id: string;
  rollNo: string;
  year: number;
  user: {
    email: string;
  };
  college: {
    collegeName: string;
  };
  department: {
    name: string;
  };
};

export default function StudentsPage() {
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStudents = async () => {
    try {
      const res = await api.get("/students");
      setStudents(res.data);
    } catch (err: any) {
      setError("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this student?")) return;

    try {
      await api.delete(`/students/${id}`);
      setStudents((prev) => prev.filter((s) => s.id !== id));
    } catch {
      alert("Failed to delete student");
    }
  };

  if (loading) return <p className="p-6">Loading students...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>Students</h1>

        <button
          onClick={() => router.push("/college/students/add")}
          className={styles.addBtn}
        >
          + Add Student
        </button>
      </div>

      {students.length === 0 ? (
        <p>No students found.</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Email</th>
              <th>Roll No</th>
              <th>Year</th>
              <th>Department</th>
              <th>College</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {students.map((s) => (
              <tr key={s.id}>
                <td>{s.user.email}</td>
                <td>{s.rollNo}</td>
                <td>{s.year}</td>
                <td>{s.department.name}</td>
                <td>{s.college.collegeName}</td>
                <td>
                  <button
                    onClick={() => handleDelete(s.id)}
                    className={styles.deleteBtn}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}