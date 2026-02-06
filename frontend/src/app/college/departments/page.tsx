import Link from "next/link";

const departments = [
  { id: 1, name: "Computer Science", students: 120 },
  { id: 2, name: "Information Tech", students: 80 },
];

export default function DepartmentsPage() {
  return (
    <>
      <h1>Departments</h1>

      <Link href="/college/departments/create">
        + Create Department
      </Link>

      <div style={{ marginTop: "20px" }}>
        {departments.map((d) => (
          <div key={d.id}>
            <Link href={`/college/departments/${d.id}`}>
              {d.name} ({d.students} students)
            </Link>
          </div>
        ))}
      </div>
    </>
  );
}
