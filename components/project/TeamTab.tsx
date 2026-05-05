"use client";

import { useEffect, useState } from "react";
import { ShieldCheck, Crown, Edit, Trash2, Plus, LucideLoader } from "lucide-react";

export default function TeamTab({ projectId }: { projectId: string }) {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [memberLoading, setmemberLoading] = useState(false);
  const [editingMember, setEditingMember] = useState<any>(null);
  const [newRole, setNewRole] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [clientModel, setClientModel] = useState(false);
  const [availableUsers, setAvailableUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [memberRole, setMemberRole] = useState("");
  const [isClientAvailable, setIsClientAvailable] = useState(false);
  const [usersLoading, setUsersLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEmployee, setEmployee] = useState(false)
  const [removeModal, setRemoveModal] = useState<{
    userId: string;
    userName: string;
  } | null>(null);

  const checkUserRole = async () => {
    try {
      const response = localStorage.getItem("user");
      // const response = await fetch('/api/user');
      // const data = await response.json();
      const data = response ? JSON.parse(response) : null;

      // if (data.user && data.user.role === "EMPLOYEE") {
      //   setEmployee(true);
      // }

      // if (data.user && data.user.role === 'ADMIN') {
      //   setIsAdmin(true);
      // }

      if (data && data.subRole?.role?.name === "EMPLOYEE") {
        setEmployee(true);
      }

      if (data && data.subRole?.role?.name === 'ADMIN') {
        setIsAdmin(true);
      }

    } catch (error) {
      console.error('Failed to check user role:', error);
    }
  };

  useEffect(() => {
    checkUserRole();
    if (projectId) fetchMembers();
  }, [projectId]);



  const fetchMembers = async () => {
    try {
      const res = await fetch(`/api/project/member?projectId=${projectId}`);
      const data = await res.json();

      if (data.success) {
        setMembers(data.members);
        setIsClientAvailable(data.members.some((m: any) => m.user.subRole?.role?.name === "CLIENT"));
      }
    } catch (err) {
      console.error("Team Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateRole = async (userId: string, role: string, isLeader: boolean) => {
    try {
      await fetch(`/api/project/member`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, userId, role, isLeader }),
      });

      fetchMembers();
    } catch (err) {
      console.error("Update Failed:", err);
    }
  };

  const removeMember = async (userId: string) => {

    try {
      setmemberLoading(true);
      await fetch(`/api/project/member`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, userId }),
      });

      fetchMembers();
    } catch (err) {
      console.error("Remove Failed:", err);
    } finally {
      setmemberLoading(false);
      setRemoveModal(null)
    }
  };

  const saveRole = async () => {
    if (!editingMember || !newRole.trim()) return;

    await updateRole(editingMember.userId, newRole, editingMember.isLeader);
    setEditingMember(null);
    setNewRole("");
  };

  const fetchAvailableUsers = async (Type: string) => {
    setUsersLoading(true);

    try {
      const res = await fetch(`/api/admin/getRoleWise?role=${Type}`);
      const data = await res.json();

      if (data.users) {
        const currentMemberIds = members.map(m => m.userId);
        const available = data.users.filter(
          (u: any) => !currentMemberIds.includes(u.id)
        );
        setAvailableUsers(available);
      }
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setUsersLoading(false);
    }
  };


  const addMember = async (isClient: boolean) => {
    if (!selectedUser) return;

    try {
      setmemberLoading(true);
      await fetch('/api/project/member', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          userId: selectedUser,
          role: isClient ? "CLIENT" : memberRole || 'Member',
          isLeader: false
        })
      });

      setShowAddModal(false);
      setSelectedUser('');
      setMemberRole('');
      setClientModel(false);
      fetchMembers();
    } catch (err) {
      console.error('Add member failed:', err);
    } finally {
      setmemberLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-[50vh] flex justify-center items-center">
        <LucideLoader className='animate-spin text-blue-300' size={40} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Project Team</h2>
        {
          isAdmin && (
            <div className="flex justify-between items-center gap-4">

              <button
                onClick={isClientAvailable ? () => { } : () => {
                  fetchAvailableUsers('CLIENT');
                  setShowAddModal(true);
                  setClientModel(true);
                }}
                className={`${isClientAvailable ? "opacity-40 cursor-not-allowed" : "cursor-pointer hover:text-white  hover:bg-blue-700"} px-4 py-2 bg-transparent border-2 border-blue-700 text-blue-500 rounded-lg flex items-center gap-2 transition-colors`}
              >
                <Plus size={18} /> Add Client
              </button>

              <button
                onClick={() => {
                  fetchAvailableUsers('EMPLOYEE');
                  setShowAddModal(true);
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition-colors"
              >
                <Plus size={18} /> Add Member
              </button>
            </div>
          )
        }

      </div>

      {members.length === 0 && (
        <p className="text-gray-400">No team members added yet.</p>
      )}

      <div className="space-y-4">
        {members.map((m: any) => {
          if (isEmployee && m.role.name === "CLIENT") {
            return null;
          }
          return (
            <div
              key={m.id}
              className="p-5 bg-white  dark:bg-gray-800/50 border border-gray-400 rounded-xl"
            >
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <p className="font-semibold dark:text-white">{m.user.name}</p>
                  {editingMember?.id === m.id ? (
                    <div className="flex items-center gap-2 mt-2">
                      <input
                        type="text"
                        value={newRole}
                        onChange={(e) => setNewRole(e.target.value)}
                        className="px-2 py-1 text-sm border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        placeholder="Enter role"
                      />
                      <button
                        onClick={saveRole}
                        className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-green-700"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingMember(null)}
                        className="px-2 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <p className="dark:text-gray-400 text-sm">
                      <span className="font-medium">{m.role || "Not assigned"}</span>
                    </p>
                  )}

                  {m.isLeader && (
                    <p className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400 mt-1">
                      <Crown size={18} /> Team Leader
                    </p>
                  )}
                </div>
                {
                  isAdmin && (
                    <div className="flex mt-10 items-end gap-2">
                      {
                        m.user.subRole?.role?.name === "CLIENT" ? null : (
                          <div>
                            <button
                              onClick={() => updateRole(m.userId, m.role.name || "Member", !m.isLeader)}
                              className={`flex items-center gap-1 px-3 py-1 rounded text-xs ${m.isLeader
                                ? "bg-yellow-400/70 text-black"
                                : "bg-gray-400/30 text-white"
                                }`}
                            >
                              <ShieldCheck size={14} />
                              {m.isLeader ? "Remove Leader" : "Make Leader"}
                            </button>
                          </div>
                        )
                      }

                      <div className="flex items-center gap-1">
                        {
                          m.subRole?.role?.name === "CLIENT" ? null : (
                            <button
                              onClick={() => {
                                setEditingMember(m);
                                setNewRole(m.role.name || "");
                              }}
                              className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
                              title="Edit role"
                            >
                              <Edit size={14} />
                            </button>
                          )
                        }

                        <button
                          // onClick={() => removeMember(m.userId)}
                          onClick={() =>
                            setRemoveModal({
                              userId: m.userId,
                              userName: m.user.name,
                            })
                          }
                          className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                          title="Remove member"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  )
                }
              </div>
            </div>
          )
        }
        )
        }
      </div>

      {/* Add Member Modal */}
      {(showAddModal || clientModel) && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-900 w-full max-w-md p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-2xl">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Add {clientModel ? "Client" : "Team Member"}</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">Select User</label>
                {/* <select
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Choose a user...</option>
                  {availableUsers.map(user => (
                    <option key={user.id} value={user.id}>{user.name} ({user.email})</option>
                  ))}
                </select> */}

                <select
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                  disabled={usersLoading}
                  className={`w-full px-3 py-2 rounded-lg border
    ${usersLoading
                      ? "bg-gray-100 dark:bg-gray-700 cursor-not-allowed"
                      : "bg-white dark:bg-gray-800"}
    border-gray-300 dark:border-gray-700
    text-gray-900 dark:text-white
    focus:ring-2 focus:ring-blue-500`}
                >
                  {usersLoading ? (
                    <option value="">Loading users...</option>
                  ) : (
                    <>
                      <option value="">Choose a user...</option>
                      {availableUsers.map(user => (
                        <option key={user.id} value={user.id}>
                          {user.name} ({user.email})
                        </option>
                      ))}
                    </>
                  )}
                </select>


              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">Role</label>
                <input
                  type="text"
                  value={clientModel ? "CLIENT" : memberRole}
                  disabled={clientModel}
                  style={clientModel ? { opacity: 20, cursor: "not-allowed", color: "text-gray-600" } : { opacity: 100 }}
                  onChange={(e) => setMemberRole(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter role (e.g., Developer, Designer)"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setSelectedUser('');
                  setMemberRole('');
                  setClientModel(false);
                }}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={() => addMember(clientModel)}
                disabled={!selectedUser}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg"
              >
                {memberLoading ? "Adding..." : "Add Member"}
              </button>
            </div>
          </div>
        </div>
      )}

      {removeModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 w-full max-w-sm border border-gray-200 dark:border-gray-700 shadow-2xl">
            <h2 className="text-lg font-bold text-red-600 mb-2">
              Remove Member
            </h2>

            <p className="text-sm text-gray-700 dark:text-gray-300">
              Are you sure you want to remove{" "}
              <span className="font-semibold">
                {removeModal.userName}
              </span>{" "}
              from this project?
            </p>

            <p className="text-xs text-gray-500 mt-2">
              This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setRemoveModal(null)}
                className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                Cancel
              </button>

              {/* <button
                onClick={async () => {
                  await removeMember(removeModal.userId);
                  setRemoveModal(null);
                }}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white"
              >
                Remove
              </button> */}
              <button
                onClick={() => removeMember(removeModal.userId)}
                disabled={memberLoading}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white"
              >
                {memberLoading ? "Removing..." : "Remove"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
