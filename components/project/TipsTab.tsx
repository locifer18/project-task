"use client";

import { useEffect, useState } from "react";
import { Lightbulb, Plus, User, Calendar, LucideLoader } from "lucide-react";
import toast from "react-hot-toast";

export default function UsefulTipsTab({ projectId }: { projectId: string }) {
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [creating, setCreating] = useState(false);

  const [newTip, setNewTip] = useState({
    tip: ""
  });

  useEffect(() => {
    if (projectId) {
      fetchTips();
    }
  }, [projectId]);

  const fetchTips = async () => {
    try {
      const res = await fetch(`/api/project/tip?projectId=${projectId}`);
      const data = await res.json();
      
      if (data.success) {
        setTips(data.tips);
      }
    } catch (err) {
      console.error("Failed to fetch tips:", err);
    } finally {
      setLoading(false);
    }
  };

  const createTip = async () => {
    if (!newTip.tip.trim()) {
      toast.error('Please enter a tip');
      return;
    }

    try {
      setCreating(true);
      
      // Get user ID from cookies or auth
      const userRes = await fetch('/api/auth/me');
      const userData = await userRes.json();
      
      if (!userData.success) {
        toast.error('Please login to add tips');
        return;
      }
      
      const res = await fetch('/api/project/tip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          userId: userData.user.id,
          tip: newTip.tip.trim()
        })
      });

      const data = await res.json();
      
      if (data.success) {
        setShowModal(false);
        setNewTip({ tip: "" });
        await fetchTips();
        toast.success('Tip added successfully!');
      } else {
        toast.error(data.message || 'Failed to add tip');
      }
    } catch (err) {
      console.error("Failed to add tip:", err);
      toast.error('Error adding tip');
    } finally {
      setCreating(false);
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
          <Lightbulb size={24} />
          Useful Tips
        </h2>
        
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={16} />
          Add Tip
        </button>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Contribution Guidelines</h3>
        <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
          <li><strong>Open to All:</strong> Anyone involved in the project can contribute their opinions or suggestions</li>
          <li><strong>Project Enhancement:</strong> Tips are intended to boost project efficiency and success</li>
          <li><strong>Examples:</strong> Best practices, shortcuts, tools recommendations, workflow improvements</li>
        </ul>
      </div>

      {/* Tips List */}
      {tips.length === 0 ? (
        <div className="text-center py-12">
          <Lightbulb className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No tips shared yet</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Be the first to share a useful tip to enhance project outcomes.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {tips.map((tip: any) => (
            <div
              key={tip.id}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start gap-3">
                <Lightbulb className="mt-1 text-yellow-500" size={20} />
                <div className="flex-1">
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    {tip.tip}
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <User size={14} />
                      <span>Shared by {tip.user}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      <span>{new Date(tip.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Tip Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-900 w-full max-w-md p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-2xl">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Share a Useful Tip
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
                  Your Tip *
                </label>
                <textarea
                  value={newTip.tip}
                  onChange={(e) => setNewTip({ ...newTip, tip: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={4}
                  placeholder="Share your insight or suggestion to enhance project outcomes..."
                  disabled={creating}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowModal(false);
                  setNewTip({ tip: "" });
                }}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                disabled={creating}
              >
                Cancel
              </button>
              <button
                onClick={createTip}
                disabled={creating || !newTip.tip.trim()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
              >
                {creating ? 'Adding...' : 'Add Tip'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}