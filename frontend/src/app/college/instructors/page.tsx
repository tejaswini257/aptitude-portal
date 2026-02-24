"use client";

import { useState, useEffect } from "react";
import api from "@/interceptors/axios";
import { toast } from "react-hot-toast";

type Instructor = {
  id: string;
  designation: string | null;
  departmentId: string;
  isActive: boolean;
  createdAt: string;
  user: { email: string; createdAt: string };
  department: { name: string };
};

type Department = { id: string; name: string };

export default function InstructorsPage() {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
    departmentId: "",
    designation: "",
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [instRes, deptRes] = await Promise.all([
        api.get("/college/instructors"),
        api.get("/departments"),
      ]);
      setInstructors(instRes.data);
      setDepartments(deptRes.data);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/college/instructors", form);
      toast.success("Instructor added successfully");
      setShowModal(false);
      setForm({ email: "", password: "", departmentId: "", designation: "" });
      fetchData();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to add instructor");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this instructor?")) return;
    try {
      await api.delete(`/college/instructors/${id}`);
      toast.success("Instructor deleted");
      setInstructors((prev) => prev.filter((i) => i.id !== id));
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to delete");
    }
  };

  if (loading) {
    return <div className="page text-secondary">Loading instructors...</div>;
  }

  return (
    <div className="page space-y-6">
      <div className="page-header">
        <div>
          <h2 className="page-title">Instructors</h2>
          <p className="page-subtitle">Manage faculty and instructors across departments.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          Add Instructor
        </button>
      </div>

      <div className="card p-0 overflow-hidden">
        {instructors.length === 0 ? (
          <p className="p-4 text-secondary">No instructors found.</p>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 font-semibold text-sm text-gray-700">Email</th>
                <th className="px-4 py-3 font-semibold text-sm text-gray-700">Designation</th>
                <th className="px-4 py-3 font-semibold text-sm text-gray-700">Department</th>
                <th className="px-4 py-3 font-semibold text-sm text-gray-700">Status</th>
                <th className="px-4 py-3 font-semibold text-sm text-gray-700 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {instructors.map((instructor) => (
                <tr key={instructor.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                    {instructor.user.email}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {instructor.designation || "—"}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {instructor.department?.name || "—"}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {instructor.isActive ? (
                      <span className="px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-800">
                        Active
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                        Inactive
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-right">
                    <button
                      className="text-red-600 hover:text-red-700 font-medium"
                      onClick={() => handleDelete(instructor.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4">Add Instructor</h3>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  className="input w-full"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  required
                  className="input w-full"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  className="input w-full"
                  value={form.departmentId}
                  onChange={(e) => setForm({ ...form, departmentId: e.target.value })}
                >
                  <option value="">Select a department...</option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Designation
                </label>
                <input
                  type="text"
                  className="input w-full"
                  placeholder="e.g. Professor, Assistant Prof"
                  value={form.designation}
                  onChange={(e) => setForm({ ...form, designation: e.target.value })}
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
