"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getStudents, updateStudent } from "@/services/student.service";
import styles from "./edit.module.css";

interface StudentForm {
  name: string;
  email: string;
  departmentId: string;
}

export default function EditStudentPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [form, setForm] = useState<StudentForm>({
    name: "",
    email: "",
    departmentId: "",
  });

  /* 🔹 Fetch existing student data */
  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await getStudents();
        const student = res.data.find((s: any) => s.id === id);

        if (student) {
          setForm({
            name: student.name,
            email: student.email,
            departmentId: student.department?.id || "",
          });
        }
      } catch (error) {
        console.error("Failed to fetch student");
      }
    };

    fetchStudent();
  }, [id]);

  /* 🔹 FIX 1: handleChange is now defined */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  /* 🔹 FIX 2: React.FormEvent works because React is imported */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await updateStudent(id, form);
      router.push("/college/students");
    } catch (error) {
      alert("Failed to update student");
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2>Edit Student</h2>

      <input
        type="text"
        name="name"
        placeholder="Student Name"
        value={form.name}
        onChange={handleChange}
        required
      />

      <input
        type="email"
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        required
      />

      <input
        type="text"
        name="departmentId"
        placeholder="Department ID"
        value={form.departmentId}
        onChange={handleChange}
        required
      />

      <button type="submit">Update Student</button>
    </form>
  );
}
