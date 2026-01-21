"use client";

import { useEffect, useState } from "react";
import { getStudents, deleteStudent } from "@/services/student.service";
import { useRouter } from "next/navigation";
import styles from "./students.module.css";

interface Student {
  id: string;
  name: string;
  email: string;
  department?: {
    name: string;
  };
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await getStudents();
        setStudents(res.data);
      } catch (err) {
        console.error("Failed to load students");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this student?")) return;

    try {
      await deleteStudent(id);
      setStudents(prev => prev.filter(s => s.id !== id));
    } catch {
      alert("Failed to delete student");
    }
  };

  if (loading) return <p>Loading students...</p>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Students</h2>
        <button onClick={() => router.push("/college/students/add")}>
          Add Student
        </button>
      </div>

      {students.length === 0 ? (
        <p>No students found</p>
      ) : (
       <div className={styles.tableWrapper}>
  <table className={styles.table}>
    <thead>
      <tr>
        <th>Name</th>
        <th>Email</th>
        <th>Department</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {students.map(student => (
        <tr key={student.id}>
          <td>{student.name}</td>
          <td>{student.email}</td>
          <td>{student.department?.name || "-"}</td>
          <td className={styles.actions}>
            <button>Edit</button>
            <button className={styles.danger}>Delete</button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
      )}
    </div>
  );
}
