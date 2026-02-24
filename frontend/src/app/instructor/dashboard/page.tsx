"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import api from "@/interceptors/axios";
import { Users, FileText, CheckCircle, BarChart3 } from "lucide-react";

type DashboardStats = {
    studentsCount: number;
    testsCreated: number;
    testsActive: number;
};

export default function InstructorDashboardPage() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get("/instructor/dashboard").then((res) => {
            setStats(res.data);
            setLoading(false);
        }).catch(console.error);
    }, []);

    if (loading) return <div className="page p-8 text-center text-secondary">Loading dashboard stats...</div>;

    return (
        <div className="page space-y-8 pb-8">
            <div className="page-header">
                <div>
                    <h2 className="page-title">Instructor Dashboard</h2>
                    <p className="page-subtitle">Overview of your department students and tests.</p>
                </div>
            </div>

            <div className="space-y-6">
                <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">Department Overview</h3>
                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    <MetricLinkCard title="Total Students" value={stats?.studentsCount ?? 0} href="/instructor/students" icon={<Users size={20} />} tone="success" />
                    <MetricLinkCard title="Active Tests" value={stats?.testsActive ?? 0} href="/instructor/tests" icon={<FileText size={20} />} tone="primary" />
                    <MetricLinkCard title="Tests Created" value={stats?.testsCreated ?? 0} href="/instructor/tests" icon={<CheckCircle size={20} />} tone="info" />
                </div>
            </div>

            <div className="space-y-6 pt-4">
                <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">Analytics</h3>
                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    <MetricCard title="Average Performance" value="N/A" trend="Overall" icon={<BarChart3 size={20} />} tone="warning" />
                </div>
            </div>
        </div>
    );
}

function MetricLinkCard({ title, value, href, icon, tone }: any) {
    const toneColors: Record<string, string> = {
        info: "text-blue-600 bg-blue-50 border-blue-100",
        success: "text-emerald-600 bg-emerald-50 border-emerald-100",
        primary: "text-indigo-600 bg-indigo-50 border-indigo-100",
        warning: "text-amber-600 bg-amber-50 border-amber-100",
    };

    return (
        <Link href={href} className="card p-5 hover:shadow-lg transition-shadow duration-200 border border-gray-100 relative overflow-hidden group block">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-2.5 rounded-lg border ${toneColors[tone] || toneColors.primary}`}>
                    {icon}
                </div>
                <div className="text-sm font-medium px-2 py-0.5 rounded-full text-gray-500 bg-gray-50 opacity-0 group-hover:opacity-100 transition-opacity">
                    View all →
                </div>
            </div>
            <h4 className="text-gray-500 text-sm font-medium mb-1">{title}</h4>
            <p className="text-3xl font-bold text-gray-900 tracking-tight">{value}</p>

            <div className={`absolute -bottom-6 -right-6 w-24 h-24 rounded-full opacity-[0.03] group-hover:opacity-[0.06] transition-opacity duration-300 pointer-events-none ${(toneColors[tone] || toneColors.primary).split(' ')[1]}`} />
        </Link>
    );
}

function MetricCard({ title, value, trend, icon, tone }: any) {
    const toneColors: Record<string, string> = {
        info: "text-blue-600 bg-blue-50 border-blue-100",
        success: "text-emerald-600 bg-emerald-50 border-emerald-100",
        warning: "text-amber-600 bg-amber-50 border-amber-100",
        primary: "text-indigo-600 bg-indigo-50 border-indigo-100",
    };

    return (
        <div className="card p-5 border border-gray-100 relative overflow-hidden group">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-2.5 rounded-lg border ${toneColors[tone] || toneColors.primary}`}>
                    {icon}
                </div>
                <div className="text-sm font-medium px-2 py-0.5 rounded-full text-gray-500 bg-gray-50">
                    {trend}
                </div>
            </div>
            <h4 className="text-gray-500 text-sm font-medium mb-1">{title}</h4>
            <p className="text-3xl font-bold text-gray-900 tracking-tight">{value}</p>

            <div className={`absolute -bottom-6 -right-6 w-24 h-24 rounded-full opacity-[0.03] pointer-events-none ${(toneColors[tone] || toneColors.primary).split(' ')[1]}`} />
        </div>
    );
}
