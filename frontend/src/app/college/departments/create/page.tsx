"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

type College = {
  id: string;
  name: string;
};

export default function CreateDepartmentPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [collegeId, setCollegeId] = useState("");
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api("/colleges")
      .then(setColleges)
      .catch(() => alert("Failed to load colleges"));
  }, []);

  const handleCreate = async () => {
    if (!name || !collegeId) {
      alert("Please enter name and select college");
      return;
    }

    try {
      setLoading(true);
      await api("/departments", {
        method: "POST",
        body: JSON.stringify({
          name,
          collegeId,
        }),
      });

      router.push("/college/departments");
    } catch (err: any) {
      alert(err.message || "Failed to create department");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-md">
      <h1 className="text-2xl font-semibold mb-6">Create Department</h1>

      <div className="space-y-4">
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
          {colleges.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <div className="flex gap-3">
          <button
            onClick={() => router.back()}
            className="btn btn-secondary w-full"
          >
            Cancel
          </button>

          <button
            onClick={handleCreate}
            disabled={loading}
            className="btn btn-primary w-full"
          >
            {loading ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}