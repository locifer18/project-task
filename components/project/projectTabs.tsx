"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";


export default function ProjectTabs({ activeTab, setActiveTab }: any) {
    const [isAdmin, setIsAdmin] = useState(false)

    const checkUserRole = async () => {
      try {
        const response = localStorage.getItem("user");
        // const response = await fetch('/api/user');
        // const data = await response.json();
        const data = response ? JSON.parse(response) : null;
        // if (data.user && data.user.role === 'ADMIN') {
        //   setIsAdmin(true);
        // }
        if (data && data.subRole?.role?.name === 'ADMIN') {
          setIsAdmin(true);
        }
      } catch (error) {
        console.error('Failed to check user role:', error);
      }
    };

  const tabs = [
    "Overview",
    "Work Done",
    "Kanban",
    "Team",
    "Milestones",
    "Assets",
    "Tickets",
    "Report Issue",
    "Tips",
    "Client Update"
  ];

  useEffect(() => {
    checkUserRole()
  }, [])
  return (
    <div className="flex items-center gap-6 border-b border-gray-200 dark:border-gray-700">
      {/* Back Arrow */}
      <Link href="/project" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
      </Link>



      {/* Tabs */}
      <div className="flex gap-8 overflow-x-auto">
        {tabs.map((tab) => {
          const isActive = activeTab === tab;
          
          if (tab === "Client Update" && !isAdmin) {
            return null;
          }

          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative text-base py-4 whitespace-nowrap transition-all duration-200 
                ${isActive
                  ? "text-blue-500 font-normal"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                }
              `}
            >
              {tab}
              {/* Underline Indicator */}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-blue-500" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}