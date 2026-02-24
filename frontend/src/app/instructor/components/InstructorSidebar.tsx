"use client";

import {
    LayoutDashboard,
    Users,
    ClipboardList,
    BarChart3,
} from "lucide-react";
import PortalSidebar from "@/components/PortalSidebar";

const menu = [
    { name: "Dashboard", path: "/instructor/dashboard", icon: LayoutDashboard },
    { name: "Students", path: "/instructor/students", icon: Users },
    { name: "Tests", path: "/instructor/tests", icon: ClipboardList },
    { name: "Analytics", path: "/instructor/analytics", icon: BarChart3 },
];

export default function InstructorSidebar() {
    return <PortalSidebar title="Aptitude Portal" menu={menu} />;
}
