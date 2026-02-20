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
    <div className="app-layout">
      <AdminSidebar />

      <div className="app-main">
        <header className="app-header">
          <button className="btn btn-danger" onClick={logout}>
            Logout
          </button>
        </header>

        <main className="app-content">{children}</main>
      </div>
    </div>
  );
}