"use client";

import { usePathname, useRouter } from "next/navigation";

const menuItems = [
  { label: "Dashboard", path: "/company/dashboard" },
  { label: "Companies", path: "/company" },
  { label: "Drives", path: "/company/drives" },
  { label: "Tests", path: "/company/tests" },
  { label: "Questions", path: "/company/questions" },
  { label: "Analytics", path: "/company/analytics" },
];

export default function CompanySidebar() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <h2 className="sidebar-title">Company Panel</h2>

      <nav className="sidebar-menu">
        {menuItems.map((item) => {
          const isActive = pathname.startsWith(item.path);

          return (
            <button
              key={item.path}
              className={`sidebar-item ${isActive ? "active" : ""}`}
              onClick={() => router.push(item.path)}
            >
              {item.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
