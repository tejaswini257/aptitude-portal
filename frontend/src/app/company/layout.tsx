"use client";

import "../globals.css";   // IMPORTANT
import CompanySidebar from "./components/CompanySidebar";

export default function CompanyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="company-layout">
      <CompanySidebar />
      <main className="company-content">{children}</main>
    </div>
  );
}
