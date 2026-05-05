"use client";
import { usePathname } from "next/navigation";
import AppHeader from "@/layout/AppHeader";
import AppSidebar from "@/layout/AppSidebar";
import { useSidebar } from "@/context/SidebarContext";

const AUTH_PATHS = ["/signin", "/signup", "/forgot-password"];

function Shell({ children }: { children: React.ReactNode }) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  const sidebarOpen = isExpanded || isHovered || isMobileOpen;

  return (
    <>
      <AppHeader />
      <div className="flex flex-1 pt-16">
        <AppSidebar />
        <main
          className={`flex-1 min-h-screen p-6 transition-all duration-300 ${
            sidebarOpen ? "lg:ml-[240px]" : "lg:ml-[72px]"
          }`}
        >
          {children}
        </main>
      </div>
    </>
  );
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = AUTH_PATHS.some((p) => pathname?.startsWith(p));

  if (isAuthPage) return <>{children}</>;
  return <Shell>{children}</Shell>;
}
