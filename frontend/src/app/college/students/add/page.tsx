import { Suspense } from "react";
import AddStudentForm from "./AddStudentForm";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AddStudentForm />
    </Suspense>
  );
}
