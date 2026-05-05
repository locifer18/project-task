"use client";

import { Mail, Phone, Calendar, User, MapPin, Edit2, Trash2, Plus, Leaf, LucideTrash, LucideEdit2, LucideGithub, LucideCopy, LucideLoader } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";

type User = {
  id: string;
  name: string;
  email: string;
  role?: {
    id: string;
    name: string;
    parentId?: string | null;
  };
  githubProfile?: string
  isDev?: boolean;
  password: string;
  employeeId?: string | null;
  department?: string | null;
  phone?: string | null;
  createdAt?: string;
  joiningDate?: string;
  image?: string;
  isLogin: boolean;
  bio?: string;
  workingAs?: string;
  clockRecords?: any[];
  breaks?: any[];
  Documents?: any[];
  milestones?: any[];
  leaves?: {
    total: number;
    remaining: number;
    emergency: number;
    sick: number;
  } | null;
  timezone?: {
    code: string;
    name?: string;
  } | null;
  workHours?: any[];
  featureRequests?: any[];
  meetingRequests?: any[];
  faceDescriptor?: string;
  dob?: string;
  leaveRequests?: { status: string }[];
  subRole?: {
    id: string;
    name: string;
    role: { id: string; name: string; parentId?: string | null };
  };
  projectMembers?: {
    project: {
      id: string;
      name: string;
      summary?: string | null;
      priority?: string | null;
      progress?: number | null;
      status?: string | null;
      createdAt?: string;
      projectInfo?: {
        budget?: number | null;
        projectType?: string | null;
        supervisorAdmin?: string | null;
      } | null;
    };
  }[];
};

const departments = [
  'Web Development',
  'UI / UX Design',
  'Mobile App Development',
  'Custom Software Development',
  'AI / ML Solutions',
  'Data Engineering & Analytics',
  'Cyber Security',
  'Cloud Architecture & DevOps',
  'SaaS Product Development',
  'E-commerce Development',
  'API & System Integrations',
  'Automation & RPA',
  'Quality Assurance & Testing',
  'Performance Optimization',
  'SEO & Growth Engineering',
  'Digital Marketing',
  'Branding & Creative Design',
  'Product Management',
  'Project Management',
  'IT Consulting & Strategy',
  'Maintenance & Support',
  'Research & Innovation',
  'HR & Talent Management'
];
const positions = [
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'Mobile App Developer',
  'UI/UX Designer',
  'Product Manager',
  'Project Manager',
  'QA Engineer',
  'DevOps Engineer',
  'Cloud Engineer',
  'AI / ML Engineer',
  'Data Engineer',
  'Cyber Security Analyst',
  'SEO Specialist',
  'Digital Marketing Manager',
  'Content Strategist',
  'Brand Designer',
  'Sales Executive',
  'Business Development Manager',
  'Client Success Manager',
  'HR Manager',
  'Talent Acquisition Specialist',
  'Operations Manager',
  'Technical Support Engineer',
  'Intern / Trainee',
  'Other'
];

export function UserModel({ rect = false, editUser, setEditUser, setAddUser, leaveDays, setLeaveDays, leaveType, setLeaveType, selectedTimezone, setSelectedTimezone, allTimezones, handleSaveAllChanges, saving }: { rect?: boolean, setAddUser?: (v: boolean) => void, leaveDays: number, setLeaveDays: (v: number) => void, editUser: User | null, setEditUser: React.Dispatch<React.SetStateAction<User | null>>, leaveType: string, setLeaveType: React.Dispatch<React.SetStateAction<string>>, selectedTimezone: string, setSelectedTimezone: React.Dispatch<React.SetStateAction<string>>, allTimezones: any[], handleSaveAllChanges: () => void, saving: boolean }) {
  return (
    <div className={`fixed inset-0 w-full h-full dark:bg-black/50 flex items-center justify-center z-99999`}>
      <div className="bg-neutral-100 dark:bg-gray-800 rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-bold mb-4">{setAddUser ? "Add User" : "Edit User"}</h2>
        <form
          className="space-y-3"
        >
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input className="w-full border dark:border-gray-600 dark:bg-gray-700 bg-white px-3 py-2 rounded" value={editUser?.name || ""} onChange={(e) => setEditUser({ ...editUser, name: e.target.value })} placeholder="Enter name" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input className="w-full border dark:border-gray-600 dark:bg-gray-700 bg-white px-3 py-2 rounded" value={editUser?.email || ""} onChange={(e) => setEditUser({ ...editUser, email: e.target.value })} placeholder="Enter email" />
          </div>
          <div>
            {
              setAddUser ? (
                <>
                  <label className="block text-sm font-medium mb-1">Password</label>
                  <input className="w-full border dark:border-gray-600 dark:bg-gray-700 bg-white px-3 py-2 rounded" value={editUser?.password ? editUser.password : ""} onChange={(e) => setEditUser({ ...editUser, password: e.target.value })} placeholder="Enter Password" />
                  <div>
                    <label className="block text-sm font-medium my-2">Role *</label>
                    <select className="w-full border dark:border-gray-600 dark:bg-gray-700 bg-white px-3 py-2 rounded" value={editUser?.role || ""} onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}>
                      <option value="">Select Role</option>
                      <option value="EMPLOYEE">Employee</option>
                      <option value="ADMIN">Admin</option>
                      <option value="CLIENT">Client</option>
                    </select>
                  </div>
                </>
              ) : (
                <>
                  <label className="block text-sm font-medium mb-1">Employee ID</label>
                  <input className="w-full border dark:border-gray-600 dark:bg-gray-700 bg-white px-3 py-2 rounded" value={editUser?.employeeId ? editUser.employeeId : "Not Assigned"} onChange={(e) => setEditUser({ ...editUser, employeeId: e.target.value })} placeholder="Enter EMPLOYEE ID" />
                </>
              )
            }
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Date of Birth</label>
            <input
              type="date"
              value={editUser?.dob?.split("T")[0] || ""}
              onChange={(e) => setEditUser({ ...editUser, dob: e.target.value })}
              className="w-full border dark:border-gray-600 dark:bg-gray-700 bg-white px-3 py-2 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Joining Date</label>
            <input
              type="date"
              value={editUser?.joiningDate?.split("T")[0] || ""}
              onChange={(e) => setEditUser({ ...editUser, joiningDate: e.target.value })}
              className="w-full border dark:border-gray-600 dark:bg-gray-700 bg-white px-3 py-2 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input className="w-full border dark:border-gray-600 dark:bg-gray-700 bg-white px-3 py-2 rounded" value={editUser?.phone ?? ""} onChange={(e) => setEditUser({ ...editUser, phone: e.target.value })} placeholder="Enter phone number" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Department</label>
            <select className="w-full border dark:border-gray-600 dark:bg-gray-700 bg-white px-3 py-2 rounded" value={editUser?.department ?? ""} onChange={(e) => setEditUser({ ...editUser, department: e.target.value })}>
              <option value="">Select or type below</option>
              {departments.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <input className="w-full border dark:border-gray-600 dark:bg-gray-700 bg-white px-3 py-2 rounded mt-2" value={editUser?.department ?? ""} onChange={(e) => setEditUser({ ...editUser, department: e.target.value })} placeholder="Or type custom department" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Position</label>
            <select className="w-full border dark:border-gray-600 dark:bg-gray-700 bg-white px-3 py-2 rounded" value={editUser?.workingAs ?? ""} onChange={(e) => setEditUser({ ...editUser, workingAs: e.target.value })}>
              <option value="">Select or type below</option>
              {positions.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            <input className="w-full border dark:border-gray-600 dark:bg-gray-700 bg-white px-3 py-2 rounded mt-2" value={editUser?.workingAs ?? ""} onChange={(e) => setEditUser({ ...editUser, workingAs: e.target.value })} placeholder="Or type custom position" />
          </div>
          {/* {setAddUser && ( */}
          <label className="block text-sm font-medium mb-1">Is Developer</label>

          <select className="w-full border dark:border-gray-600 dark:bg-gray-700 bg-white px-3 py-2 rounded" value={`${editUser?.isDev || false}`} onChange={(e) => setEditUser({ ...editUser, isDev: Boolean(e.target.value) })}>
            <option value="">Is Developer?</option>
            <option value="true">YES</option>
            <option value="false">NO</option>
          </select>
          {/* // )} */}
          {
            !setAddUser && (
              <div>
                <label className="block text-sm font-medium mb-1">Manage Leaves</label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value)}
                  className="w-full border px-3 py-2 rounded dark:bg-gray-700 bg-white"
                >
                  <option value="">Select leave type</option>
                  <option value="remaining">Casual</option>
                  <option value="sick">Sick</option>
                  <option value="emergency">Emergency</option>
                </select>
                <input
                  type="number"
                  min={1}
                  value={leaveDays}
                  onChange={(e) => setLeaveDays(Number(e.target.value))}
                  className="w-full border px-3 py-2 rounded mt-2 dark:bg-gray-700 bg-white"
                  placeholder="Number of days"
                />
              </div>

            )
          }
          <div>
            <label className="block text-sm font-medium mb-1">
              Time Zone
            </label>

            <select
              value={selectedTimezone}
              onChange={(e) => setSelectedTimezone(e.target.value)}
              className=" w-full mt-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="" disabled>
                Select Timezone
              </option>

              {allTimezones.map((tz) => (
                <option key={tz.code} value={tz.code}>
                  {tz.code} — {tz.hours}
                </option>
              ))}
            </select>

          </div>
          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={setAddUser ? () => { setAddUser(false), setEditUser(null) } : () => setEditUser(null)}
              className="px-4 py-2 rounded border dark:border-gray-600"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSaveAllChanges}
              disabled={saving}
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}

export function DeleteModel({ deleteUser, setDeleteUser, setUsers }: { deleteUser: User | null, setDeleteUser: React.Dispatch<React.SetStateAction<User | null>>, setUsers: React.Dispatch<React.SetStateAction<User[]>> }) {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-1000">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-sm">
        <h2 className="text-lg font-bold text-red-600">Delete User</h2>
        <p className="text-sm mt-2">Are you sure you want to delete <strong>{deleteUser.name}</strong>? This action cannot be undone.</p>
        <div className="flex justify-end gap-3 mt-5">
          <button onClick={() => setDeleteUser(null)} className="px-4 py-2 rounded border dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">Cancel</button>
          <button
            onClick={async () => {
              const toastId = toast.loading("Deleting user...");
              try {
                const res = await fetch("/api/admin/user", {
                  method: "DELETE",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ email: deleteUser.email }),
                });
                const data = await res.json();
                if (!res.ok) {
                  toast.error(data.error || "Delete failed", { id: toastId });
                  return;
                }
                setUsers((prev) => prev.filter((u) => u.id !== deleteUser.id));
                toast.success("User deleted successfully", { id: toastId });
                setDeleteUser(null);
              } catch {
                toast.error("Something went wrong", { id: toastId });
              }
            }}
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}


export function RoleCard({ rect = true, setEditUser, setSelectedTimezone, setDeleteUser, u, emergencyPhone, leaveStats, userRole, }: { rect?: boolean, u: User, userRole: string; setEditUser: React.Dispatch<React.SetStateAction<User | null>>, setSelectedTimezone: React.Dispatch<React.SetStateAction<string>>, setDeleteUser: React.Dispatch<React.SetStateAction<User | null>>, emergencyPhone: string, leaveStats: { total: number; remaining: number; used: number; breakdown: { sick: number; emergency: number } } }) {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  return (
    <div className={`relative ${rect ? "mt-8" : "mt-12"}`} key={u.id}>
      <div className="flex gap-2 justify-end pr-6 absolute -top-8 right-2 z-50">
        {
          u.githubProfile &&
          <button
            onClick={async () => { await navigator.clipboard.writeText(u.githubProfile) }}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 bg-gray-100 dark:bg-gray-800 rounded-t-lg"
            title="Copu"
          >
            <LucideGithub className="w-4 h-4 text-gray-400 hover:text-gray-600" />
          </button>
        }

        {userRole !== "MANAGER" && userRole !== "HRMANAGER" && userRole !== "FINANCE" && userRole !== "PROJECTMANAGER" && (
          <div className="flex gap-1">
            <button
              onClick={() => {
                setEditUser(u);
                setSelectedTimezone(u.timezone?.code || "");
                scrollToTop()
              }}

              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 bg-gray-100 dark:bg-gray-800 rounded-t-lg"
              title="Edit"
            >
              <Edit2 className="w-4 h-4 text-gray-400 hover:text-gray-600" />
            </button>

            <button
              onClick={() => {
                setDeleteUser(u)
              }}

              className="p-2 hover:bg-red-100 dark:hover:bg-red-950 bg-gray-100 dark:bg-gray-800 rounded-t-lg"
              title="Delete"
            >
              <Trash2 className="w-4 h-4 text-gray-400 hover:text-gray-600" />
            </button>
          </div>
        )}


      </div>
      <Link
        href={`/user/${u.id}`}
        className="hover:shadow-md relative transition-all cursor-pointer hover:scale-[1.01]"
        title="View Profile"
        key={u.id}
      >
        <div key={u.id} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 shadow-sm hover:shadow-md transition-all">
          {/* Header Section */}
          <div className="flex items-start gap-4">
            {/* Avatar with Status */}
            <div className="relative flex-shrink-0">
              {
                u?.image ? (
                  <Image
                    src={u.image}
                    alt={u.name}
                    width={72}
                    height={72}
                    className="rounded-full object-cover w-18 h-18"
                  />
                ) : (
                  <div className="rounded-full object-cover w-18 h-18 bg-linear-to-br from-purple-700  dark:to-black to-purple-300 text-white grid place-items-center">{u.name.charAt(0)}</div>
                )
              }
              <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-gray-900 ${u.isLogin ? "bg-green-500" : "bg-gray-400"}`} />
            </div>

            {/* User Info */}
            <div className="flex-1 gap-2 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{u.name}</h3>

              {/* Contact Info with Icons */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Mail className="w-3.5 h-3.5 flex-shrink-0 text-gray-400" />
                  <span className="truncate">{u.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Phone className="w-3.5 h-3.5 flex-shrink-0 text-gray-400" />
                  <span>{u.phone || "N/A"}</span>
                </div>
              </div>

              {/* Employee Details */}
              <div className="mt-3 space-y-3">
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                  <User className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>ID: {u.employeeId || "N/A"}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                  <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>Joined: {u.joiningDate ? new Date(u.joiningDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "N/A"}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                  <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>Emergency: {emergencyPhone}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                  <Leaf className="w-4 h-4" />
                  <span className="text-gray-600 dark:text-gray-400">
                    Leaves: {leaveStats.remaining} - {leaveStats.total}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                  <LucideGithub className="w-4 h-4" />
                  <span className="text-gray-600 dark:text-gray-400 flex justify-center items-center gap-2">
                    {u.githubProfile ? `@${u.githubProfile}` : "Not Provided"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Role Badge */}
          <div className="mt-4 flex items-center gap-2">
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {u.workingAs || "Employee"} - {u.department || "Department"}
            </span>
          </div>

          {/* Bio */}
          <p className="mt-2.5 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            {u.bio || "Hardworking and result-oriented professional"}
          </p>

          {/* Footer - Timezone & DOB */}
          <div className="mt-4 pt-3.5 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between text-xs text-gray-500 dark:text-gray-500">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              <span>Time Zone: {u.timezone?.code || "NOT SET"}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span>DOB: {u.dob || "N/A"}</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );

}

export default function RoleDashboard() {
  const [selectedRole, setSelectedRole] = useState("EMPLOYEE");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [deleteUser, setDeleteUser] = useState<User | null>(null);
  const [addUser, setAddUser] = useState(false);
  const [saving, setSaving] = useState(false);
  const [allTimezones, setAllTimezones] = useState<any[]>([]);
  const [selectedTimezone, setSelectedTimezone] = useState("");
  const [leaveType, setLeaveType] = useState("");
  const [leaveDays, setLeaveDays] = useState(0);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const createUser = async () => {
    setSaving(true);
    const toastId = toast.loading("Creating user...");
    try {
      const res = await fetch("/api/admin/user", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ editUser, timezoneCode: selectedTimezone }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to create user", { id: toastId });
        return;
      }
      setUsers((prev) => [...prev, data.user]);
      toast.success("User created successfully", { id: toastId });
      setAddUser(false);
      setEditUser(null);
    } catch {
      toast.error("Something went wrong", { id: toastId });
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveAllChanges() {
    if (!editUser) return;

    setSaving(true);
    const toastId = toast.loading("Saving changes...");

    try {
      /* --------------------
         1️⃣ UPDATE USER PROFILE
      -------------------- */
      const userRes = await fetch("/api/admin/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editUser),
      });

      if (!userRes.ok) {
        const err = await userRes.json();
        throw new Error(err.error || "Failed to update user");
      }

      /* --------------------
         2️⃣ UPDATE TIMEZONE (OPTIONAL)
      -------------------- */
      let updatedTimezone = editUser.timezone;

      if (selectedTimezone && selectedTimezone !== editUser.timezone?.code) {
        const tzRes = await fetch("/api/admin/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: editUser.id,
            timezoneCode: selectedTimezone,
          }),
        });

        const tzData = await tzRes.json();
        if (!tzRes.ok) throw new Error(tzData.error || "Failed to update timezone");

        updatedTimezone = tzData.timezone;
      }

      /* --------------------
         3️⃣ DEDUCT LEAVES (OPTIONAL)
      -------------------- */
      let updatedLeaves = editUser.leaves;

      if (leaveType && leaveDays > 0) {
        const leaveRes = await fetch("/api/admin/leaves", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: editUser.id,
            action: "deduct",
            type: leaveType,
            days: leaveDays,
          }),
        });

        const leaveData = await leaveRes.json();
        if (!leaveRes.ok) throw new Error(leaveData.error || "Failed to deduct leaves");

        updatedLeaves = leaveData.leaves;
      }

      /* --------------------
         4️⃣ UPDATE UI STATE
      -------------------- */
      setUsers(prev =>
        prev.map(u =>
          u.id === editUser.id
            ? {
              ...u,
              ...editUser,
              timezone: updatedTimezone,
              leaves: updatedLeaves,
            }
            : u
        )
      );

      toast.success("Changes saved successfully", { id: toastId });
      setEditUser(null);

      // Reset temp states
      setLeaveType("");
      setLeaveDays(0);
      setSelectedTimezone("");

    } catch (err: any) {
      toast.error(err.message || "Something went wrong", { id: toastId });
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    async function loadUsers() {
      try {
        setLoading(true);

        const res = await fetch("/api/admin/getRoleWise?role=" + selectedRole);
        const data = await res.json();

        if (!res.ok) {
          toast.error(data.error || "Failed to load users");
          return;
        }
        setUsers(data.users || []);
      } catch {
        toast.error("Network error");
      } finally {
        setLoading(false);
      }
    }
    loadUsers();
  }, [selectedRole]);

  useEffect(() => {
    async function loadTimezones() {
      try {
        const res = await fetch("/api/clock/timezone?action=timezones");
        const data = await res.json();
        if (data.success) {
          setAllTimezones(data.timezones);
        }
      } catch {
        toast.error("Failed to load timezones");
      }
    }

    loadTimezones();
  }, []);

  useEffect(() => {
    const res = localStorage.getItem("user");
    const data = res ? JSON.parse(res) : null;
    if (data) setUserRole(data.role);

  }, []);

  const visibleUsers = users
    .filter((u) => u.subRole?.role?.name === selectedRole)
    .filter((u) =>
      [u.name, u.email, u.employeeId, u.phone]
        .filter(Boolean)
        .some((field) =>
          field!.toLowerCase().includes(search.toLowerCase())
        )
    );

  function getLeaveStats(user: User) {
    const leaves = user.leaves ?? { sick: 0, emergency: 0 };

    const TOTAL_LEAVES = 8;

    const remaining = leaves.sick + leaves.emergency;
    const used = TOTAL_LEAVES - remaining;

    return {
      total: TOTAL_LEAVES,
      remaining,
      used,
      breakdown: {
        sick: leaves.sick,
        emergency: leaves.emergency,
      },
    };
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-8">
      <Toaster position="top-right" />

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6">{selectedRole === "EMPLOYEE" ? "Employees" : selectedRole === "ADMIN" ? "Admin" : "Client"}
          <span className="text-m font-semibold text-gray-800 dark:text-gray-500 mx-3">{visibleUsers.length}</span>
        </h1>
        <div className="flex justify-between items-center gap-4">
          {/* Tab Navigation */}
          <div className="flex gap-2 bg-white dark:bg-gray-900 rounded-lg p-1.5 shadow-sm border border-gray-200 dark:border-gray-800">
            {["EMPLOYEE", "ADMIN", "CLIENT"].map((role) => (
              <button
                key={role}
                onClick={() => setSelectedRole(role)}
                className={`px-5 py-2 rounded-md text-sm font-medium transition-all ${selectedRole === role
                  ? "bg-gray-200 dark:bg-gray-700 bg-white text-gray-900 dark:text-white"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  }`}
              >
                {role === "EMPLOYEE" ? "Employees" : role === "ADMIN" ? "Admin" : "Client"}
              </button>
            ))}
          </div>

          <div className="flex gap-4">
            {/* SEARCH */}
            <div className="relative flex items-right justify-right">
              <input
                type="text"
                placeholder="Search by name, email, phone, or employee ID"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="px-4 py-2 w-64  rounded-lg border border-gray-200 dark:border-gray-800 bg-white text-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* ADD USER BUTTON */}
            {userRole !== "MANAGER" && userRole !== "HRMANAGER" && userRole !== "FINANCE" && userRole !== "PROJECTMANAGER" && (
              <button
                onClick={() => setAddUser(true)}
                className="px-5 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 rounded-lg shadow-sm hover:shadow-md transition-all flex items-center gap-2 font-medium text-sm"
              >
                <Plus size={18} />
                Add
              </button>
            )}
          </div>

        </div>
      </div>

      {/* ADD USER MODAL */}
      {addUser && (
        <UserModel
          editUser={editUser}
          allTimezones={allTimezones}
          handleSaveAllChanges={createUser}
          leaveDays={leaveDays}
          leaveType={leaveType}
          saving={saving}
          setEditUser={setEditUser}
          setLeaveDays={setLeaveDays}
          setLeaveType={setLeaveType}
          selectedTimezone={selectedTimezone}
          setSelectedTimezone={setSelectedTimezone}
          setAddUser={setAddUser}
        />
      )}

      {/* LOADING */}
      {loading && <div className="w-full h-[50vh] flex flex-col justify-center items-center">
        <LucideLoader className='animate-spin text-blue-300' size={40} />
        <p className="text-center text-gray-400 mt-4">Loading users...</p>
      </div>}

      {/* ADMIN TABLE */}
      {!loading && selectedRole === "ADMIN" ? (
        <div>
          {deleteUser && (
            <DeleteModel
              deleteUser={deleteUser}
              setDeleteUser={setDeleteUser}
              setUsers={setUsers}
            />
          )}
          {editUser && !addUser && (
            <UserModel
              editUser={editUser}
              allTimezones={allTimezones}
              handleSaveAllChanges={handleSaveAllChanges}
              leaveDays={leaveDays}
              leaveType={leaveType}
              saving={saving}
              setEditUser={setEditUser}
              setLeaveDays={setLeaveDays}
              setLeaveType={setLeaveType}
              selectedTimezone={selectedTimezone}
              setSelectedTimezone={setSelectedTimezone}
            />
          )}
          {visibleUsers.map((u) => {
            const emergencyPhone = u.phone || "N/A";
            const leaveStats = getLeaveStats(u);

            return (
              <RoleCard
                key={u.id}
                u={u}
                rect={false}
                emergencyPhone={emergencyPhone}
                leaveStats={leaveStats}
                setEditUser={setEditUser}
                setDeleteUser={setDeleteUser}
                setSelectedTimezone={setSelectedTimezone}
                userRole={userRole}
              />
            );
          })}
        </div>
      ) : (
        /* EMPLOYEE + CLIENT CARD VIEW */
        <div>
          {/* EMPLOYEE CARD VIEW */}
          {selectedRole === "EMPLOYEE" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 ">
              {deleteUser && (
                <DeleteModel
                  deleteUser={deleteUser}
                  setDeleteUser={setDeleteUser}
                  setUsers={setUsers}
                />
              )}
              {!addUser && editUser && (
                <UserModel
                  rect={true}
                  editUser={editUser}
                  allTimezones={allTimezones}
                  handleSaveAllChanges={handleSaveAllChanges}
                  leaveDays={leaveDays}
                  leaveType={leaveType}
                  saving={saving}
                  setEditUser={setEditUser}
                  setLeaveDays={setLeaveDays}
                  setLeaveType={setLeaveType}
                  selectedTimezone={selectedTimezone}
                  setSelectedTimezone={setSelectedTimezone}
                />
              )}
              {visibleUsers.map((u) => {
                const emergencyPhone = u.phone || "N/A";
                const leaveStats = getLeaveStats(u);

                return (
                  <RoleCard
                    key={u.id}
                    u={u}
                    emergencyPhone={emergencyPhone}
                    leaveStats={leaveStats}
                    setEditUser={setEditUser}
                    setDeleteUser={setDeleteUser}
                    setSelectedTimezone={setSelectedTimezone}
                    userRole={userRole}
                  />
                );
              })}
            </div>
          )}

          {/* CLIENT CARD VIEW */}
          {selectedRole === "CLIENT" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {deleteUser && (
                <DeleteModel
                  deleteUser={deleteUser}
                  setDeleteUser={setDeleteUser}
                  setUsers={setUsers}
                />
              )}
              {visibleUsers.map((u) => (
                <div key={u.id} onClick={() => (window.location.href = `/user/${u.id}`)} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 shadow-sm hover:shadow-md transition-all cursor-pointer hover:scale-[1.01]">
                  <div className="flex items-start gap-4">
                    <div className="relative flex-shrink-0">
                      {
                        u?.image ? (
                          <Image src={u.image ?? "/default-avatar.png"} alt={u.name} width={72} height={72} className="rounded-full object-cover w-18 h-18" />
                        ) : (
                          <div className="rounded-full object-cover w-18 h-18 bg-linear-to-br from-purple-700  dark:to-black to-purple-300 text-white grid place-items-center">{u.name.charAt(0)}</div>
                        )
                      }
                      <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-gray-900 ${u.isLogin ? "bg-green-500" : "bg-gray-400"}`} />
                    </div>
                    <div className="flex-1 min-w-0 ">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{u.name}</h3>
                      <div className="w-10 h-10 hover:bg-gray-200/20 rounded-sm flex justify-center items-center absolute right-0 top-0 z-50"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteUser(u)
                        }}>
                        <LucideTrash color="white" strokeWidth={1} size={18} />
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Mail className="w-3.5 h-3.5 flex-shrink-0 text-gray-400" />
                          <span className="truncate">{u.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Phone className="w-3.5 h-3.5 flex-shrink-0 text-gray-400" />
                          <span>{u.phone || "N/A"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500 mt-2">
                          <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                          <span>Joined: {u.joiningDate ? new Date(u.joiningDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "N/A"}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Bio: {u.bio || "N/A"}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}