"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/interceptors/axios";
import BrandLogo from "@/components/BrandLogo";

type Role = "SUPER_ADMIN" | "COLLEGE_ADMIN" | "COMPANY_ADMIN" | "STUDENT";

type Organization = {
  id: string;
  name: string;
  type: string;
};

type College = {
  id: string;
  collegeName: string;
};

type Department = {
  id: string;
  name: string;
};

type ApiErrorShape = {
  response?: {
    data?: {
      message?: string;
    };
  };
};

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("COLLEGE_ADMIN");

  // Organization state
  const [orgId, setOrgId] = useState("");
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [orgLoading, setOrgLoading] = useState(false);
  const [orgError, setOrgError] = useState("");

  // Student state
  const [collegeId, setCollegeId] = useState("");
  const [colleges, setColleges] = useState<College[]>([]);
  const [departmentId, setDepartmentId] = useState("");
  const [departments, setDepartments] = useState<Department[]>([]);
  const [rollNo, setRollNo] = useState("");
  const [year, setYear] = useState("");
  const [collegesLoading, setCollegesLoading] = useState(false);
  const [departmentsLoading, setDepartmentsLoading] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Load organizations
  useEffect(() => {
    setOrgLoading(true);
    setOrgError("");

    api
      .get("/organizations")
      .then((res) => {
        const list: Organization[] = Array.isArray(res.data) ? res.data : [];
        setOrganizations(list);
        setOrgId((prev) => (prev || list.length === 0 ? prev : list[0].id));
      })
      .catch(() => {
        setOrgError(
          "Failed to load organizations. Make sure you are logged in as Super Admin."
        );
      })
      .finally(() => {
        setOrgLoading(false);
      });
  }, []);

  // Load colleges for Student registration
  useEffect(() => {
    if (role === "STUDENT") {
      setCollegesLoading(true);
      api
        .get("/public-colleges")
        .then((res) => {
          const list: College[] = Array.isArray(res.data) ? res.data : [];
          setColleges(list);
          if (list.length > 0) {
            setCollegeId(list[0].id);
          }
        })
        .catch(() => setError("Failed to load colleges."))
        .finally(() => setCollegesLoading(false));
    }
  }, [role]);

  // Load departments when college changes
  useEffect(() => {
    if (role === "STUDENT" && collegeId) {
      setDepartmentsLoading(true);
      api
        .get(`/public-colleges/${collegeId}/departments`)
        .then((res) => {
          const list: Department[] = Array.isArray(res.data) ? res.data : [];
          setDepartments(list);
          if (list.length > 0) {
            setDepartmentId(list[0].id);
          } else {
            setDepartmentId("");
          }
        })
        .catch(() => setError("Failed to load departments."))
        .finally(() => setDepartmentsLoading(false));
    }
  }, [collegeId, role]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (role !== "SUPER_ADMIN" && role !== "STUDENT" && !orgId) {
      setError("Please select an organization for this admin.");
      return;
    }

    if (role === "STUDENT") {
      if (!collegeId || !departmentId || !rollNo || !year) {
        setError("Please fill in all student details.");
        return;
      }
    }

    setLoading(true);

    try {
      await api.post("/auth/register", {
        email,
        password,
        role,
        orgId: role === "SUPER_ADMIN" || role === "STUDENT" ? undefined : orgId,
        collegeId: role === "STUDENT" ? collegeId : undefined,
        departmentId: role === "STUDENT" ? departmentId : undefined,
        rollNo: role === "STUDENT" ? rollNo : undefined,
        year: role === "STUDENT" ? Number(year) : undefined,
      });

      router.push("/login");
    } catch (err: unknown) {
      const error = err as ApiErrorShape;
      setError(error?.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <form
        onSubmit={handleSubmit}
        className="auth-card space-y-4"
      >
        <div className="flex justify-center">
          <BrandLogo />
        </div>
        <h1 className="text-2xl font-semibold text-center">Create Portal Account</h1>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          className="input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Password (min 6 chars)"
          className="input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {/* Role */}
        <select
          className="input"
          value={role}
          onChange={(e) => setRole(e.target.value as Role)}
        >
          <option value="SUPER_ADMIN">Super Admin</option>
          <option value="COLLEGE_ADMIN">College Admin</option>
          <option value="COMPANY_ADMIN">Company Admin</option>
          <option value="STUDENT">Student</option>
        </select>

        {/* Organization dropdown for non-student & non-super */}
        {role !== "SUPER_ADMIN" && role !== "STUDENT" && (
          <div className="space-y-1">
            <label className="block text-sm font-medium">
              Organization
            </label>

            <select
              className="input"
              value={orgId}
              onChange={(e) => setOrgId(e.target.value)}
              disabled={orgLoading || organizations.length === 0}
              required
            >
              {orgLoading && <option value="">Loading organizations...</option>}

              {!orgLoading && organizations.length === 0 && (
                <option value="">
                  {orgError || "No organizations available"}
                </option>
              )}

              {!orgLoading &&
                organizations.length > 0 &&
                organizations.map((org) => (
                  <option key={org.id} value={org.id}>
                    {org.name} ({org.type})
                  </option>
                ))}
            </select>

            {orgError && (
              <p className="text-xs text-red-500">{orgError}</p>
            )}
          </div>
        )}

        {/* Student specific fields */}
        {role === "STUDENT" && (
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="block text-sm font-medium">College</label>
              <select
                className="input"
                value={collegeId}
                onChange={(e) => setCollegeId(e.target.value)}
                disabled={collegesLoading || colleges.length === 0}
                required
              >
                {collegesLoading && <option value="">Loading colleges...</option>}
                {!collegesLoading && colleges.length === 0 && (
                  <option value="">No colleges available</option>
                )}
                {!collegesLoading &&
                  colleges.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.collegeName}
                    </option>
                  ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium">Department</label>
              <select
                className="input"
                value={departmentId}
                onChange={(e) => setDepartmentId(e.target.value)}
                disabled={departmentsLoading || departments.length === 0}
                required
              >
                {departmentsLoading && <option value="">Loading departments...</option>}
                {!departmentsLoading && departments.length === 0 && (
                  <option value="">No departments available</option>
                )}
                {!departmentsLoading &&
                  departments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-sm font-medium">Roll Number</label>
                <input
                  type="text"
                  placeholder="e.g. 101"
                  className="input"
                  value={rollNo}
                  onChange={(e) => setRollNo(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium">Year</label>
                <select
                  className="input"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  required
                >
                  <option value="">Select</option>
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Button */}
        <button
          className="btn btn-primary btn-block"
          disabled={
            loading ||
            (role !== "SUPER_ADMIN" && role !== "STUDENT" && (orgLoading || organizations.length === 0)) ||
            (role === "STUDENT" && (collegesLoading || colleges.length === 0))
          }
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
}
