"use client";

import CollegeSidebar from "./components/CollegeSidebar";

export default function CollegeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="app-layout">
      <CollegeSidebar />
      <div className="app-main">
        <main className="app-content">{children}</main>
      </div>
    </div>
  );
}