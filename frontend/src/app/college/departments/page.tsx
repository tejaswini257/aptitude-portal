"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { api } from "@/lib/api"
import { useRouter } from "next/navigation"

type Department = {
  id: string
  name: string
  studentsCount: number
  verifiedCount: number
  activeTests: number
  placement: number
  status: string
}

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("accessToken")

    // 🔐 Guard: no token → go to login
    if (!token) {
      router.replace("/login")
      return
    }

    // ✅ Token exists → fetch departments
    api("/departments")
      .then((data) => {
        setDepartments(data)
      })
      .catch((err) => {
        setError(err.message || "Unauthorized")
      })
      .finally(() => {
        setLoading(false)
      })
  }, [router])

  if (loading) {
    return <div className="p-10 text-gray-500">Loading departments...</div>
  }

  if (error) {
    return <div className="p-10 text-red-500">Failed to load: {error}</div>
  }

  return (
    <div className="page">
      <div className="flex justify-between items-center mb-6">
        <h1 className="page-title">Departments</h1>

        <button
          onClick={() => router.push("/college/departments/create")}
          className="btn btn-primary"
        >
          + Add Department
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {departments.map((d) => (
          <div key={d.id} className="flex justify-center">
            <div className="department-card bg-white dark:bg-[#121826] rounded-xl border border-gray-200 dark:border-[#1f2937] shadow-sm hover:shadow-md transition overflow-hidden flex flex-col">
              
              {/* Header */}
              <div className="p-5">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs px-3 py-1 rounded-full bg-gray-100 dark:bg-[#1f2937]">
                    {d.status}
                  </span>
                  <span className="text-sm text-gray-400">#{d.id}</span>
                </div>

                <h2 className="font-semibold text-lg mb-2">{d.name}</h2>

                <div className="text-sm text-gray-500 space-y-1">
                  <div>{d.studentsCount} Students</div>
                  <div>{d.verifiedCount} Verified</div>
                  <div>{d.activeTests} Active Tests</div>
                </div>

                {/* Placement bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Placement</span>
                    <span>{d.placement}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 dark:bg-[#1f2937] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500"
                      style={{ width: `${d.placement}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-auto flex justify-between items-center px-5 py-4 border-t dark:border-[#1f2937]">
                <Link
                  href={`/college/departments/${d.id}`}
                  className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-black"
                >
                  Open →
                </Link>
                <Link
                  href={`/college/departments/${d.id}/students`}
                  className="text-sm text-gray-400 hover:text-black"
                >
                  Students
                </Link>
              </div>

              <div className="h-1 bg-green-500" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
