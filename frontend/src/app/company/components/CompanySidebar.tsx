"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BarChart3,
  FileText,
  Briefcase,
  ClipboardList,
} from "lucide-react";

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
    <aside className="sidebar">
      <h2 className="sidebar-title">Company Panel</h2>

      <nav>
        {menu.map((item) => {
          const Icon = item.icon;
          const active =
            pathname === item.path ||
            pathname.startsWith(item.path + "/");

          return (
            <Link
              key={item.name}
              href={item.path}
              className={`sidebar-item ${
                active ? "sidebar-item-active" : ""
              }`}
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