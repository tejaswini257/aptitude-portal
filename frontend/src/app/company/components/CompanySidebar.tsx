"use client";

import { LayoutDashboard, BarChart3, FileText, Briefcase, ClipboardList } from "lucide-react";
import PortalSidebar from "@/components/PortalSidebar";

const menu = [
  { name: "Dashboard", path: "/company/dashboard", icon: LayoutDashboard },
  { name: "Drives", path: "/company/drives", icon: Briefcase },
  { name: "Tests", path: "/company/tests", icon: ClipboardList },
  { name: "Questions", path: "/company/questions", icon: FileText },
  { name: "Analytics", path: "/company/analytics", icon: BarChart3 },
];

export default function CompanySidebar() {
  return <PortalSidebar title="Aptitude Portal" menu={menu} />;
}
