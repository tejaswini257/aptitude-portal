"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menu = [
  { name: "Dashboard", href: "/student/dashboard" },
  { name: "Practice", href: "/student/practice" },
  { name: "Tests", href: "/student/tests" },
  { name: "Coding", href: "/student/coding" },
  { name: "Analytics", href: "/student/analytics" },
];

export default function StudentSidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-white shadow-md p-4">
      <h2 className="text-xl font-bold mb-6">Student Panel</h2>
      <ul className="space-y-3">
        {menu.map((item) => (
          <li key={item.name}>
            <Link
              href={item.href}
              className={`block p-2 rounded-md ${
                pathname === item.href
                  ? "bg-blue-500 text-white"
                  : "hover:bg-gray-200"
              }`}
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
