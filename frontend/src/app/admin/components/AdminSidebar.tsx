"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menu = [
  { name: "Dashboard", path: "/admin/dashboard" },
  { name: "Colleges", path: "/admin/colleges" },
  { name: "Companies", path: "/admin/companies" },
  { name: "Students", path: "/admin/students" },
  { name: "Tests", path: "/admin/tests" },
  { name: "Analytics", path: "/admin/analytics" },
];

export default function AdminSidebar() {
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
        Super Admin
      </h2>

      {menu.map((item) => {
        const active = pathname === item.path || pathname.startsWith(item.path + "/");
        return (
          <Link
            key={item.name}
            href={item.path}
            style={{
              display: "block",
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
            {item.name}
          </Link>
        );
      })}
    </aside>
  );
}
