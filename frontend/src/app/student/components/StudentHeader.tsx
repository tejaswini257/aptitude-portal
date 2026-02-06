"use client";

import { Bell, Search } from "lucide-react";
import Image from "next/image";

export default function StudentHeader() {
  return (
    <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
      
      {/* Left Section */}
      <div>
        <h1 className="text-xl font-semibold text-gray-800">
          Student Dashboard
        </h1>
        <p className="text-sm text-gray-500">
          Welcome back 👋
        </p>
      </div>

      {/* Center Section (Search) */}
      <div className="hidden md:flex items-center bg-gray-100 rounded-lg px-3 py-2 w-96">
        <Search size={18} className="text-gray-500 mr-2" />
        <input
          type="text"
          placeholder="Search tests, practice, coding..."
          className="bg-transparent outline-none w-full text-sm"
        />
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        
        {/* Notification */}
        <button className="relative p-2 rounded-full hover:bg-gray-100 transition">
          <Bell size={20} className="text-gray-600" />
          <span className="absolute top-1 right-1 bg-red-500 text-white text-xs px-1 rounded-full">
            3
          </span>
        </button>

        {/* Profile */}
        <div className="flex items-center gap-3 cursor-pointer">
          <Image
            src="https://i.pravatar.cc/40"
            alt="Profile"
            width={40}
            height={40}
            className="rounded-full"
          />
          <div className="hidden md:block">
            <p className="text-sm font-medium text-gray-700">
              Komal
            </p>
            <p className="text-xs text-gray-500">
              CSE Department
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
