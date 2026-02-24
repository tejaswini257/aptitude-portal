"use client";

import { useState, useEffect } from "react";
import api from "@/interceptors/axios";
import { ClipboardList } from "lucide-react";

export default function InstructorTestsPage() {
    const [tests, setTests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get("/instructor/tests").then((res) => {
            setTests(res.data);
            setLoading(false);
        }).catch(console.error);
    }, []);

    return (
        <div className="page pb-8 space-y-8">
            <div className="page-header flex justify-between items-center">
                <div>
                    <h2 className="page-title">Assigned Tests</h2>
                    <p className="page-subtitle">Manage tests assigned to your department.</p>
                </div>
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
                    <ClipboardList size={24} />
                </div>
            </div>

            <div className="card p-8 text-center bg-gray-50 border border-dashed border-gray-200">
                <ClipboardList size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Tests Available</h3>
                <p className="text-gray-500 max-w-sm mx-auto">
                    {loading ? "Loading tests..." : "There are currently no tests assigned to your department."}
                </p>
            </div>
        </div>
    );
}
