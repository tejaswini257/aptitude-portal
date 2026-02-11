"use client";

import styles from "../company.module.css";
import { Plus } from "lucide-react";

const drives = [
  { id: 1, role: "Frontend Developer", package: "6 LPA", applicants: 120, status: "Active" },
  { id: 2, role: "Backend Developer", package: "8 LPA", applicants: 85, status: "Closed" },
  { id: 3, role: "Data Analyst", package: "7 LPA", applicants: 140, status: "Active" },
];

export default function DrivesPage() {
  return (
    <div className={styles.pageWrapper}>
      <div className={styles.pageHeader}>
        <h2 className={styles.pageTitle}>Recruitment Drives</h2>
        <button className={styles.primaryBtn}>
          <Plus size={16} />
          Create Drive
        </button>
      </div>

      <div className={styles.card}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Role</th>
              <th>Package</th>
              <th>Applicants</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {drives.map((drive) => (
              <tr key={drive.id}>
                <td>{drive.role}</td>
                <td>{drive.package}</td>
                <td>{drive.applicants}</td>
                <td>
                  <span
                    className={
                      drive.status === "Active"
                        ? styles.statusActive
                        : styles.statusClosed
                    }
                  >
                    {drive.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
