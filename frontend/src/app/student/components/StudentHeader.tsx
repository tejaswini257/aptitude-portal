"use client";

import Image from "next/image";
import { Bell, Search } from "lucide-react";
import styles from "./StudentHeader.module.css";

export default function StudentHeader() {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* LEFT SECTION */}
        <div>
          <h1 className={styles.title}>
            Welcome back 👋
          </h1>

          <div className={styles.subtitle}>
            {today} • Track your performance and stay consistent.
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className={styles.rightSection}>
          {/* SEARCH */}
          <div className={styles.searchBox}>
            <Search size={16} color="#64748b" />
            <input
              className={styles.searchInput}
              placeholder="Search..."
            />
          </div>

          {/* NOTIFICATION */}
          <div className={styles.notification}>
            <Bell size={20} color="#475569" />
            <span className={styles.badge}>
              3
            </span>
          </div>

          {/* PROFILE */}
          <Image
            src="https://i.pravatar.cc/40"
            alt="Profile"
            width={40}
            height={40}
            className={styles.profileImage}
          />
        </div>
      </div>
    </header>
  );
}
