"use client";

import BrandLogo from "@/components/BrandLogo";
import InstructorSidebar from "./components/InstructorSidebar";
import { useEffect, useState } from "react";
import api from "@/interceptors/axios";

function logout() {
    if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
        document.cookie = "accessToken=; path=/; max-age=0";
    }
    window.location.href = "/login";
}

export default function InstructorLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [profile, setProfile] = useState<any>(null);

    useEffect(() => {
        api.get("/instructor/me").then((res) => setProfile(res.data)).catch(console.error);
    }, []);

    return (
        <div className="portal-shell">
            <InstructorSidebar />

            <div className="portal-shell-main">
                <header className="portal-header flex justify-between">
                    <div className="portal-header-brand">
                        <BrandLogo compact />
                    </div>

                    <div className="flex items-center gap-4">
                        {profile && (
                            <div className="flex items-center gap-3 mr-4">
                                <span className="text-sm font-medium text-gray-700">{profile.name}</span>
                                <span className="px-2 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-full border border-indigo-100">
                                    {profile.department?.name}
                                </span>
                            </div>
                        )}
                        <button
                            onClick={logout}
                            className="btn btn-danger"
                        >
                            Logout
                        </button>
                    </div>
                </header>

                <main className="portal-content">{children}</main>
            </div>
        </div>
    );
}
