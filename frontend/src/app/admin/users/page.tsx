"use client";

import { useEffect, useState } from "react";
import api from "@/interceptors/axios";

type PlatformUser = {
  id: string;
  email: string;
  role: string;
  organizationName: string;
  createdAt: string;
  isBlocked: boolean;
  blockReason: string | null;
  blockedAt: string | null;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<PlatformUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/users");
      setUsers(Array.isArray(res.data) ? res.data : []);
      setError("");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleBlockToggle = async (user: PlatformUser) => {
    setProcessingId(user.id);
    try {
      if (user.isBlocked) {
        if (!window.confirm(`Are you sure you want to unblock ${user.email}?`)) return;
        await api.put(`/admin/users/${user.id}/unblock`);
      } else {
        const reason = window.prompt(`Enter reason for blocking ${user.email}:`, "Admin action");
        if (reason === null) return;
        await api.put(`/admin/users/${user.id}/block`, { reason });
      }
      await fetchUsers();
    } catch (err: any) {
      window.alert(err?.response?.data?.message || "Action failed.");
    } finally {
      setProcessingId(null);
    }
  };

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Platform Users</h1>
          <p className="text-gray-500">Manage, block, and unblock platform users.</p>
        </div>
      </div>

      <div className="card p-0 overflow-hidden">
        {loading && users.length === 0 ? (
          <p className="p-4 text-gray-500">Loading users...</p>
        ) : users.length === 0 ? (
          <p className="p-4 text-gray-500">No users found.</p>
        ) : (
          <table className="w-full border-collapse">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Email</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Role</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Organization</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 min-w-[200px]">
                    <div className="font-medium text-gray-900">{user.email}</div>
                    <div className="text-xs text-gray-500">Joined: {new Date(user.createdAt).toLocaleDateString()}</div>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className="px-2 py-1 bg-gray-100 rounded text-gray-700 whitespace-nowrap">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 truncate max-w-[200px]">
                    {user.organizationName}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {user.isBlocked ? (
                      <div>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                          Blocked
                        </span>
                        {user.blockReason && <div className="text-xs text-gray-500 mt-1 truncate max-w-[150px]" title={user.blockReason}>Reason: {user.blockReason}</div>}
                      </div>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                        Active
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      className={`btn btn-sm ${user.isBlocked ? "btn-outline border-blue-600 text-blue-600 hover:bg-blue-50" : "btn-outline text-red-600 border-red-600 hover:bg-red-50"}`}
                      onClick={() => handleBlockToggle(user)}
                      disabled={processingId === user.id}
                    >
                      {processingId === user.id ? "..." : user.isBlocked ? "Unblock" : "Block"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}