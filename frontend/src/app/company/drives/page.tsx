"use client";

import { Plus } from "lucide-react";

const drives = [
  { id: 1, role: "Frontend Developer", package: "6 LPA", applicants: 120, status: "Active" },
  { id: 2, role: "Backend Developer", package: "8 LPA", applicants: 85, status: "Closed" },
  { id: 3, role: "Data Analyst", package: "7 LPA", applicants: 140, status: "Active" },
];

export default function DrivesPage() {
  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">Recruitment Drives</h2>

        <button className="btn-primary flex items-center gap-2">
          <Plus size={16} />
          Create Drive
        </button>
      </div>

      <div className="table-card">
        <table className="w-full">
          <thead>
            <tr>
              <th className="table-head">Role</th>
              <th className="table-head">Package</th>
              <th className="table-head">Applicants</th>
              <th className="table-head">Status</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {drives.map((drive) => (
              <tr key={drive.id} className="table-row">
                <td className="table-cell">{drive.role}</td>
                <td className="table-cell">{drive.package}</td>
                <td className="table-cell">{drive.applicants}</td>
                <td className="table-cell">
                  <span
                    className={
                      drive.status === "Active"
                        ? "badge-success"
                        : "badge-warning"
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