export default function DrivesPage() {
  const drives = [
    { id: 1, name: "TCS Recruitment Drive", status: "Active" },
    { id: 2, name: "Infosys Hiring", status: "Closed" },
  ];

  return (
    <>
      <h1 style={{ marginBottom: "24px" }}>Recruitment Drives</h1>

      {drives.map((d) => (
        <div key={d.id} style={{ background: "white", padding: "20px", borderRadius: "14px", marginBottom: "16px" }}>
          <h3>{d.name}</h3>
          <p style={{ color: "#6b7280" }}>Status: {d.status}</p>
        </div>
      ))}
    </>
  );
}
