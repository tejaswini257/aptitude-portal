"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { createStudent } from "@/services/student.service";
import { useRouter } from "next/navigation";
import styles from "./add.module.css";

export default function AddStudentPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    departmentId: ""
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createStudent(form);
      router.push("/college/students");
    } catch {
      alert("Failed to create student");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2>Add Student</h2>

      <input
        name="name"
        placeholder="Student Name"
        value={form.name}
        onChange={handleChange}
        required
      />

      <input
        name="email"
        placeholder="Email"
        type="email"
        value={form.email}
        onChange={handleChange}
        required
      />

      <input
        name="departmentId"
        placeholder="Department ID"
        value={form.departmentId}
        onChange={handleChange}
        required
      />

      <button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Create Student"}
      </button>
    </form>
  );
}
