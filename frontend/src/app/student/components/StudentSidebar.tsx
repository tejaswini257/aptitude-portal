"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BookOpen, Code2, BarChart3 } from "lucide-react";

const menu = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/student/dashboard" },
  { name: "Practice", icon: BookOpen, path: "/student/practice" },
  { name: "Coding", icon: Code2, path: "/student/coding" },
  { name: "Analytics", icon: BarChart3, path: "/student/analytics" },
];

export default function StudentSidebar() {
  const pathname = usePathname();

  return (
    <aside
      style={{
        width: "240px",
        background: "#ffffff",
        borderRight: "1px solid #e5e7eb",
        padding: "30px 20px",
      }}
    >
      <h2
        style={{
          fontSize: "20px",
          fontWeight: 600,
          marginBottom: "40px",
          color: "#2563eb",
        }}
      >
        Student Panel
      </h2>

      <nav style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {menu.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.path;

          return (
            <Link
              key={item.name}
              href={item.path}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "10px 14px",
                borderRadius: "8px",
                background: active
                  ? "linear-gradient(90deg,#2563eb,#7c3aed)"
                  : "transparent",
                color: active ? "#fff" : "#374151",
                textDecoration: "none",
                fontWeight: 500,
              }}
            >
              <Icon size={18} />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
