<<<<<<< HEAD
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api"

export default function CreateDepartmentPage() {
  const router = useRouter()

  const [name, setName] = useState("")
  const [status, setStatus] = useState("ACTIVE")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      await api("/departments", {
        method: "POST",
        body: JSON.stringify({
          name,
          status,
        }),
      })

      // success → go back to list
      router.push("/college/departments")
    } catch (err: any) {
      setError(err.message || "Failed to create department")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page max-w-xl">
      <h1 className="page-title mb-6">Create Department</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-[#121826] rounded-xl border border-gray-200 dark:border-[#1f2937] p-6 space-y-5"
      >
        {/* Department Name */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Department Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Computer Science"
            required
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-[#1f2937] bg-transparent outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-[#1f2937] bg-transparent outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>

        {/* Error */}
        {error && (
          <div className="text-sm text-red-500">
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-[#1f2937]"
=======
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreateDepartmentPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [collegeId, setCollegeId] = useState("");

  return (
    <div className="p-8 max-w-md">
      <h1 className="text-2xl font-semibold mb-6">
        Create Department
      </h1>

      <form className="space-y-4">
        <input
          type="text"
          placeholder="Department name"
          className="input w-full"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <select
          className="input w-full"
          value={collegeId}
          onChange={(e) => setCollegeId(e.target.value)}
        >
          <option value="">Select college</option>
          <option value="1">ABC Engineering College</option>
          <option value="2">XYZ Institute of Technology</option>
        </select>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="btn btn-secondary w-full"
>>>>>>> 0a3f4bc (feat: add department UI screens (list, create, edit))
          >
            Cancel
          </button>

          <button
<<<<<<< HEAD
            type="submit"
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Department"}
=======
            type="button"
            className="btn btn-primary w-full"
          >
            Create
>>>>>>> 0a3f4bc (feat: add department UI screens (list, create, edit))
          </button>
        </div>
      </form>
    </div>
<<<<<<< HEAD
  )
=======
  );
>>>>>>> 0a3f4bc (feat: add department UI screens (list, create, edit))
}
