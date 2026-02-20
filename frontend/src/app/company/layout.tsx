"use client";

import CompanySidebar from "./components/CompanySidebar";
import CompanyHeader from "./components/CompanyHeader";

export default function CompanyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="app-layout">
      <CompanySidebar />

      <div className="app-main">
        <CompanyHeader />
        <main className="app-content">{children}</main>
      </div>
    </div>
  );
}