"use client";

import { useEffect, useState } from "react";
import { BarChart3, Edit3, Check, X, LucideLoader } from "lucide-react";
import toast from "react-hot-toast";

export default function StatusTab({ projectId }: { projectId: string }) {
  const [status, setStatus] = useState(0);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [newStatus, setNewStatus] = useState(0);
  const [updating, setUpdating] = useState(false);
  const [canEdit, setCanEdit] = useState(false);

  useEffect(() => {
    if (projectId) {
      fetchStatus();
      checkPermissions();
    }
  }, [projectId]);

  const fetchStatus = async () => {
    try {
      const res = await fetch(`/api/project/status?projectId=${projectId}`);
      const data = await res.json();
      
      if (data.success) {
        setStatus(data.status);
        setNewStatus(data.status);
      }
    } catch (err) {
      console.error("Failed to fetch status:", err);
    } finally {
      setLoading(false);
    }
  };

  const checkPermissions = async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      
      
      if (data.success && data.user) {
        const isAdmin = data.user.role.name === 'ADMIN';
        // TODO: Check if user is team leader for this project
        setCanEdit(isAdmin);
      }
    } catch (err) {
      console.error("Failed to check permissions:", err);
    }
  };

  const updateStatus = async () => {
    try {
      setUpdating(true);
      
      
      const res = await fetch('/api/project/status', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          status: newStatus
        })
      });

      const data = await res.json();
      
      
      if (data.success) {
        setStatus(data.status);
        setEditing(false);
        toast.success('Status updated successfully!');
      } else {
        console.error('Update failed:', data);
        toast.error(data.error || 'Failed to update status');
      }
    } catch (err) {
      console.error("Failed to update status:", err);
      toast.error('Error updating status');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 50) return 'bg-blue-500';
    if (percentage >= 25) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getStatusText = (percentage: number) => {
    if (percentage === 100) return 'Completed';
    if (percentage >= 80) return 'Near Completion';
    if (percentage >= 50) return 'In Progress';
    if (percentage >= 25) return 'Getting Started';
    return 'Just Started';
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
          <BarChart3 size={24} />
          Project Status
        </h2>
        
        {/* Debug info */}
        <div className="text-xs text-gray-500 mb-2">
          Can Edit: {canEdit ? 'Yes' : 'No'}
        </div>
        
        {canEdit && !editing && (
          <button
            onClick={() => setEditing(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition-colors"
          >
            <Edit3 size={16} />
            Update Status
          </button>
        )}
      </div>

      {/* Status Display */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Progress Overview
          </h3>
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            {status}%
          </span>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
            <div
              className={`h-4 rounded-full transition-all duration-500 ${getStatusColor(status)}`}
              style={{ width: `${status}%` }}
            ></div>
          </div>
        </div>

        {/* Status Text */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Status: {getStatusText(status)}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-500">
            {100 - status}% remaining
          </span>
        </div>
      </div>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-900 w-full max-w-md p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-2xl">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Update Project Status
            </h3>

            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
                Progress Percentage
              </label>
              
              {/* Number Input */}
              <div className="flex items-center gap-4 mb-3">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={newStatus}
                  onChange={(e) => setNewStatus(Math.max(0, Math.min(100, parseInt(e.target.value) || 0)))}
                  className="w-20 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  disabled={updating}
                />
                <span className="text-gray-600 dark:text-gray-400">%</span>
              </div>
              
              {/* Range Slider */}
              <input
                type="range"
                min="0"
                max="100"
                value={newStatus}
                onChange={(e) => setNewStatus(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                disabled={updating}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0%</span>
                <span className="font-medium text-lg">{newStatus}%</span>
                <span>100%</span>
              </div>
            </div>

            <div className="mb-6">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all duration-300 ${getStatusColor(newStatus)}`}
                  style={{ width: `${newStatus}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                {getStatusText(newStatus)}
              </p>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setEditing(false);
                  setNewStatus(status);
                }}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center gap-2"
                disabled={updating}
              >
                <X size={16} />
                Cancel
              </button>
              <button
                onClick={updateStatus}
                disabled={updating}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center gap-2"
              >
                <Check size={16} />
                {updating ? 'Updating...' : 'Update'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}