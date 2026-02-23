"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function CollegeHeader() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    router.replace("/login");
  };

  return (
    <header className="w-full bg-white border-b px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {/* Replace this with your real college logo URL later */}
        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold">
          C
        </div>

        <div>
          <h1 className="text-lg font-semibold text-gray-900">
            Your College Name
          </h1>
          <p className="text-xs text-gray-500">College Admin Panel</p>
        </div>
      </div>

      <button
        onClick={handleLogout}
        className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition"
      >
        Logout
      </button>
    </header>
  );
}
