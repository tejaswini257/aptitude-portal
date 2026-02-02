"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  getStudents,
  deleteStudent,
} from "@/services/student.service";
import styles from "./list.module.css";

export default function StudentsPage() {
  const router = useRouter();
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getStudents();
        setStudents(res.data);
      } catch (err: any) {
        console.error(err);
        setError(err?.response?.data?.message || "Failed to load students");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm("Delete this student?");
    if (!confirmed) return;

    try {
      await deleteStudent(id);
      setStudents((prev) => prev.filter((s) => s.id !== id));
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to delete student");
    }
  };

  if (loading) {
    return <div className={styles.state}>Loading students...</div>;
  }

  if (error) {
    return <div className={styles.stateError}>{error}</div>;
  }

  if (students.length === 0) {
    return (
      <div className={styles.state}>
        <p>No students found.</p>
        <button
          className={styles.primaryButton}
          onClick={() => router.push("/college/students/add")}
        >
          Add first student
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Students</h2>
        <Link href="/college/students/add" className={styles.primaryButton}>
          + Add Student
        </Link>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Roll No</th>
            <th>Department</th>
            <th>College</th>
            <th>Year</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s.id}>
              <td>{s.user?.email || "N/A"}</td>
              <td>{s.rollNo}</td>
              <td>{s.department?.name}</td>
              <td>{s.college?.collegeName}</td>
              <td>{s.year}</td>
              <td className={styles.actions}>
                <Link href={`/college/students/edit/${s.id}`}>Edit</Link>
                <button onClick={() => handleDelete(s.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}