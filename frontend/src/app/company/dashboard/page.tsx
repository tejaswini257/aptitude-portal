export default function CompanyDashboard() {
  return (
    <>
      <h1 style={{ marginBottom: "30px" }}>Company Dashboard</h1>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "20px" }}>
        <Card label="Total Tests" value="12" />
        <Card label="Active Drives" value="4" />
        <Card label="Total Candidates" value="320" />
        <Card label="Shortlisted" value="45" />
      </div>

      <div style={{ marginTop: "40px", background: "white", padding: "24px", borderRadius: "14px" }}>
        <h3 style={{ marginBottom: "16px" }}>Recent Activity</h3>
        <ul style={{ color: "#6b7280" }}>
          <li>✔ New Drive Created</li>
          <li>✔ 120 Candidates Applied</li>
          <li>✔ Test Evaluation Completed</li>
        </ul>
      </div>
    </>
  );
}

function Card({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ background: "white", padding: "20px", borderRadius: "14px" }}>
      <p style={{ color: "#6b7280" }}>{label}</p>
      <h2>{value}</h2>
    </div>
  );
}
