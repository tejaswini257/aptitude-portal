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
    <header
      style={{
        padding: "20px 40px",
        background: "#ffffff",
        borderBottom: "1px solid #e2e8f0",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div>
        <h1 style={{ fontSize: "22px", fontWeight: 600 }}>
          Welcome Recruiter 👋
        </h1>
        <div style={{ fontSize: "14px", color: "#64748b" }}>{today}</div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            background: "#f1f5f9",
            padding: "8px 12px",
            borderRadius: "10px",
            width: "220px",
          }}
        >
          <Search size={16} color="#64748b" />
          <input
            placeholder="Search..."
            style={{
              border: "none",
              outline: "none",
              background: "transparent",
              marginLeft: "8px",
              width: "100%",
            }}
          />
        </div>

        <Bell size={20} />

        <Image
          src="https://i.pravatar.cc/40?img=5"
          alt="Profile"
          width={40}
          height={40}
          style={{
            borderRadius: "50%",
          }}
        />
      </div>
    </header>
  );
}
