"use client";

import Link from "next/link";
import styles from "../student.module.css";

export default function StudentSidebar() {
  return (
    <aside className={styles.sidebar}>
      <h3>Aptitude Portal</h3>

      <nav>
        <Link href="/student/dashboard">Dashboard</Link>
        <Link href="/student/practice">Practice</Link>
        <Link href="/student/coding">Coding</Link>
        <Link href="/student/mocks">Mocks</Link>
        <Link href="/student/analytics">Analytics</Link>
      </nav>
    </aside>
  );
}
