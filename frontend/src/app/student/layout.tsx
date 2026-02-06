import StudentSidebar from "./components/StudentSidebar";
import StudentHeader from "./components/StudentHeader";
import styles from "./student.module.css";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.container}>
      <StudentSidebar />

      <div className={styles.mainContent}>
        <StudentHeader />

        <div className={styles.wrapper}>
          <div className={styles.content}>{children}</div>
        </div>
      </div>
    </div>
  );
}
