"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FolderGit2, Layers, CheckCircle2, AlertCircle, Clock, Users } from "lucide-react";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalTasks: 0,
    completedTasks: 0,
    overdueTasks: 0,
    inProgressTasks: 0,
    assignedTasks: 0,
  });
  const [recentProjects, setRecentProjects] = useState<any[]>([]);
  const [overdueTasks, setOverdueTasks] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const res = await fetch("/api/auth/me", { credentials: "include" });
      if (!res.ok) {
        setUnauthorized(true);
        setLoading(false);
        return;
      }
      const data = await res.json();
      setUser(data.user);
      setUnauthorized(false);
    } catch (err) {
      console.error("Failed to fetch user:", err);
      setUnauthorized(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      const isAdmin = user?.role === "ADMIN";
      const tasksUrl = isAdmin ? "/api/kanban/task?all=true" : "/api/kanban/task";

      const [projectsRes, tasksRes] = await Promise.all([
        fetch("/api/project", { credentials: "include" }),
        fetch(tasksUrl, { credentials: "include" }),
      ]);

      if (!projectsRes.ok || !tasksRes.ok) {
        console.error("Dashboard fetch failed", projectsRes.status, tasksRes.status);
        return;
      }

      const projectsData = await projectsRes.json();
      const tasksData = await tasksRes.json();

      const projects = projectsData.projects || [];
      const tasks = tasksData.tasks || [];
      const now = new Date();

      const completed = tasks.filter((t: any) => t.status === "completed");
      const inProgress = tasks.filter((t: any) => t.status === "in-progress");
      const assigned = tasks.filter((t: any) => t.status === "assigned");
      const overdue = tasks.filter(
        (t: any) => t.status !== "completed" && new Date(t.dueDate) < now
      );

      setStats({
        totalProjects: projects.length,
        totalTasks: tasks.length,
        completedTasks: completed.length,
        overdueTasks: overdue.length,
        inProgressTasks: inProgress.length,
        assignedTasks: assigned.length,
      });

      setRecentProjects(projects.slice(0, 4));
      setOverdueTasks(overdue.slice(0, 5));
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    }
  };

  const statCards = [
    { label: "Total Projects", value: stats.totalProjects, icon: FolderGit2, color: "blue", href: "/project" },
    { label: "Total Tasks", value: stats.totalTasks, icon: Layers, color: "purple", href: "/kanban" },
    { label: "Completed", value: stats.completedTasks, icon: CheckCircle2, color: "green", href: "/kanban" },
    { label: "Overdue", value: stats.overdueTasks, icon: AlertCircle, color: "red", href: "/kanban" },
    { label: "In Progress", value: stats.inProgressTasks, icon: Clock, color: "yellow", href: "/kanban" },
    { label: "Assigned", value: stats.assignedTasks, icon: Users, color: "indigo", href: "/kanban" },
  ];

  const colorMap: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
    purple: "bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400",
    green: "bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400",
    red: "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400",
    yellow: "bg-yellow-50 text-yellow-600 dark:bg-yellow-500/10 dark:text-yellow-400",
    indigo: "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400",
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (unauthorized) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Welcome to Team Task Manager</h1>
        <p className="max-w-md text-gray-500 dark:text-gray-400">
          You need to sign in to access your projects, tasks, and team dashboard.
        </p>
        <Link href="/signin" className="rounded-full bg-blue-600 px-5 py-3 text-white hover:bg-blue-700">
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Welcome back, {user?.name || "User"} 👋
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {user?.role === "ADMIN" ? "Admin — showing stats across all members" : user?.role || "Member"} • {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link key={card.label} href={card.href}>
              <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] hover:shadow-md transition-shadow cursor-pointer">
                <div className={`${colorMap[card.color]} w-10 h-10 rounded-lg flex items-center justify-center mb-3`}>
                  <Icon className="w-5 h-5" />
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{card.value}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{card.label}</p>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Projects</h2>
            <Link href="/project" className="text-sm text-blue-600 hover:underline dark:text-blue-400">View all</Link>
          </div>
          {recentProjects.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">No projects yet.</p>
          ) : (
            <div className="space-y-3">
              {recentProjects.map((project) => (
                <Link key={project.id} href={`/project/${project.id}`}>
                  <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{project.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{project.membersCount} members</p>
                    </div>
                    <div className="ml-3 flex-shrink-0">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                          <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${project.progress}%` }} />
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{project.progress}%</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Overdue Tasks
              {stats.overdueTasks > 0 && (
                <span className="ml-2 px-2 py-0.5 text-xs bg-red-100 text-red-600 rounded-full dark:bg-red-500/10 dark:text-red-400">
                  {stats.overdueTasks}
                </span>
              )}
            </h2>
            <Link href="/kanban" className="text-sm text-blue-600 hover:underline dark:text-blue-400">View all</Link>
          </div>
          {overdueTasks.length === 0 ? (
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-200">
                ✓
              </span>
              <p className="text-sm text-gray-500 dark:text-gray-400">No overdue tasks right now.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {overdueTasks.map((task) => (
                <div key={task.id} className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-white/5">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{task.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Due {new Date(task.dueDate).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
