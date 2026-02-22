"use client";

import AdminSidebar from "./components/AdminSidebar";

function logout() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("accessToken");
    document.cookie = "accessToken=; path=/; max-age=0";
  }
  window.location.href = "/login";
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />

      <div className="flex-1 flex flex-col">
        <header className="flex justify-between items-center px-6 py-4 bg-white border-b">
          <h1 className="text-lg font-semibold text-gray-700">
            Admin Dashboard
          </h1>

          <button
            onClick={logout}
            className="px-4 py-2 rounded-md bg-red-500 text-white text-sm hover:bg-red-600 shadow-sm"
          >
            Logout
          </button>
        </header>

        <main className="p-6 bg-gray-100 min-h-screen">{children}</main>
      </div>
    </div>
  );
}