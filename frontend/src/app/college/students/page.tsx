"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import styles from "./students.module.css";
import { studentsMock } from "@/data/student";
import ConfirmModal from "@/components/ConfirmModel";

export default function StudentsPage() {
  const router = useRouter();

  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleDeleteClick = (id: string) => {
    setSelectedId(id);
    setShowModal(true);
  };

  const handleConfirmDelete = () => {
    console.log("Delete student with id:", selectedId);
    // 🔌 API will be called here later
    setShowModal(false);
    setSelectedId(null);
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h2>Students</h2>
        <button onClick={() => router.push("/college/students/add")}>
          + Add Student
        </button>
      </div>

      {/* Table */}
      <div className={styles.tableWrapper}>
        {studentsMock.length === 0 ? (
          <p>No students found.</p>
        ) : (
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
              {studentsMock.map((s) => (
                <tr key={s.id}>
                  <td data-label="Name">{s.name}</td>
                  <td data-label="Email">{s.email}</td>
                  <td data-label="Department">{s.department}</td>
                  <td data-label="Actions" className={styles.actions}>
                    <button
                      onClick={() =>
                        router.push(`/college/students/edit/${s.id}`)
                      }
                    >
                      Edit
                    </button>

                    <button
                      className={styles.danger}
                      onClick={() => handleDeleteClick(s.id)}
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

      {/* Delete Confirmation Modal */}
      {showModal && (
        <ConfirmModal
          title="Delete Student"
          message="Are you sure you want to delete this student?"
          onCancel={() => {
            setShowModal(false);
            setSelectedId(null);
          }}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
}
