export default function CollegeDashboard() {
  return (
    <>
      <h1 style={{ marginBottom: "30px" }}>College Dashboard</h1>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "20px" }}>
        <Card label="Total Students" value="240" />
        <Card label="Departments" value="8" />
        <Card label="Active Drives" value="5" />
        <Card label="Selected Students" value="18" />
      </div>

      <div style={{ marginTop: "40px", background: "white", padding: "24px", borderRadius: "14px" }}>
        <h3 style={{ marginBottom: "16px" }}>Recent Activity</h3>
        <ul style={{ color: "#6b7280" }}>
          <li>✔ 15 new students registered</li>
          <li>✔ Infosys Drive Invitation</li>
          <li>✔ 5 students shortlisted</li>
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
