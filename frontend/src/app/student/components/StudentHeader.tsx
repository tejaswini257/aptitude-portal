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
        padding: "22px 40px",
        background: "linear-gradient(90deg,#ffffff,#f3f4ff)",
        borderBottom: "1px solid #e5e7eb",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div>
        <h1 style={{ fontSize: "24px", fontWeight: 600 }}>
          Welcome back 👋
        </h1>
        <p style={{ fontSize: "14px", color: "#6b7280", marginTop: "4px" }}>
          {today} • Track your performance & stay consistent
        </p>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            background: "#fff",
            padding: "8px 12px",
            borderRadius: "10px",
            border: "1px solid #e5e7eb",
          }}
        >
          <Search size={16} color="#6b7280" />
          <input
            placeholder="Search..."
            style={{
              border: "none",
              outline: "none",
              marginLeft: "8px",
              background: "transparent",
            }}
          />
        </div>

        <div style={{ position: "relative" }}>
          <Bell size={20} color="#374151" />
          <span
            style={{
              position: "absolute",
              top: "-4px",
              right: "-6px",
              background: "#ef4444",
              color: "#fff",
              fontSize: "10px",
              padding: "2px 6px",
              borderRadius: "50%",
            }}
          >
            3
          </span>
        </div>

        <Image
          src="https://i.pravatar.cc/40"
          alt="Profile"
          width={40}
          height={40}
          style={{
            borderRadius: "50%",
            border: "2px solid #6366f1",
          }}
        />
      </div>
    </header>
  );
}
