import StudentSidebar from "./components/StudentSidebar";
import StudentHeader from "./components/StudentHeader";
import styles from "./student.module.css";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <StudentSidebar />

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <StudentHeader />

        <div className={styles.wrapper}>
          <div className={styles.content}>{children}</div>
        </div>
      </div>
    </div>
  );
}
