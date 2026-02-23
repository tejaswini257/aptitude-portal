"use client";

import { LayoutDashboard, BookOpen, Code2, BarChart3, ClipboardList, UserCircle2 } from "lucide-react";
import PortalSidebar from "@/components/PortalSidebar";

const menu = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/student/dashboard" },
  { name: "Tests", icon: ClipboardList, path: "/student/tests" },
  { name: "Practice", icon: BookOpen, path: "/student/practice" },
  { name: "Coding", icon: Code2, path: "/student/coding" },
  { name: "Analytics", icon: BarChart3, path: "/student/analytics" },
  { name: "Profile", icon: UserCircle2, path: "/student/profile" },
];

export default function StudentSidebar() {
  return <PortalSidebar title="Student Panel" menu={menu} />;
}
