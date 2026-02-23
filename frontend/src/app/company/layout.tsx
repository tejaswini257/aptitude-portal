"use client";

import BrandLogo from "@/components/BrandLogo";
import CompanySidebar from "./components/CompanySidebar";

function logout() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("accessToken");
    document.cookie = "accessToken=; path=/; max-age=0";
  }
  window.location.href = "/login";
}

export default function CompanyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="portal-shell">
      <CompanySidebar />

      <div className="portal-shell-main">
        <header className="portal-header">
          <div className="portal-header-brand">
            <BrandLogo compact />
            <h1 className="portal-header-title">Company Dashboard</h1>
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
