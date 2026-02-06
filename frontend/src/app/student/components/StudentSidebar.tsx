"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Code,
  BarChart3,
} from "lucide-react";

const menu = [
  {
    name: "Dashboard",
    href: "/student/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Practice",
    href: "/student/practice",
    icon: BookOpen,
  },
  {
    name: "Coding",
    href: "/student/coding",
    icon: Code,
  },
  {
    name: "Analytics",
    href: "/student/analytics",
    icon: BarChart3,
  },
];

export default function StudentSidebar() {
  const pathname = usePathname();

  return (
    <aside
      style={{
        width: "250px",
        background: "#ffffff",
        borderRight: "1px solid #e5e7eb",
        padding: "30px 20px",
      }}
    >
      <h2
        style={{
          fontSize: "20px",
          fontWeight: 600,
          marginBottom: "30px",
          background: "linear-gradient(90deg,#2563eb,#7c3aed)",
          WebkitBackgroundClip: "text",
          color: "transparent",
        }}
      >
        Student Panel
      </h2>

      {menu.map((item) => {
        const Icon = item.icon;
        const active = pathname === item.href;

        return (
          <Link
            key={item.name}
            href={item.href}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "12px 16px",
              borderRadius: "10px",
              marginBottom: "12px",
              textDecoration: "none",
              fontWeight: 500,
              transition: "0.3s",
              color: active ? "#ffffff" : "#374151",
              background: active
                ? "linear-gradient(90deg,#2563eb,#7c3aed)"
                : "transparent",
            }}
          >
            <Icon size={18} />
            {item.name}
          </Link>
        );
      })}
    </aside>
  );
}
