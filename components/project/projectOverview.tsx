"use client";

import React from "react";
import { Calendar, User} from "lucide-react";

export default function ProjectOverview({ project }: any) {
  if (!project) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-md backdrop-blur-md">

      {/* HEADER */}
      <h2 className="text-xl font-bold dark:text-white mb-3">Project Overview</h2>

      <div className="space-y-4">

        {/* NAME */}
        <div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Project Name</p>
          <p className="font-semibold text-gray-900 dark:text-white">{project.name}</p>
        </div>

        {/* SUMMARY */}
        {project.summary && (
          <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Summary</p>
            <p className="text-gray-900 dark:text-white text-sm leading-relaxed">
              {project.summary}
            </p>
          </div>
        )}

        {/* PRIORITY */}
        <div>
          <p className="text-gray-900 dark:text-gray-300 text-sm">Priority</p>
          <span
            className={`px-3 py-1 text-xs font-semibold rounded-lg inline-block mt-1 ${
              project.priority === "HIGH"
                ? "bg-red-100 text-red-700 border border-red-200"
                : project.priority === "MEDIUM"
                ? "bg-yellow-600/20 text-yellow-300 border border-yellow-600/40"
                : "bg-green-600/20 text-green-300 border border-green-600/40"
            }`}
          >
            {project.priority?.toUpperCase()}
          </span>
        </div>

        {/* MEMBERS COUNT */}
        <div className="flex items-center gap-3">
          <User className="text-gray-500 dark:text-gray-400" size={18} />
          <p className="text-gray-900 dark:text-white  text-sm">
            Members: <span className="font-semibold text-gray-900 dark:text-white ">{project.members?.length || 0}</span>
          </p>
        </div>

        {/* CREATED AT */}
        <div className="flex items-center gap-3">
          <Calendar className="text-gray-500 dark:text-gray-400" size={18} />
          <p className="text-gray-900 dark:text-gray-300 text-sm">
            Created:{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              {new Date(project.createdAt).toLocaleDateString()}
            </span>
          </p>
        </div>

        {/* BASIC DETAILS */}
        {project.basicDetails && (
          <div className="mt-3">
            <p className="text-gray-500 dark:text-gray-400 text-sm">Details</p>
            <p className="text-gray-900 dark:text-gray-300 text-sm">{project.basicDetails}</p>
          </div>
        )}
      </div>
    </div>
  );
}
