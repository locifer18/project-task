"use client";
import React, { useEffect, useState } from "react";

export default function WelcomeCard() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // fetch('/api/user', { credentials: 'include' })
    //   .then(res => res.ok ? res.json() : null)
    //   .then(data => data && setUser(data.user))
    //   .catch(() => {});

    const res = localStorage.getItem("user");
        const data = res ? JSON.parse(res) : null;

        if (data) {
            setUser(data);
        }

  }, []);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
            Welcome back, {user?.name || 'User'}!
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {user?.role || 'Employee'} • {user?.department || 'Department'}
          </p>
          <p className="mt-1 text-xs text-gray-400">
            Employee ID: {user?.employeeId || 'N/A'}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
      </div>
    </div>
  );
}