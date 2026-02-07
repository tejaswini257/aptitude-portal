"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function DashboardPage() {
  const [accuracy, setAccuracy] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAccuracy(78);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <h2 style={{ fontSize: "26px", fontWeight: 600, marginBottom: "30px" }}>
        Dashboard Overview
      </h2>

      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
          gap: "24px",
          marginBottom: "40px",
        }}
      >
        <StatCard title="Tests Attempted" value="12" />
        <StatCard title="Average Score" value="78%" />
        <StatCard title="Active Drives" value="3" />
      </div>

      {/* Weekly Progress */}
      <div
        style={{
          background: "#fff",
          padding: "28px",
          borderRadius: "14px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
          marginBottom: "30px",
        }}
      >
        <h3 style={{ marginBottom: "10px" }}>Weekly Performance</h3>
        <p style={{ color: "#6b7280", marginBottom: "16px" }}>
          You improved 12% compared to last week.
        </p>

        <div
          style={{
            height: "10px",
            background: "#e5e7eb",
            borderRadius: "6px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${accuracy}%`,
              background: "linear-gradient(90deg,#4f46e5,#7c3aed)",
              transition: "width 1s ease",
            }}
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div
        style={{
          background: "#fff",
          padding: "28px",
          borderRadius: "14px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
          display: "flex",
          gap: "20px",
        }}
      >
        <Link href="/student/practice">
          <button style={buttonStyle}>Start Practice</button>
        </Link>

        <Link href="/student/coding">
          <button style={buttonStyle}>Coding Challenges</button>
        </Link>

        <Link href="/student/analytics">
          <button style={buttonStyle}>View Analytics</button>
        </Link>
      </div>
    </>
  );
}

function StatCard({ title, value }: any) {
  return (
    <div
      style={{
        background: "#fff",
        padding: "22px",
        borderRadius: "14px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
      }}
    >
      <p style={{ color: "#6b7280" }}>{title}</p>
      <h3 style={{ fontSize: "26px", marginTop: "6px" }}>{value}</h3>
    </div>
  );
}

const buttonStyle = {
  padding: "12px 20px",
  background: "linear-gradient(90deg,#4f46e5,#7c3aed)",
  border: "none",
  color: "#fff",
  borderRadius: "10px",
  cursor: "pointer",
};

{/* Module Progress */}
<div style={{
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
  gap: "20px",
  marginTop: "40px"
}}>
  <ProgressCard title="Quantitative" progress={70} />
  <ProgressCard title="Logical" progress={60} />
  <ProgressCard title="Verbal" progress={85} />
  <ProgressCard title="Coding" progress={50} />
</div>

function ProgressCard({ title, progress }: any) {
  return (
    <div style={{
      background: "#fff",
      padding: "20px",
      borderRadius: "14px",
      boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
    }}>
      <p style={{ marginBottom: "10px" }}>{title}</p>
      <div style={{
        height: "8px",
        background: "#e5e7eb",
        borderRadius: "6px",
        overflow: "hidden"
      }}>
        <div style={{
          height: "100%",
          width: `${progress}%`,
          background: "linear-gradient(90deg,#4f46e5,#7c3aed)",
          transition: "width 0.5s ease"
        }} />
      </div>
      <p style={{ marginTop: "8px", fontSize: "14px", color: "#6b7280" }}>
        {progress}% Completed
      </p>
    </div>
  );
}
