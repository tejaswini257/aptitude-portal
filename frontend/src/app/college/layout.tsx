"use client";

import CollegeSidebar from "./components/CollegeSidebar";

export default function CollegeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc" }}>
      <CollegeSidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <main style={{ padding: "40px", flex: 1 }}>{children}</main>
      </div>
    </div>
  );
}
