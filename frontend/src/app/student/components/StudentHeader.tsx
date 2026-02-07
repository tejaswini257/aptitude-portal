"use client";

import Image from "next/image";
import { Bell, Search } from "lucide-react";

export default function StudentHeader() {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  return (
    <header
      style={{
        height: "72px",
        background: "#ffffff",
        borderBottom: "1px solid #e5e7eb",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 32px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      {/* LEFT SIDE */}
      <div>
        <h2
          style={{
            fontSize: "18px",
            fontWeight: 600,
            color: "#111827",
            margin: 0,
          }}
        >
          Welcome back 👋
        </h2>

        <span
          style={{
            fontSize: "12px",
            color: "#64748b",
          }}
        >
          {today}
        </span>
      </div>

      {/* RIGHT SIDE */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "18px",
        }}
      >
        {/* Search */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            background: "#f8fafc",
            padding: "6px 12px",
            borderRadius: "8px",
            border: "1px solid #e2e8f0",
            width: "200px",
          }}
        >
          <Search size={16} color="#94a3b8" />
          <input
            placeholder="Search..."
            style={{
              border: "none",
              outline: "none",
              marginLeft: "8px",
              fontSize: "13px",
              background: "transparent",
              width: "100%",
            }}
          />
        </div>

        {/* Notification */}
        <div
          style={{
            position: "relative",
            cursor: "pointer",
            padding: "6px",
            borderRadius: "8px",
            transition: "0.2s",
          }}
        >
          <Bell size={18} color="#475569" />
          <span
            style={{
              position: "absolute",
              top: "-4px",
              right: "-4px",
              background: "#ef4444",
              color: "#fff",
              fontSize: "10px",
              padding: "2px 6px",
              borderRadius: "999px",
            }}
          >
            3
          </span>
        </div>

        {/* Profile */}
        <Image
          src="https://i.pravatar.cc/40"
          alt="Profile"
          width={36}
          height={36}
          style={{
            borderRadius: "50%",
            border: "2px solid #3b82f6",
            cursor: "pointer",
          }}
        />
      </div>
    </header>
  );
}
