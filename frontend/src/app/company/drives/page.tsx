"use client";

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
const router = useRouter();



const drives = [
  { id: 1, role: "Frontend Developer", package: "6 LPA", applicants: 120, status: "Active" },
  { id: 2, role: "Backend Developer", package: "8 LPA", applicants: 85, status: "Closed" },
  { id: 3, role: "Data Analyst", package: "7 LPA", applicants: 140, status: "Active" },
];

export default function DrivesPage() {
  return (
    <>
      <div className="page-header">
        <h2 className="page-title">Recruitment Drives</h2>

  <button
  className="btn-primary"
  onClick={() => router.push("/company/drives/create")}
>
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

          <tbody>
            {drives.map((d) => (
              <tr key={d.id} className="table-row">
                <td className="table-cell">{d.role}</td>
                <td className="table-cell">{d.package}</td>
                <td className="table-cell">{d.applicants}</td>
                <td className="table-cell">
                  <span
                    className={
                      d.status === "Active"
                        ? "badge-success"
                        : "badge-warning"
                    }
                  >
                    {d.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}