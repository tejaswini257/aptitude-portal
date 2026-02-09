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
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc" }}>
      <AdminSidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <header
          style={{
            padding: "16px 24px",
            background: "#fff",
            borderBottom: "1px solid #e2e8f0",
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <button
            type="button"
            onClick={logout}
            style={{
              padding: "8px 16px",
              background: "#dc2626",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </header>
        <main style={{ padding: "40px", flex: 1 }}>{children}</main>
      </div>
    </div>
  );
}
