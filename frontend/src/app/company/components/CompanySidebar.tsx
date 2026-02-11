"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BarChart3, FileText, Briefcase, ClipboardList } from "lucide-react";

const menu = [
  { name: "Dashboard", path: "/company/dashboard", icon: LayoutDashboard },
  { name: "Drives", path: "/company/drives", icon: Briefcase },
  { name: "Tests", path: "/company/tests", icon: ClipboardList },
  { name: "Questions", path: "/company/questions", icon: FileText },
  { name: "Analytics", path: "/company/analytics", icon: BarChart3 },
];

export default function CompanySidebar() {
  const pathname = usePathname();

  return (
    <aside
      style={{
        width: "240px",
        background: "#ffffff",
        borderRight: "1px solid #e2e8f0",
        padding: "30px 20px",
      }}
    >
      <h2
        style={{
          fontSize: "20px",
          fontWeight: 600,
          marginBottom: "30px",
        }}
      >
        Company Panel
      </h2>

      {menu.map((item) => {
        const ActiveIcon = item.icon;
        const active = pathname === item.path;

        return (
          <Link
            key={item.name}
            href={item.path}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "10px 14px",
              borderRadius: "10px",
              marginBottom: "10px",
              background: active
                ? "linear-gradient(90deg,#4f46e5,#7c3aed)"
                : "transparent",
              color: active ? "#fff" : "#334155",
              textDecoration: "none",
              fontWeight: 500,
            }}
          >
            <ActiveIcon size={18} />
            {item.name}
          </Link>
        );
      })}
    </aside>
  );
}
