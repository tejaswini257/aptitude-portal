"use client";

import { useState } from "react";
import styles from "./add.module.css";

export default function AddStudent() {
  const [form, setForm] = useState({
    name: "",
    department: "",
    year: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Student Added (dummy)");
  };

  return (
    <>
      <h1>Add Student</h1>

      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          placeholder="Student Name"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <input
          placeholder="Department"
          value={form.department}
          onChange={(e) =>
            setForm({ ...form, department: e.target.value })
          }
        />

        <input
          placeholder="Year"
          value={form.year}
          onChange={(e) =>
            setForm({ ...form, year: e.target.value })
          }
        />

        <button type="submit">Save Student</button>
      </form>
    </>
  );
}
