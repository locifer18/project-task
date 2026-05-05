"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Plus, Clock, CheckCircle, XCircle, User, LucideLoader } from "lucide-react";
import toast from "react-hot-toast";

export default function BlockageTab({ projectId }: { projectId: string }) {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  const [newTicket, setNewTicket] = useState({
    title: "",
    description: "",
    blockedBy: "",
    priority: "MEDIUM"
  });

  useEffect(() => {
    if (projectId) {
      fetchTickets();
      fetchCurrentUser();
    }
  }, [projectId]);

  const fetchCurrentUser = async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      if (data.success) {
        setCurrentUser(data.user);
      }
    } catch (err) {
      console.error('Failed to fetch user:', err);
    }
  };

  const fetchTickets = async () => {
    try {
      const res = await fetch(`/api/project/blockage?projectId=${projectId}`);
      const data = await res.json();
      
      if (data.success) {
        setTickets(data.tickets);
      }
    } catch (err) {
      console.error("Failed to fetch tickets:", err);
    } finally {
      setLoading(false);
    }
  };

  const createTicket = async () => {
    if (!newTicket.title.trim() || !newTicket.description.trim() || !newTicket.blockedBy.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setCreating(true);
      const res = await fetch('/api/project/blockage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newTicket,
          projectId
        })
      });

      const data = await res.json();
      
      if (data.success) {
        setShowModal(false);
        setNewTicket({ title: "", description: "", blockedBy: "", priority: "MEDIUM" });
        await fetchTickets();
        toast.success('Blockage ticket created successfully!');
      } else {
        toast.error(data.error || 'Failed to create ticket');
      }
    } catch (err) {
      console.error("Failed to create ticket:", err);
      toast.error('Error creating ticket');
    } finally {
      setCreating(false);
    }
  };

  const updateTicketStatus = async (ticketId: string, status: string) => {
    try {
      const res = await fetch('/api/project/blockage', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticketId, status })
      });

      const data = await res.json();
      
      if (data.success) {
        await fetchTickets();
        toast.success('Ticket status updated!');
      } else {
        toast.error(data.error || 'Failed to update status');
      }
    } catch (err) {
      console.error("Failed to update status:", err);
      toast.error('Error updating status');
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'bg-red-100 text-red-800 border-red-200';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'LOW': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'OPEN': return <AlertTriangle className="text-red-500" size={20} />;
      case 'IN_PROGRESS': return <Clock className="text-yellow-500" size={20} />;
      case 'RESOLVED': return <CheckCircle className="text-green-500" size={20} />;
      default: return <XCircle className="text-gray-500" size={20} />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        {/* <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div> */}
         <LucideLoader className='animate-spin text-blue-300' size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <AlertTriangle size={24} />
          Blockage Tickets
        </h2>
        
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={16} />
          Report Blockage
        </button>
      </div>

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
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  {getStatusIcon(ticket.status)}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {ticket.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                      {ticket.description}
                    </p>
                  </div>
                </div>
                
                <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getPriorityColor(ticket.priority)}`}>
                  {ticket.priority}
                </span>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 mb-4">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>Blocked by:</strong> {ticket.blockedBy}
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <User size={14} />
                    <span>Reported by Developer</span>
                  </div>
                  <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                </div>

                {currentUser?.role.name === 'ADMIN' && ticket.status !== 'RESOLVED' && (
                  <div className="flex gap-2">
                    {ticket.status === 'OPEN' && (
                      <button
                        onClick={() => updateTicketStatus(ticket.id, 'IN_PROGRESS')}
                        className="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 text-white text-sm rounded transition-colors"
                      >
                        Start Progress
                      </button>
                    )}
                    <button
                      onClick={() => updateTicketStatus(ticket.id, 'RESOLVED')}
                      className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition-colors"
                    >
                      Mark Resolved
                    </button>
                  </div>
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
              Report Project Blockage
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
                  Issue Title *
                </label>
                <input
                  type="text"
                  value={newTicket.title}
                  onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500"
                  placeholder="e.g., Waiting for design assets"
                  disabled={creating}
                />
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
                  Description *
                </label>
                <textarea
                  value={newTicket.description}
                  onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 resize-none"
                  rows={3}
                  placeholder="Describe the blockage and its impact..."
                  disabled={creating}
                />
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
                  Blocked By *
                </label>
                <input
                  type="text"
                  value={newTicket.blockedBy}
                  onChange={(e) => setNewTicket({ ...newTicket, blockedBy: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500"
                  placeholder="e.g., Design Team, External API, Client"
                  disabled={creating}
                />
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
                  Priority
                </label>
                <select
                  value={newTicket.priority}
                  onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500"
                  disabled={creating}
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowModal(false);
                  setNewTicket({ title: "", description: "", blockedBy: "", priority: "MEDIUM" });
                }}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                disabled={creating}
              >
                Cancel
              </button>
              <button
                onClick={createTicket}
                disabled={creating}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
              >
                {creating ? 'Creating...' : 'Report Blockage'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}