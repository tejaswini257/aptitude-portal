"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./add.module.css";

import { createStudent } from "@/services/student.service";
import { getColleges, College } from "@/services/college.service";
import { getDepartments, Department } from "@/services/department.service";

export default function AddStudentPage() {
  const router = useRouter();

  const [colleges, setColleges] = useState<College[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
    rollNo: "",
    year: 1,
    collegeId: "",
    departmentId: "",
  });

  // ✅ Load colleges
  useEffect(() => {
    getColleges()
      .then((res) => {
        setColleges(res.data);
      })
      .catch(() => {
        alert("Failed to load colleges");
      });
  }, []);

  // ✅ Load departments when college changes
  useEffect(() => {
    if (!form.collegeId) return;

    getDepartments(form.collegeId)
      .then((res) => {
        setDepartments(res.data);
      })
      .catch(() => {
        alert("Failed to load departments");
      });
  }, [form.collegeId]);

  // ✅ Handle input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: name === "year" ? Number(value) : value,
    });
  };

  // ✅ Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createStudent(form);
      alert("Student created successfully");
      router.push("/college/students");
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message || "Failed to create student");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2>Add Student</h2>

      {/* Email */}
      <input
        name="email"
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        required
      />

      {/* Password */}
      <input
        name="password"
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
        required
      />

      {/* Roll Number */}
      <input
        name="rollNo"
        placeholder="Roll Number"
        value={form.rollNo}
        onChange={handleChange}
        required
      />

      {/* Year */}
      <label htmlFor="year-input">Year</label>
      <input
        id="year-input"
        name="year"
        type="number"
        min={1}
        max={4}
        value={form.year}
        onChange={handleChange}
        required
        placeholder="Year"
      />

      {/* College */}
      <label htmlFor="college-select">College</label>
      <select
        id="college-select"
        name="collegeId"
        value={form.collegeId}
        onChange={handleChange}
        required
      >
        <option value="">Select College</option>
        {colleges.map((c) => (
          <option key={c.id} value={c.id}>
            {c.collegeName}
          </option>
        ))}
      </select>

      {/* Department */}
      <label htmlFor="department-select">Department</label>
      <select
        id="department-select"
        name="departmentId"
        value={form.departmentId}
        onChange={handleChange}
        required
        disabled={!form.collegeId}
      >
        <option value="">Select Department</option>
        {departments.map((d) => (
          <option key={d.id} value={d.id}>
            {d.name}
          </option>
        ))}
      </select>

      <button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Create Student"}
      </button>
    </form>
  );
}