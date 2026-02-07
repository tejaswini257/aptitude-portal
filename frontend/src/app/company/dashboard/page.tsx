export default function CompanyDashboard() {
  return (
    <>
      <h2 style={{ fontSize: "26px", fontWeight: 600, marginBottom: "30px" }}>
        Dashboard Overview
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: "20px",
        }}
      >
        <StatCard title="Active Drives" value="5" />
        <StatCard title="Total Applicants" value="342" />
        <StatCard title="Tests Created" value="12" />
      </div>
    </>
  );
}

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <div
      style={{
        background: "#ffffff",
        padding: "24px",
        borderRadius: "16px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
      }}
    >
      <p style={{ color: "#64748b", fontSize: "14px" }}>{title}</p>
      <h3 style={{ fontSize: "28px", marginTop: "10px" }}>{value}</h3>
    </div>
  );
}
