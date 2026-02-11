import StudentSidebar from "./components/StudentSidebar";
import StudentHeader from "./components/StudentHeader";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f5f7fb" }}>
      <StudentSidebar />

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <StudentHeader />
        <main style={{ padding: "30px 40px" }}>{children}</main>
      </div>
    </div>
  );
}
