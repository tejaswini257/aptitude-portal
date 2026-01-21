"use client";

import { useEffect, useState } from "react";
import { getStudents } from "@/services/student.service";
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

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await getStudents();
        setStudents(res.data as Student[]);
      } catch (error) {
        console.error("Error fetching students", error);
      }
    };

    fetchStudents();
  }, []);

  return (
    <div className={styles.studentsContainer}>
      <div className={styles.studentsHeader}>
        <h2>Students</h2>
        <button>Add Student</button>
      </div>

      <div className={styles.tableWrapper}>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s.id}>
                <td>{s.name}</td>
                <td>{s.email}</td>
                <td>{s.department?.name ?? "-"}</td>
                <td>
                  <button>Edit</button>
                  <button className={styles.danger}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
