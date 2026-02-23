"use client";
import "../../styles/tailwind.css";   // ✅ Correct Tailwind entry

import CollegeSidebar from "./components/CollegeSidebar";
import CollegeHeader from "./components/CollegeHeader";

export default function CollegeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <CollegeSidebar />

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Top header */}
        <CollegeHeader />

        {/* Page content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
