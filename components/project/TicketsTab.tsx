"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Plus, Trash2, User, Clock, LucideLoader } from "lucide-react";
import toast from "react-hot-toast";

export default function TicketsTab({ projectId }: { projectId: string }) {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [teammates, setTeammates] = useState([]);

  const [newTicket, setNewTicket] = useState({
    reason: "",
    // blockedTeammates: [] as string[]
    blockedTeammates: [] as { id: string; name: string }[],
  });

  useEffect(() => {
    if (projectId) {
      fetchTickets();
      fetchCurrentUser();
      fetchTeammates();
      // console.log(projectId, "projectId");

    }
  }, [projectId]);

  const fetchCurrentUser = async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      if (data.success) {
        // console.log(data.user);

        setCurrentUser(data.user);
      }
    } catch (err) {
      console.error('Failed to fetch user:', err);
    }
  };

  const fetchTeammates = async () => {
    try {
      const res = await fetch(`/api/project/member?projectId=${projectId}`);
      const data = await res.json();
      if (data.success) {
        const userIds = data.members.map((member: any) => member.userId);
        // console.log(data.members, "teammates", userIds);

        setTeammates(data.members);
      }
    } catch (err) {
      console.error('Failed to fetch teammates:', err);
    }
  };

  const fetchTickets = async () => {
    try {
      const res = await fetch(`/api/project/ticket?projectId=${projectId}`);
      const data = await res.json();

      if (data.success) {
        // console.log(data.tickets, "tickets");

        setTickets(data.tickets);
      }
    } catch (err) {
      console.error("Failed to fetch tickets:", err);
    } finally {
      setLoading(false);
    }
  };

  const createTicket = async () => {
    if (!newTicket.reason.trim()) {
      toast.error('Please describe the blockage issue');
      return;
    }
    // console.log(currentUser);

    if (!currentUser?.name) {
      toast.error('User not authenticated');
      return;
    }

    try {
      setCreating(true);
      const res = await fetch('/api/project/ticket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          reportedBy: currentUser.name,
          reason: newTicket.reason.trim(),
          blockedTeammates: newTicket.blockedTeammates
        })
      });

      const data = await res.json();

      if (data.success) {
        setShowModal(false);
        setNewTicket({ reason: "", blockedTeammates: [] });
        await fetchTickets();
        toast.success('Blockage ticket created successfully!');
      } else {
        toast.error(data.message || 'Failed to create ticket');
      }
    } catch (err) {
      console.error("Failed to create ticket:", err);
      toast.error('Error creating ticket');
    } finally {
      setCreating(false);
    }
  };

  const deleteTicket = async (ticketId: string) => {
    if (!window.confirm('Are you sure you want to delete this ticket?')) return;

    try {
      const res = await fetch('/api/project/ticket', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticketId })
      });

      const data = await res.json();

      if (data.success) {
        await fetchTickets();
        toast.success('Ticket deleted successfully!');
      } else {
        toast.error(data.message || 'Failed to delete ticket');
      }
    } catch (err) {
      console.error("Failed to delete ticket:", err);
      toast.error('Error deleting ticket');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <LucideLoader className='animate-spin text-blue-300' size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <AlertTriangle size={24} />
          Project Blockage Tickets
        </h2>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={16} />
          Report Blockage
        </button>
      </div>

      <p className="text-gray-600 dark:text-gray-400">
        Report impediments that are blocking project progress. Examples: waiting for designs, external dependencies, team member availability.
      </p>

      {/* Tickets List */}
      {tickets.length === 0 ? (
        <div className="text-center py-12">
          <AlertTriangle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No blockages reported</h3>
          <p className="text-gray-600 dark:text-gray-400">
            When team members face impediments, they'll appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {tickets.map((ticket: any) => (
            <div
              key={ticket.id}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <AlertTriangle className="text-red-500 mt-1" size={20} />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Project Blockage Issue
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                      {ticket.reason}
                    </p>

                    {ticket.blockedTeammates && ticket.blockedTeammates.length > 0 && (
                      <div className="mb-3">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Blocked by:</h4>
                        {/* <div className="flex flex-wrap gap-2">
                          {ticket.blockedTeammates.map((teammate: { id: string; name: string }, index: number) => (
                            <span
                              key={teammate.id || index}
                              className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 text-xs rounded-full"
                            >
                              {teammate.name}
                            </span>
                          ))}
                        </div> */}

                        <div className="flex flex-wrap gap-2">
                          {ticket.blockedTeammates.map((teammate: string, index: number) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 text-xs rounded-full"
                            >
                              {teammate}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <User size={14} />
                        <span>Reported by: {ticket.reportedBy}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {currentUser?.subRole?.role?.name === 'ADMIN' && (
                  <button
                    onClick={() => deleteTicket(ticket.id)}
                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    title="Delete Ticket"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Ticket Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-900 w-full max-w-md p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-2xl">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Report Project Blockag
            </h3>

            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
                Describe the blockage issue *
              </label>
              <textarea
                value={newTicket.reason}
                onChange={(e) => setNewTicket(prev => ({ ...prev, reason: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 resize-none"
                rows={4}
                placeholder="e.g., Frontend development is blocked because the design team hasn't provided the final UI mockups for the dashboard page."
                disabled={creating}
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
                Blocked Teammates
              </label>
              <div className="space-y-2 max-h-32 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-lg p-2 bg-white dark:bg-gray-800">
                {teammates.map((teammate: any) => (
                  <label key={teammate.id} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-1 rounded">
                    <input
                      type="checkbox"
                      // checked={newTicket.blockedTeammates?.includes(teammate.user.name) ?? false}
                      checked={
                        newTicket.blockedTeammates?.some(
                          (t) => t.id === teammate.userId
                        ) ?? false
                      }
                      // onChange={(e) => {
                      //   if (e.target.checked) {
                      //     setNewTicket(prev => ({
                      //       ...prev,
                      //       blockedTeammates: [...prev.blockedTeammates, teammate.user.name]
                      //     }));
                      //   } else {
                      //     setNewTicket(prev => ({
                      //       ...prev,
                      //       blockedTeammates: prev.blockedTeammates.filter(name => name !== teammate.user.name)
                      //     }));
                      //   }
                      // }}

                      onChange={(e) => {
                        if (e.target.checked) {
                          setNewTicket(prev => ({
                            ...prev,
                            blockedTeammates: [
                              ...prev.blockedTeammates,
                              {
                                id: teammate.userId,
                                name: teammate.user.name
                              }
                            ]
                          }));
                        } else {
                          setNewTicket(prev => ({
                            ...prev,
                            blockedTeammates: prev.blockedTeammates.filter(
                              (t) => t.id !== teammate.userId
                            )
                          }));
                        }
                      }}

                      className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                      disabled={creating}
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{teammate.user.name}</span>
                  </label>
                ))}
                {teammates.length === 0 && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 p-2">No teammates found</p>
                )}
              </div>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 mb-4">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                <strong>Examples:</strong> Waiting for designs, external API issues, team member unavailable, missing requirements, dependency delays.
              </p>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowModal(false);
                  setNewTicket({ reason: "", blockedTeammates: [] });
                }}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                disabled={creating}
              >
                Cancel
              </button>
              <button
                onClick={createTicket}
                disabled={creating || !newTicket.reason.trim()}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                {creating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Creating...
                  </>
                ) : (
                  'Report Blockage'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}