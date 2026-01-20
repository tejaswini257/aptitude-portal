"use client"

import { useParams } from "next/navigation"
import Link from "next/link"

const data = {
  cse: {
    name: "Computer Science",
    code: "cse",
    metrics: {
      total: 120,
      verified: 98,
      passed: 67,
      shortlisted: 23,
      placed: 8,
      atRisk: 22,
      placementRate: 72,
      testReadiness: 68,
    },
    drives: [
      { company: "Infosys", status: "Ongoing", count: "32 Registered" },
      { company: "TCS", status: "Shortlisting", count: "18 Shortlisted" },
      { company: "Wipro", status: "Upcoming", count: "Test Tomorrow" },
    ],
  },
}

export default function DepartmentPage() {
  const { id } = useParams()
  const dept = data[id as keyof typeof data]

  if (!dept) return <div className="page">Department not found</div>

  return (
    <div className="page space-y-8">

      {/* HEADER */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="page-title">{dept.name}</h1>
          <p className="text-gray-500 text-sm">Department Code: {dept.code.toUpperCase()}</p>
        </div>

        <div className="flex gap-3">
          <Link
            href={`/college/departments/${dept.code}/students`}
            className="btn"
          >
            View Students
          </Link>
          <button className="btn btn-primary">Assign Test</button>
        </div>
      </div>

      {/* TOP METRICS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat title="Total Students" value={dept.metrics.total} />
        <Stat title="Verified" value={dept.metrics.verified} />
        <Stat title="At Risk" value={dept.metrics.atRisk} />
        <Stat title="Placement %" value={`${dept.metrics.placementRate}%`} />
      </div>

      {/* STUDENT FUNNEL */}
      <div className="section">
        <h2 className="font-semibold mb-4">Student Pipeline</h2>

        <div className="grid grid-cols-5 gap-4 text-center">
          <Pipeline label="Total" value={dept.metrics.total} />
          <Pipeline label="Verified" value={dept.metrics.verified} />
          <Pipeline label="Passed" value={dept.metrics.passed} />
          <Pipeline label="Shortlisted" value={dept.metrics.shortlisted} />
          <Pipeline label="Placed" value={dept.metrics.placed} />
        </div>
      </div>

      {/* LIVE OPERATIONS */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* ACTIVE DRIVES */}
        <div className="section">
          <h2 className="font-semibold mb-4">Active Company Drives</h2>

          <div className="space-y-3">
            {dept.drives.map((d) => (
              <div key={d.company} className="flex justify-between items-center p-3 rounded-md border">
                <div>
                  <div className="font-medium">{d.company}</div>
                  <div className="text-xs text-gray-500">{d.status}</div>
                </div>
                <div className="text-sm text-blue-600">{d.count}</div>
              </div>
            ))}
          </div>
        </div>

        {/* HEALTH */}
        <div className="section">
          <h2 className="font-semibold mb-4">Department Health</h2>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span>Verification Rate</span>
              <span className="text-green-600">82%</span>
            </div>
            <div className="flex justify-between">
              <span>Test Readiness</span>
              <span className="text-blue-600">68%</span>
            </div>
            <div className="flex justify-between">
              <span>Placement Readiness</span>
              <span className="font-medium">High</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Stat({ title, value }: { title: string; value: any }) {
  return (
    <div className="section text-center">
      <div className="text-xs text-gray-500">{title}</div>
      <div className="text-2xl font-semibold mt-1">{value}</div>
    </div>
  )
}

function Pipeline({ label, value }: { label: string; value: number }) {
  return (
    <div className="border rounded-lg p-4">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="text-xl font-semibold mt-2">{value}</div>
    </div>
  )
}
