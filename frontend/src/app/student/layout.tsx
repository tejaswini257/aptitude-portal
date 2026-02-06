import StudentSidebar from "./components/StudentSidebar";
import StudentHeader from "./components/StudentHeader";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <StudentSidebar />
      <div className="flex-1">
        <StudentHeader />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
