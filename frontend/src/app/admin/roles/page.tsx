"use client";

import { useEffect, useMemo, useState } from "react";
import api from "@/interceptors/axios";

type RoleConfig = {
  role: "SUPER_ADMIN" | "COLLEGE_ADMIN" | "COMPANY_ADMIN" | "STUDENT";
  permissions: string[];
  updatedAt: string | null;
};

const PERMISSION_CATALOG = [
  "dashboard:view",
  "users:manage",
  "roles:manage",
  "subscriptions:manage",
  "analytics:view",
  "monitoring:view",
  "orgs:manage",
  "students:manage",
  "tests:manage",
  "drives:view",
  "drives:manage",
  "questions:manage",
  "tests:attempt",
  "practice:attempt",
  "coding:attempt",
];

type ApiErrorShape = {
  response?: {
    data?: {
      message?: string;
    };
  };
};

export default function AdminRolesPage() {
  const [roles, setRoles] = useState<RoleConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingRole, setSavingRole] = useState<string | null>(null);
  const [error, setError] = useState("");

  const fetchRoles = async () => {
    try {
      const res = await api.get("/admin/roles");
      setRoles(Array.isArray(res.data) ? (res.data as RoleConfig[]) : []);
      setError("");
    } catch (err: unknown) {
      const e = err as ApiErrorShape;
      setError(e?.response?.data?.message || "Failed to load roles.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const rolesByPriority = useMemo(() => {
    const order = ["SUPER_ADMIN", "COLLEGE_ADMIN", "COMPANY_ADMIN", "STUDENT"];
    return [...roles].sort((a, b) => order.indexOf(a.role) - order.indexOf(b.role));
  }, [roles]);

  const togglePermission = (role: string, permission: string) => {
    setRoles((prev) =>
      prev.map((item) => {
        if (item.role !== role) return item;
        const exists = item.permissions.includes(permission);
        return {
          ...item,
          permissions: exists
            ? item.permissions.filter((p) => p !== permission)
            : [...item.permissions, permission],
        };
      }),
    );
  };

  const saveRole = async (role: RoleConfig) => {
    setSavingRole(role.role);
    try {
      await api.put(`/admin/roles/${role.role}`, {
        permissions: role.permissions,
      });
      await fetchRoles();
    } catch (err: unknown) {
      const e = err as ApiErrorShape;
      window.alert(e?.response?.data?.message || "Failed to save permissions.");
    } finally {
      setSavingRole(null);
    }
  };

  if (loading) return <p className="text-secondary">Loading role configurations...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="page space-y-6">
      <div className="page-header">
        <div>
          <h2 className="page-title">Roles & Permissions</h2>
          <p className="page-subtitle">Manage permission bundles for each portal role.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {rolesByPriority.map((role) => (
          <div key={role.role} className="card space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">{role.role.replace("_", " ")}</h3>
              {role.updatedAt ? (
                <span className="text-xs text-secondary">
                  Updated: {new Date(role.updatedAt).toLocaleString()}
                </span>
              ) : (
                <span className="text-xs text-secondary">Default policy</span>
              )}
            </div>

            <div className="grid gap-2">
              {PERMISSION_CATALOG.map((permission) => (
                <label key={permission} className="check-field">
                  <input
                    type="checkbox"
                    checked={role.permissions.includes(permission)}
                    onChange={() => togglePermission(role.role, permission)}
                  />
                  <span>{permission}</span>
                </label>
              ))}
            </div>

            <button
              className="btn btn-primary"
              disabled={savingRole === role.role}
              onClick={() => void saveRole(role)}
            >
              {savingRole === role.role ? "Saving..." : "Save Permissions"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
