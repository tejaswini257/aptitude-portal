"use client";

import CompanySidebar from "./components/CompanySidebar";
import CompanyHeader from "./components/CompanyHeader";

export default function CompanyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc" }}>
      <CompanySidebar />

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <CompanyHeader />

        <main
          style={{
            padding: "40px",
            flex: 1,
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
