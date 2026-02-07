"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminRootPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/admin/dashboard");
  }, [router]);
  return (
    <p style={{ padding: "40px", color: "#64748b" }}>Redirecting to dashboard...</p>
  );
}
