"use client";

import styles from "../company.module.css";

export default function CompanyAnalytics() {
  return (
    <div className={styles.pageWrapper}>
      <div className={styles.pageHeader}>
        <h2 className={styles.pageTitle}>Company Analytics</h2>
      </div>

      <div className={styles.grid3}>
        <StatCard title="Applications" value="180" />
        <StatCard title="Shortlisted" value="62" />
        <StatCard title="Selected" value="15" />
      </div>

      <div style={{ marginTop: "40px" }} className={styles.card}>
        <h3 style={{ marginBottom: "25px" }}>Hiring Funnel</h3>

        <Progress label="Applied" percent={100} />
        <Progress label="Shortlisted" percent={60} />
        <Progress label="Interviewed" percent={35} />
        <Progress label="Selected" percent={15} />
      </div>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <div className={styles.card}>
      <div className={styles.statTitle}>{title}</div>
      <div className={styles.statValue}>{value}</div>
    </div>
  );
}

function Progress({ label, percent }: { label: string; percent: number }) {
  return (
    <div className={styles.progressContainer}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span>{label}</span>
        <span>{percent}%</span>
      </div>

      <div className={styles.progressBar}>
        <div
          className={styles.progressFill}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
