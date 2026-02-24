"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  Users,
  ClipboardList,
  Briefcase,
  FileEdit,
  Handshake,
  GraduationCap,
  Database
} from "lucide-react";

const menu = [
  { name: "Dashboard", path: "/college/dashboard", icon: LayoutDashboard },
  { name: "Departments", path: "/college/departments", icon: Building2 },
  { name: "Students", path: "/college/students", icon: GraduationCap },
  { name: "Tests", path: "/college/tests", icon: FileEdit },
  { name: "Practice Sets", path: "/college/practice", icon: ClipboardList },
  { name: "Drives", path: "/college/drives", icon: Briefcase },
  { name: "Instructors", path: "/college/instructors", icon: Users },
  { name: "Companies", path: "/college/companies", icon: Handshake },
  { name: "Question Bank", path: "/college/question-bank", icon: Database },
];

export default function CollegeSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[260px] min-h-screen bg-slate-900 border-r border-slate-800 p-4 text-slate-300 flex flex-col shrink-0 sticky top-0 h-screen overflow-y-auto hidden-scrollbar">
      <div className="flex items-center gap-3 px-2 mb-8 mt-4">
        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary font-bold shadow-sm border border-primary/20">
          A
        </div>
        <div>
          <h2 className="text-lg font-bold text-white tracking-wide leading-tight">AptiCore</h2>
          <p className="text-xs text-slate-400 font-medium tracking-wider uppercase">Enterprise</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1.5">
        {menu.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path || pathname.startsWith(item.path + '/');

          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${isActive
                  ? "bg-primary text-white shadow-md shadow-primary/20 font-medium"
                  : "hover:bg-slate-800 hover:text-white"
                }`}
            >
              <Icon size={18} className={isActive ? "text-white" : "text-slate-400 group-hover:text-white transition-colors"} />
              <span className="text-sm">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="px-2 pb-4 mt-8">
        <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
          <p className="text-xs text-slate-400 font-medium mb-1">Need help?</p>
          <p className="text-xs text-slate-500 mb-3">Check the support docs.</p>
          <button className="text-xs bg-slate-700 hover:bg-slate-600 text-white px-3 py-1.5 rounded transition block w-full text-center">Documentation</button>
        </div>
      </div>
    </aside>
  );
}
