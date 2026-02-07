"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  ClipboardList,
  Briefcase,
  BarChart3,
} from "lucide-react";

export default function CompanyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const menu = [
    { name: "Dashboard", path: "/company/dashboard", icon: <LayoutDashboard size={18} /> },
    { name: "Tests", path: "/company/tests", icon: <FileText size={18} /> },
    { name: "Questions", path: "/company/questions", icon: <ClipboardList size={18} /> },
    { name: "Drives", path: "/company/drives", icon: <Briefcase size={18} /> },
    { name: "Analytics", path: "/company/analytics", icon: <BarChart3 size={18} /> },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <aside
        style={{
          width: "240px",
          background: "#ffffff",
          borderRight: "1px solid #e5e7eb",
          padding: "30px 20px",
        }}
      >
        <h2 style={{ marginBottom: "30px" }}>Company Panel</h2>

        <nav style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {menu.map((item) => (
            <Link
              key={item.name}
              href={item.path}
              style={{
                textDecoration: "none",
                padding: "10px 14px",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                background:
                  pathname === item.path
                    ? "linear-gradient(90deg,#2563eb,#7c3aed)"
                    : "transparent",
                color: pathname === item.path ? "white" : "#374151",
                fontWeight: 500,
              }}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>

      <main
        style={{
          flex: 1,
          padding: "40px",
          background: "#f1f5f9",
        }}
      >
        {children}
      </main>
    </div>
  );
}
