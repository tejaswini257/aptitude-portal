"use client";

import { LayoutDashboard, Building2, Users, ClipboardList, Briefcase, BarChart3, Handshake } from "lucide-react";
import PortalSidebar from "@/components/PortalSidebar";

const menu = [
  { name: "Dashboard", path: "/college/dashboard", icon: LayoutDashboard },
  { name: "Departments", path: "/college/departments", icon: Building2 },
  { name: "Students", path: "/college/students", icon: Users },
  { name: "Tests", path: "/college/tests", icon: ClipboardList },
  { name: "Drives", path: "/college/drives", icon: Briefcase },
  { name: "Analytics", path: "/college/analytics", icon: BarChart3 },
  { name: "Companies", path: "/college/companies", icon: Handshake },
];

export default function CollegeSidebar() {
  return <PortalSidebar title="College Panel" menu={menu} />;
}
