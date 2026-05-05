"use client";
import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebar } from "../context/SidebarContext";
import { LayoutDashboard, FolderGit2, Layers } from "lucide-react";

const navItems = [
  { name: "Dashboard", path: "/", icon: LayoutDashboard },
  { name: "Projects", path: "/project", icon: FolderGit2 },
  { name: "Kanban Board", path: "/kanban", icon: Layers },
];

export default function AppSidebar() {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();
  const [userRole, setUserRole] = useState<string | null>(null);
  const isOpen = isExpanded || isHovered || isMobileOpen;

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        const data = JSON.parse(stored);
        setUserRole(data?.role || null);
      } catch {}
    }
  }, []);

  const isActive = useCallback(
    (path: string) => (path === "/" ? pathname === "/" : pathname?.startsWith(path)),
    [pathname]
  );

  const renderItem = (item: { name: string; path: string; icon: any }) => {
    const Icon = item.icon;
    const active = isActive(item.path);
    return (
      <li key={item.path}>
        <Link
          href={item.path}
          className={`menu-item ${active ? "menu-item-active" : "menu-item-inactive"}`}
        >
          <span className={active ? "menu-item-icon-active" : "menu-item-icon-inactive"}>
            <Icon className="w-5 h-5 flex-shrink-0" strokeWidth={1.8} />
          </span>
          {isOpen && <span className="menu-item-text truncate">{item.name}</span>}
        </Link>
      </li>
    );
  };

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" />
      )}

      <aside
        className={`
          fixed top-16 left-0 h-[calc(100vh-4rem)] z-50
          flex flex-col
          bg-white dark:bg-slate-900
          border-r border-gray-200 dark:border-slate-700
          transition-all duration-300 ease-in-out
          ${isOpen ? "w-[240px]" : "w-[72px]"}
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
        onMouseEnter={() => !isExpanded && setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Nav */}
        <nav className="flex-1 overflow-y-auto no-scrollbar py-4 px-3 space-y-6">
          <div>
            {isOpen && (
              <p className="px-2 mb-2 text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-slate-500">
                Main
              </p>
            )}
            <ul className="space-y-1">{navItems.map(renderItem)}</ul>
          </div>
        </nav>
      </aside>
    </>
  );
}
