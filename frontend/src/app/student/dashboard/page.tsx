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
      <div className={styles.secondRow}>
        {/* PROGRESS CARD */}
        <div className={styles.chartCard}>
          <h3 className={styles.cardTitle}>
            Weekly Performance
          </h3>

          <p className={styles.cardDescription}>
            You improved 12% compared to last week.
          </p>

          <div className={styles.progressSection}>
            <div className={styles.progressLabel}>
              Overall Accuracy
            </div>

            <div className={styles.progressBar}>
              <div className={styles.progressFill} />
            </div>
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <div className={styles.chartCard}>
          <h3 className={styles.cardTitle}>
            Quick Actions
          </h3>

          <div className={styles.actionContainer}>
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
      <div className={styles.recentActivity}>
        <h3 className={styles.cardTitle}>
          Recent Activity
        </h3>

        <ul className={styles.activityList}>
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
      <div className={styles.kpiLabel}>
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
    <Link href={href} className={styles.actionLink}>
      <div className={styles.actionButtonStyle}>
        {label}
      </div>
    </Link>
  );
}
