"use client";

import BrandLogo from "@/components/BrandLogo";
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
    <div className="portal-shell">
      <AdminSidebar />

      <div className="portal-shell-main">
        <header className="portal-header">
          <div className="portal-header-brand">
            <BrandLogo compact />
          </div>

          <button
            onClick={logout}
            className="btn btn-danger"
          >
            Logout
          </button>
        </header>

        <main className="portal-content">{children}</main>
      </div>
    </div>
  );
}
