"use client";

import BrandLogo from "@/components/BrandLogo";
import StudentSidebar from "./components/StudentSidebar";

function logout() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("accessToken");
    document.cookie = "accessToken=; path=/; max-age=0";
  }
  window.location.href = "/login";
}

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="portal-shell">
      <StudentSidebar />
      <div className="portal-shell-main">
        <header className="portal-header">
          <div className="portal-header-brand">
            <BrandLogo compact />
            <h1 className="portal-header-title">Student Dashboard</h1>
          </div>
          <button onClick={logout} className="btn btn-danger">
            Logout
          </button>
        </header>
        <main className="portal-content">{children}</main>
      </div>
    </div>
  );
}
