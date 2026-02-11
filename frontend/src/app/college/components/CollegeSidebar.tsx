"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menu = [
  { name: "Dashboard", path: "/college/dashboard" },
  { name: "Departments", path: "/college/departments" },
  { name: "Students", path: "/college/students" },
  { name: "Tests", path: "/college/tests" },
  { name: "Drives", path: "/college/drives" },
  { name: "Analytics", path: "/college/analytics" },
  { name: "Companies", path: "/college/companies" },
];

export default function CollegeSidebar() {
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
        College Panel
      </h2>

      {menu.map((item) => {
        const active =
          pathname === item.path || pathname.startsWith(item.path + "/");
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
                ? "linear-gradient(90deg,#059669,#10b981)"
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
