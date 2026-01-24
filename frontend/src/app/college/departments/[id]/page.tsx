"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";

export default function EditDepartmentPage() {
  const { id } = useParams();
  const router = useRouter();

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);

  // 🔹 Load department details
  useEffect(() => {
    api(`/departments/${id}`)
      .then((data) => {
        setName(data.name);
      })
      .catch(() => {
        alert("Failed to load department");
        router.push("/college/departments");
      })
      .finally(() => setLoading(false));
  }, [id, router]);

  // 🔹 Save update
  const handleUpdate = async () => {
    try {
      await api(`/departments/${id}`, {
        method: "PUT",
        body: JSON.stringify({ name }),
      });

      router.push("/college/departments");
    } catch (err: any) {
      alert(err.message || "Update failed");
    }
  };

  if (loading) return <div className="p-10">Loading...</div>;

  return (
    <div className="p-8 max-w-md">
      <h1 className="text-2xl font-semibold mb-6">
        Edit Department
      </h1>

      <input
        className="input w-full mb-4"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <div className="flex gap-3">
        <button
          onClick={() => router.back()}
          className="btn btn-secondary w-full"
        >
          Cancel
        </button>

        <button
          onClick={handleUpdate}
          className="btn btn-primary w-full"
        >
          Save
        </button>
      </div>
    </div>
  );
}