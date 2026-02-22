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
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex justify-end items-center px-6 py-4 bg-white border-b">
          <button
            onClick={logout}
            className="px-4 py-2 rounded-md bg-red-500 text-white text-sm hover:bg-red-600"
          >
            Logout
          </button>
        </header>

        {/* Page content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}