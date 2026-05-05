"use client";

import { PlusCircle } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import TextArea from '../form/input/TextArea';
import Loader from '../common/Loading';
import { Trash2 } from "lucide-react";

type CardProps = {
  id: string
  description: string;
  createdBy: string;
  date: string;
  onDelete?: (id: string) => void;
};

export function MinimalCard({
  id,
  description,
  createdBy,
  date,
  onDelete,
}: CardProps) {
  return (
    <div
      className="
        relative rounded-xl
        border border-black/10 dark:border-white/10
        bg-white dark:bg-gray-800
        p-6 transition-colors
      "
    >
      {/* Delete Icon */}
      <button
        onClick={() => onDelete && onDelete(id)}
        aria-label="Delete"
        className="
          absolute right-4 top-2
          rounded-md p-1.5
          text-gray-400 hover:text-red-500
          hover:bg-gray-100 dark:hover:bg-gray-800
          transition
        "
      >
        <Trash2 size={16} />
      </button>

      {/* Description */}
      <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300 pr-8">
        {description}
      </p>

      {/* Footer */}
      <div className="mt-6 flex items-center justify-between text-xs">
        <span className="text-gray-500 dark:text-gray-400">
          {createdBy}
        </span>
        <span className="text-gray-400 dark:text-gray-500">
          {date}
        </span>
      </div>
    </div>
  );
}




function ClientUpdate({ projectId }: { projectId: string }) {
  const [showAddUpdate, setShowAddUpdate] = useState(false);
  const [update, setUpdate] = useState("");
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);


  const fetchUpdates = async () => {
    setLoading(true)
    const req = await fetch(`/api/latest-updates?projectId=${projectId}`)
    if (req.status === 200) {
      const data = await req.json()
      setData(data.updates)
    }
    setLoading(false)
  }

  const handleAddUpdate = async () => {
    if (!update.trim()) return;

    try {
      setUpdating(true)
      const userRes = await fetch("/api/auth/me");
      const userData = await userRes.json();

      const res = await fetch("/api/latest-updates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: update,
          projectId: projectId,
          createdBy: userData.user?.name || "Admin",
        }),
      });

      if (res.ok) {
        setUpdate("");
        setShowAddUpdate(false);

      } else {
        console.error("Add update failed", await res.text());
      }
    } catch (err) {
      console.error("Failed to add update:", err);
    }
    finally {
      setUpdating(false)
      fetchUpdates();
    }
  };

  const deleteProject = async (id: string) => {
    if (!confirm("This action is irreversable are you sure want to delete this?")) {
      return null;
    }

    try {
      const req = await fetch(`/api/latest-updates?id=${id}`, {
        method: "DELETE",
      });

      const res = await req.json();

      if (req.ok) {
        fetchUpdates();
        return true;
      } else {
        console.error(res);
        alert("Failed to delete");
      }

    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  useEffect(() => {
    fetchUpdates();
  }, [])

  if (loading) {
    return (
      <div className='w-full h-[80vh] flex justify-center items-center'>
        <Loader />
      </div>
    )
  }
  return (
    <div className='relative'>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-end gap-2">
          Client Update
        </h2>

        <button
          onClick={() => setShowAddUpdate(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-800 text-white rounded-lg flex items-center gap-2 transition-colors"
        >
          <PlusCircle size={16} />
          Update
        </button>
      </div>

      <p className="text-gray-600 dark:text-gray-400">
        Report to client for the latest updates.
      </p>

      {showAddUpdate && (
        <div className="fixed inset-0 flex items-center justify-center mt-20 p-4 z-100">
          <div className="w-[30%] h-96 bg-gray-100 dark:bg-gray-dark p-6 py-5 rounded-xl">
            <h1 className='text-2xl font-semibold mb-4'>Update to Client</h1>
            <TextArea value={update} onChange={(e) => { setUpdate(e) }} className='min-h-60 bg-white text-black dark:text-white resize-none'></TextArea>
            <div className="w-full flex justify-end items-center gap-3 mt-4">
              <button
                onClick={handleAddUpdate}
                disabled={updating}
                className={`px-4 py-2 rounded-lg text-white
                  ${updating
                    ? "bg-gray-400 cursor-not-allowed opacity-70"
                    : "bg-blue-600 hover:bg-blue-700"
                  }`}
              >
                {updating ? "Saving..." : "Save"}
              </button>

              <button
                onClick={() => { setShowAddUpdate(false); setUpdate(""); }}
                className="px-4 py-2 bg-gray-400 dark:bg-gray-600 text-white rounded-lg hover:bg-gray-700">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {
        data.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-6">
            {data.map((card: any, index: number) => (
              <MinimalCard key={index} id={card.id} date={card.date} createdBy={card.createdBy} description={card.title} onDelete={deleteProject} />
            ))}
          </div>
        ) : (<p className='text-center text-gray-300 dark:text-gray-600 py-16 font-normal'>No Updates has been added</p>)
      }
    </div>
  )
}

export default ClientUpdate