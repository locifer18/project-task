"use client";
import { ThemeToggleButton } from "@/components/common/ThemeToggleButton";
import UserDropdown from "@/components/header/UserDropdown";
import { useSidebar } from "@/context/SidebarContext";
import Link from "next/link";
import React, { useState } from "react";

const APP_NAME = "TaskFlow";

export default function AppHeader() {
  const { toggleSidebar, toggleMobileSidebar } = useSidebar();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleToggle = () => {
    if (typeof window !== "undefined" && window.innerWidth >= 1024) {
      toggleSidebar();
    } else {
      toggleMobileSidebar();
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 px-4 lg:px-6">
      {/* Left: hamburger + logo */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleToggle}
          className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Toggle sidebar"
        >
          <svg width="18" height="14" viewBox="0 0 18 14" fill="none">
            <path d="M1 1h16M1 7h16M1 13h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>

        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-blue-600 flex items-center justify-center">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <path d="M9 11l3 3L22 4" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="font-bold text-gray-900 dark:text-white text-base hidden sm:block">{APP_NAME}</span>
        </Link>
      </div>

      {/* Right: actions */}
      <div className="ml-auto flex items-center gap-2">
        <ThemeToggleButton />
        <UserDropdown />
      </div>
    </header>
  );
}
