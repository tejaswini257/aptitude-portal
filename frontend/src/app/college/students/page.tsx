"use client";

import Link from "next/link";
import styles from "./students.module.css";

const students = [
  { id: 1, name: "Amit Sharma", dept: "CSE", year: "Final", status: "Active" },
  { id: 2, name: "Priya Verma", dept: "IT", year: "Third", status: "Active" },
  { id: 3, name: "Rahul Patil", dept: "ECE", year: "Final", status: "Placed" },
];

export default function StudentsPage() {
  return (
    <>
      <div className={styles.header}>
        <h1>Students</h1>

        <Link href="/college/students/add" className={styles.addBtn}>
          + Add Student
        </Link>
      </div>

      <div className={styles.tableWrapper}>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Department</th>
              <th>Year</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {students.map((s) => (
              <tr key={s.id}>
                <td>{s.name}</td>
                <td>{s.dept}</td>
                <td>{s.year}</td>
                <td>
                  <span
                    className={
                      s.status === "Placed"
                        ? styles.placed
                        : styles.active
                    }
                  >
                    {s.status}
                  </span>
                </td>
                <td>
                  <Link
                    href={`/college/students/edit/${s.id}`}
                    className={styles.editBtn}
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
