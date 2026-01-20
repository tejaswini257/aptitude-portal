"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { useState } from "react"

const students = {
  cse: [
    { name: "Neha Patil", verified: true, tests: 3, status: "Shortlisted" },
    { name: "Rahul Shah", verified: true, tests: 2, status: "Ready" },
    { name: "Aman Verma", verified: false, tests: 0, status: "At Risk" },
    { name: "Sneha Iyer", verified: true, tests: 4, status: "Placed" },
    { name: "Rohit Kulkarni", verified: true, tests: 1, status: "Ready" },
    { name: "Pooja Mehta", verified: true, tests: 2, status: "Shortlisted" },
    { name: "Kunal Deshmukh", verified: false, tests: 0, status: "At Risk" },
    { name: "Isha Rao", verified: true, tests: 3, status: "Ready" },
  ],
}

export default function DepartmentStudentsPage() {
  const { id } = useParams()
  const [filter, setFilter] = useState("All")
  const [search, setSearch] = useState("")

  const list = students[id as keyof typeof students] || []

  const filtered = list.filter((s) => {
    const matchFilter =
      filter === "All" ||
      s.status === filter ||
      (filter === "Verified" && s.verified)

    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase())

    return matchFilter && matchSearch
  })

  return (
    <div className="page space-y-6">

      {/* Back */}
      <Link
        href={`/college/departments/${id}`}
        className="text-sm text-gray-500 hover:text-black"
      >
        ← Back to Department
      </Link>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="page-title capitalize">{id} Students</h1>

        <input
          placeholder="Search student..."
          className="border px-4 py-2 rounded-lg w-full md:w-80"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        {["All", "Verified", "Shortlisted", "Ready", "At Risk", "Placed"].map(
          (f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-sm border ${
                filter === f
                  ? "bg-black text-white"
                  : "bg-white hover:bg-gray-100"
              }`}
            >
              {f}
            </button>
          )
        )}
      </div>

      {/* Table */}
      <div className="section p-0 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr className="text-left">
              <th className="p-4">Student</th>
              <th className="p-4 text-center">Verified</th>
              <th className="p-4 text-center">Tests</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((s) => (
              <tr
                key={s.name}
                className="border-t hover:bg-gray-50 transition"
              >
                <td className="p-4 font-medium">{s.name}</td>

                <td className="p-4 text-center">
                  {s.verified ? "✓" : "✕"}
                </td>

                <td className="p-4 text-center">{s.tests}</td>

                <td className="p-4 text-center">
                  <span className={`px-3 py-1 rounded-full text-xs ${statusStyle(s.status)}`}>
                    {s.status}
                  </span>
                </td>

                <td className="p-4 text-right">
                  <ActionButton status={s.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/* Helpers */

function statusStyle(status: string) {
  if (status === "Placed") return "bg-green-100 text-green-700"
  if (status === "Shortlisted") return "bg-blue-100 text-blue-700"
  if (status === "Ready") return "bg-yellow-100 text-yellow-700"
  if (status === "At Risk") return "bg-red-100 text-red-700"
  return "bg-gray-100"
}

function ActionButton({ status }: { status: string }) {
  if (status === "At Risk") return <span className="text-blue-600">Verify</span>
  if (status === "Ready") return <span className="text-blue-600">Assign Test</span>
  if (status === "Shortlisted") return <span className="text-blue-600">Schedule Interview</span>
  return <span className="text-gray-400">View</span>
}
