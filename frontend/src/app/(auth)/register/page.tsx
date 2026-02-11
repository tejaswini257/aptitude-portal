"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/interceptors/axios";

type Role = "SUPER_ADMIN" | "COLLEGE_ADMIN" | "COMPANY_ADMIN";

type Organization = {
  id: string;
  name: string;
  type: string;
};

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("COLLEGE_ADMIN");
  const [orgId, setOrgId] = useState("");
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [orgLoading, setOrgLoading] = useState(false);
  const [orgError, setOrgError] = useState("");

  // Load organizations for dropdown (used when creating college/company admins)
  useEffect(() => {
    setOrgLoading(true);
    setOrgError("");
    api
      .get("/organizations")
      .then((res) => {
        const list: Organization[] = Array.isArray(res.data) ? res.data : [];
        setOrganizations(list);
        if (!orgId && list.length > 0) {
          setOrgId(list[0].id);
        }
      })
      .catch(() => {
        setOrgError(
          "Failed to load organizations. Make sure you are logged in as Super Admin."
        );
      })
      .finally(() => {
        setOrgLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (role !== "SUPER_ADMIN" && !orgId) {
      setError("Please select an organization for this admin.");
      return;
    }

    setLoading(true);
    try {
      await api.post("/auth/register", {
        email,
        password,
        role,
        orgId: role === "SUPER_ADMIN" ? undefined : orgId,
      });
      // On successful registration, go to login
      router.push("/login");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-96 p-6 border rounded-lg space-y-4"
      >
        <h1 className="text-2xl font-semibold text-center">Register</h1>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          className="input w-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password (min 6 chars)"
          className="input w-full"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <select
          className="input w-full"
          value={role}
          onChange={(e) => setRole(e.target.value as Role)}
        >
          <option value="SUPER_ADMIN">Super Admin</option>
          <option value="COLLEGE_ADMIN">College Admin</option>
          <option value="COMPANY_ADMIN">Company Admin</option>
        </select>

        {role !== "SUPER_ADMIN" && (
          <div className="space-y-1">
            <label className="block text-sm font-medium">
              Organization
            </label>
            <select
              className="input w-full"
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
                organizations.length > 0 && (
                  <>
                    <option value="">Select organization</option>
                    {organizations.map((org) => (
                      <option key={org.id} value={org.id}>
                        {org.name} ({org.type})
                      </option>
                    ))}
                  </>
                )}
            </select>
            {orgError && (
              <p className="text-xs text-red-500">{orgError}</p>
            )}
          </div>
        )}

        <button
          className="btn btn-primary w-full"
          disabled={
            loading ||
            (role !== "SUPER_ADMIN" &&
              (orgLoading || organizations.length === 0))
          }
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
}


