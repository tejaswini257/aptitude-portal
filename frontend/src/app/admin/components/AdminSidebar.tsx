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
    <aside className="w-60 bg-slate-900 text-slate-200 min-h-screen border-r border-slate-800 p-6">
      {/* Title */}
      <h2 className="text-lg font-semibold mb-6 text-white">
        Super Admin
      </h2>

      {/* Menu */}
      <nav className="space-y-2">
        {menu.map((item) => {
          const active =
            pathname === item.path ||
            pathname.startsWith(item.path + "/");

          return (
            <Link
              key={item.name}
              href={item.path}
              className={`block px-3 py-2 rounded-md text-sm font-medium transition ${
                active
                  ? "bg-blue-600 text-white"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}