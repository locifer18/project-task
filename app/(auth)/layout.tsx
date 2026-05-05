import GridShape from "@/components/common/GridShape";
import ThemeTogglerTwo from "@/components/common/ThemeTogglerTwo";
import Link from "next/link";
import React from "react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-white dark:bg-slate-900">
      {/* Form side */}
      <div className="flex flex-1 flex-col justify-center px-6 py-12 lg:px-12">
        {/* Logo */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M9 11l3 3L22 4" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">TaskFlow</span>
          </Link>
        </div>
        {children}
      </div>

      {/* Decorative side — hidden on mobile */}
      <div className="hidden lg:flex lg:w-1/2 bg-blue-600 dark:bg-slate-800 items-center justify-center relative overflow-hidden">
        <GridShape />
        <div className="relative z-10 text-center px-12">
          <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-6">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
              <path d="M9 11l3 3L22 4" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">TaskFlow</h1>
          <p className="text-blue-100 dark:text-slate-300 text-lg max-w-xs mx-auto">
            Manage projects, assign tasks, and track progress together.
          </p>
        </div>
      </div>

      {/* Theme toggle */}
      <div className="fixed bottom-6 right-6 z-50">
        <ThemeTogglerTwo />
      </div>
    </div>
  );
}
