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
        padding: "24px 40px",
        background:
          "linear-gradient(135deg, #ffffff 0%, #f1f5ff 100%)",
        borderBottom: "1px solid #e5e7eb",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* LEFT SECTION */}
        <div>
          <h1
            style={{
              fontSize: "26px",
              fontWeight: 600,
              color: "#111827",
            }}
          >
            Welcome back 👋
          </h1>

          <div
            style={{
              fontSize: "14px",
              color: "#64748b",
              marginTop: "6px",
            }}
          >
            {today} • Track your performance and stay consistent.
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
          }}
        >
          {/* SEARCH */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              background: "#ffffff",
              padding: "8px 12px",
              borderRadius: "10px",
              border: "1px solid #e5e7eb",
              width: "220px",
            }}
          >
            <Search size={16} color="#64748b" />
            <input
              placeholder="Search..."
              style={{
                border: "none",
                outline: "none",
                marginLeft: "8px",
                fontSize: "14px",
                width: "100%",
              }}
            />
          </div>

          {/* NOTIFICATION */}
          <div style={{ position: "relative", cursor: "pointer" }}>
            <Bell size={20} color="#475569" />
            <span
              style={{
                position: "absolute",
                top: "-4px",
                right: "-6px",
                background: "#ef4444",
                color: "white",
                fontSize: "10px",
                padding: "2px 6px",
                borderRadius: "999px",
              }}
            >
              3
            </span>
          </div>

          {/* PROFILE */}
          <Image
            src="https://i.pravatar.cc/40"
            alt="Profile"
            width={40}
            height={40}
            style={{
              borderRadius: "50%",
              border: "2px solid #2563eb",
            }}
          />
        </div>
      </div>
    </header>
  );
}
