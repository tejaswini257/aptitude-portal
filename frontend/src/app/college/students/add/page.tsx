import { Suspense } from "react";
import AddStudentForm from "./AddStudentForm";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import api from "@/interceptors/axios";

type College = { id: string; collegeName: string };
type Department = { id: string; name: string };

export default function AddStudentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const prefilledDeptId = searchParams.get("departmentId") || "";

  const [colleges, setColleges] = useState<College[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [form, setForm] = useState({
    email: "",
    password: "",
    rollNo: "",
    year: 1,
    collegeId: "",
    departmentId: prefilledDeptId,
  });
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      router.replace("/login");
      return;
    }
    api
      .get("/colleges")
      .then((res) => {
        const list = res.data || [];
        setColleges(list);
        if (list.length && !form.collegeId) {
          const firstId = list[0].id;
          setForm((f) => ({ ...f, collegeId: firstId }));
        }
      })
      .catch(() => setError("Failed to load colleges"))
      .finally(() => setLoadingData(false));
  }, [router]);

  useEffect(() => {
    if (prefilledDeptId) setForm((f) => ({ ...f, departmentId: prefilledDeptId }));
  }, [prefilledDeptId]);

  useEffect(() => {
    if (!form.collegeId) {
      setDepartments([]);
      return;
    }
    api
      .get(`/departments?collegeId=${form.collegeId}`)
      .then((res) => setDepartments(res.data || []))
      .catch(() => setDepartments([]));
  }, [form.collegeId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const name = e.target.name;
    const value = e.target.value;
    setForm((f) => ({
      ...f,
      [name]: name === "year" ? parseInt(value, 10) || 1 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password || !form.rollNo || !form.collegeId || !form.departmentId) {
      setError("Email, password, roll no, college and department are required.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (form.year < 1 || form.year > 4) {
      setError("Year must be between 1 and 4.");
      return;
    }
    try {
      setLoading(true);
      setError("");
      await api.post("/students", {
        email: form.email,
        password: form.password,
        rollNo: form.rollNo,
        year: form.year,
        collegeId: form.collegeId,
        departmentId: form.departmentId,
      });
      router.push(`/college/departments/${form.departmentId}/students`);
      router.refresh();
    } catch (err: any) {
      setError(
        err.response?.data?.message || err.message || "Failed to add student"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="flex items-center justify-center min-h-[200px] text-gray-500">
        Loading…
      </div>
    );
  }

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AddStudentForm />
    </Suspense>
  );
}