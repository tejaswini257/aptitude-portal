"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LucideIcon } from "lucide-react";
import BrandLogo from "@/components/BrandLogo";

type MenuItem = {
  name: string;
  path: string;
  icon?: LucideIcon;
};

type PortalSidebarProps = {
  title: string;
  menu: MenuItem[];
};

export default function PortalSidebar({ title, menu }: PortalSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="portal-sidebar">
      <BrandLogo compact />
      <h2 className="portal-sidebar-title">{title}</h2>

      <nav className="portal-sidebar-nav">
        {menu.map((item) => {
          const active = pathname === item.path || pathname.startsWith(item.path + "/");
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.path}
              className={`portal-sidebar-link ${active ? "is-active" : ""}`}
            >
              {Icon ? <Icon className="portal-sidebar-link-icon" /> : null}
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
