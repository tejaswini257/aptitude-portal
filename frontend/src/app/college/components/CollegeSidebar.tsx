"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menu = [
  { name: "Dashboard", path: "/college/dashboard" },
  { name: "Departments", path: "/college/departments" },
  { name: "Students", path: "/college/students" },
  { name: "Tests", path: "/college/tests" },
  { name: "Practice Sets", path: "/college/practice" },
  { name: "Drives", path: "/college/drives" },
  { name: "Analytics", path: "/college/analytics" },
  { name: "Companies", path: "/college/companies" },
];

export default function CollegeSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen bg-white border-r p-5">
      <h2 className="text-lg font-semibold mb-6">College Panel</h2>

      <nav className="space-y-2">
        {menu.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`block px-4 py-2 rounded-lg transition ${
              pathname === item.path
                ? "bg-emerald-500 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
