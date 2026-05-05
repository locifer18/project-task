"use client";

import { useEffect, useState } from "react";
import { Clock, CheckCircle, Hourglass, Timer, LucideLoader } from "lucide-react";

export default function LatestUpdates({ projectId }: { projectId: string }) {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
     fetchLatestUpdates();
  }, [projectId]);

  const fetchLatestUpdates = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/latest-updates?projectId=${projectId}`);
      if (!res.ok) throw new Error('Failed to fetch updates');
      const data = await res.json();
      if (data.success && Array.isArray(data.updates)) {
        setUpdates(data.updates);
      } else {
        setUpdates([]);
      }
    } catch (err) {
      console.error("Error fetching updates:", err);
      setUpdates([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusMeta = (status?: string) => {
    const s = (status || "").trim().toLowerCase();

    if (s === "completed")
      return { color: "text-green-600", icon: <CheckCircle size={18} /> };

    if (s === "working")
      return { color: "text-blue-600", icon: <Timer size={18} /> };

    if (s === "pending" || s === "in-progress")
      return { color: "text-yellow-600", icon: <Hourglass size={18} /> };

    return { color: "text-gray-600", icon: <Clock size={18} /> };
  };

  if (loading) {
    return (
      <div className="w-full h-[50vh] flex justify-center items-center">
        <LucideLoader className='animate-spin text-blue-300' size={40} />
         <p className="p-4 animate-pulse text-gray-500">Loading updates...</p>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-900 p-5 rounded-xl dark:border-gray-700">
      <h3 className="text-lg font-semibold mb-4 dark:text-white">Latest Updates</h3>

      {updates.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No recent activity</p>
      ) : (
        <ul className="space-y-4">
          {updates.map((update: any) => (
            <li key={update.id} className="flex items-start gap-3">
              <div className="text-blue-500"><Clock size={18} /></div>
              <div>
                <p className="text-gray-900 dark:text-white font-medium">{update.title}</p>
                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                  <Clock size={12} /> {update.date || new Date(update.createdAt).toLocaleDateString()}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
