"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import { LogOut, User, ChevronDown } from "lucide-react";

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/user", { credentials: "include" })
      .then((r) => r.ok ? r.json() : null)
      .then((d) => d?.user && setUser(d.user))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    localStorage.removeItem("user");
    window.location.href = "/signin";
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
      >
        <div className="relative w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-semibold overflow-hidden flex-shrink-0">
          {user?.image ? (
            <img src={user.image} alt="avatar" className="object-cover" />
          ) : (
            <span>{user?.name?.charAt(0)?.toUpperCase() || "U"}</span>
          )}
          <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-slate-900 ${user?.isLogin ? "bg-green-500" : "bg-gray-400"}`} />
        </div>
        <span className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-300 max-w-[100px] truncate">
          {user?.name || "User"}
        </span>
        <ChevronDown size={14} className={`text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-lg py-1 z-50">
          {/* User info */}
          <div className="px-4 py-3 border-b border-gray-100 dark:border-slate-700">
            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user?.name || "User"}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email || ""}</p>
            <span className="mt-1 inline-block text-xs px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 font-medium">
              {user?.role || "MEMBER"}
            </span>
          </div>

          <Link
            href="/profile"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
          >
            <User size={15} className="text-gray-400" />
            My Profile
          </Link>

          <div className="border-t border-gray-100 dark:border-slate-700 mt-1 pt-1">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
            >
              <LogOut size={15} />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
