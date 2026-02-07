"use client";

import styles from "../student.module.css";
import { BookOpen, BarChart3, Briefcase } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <>
      <h2 className={styles.title}>Dashboard Overview</h2>

      {/* KPI CARDS */}
      <div className={styles.kpiGrid}>
        <KpiCard
          icon={<BookOpen size={20} />}
          label="Tests Attempted"
          value="12"
        />
        <KpiCard
          icon={<BarChart3 size={20} />}
          label="Average Score"
          value="78%"
        />
        <KpiCard
          icon={<Briefcase size={20} />}
          label="Active Drives"
          value="3"
        />
      </div>

      {/* SECOND ROW */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "24px",
          marginTop: "30px",
        }}
      >
        {/* PROGRESS CARD */}
        <div className={styles.chartCard}>
          <h3 style={{ marginBottom: "16px" }}>
            Weekly Performance
          </h3>

          <p style={{ color: "#64748b" }}>
            You improved 12% compared to last week.
          </p>

          <div style={{ marginTop: "20px" }}>
            <div
              style={{
                marginBottom: "6px",
                fontSize: "14px",
              }}
            >
              Overall Accuracy
            </div>

            <div
              style={{
                height: "8px",
                background: "#e5e7eb",
                borderRadius: "999px",
              }}
            >
              <div
                style={{
                  width: "78%",
                  height: "100%",
                  borderRadius: "999px",
                  background:
                    "linear-gradient(90deg,#2563eb,#7c3aed)",
                }}
              />
            </div>
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <div className={styles.chartCard}>
          <h3 style={{ marginBottom: "16px" }}>
            Quick Actions
          </h3>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <ActionButton
              label="Start Practice"
              href="/student/practice"
            />

            <ActionButton
              label="Attempt Coding Challenge"
              href="/student/coding"
            />

            <ActionButton
              label="View Analytics"
              href="/student/analytics"
            />
          </div>
        </div>
      </div>

      {/* RECENT ACTIVITY */}
      <div
        className={styles.chartCard}
        style={{ marginTop: "30px" }}
      >
        <h3 style={{ marginBottom: "16px" }}>
          Recent Activity
        </h3>

        <ul
          style={{
            color: "#64748b",
            fontSize: "14px",
          }}
        >
          <li>✔ Completed Logical Reasoning Test</li>
          <li>✔ Scored 82% in Quant Practice</li>
          <li>✔ Attempted 2 Coding Challenges</li>
        </ul>
      </div>
    </>
  );
}

/* ===== KPI CARD ===== */

function KpiCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className={styles.kpiCard}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          color: "#64748b",
        }}
      >
        {icon}
        {label}
      </div>

      <div className={styles.kpiValue}>{value}</div>
    </div>
  );
}

/* ===== ACTION BUTTON (CLICKABLE) ===== */

function ActionButton({
  label,
  href,
}: {
  label: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      style={{ textDecoration: "none" }}
    >
      <div
        style={{
          padding: "12px 16px",
          borderRadius: "12px",
          background:
            "linear-gradient(90deg,#2563eb,#7c3aed)",
          color: "white",
          textAlign: "center",
          fontWeight: 500,
          cursor: "pointer",
          transition: "0.3s",
        }}
      >
        {label}
      </div>
    </Link>
  );
}
