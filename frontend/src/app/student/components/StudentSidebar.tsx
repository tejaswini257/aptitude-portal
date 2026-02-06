"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Code,
  BarChart3,
} from "lucide-react";
import styles from "./StudentSidebar.module.css";

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
    <aside className={styles.sidebar}>
      <h2 className={styles.title}>
        Student Panel
      </h2>

      {menu.map((item) => {
        const Icon = item.icon;
        const active = pathname === item.href;

        return (
          <Link
            key={item.name}
            href={item.href}
            className={`${styles.menuLink} ${active ? styles.active : ""}`}
          >
            <Icon size={18} />
            {item.name}
          </Link>
        );
      })}
    </aside>
  );
}
