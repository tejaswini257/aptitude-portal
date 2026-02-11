"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getStudent, updateStudent } from "@/services/student.service";
import { getDepartments, Department } from "@/services/department.service";
import styles from "./edit.module.css";

interface StudentForm {
  rollNo: string;
  year: number;
  departmentId: string;
  email: string;
  collegeName: string;
}

export default function EditStudentPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [form, setForm] = useState<StudentForm>({
    rollNo: "",
    year: 1,
    departmentId: "",
    email: "",
    collegeName: "",
  });
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  /* 🔹 Fetch existing student data */
  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await getStudent(id);
        const student = res.data;

        setForm({
          rollNo: student.rollNo,
          year: student.year,
          departmentId: student.department?.id || student.departmentId,
          email: student.user?.email || "",
          collegeName: student.college?.collegeName || "",
        });

        if (student.collegeId) {
          const deptRes = await getDepartments(student.collegeId);
          setDepartments(deptRes.data);
        }
      } catch (error) {
        console.error("Failed to fetch student");
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [id]);

  /* 🔹 handleChange */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "year" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await updateStudent(id, {
        rollNo: form.rollNo,
        year: form.year,
        departmentId: form.departmentId,
      });
      router.push("/college/students");
    } catch (error) {
      alert("Failed to update student");
    }
  };

  if (loading) {
    return <div className={styles.form}>Loading student...</div>;
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2>Edit Student</h2>

      {/* Read-only details */}
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={form.email}
        readOnly
        className={styles.readonly}
      />
      <input
        type="text"
        name="collegeName"
        placeholder="College Name"
        value={form.collegeName}
        readOnly
        className={styles.readonly}
      />

      {/* Editable fields */}
      <input
        type="text"
        name="rollNo"
        placeholder="Roll Number"
        value={form.rollNo}
        onChange={handleChange}
        required
      />

      <input
        type="number"
        name="year"
        min={1}
        max={4}
        placeholder="Year"
        value={form.year}
        onChange={handleChange}
        required
      />

      <label htmlFor="departmentId">Department</label>
      <select
        id="departmentId"
        name="departmentId"
        value={form.departmentId}
        onChange={handleChange}
        required
      >
        <option value="">Select Department</option>
        {departments.map((d) => (
          <option key={d.id} value={d.id}>
            {d.name}
          </option>
        ))}
      </select>

      <button type="submit">Update Student</button>
    </form>
  );
}
