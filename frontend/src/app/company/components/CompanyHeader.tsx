"use client";

import { Bell, Search } from "lucide-react";
import Image from "next/image";

export default function CompanyHeader() {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  return (
    <header className="app-header">
      <div>
        <h1 className="header-title">Welcome Recruiter 👋</h1>
        <div className="header-subtitle">{today}</div>
      </div>

      <div className="flex items-center gap-6">
        <div className="search-box">
          <Search size={16} className="text-gray-500" />
          <input
            placeholder="Search..."
            className="search-input"
          />
        </div>

        <Bell className="text-gray-600" size={20} />

        <Image
          src="https://i.pravatar.cc/40?img=5"
          alt="Profile"
          width={40}
          height={40}
          className="avatar"
        />
      </div>
    </header>
  );
}