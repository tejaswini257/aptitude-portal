"use client";

import StudentSidebar from "./components/StudentSidebar";
import StudentHeader from "./components/StudentHeader";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="app-layout">
      <StudentSidebar />
      <div className="app-main">
        <StudentHeader />
        <main className="app-content">{children}</main>
      </div>
    </div>
  );
}