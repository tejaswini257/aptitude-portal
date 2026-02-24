"use client";

import { useEffect, useState } from "react";
import api from "@/interceptors/axios";
import { Users } from "lucide-react";

export default function InstructorStudentsPage() {
    const [students, setStudents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get("/instructor/students").then((res) => {
            setStudents(res.data);
            setLoading(false);
        }).catch(console.error);
    }, []);

    return (
        <div className="page pb-8 space-y-8">
            <div className="page-header flex justify-between items-center">
                <div>
                    <h2 className="page-title">Department Students</h2>
                    <p className="page-subtitle">View all students registered under your department.</p>
                </div>
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
                    <Users size={24} />
                </div>
            </div>

            <div className="card overflow-x-auto">
                <table className="table w-full text-left">
                    <thead>
                        <tr>
                            <th className="px-6 py-4 border-b text-sm font-semibold text-gray-600 bg-gray-50">Roll No</th>
                            <th className="px-6 py-4 border-b text-sm font-semibold text-gray-600 bg-gray-50">Email</th>
                            <th className="px-6 py-4 border-b text-sm font-semibold text-gray-600 bg-gray-50">Year</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading ? (
                            <tr><td colSpan={3} className="px-6 py-4 text-center text-gray-500">Loading students...</td></tr>
                        ) : students.length === 0 ? (
                            <tr><td colSpan={3} className="px-6 py-4 text-center text-gray-500">No students found.</td></tr>
                        ) : (
                            students.map((student) => (
                                <tr key={student.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{student.rollNo}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{student.user?.email}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">Year {student.year}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
