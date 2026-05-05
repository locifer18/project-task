import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { SidebarProvider } from "@/context/SidebarContext";
import { Toaster } from "react-hot-toast";
import AppShell from "@/components/common/AppShell";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TaskFlow — Team Task Manager",
  description: "Manage projects, assign tasks, and track progress with your team.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={geist.variable} suppressHydrationWarning>
      <head>
        {/* Prevent dark mode flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem('theme')||'dark';if(t==='dark')document.documentElement.classList.add('dark');})();`,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
        <ThemeProvider>
          <SidebarProvider>
            <AppShell>{children}</AppShell>
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: "var(--toast-bg, #fff)",
                  color: "var(--toast-color, #111827)",
                  border: "1px solid #e5e7eb",
                  borderRadius: "0.75rem",
                  fontSize: "0.875rem",
                },
              }}
            />
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
