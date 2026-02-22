"use client";

import { Bell, Search } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function CompanyHeader() {
  const router = useRouter();

  const logout = () => {
    localStorage.removeItem("accessToken");
    document.cookie = "accessToken=; path=/; max-age=0";
    router.push("/login");
  };

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

      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <div className="search-box">
          <Search size={16} />
          <input placeholder="Search..." className="search-input" />
        </div>

        <Bell size={20} />

        <Image
          src="https://i.pravatar.cc/40?img=5"
          alt="Profile"
          width={40}
          height={40}
          className="avatar"
        />

        <button className="btn-danger" onClick={logout}>
          Logout
        </button>
      </div>
    </header>
  );
}