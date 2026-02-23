"use client";

import {
  LayoutDashboard,
  Building2,
  BriefcaseBusiness,
  Users,
  ClipboardList,
  BarChart3,
  ShieldCheck,
  ReceiptText,
  Activity,
} from "lucide-react";
import PortalSidebar from "@/components/PortalSidebar";

const menu = [
  { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Colleges", path: "/admin/colleges", icon: Building2 },
  { name: "Companies", path: "/admin/companies", icon: BriefcaseBusiness },
  { name: "Students", path: "/admin/students", icon: Users },
  { name: "Tests", path: "/admin/tests", icon: ClipboardList },
  { name: "Analytics", path: "/admin/analytics", icon: BarChart3 },
];

export default function AdminSidebar() {
  return <PortalSidebar title="Aptitude Portal" menu={menu} />;
}
