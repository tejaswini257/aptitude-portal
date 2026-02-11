"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CollegeIndexPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/college/dashboard");
  }, [router]);
  return (
    <div className="flex items-center justify-center min-h-[200px] text-gray-500">
      Redirecting…
    </div>
  );
}
