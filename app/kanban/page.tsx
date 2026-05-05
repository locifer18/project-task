/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  Clock,
  MessageSquare,
  Paperclip,
  User,
  Calendar,
  Flag,
  X,
  Plus,
  Search,
  Send,
  AlertCircle,
  Tag,
  Edit2,
  Trash2,
  Save,
  SquarePen,
  Download,
  Eye,
  LucideLoader2,
  LucideLoader,
  LucideXCircle,
  BellElectric
} from 'lucide-react';

import { Toaster, toast } from 'react-hot-toast';
import Image from 'next/image';
import RichTextEditor from '@/components/common/editor/Editor';
import dynamic from 'next/dynamic';
import { htmlToText } from '@/components/common/editor/htmlToText';

const RenderRichText = dynamic(() => import("@/components/common/editor/Render"));

interface Comment {
  id: string;
  user: { id: string, name: string, image: string }
  content: string;
  createdAt: Date;
}

interface Task {
  id: string;
  title: string;
  description: string;
  assignee: string;
  assigneeAvatar: string;
  priority: 'low' | 'medium' | 'high';
  projectId?: string;
  Project: { name: string, id: string };
  dueDate: string;
  tags: string[];
  comments: Comment[];
  attachments: Array<{ id: string; originalName: string; name: string; size: string; type: string, url: string; }>;
  status: 'assigned' | 'in-progress' | 'completed' | 'on-hold';
}

const priorityClasses = {
  low:
    'dark:bg-blue-500/20 dark:text-blue-300 dark:border-blue-500/30 bg-blue-50 text-blue-700 border-blue-200',
  medium:
    'dark:bg-yellow-500/20 dark:text-yellow-300 dark:border-yellow-500/30 bg-yellow-50 text-yellow-700 border-yellow-200',
  high:
    'dark:bg-red-500/20 dark:text-red-300 dark:border-red-500/30 bg-red-50 text-red-700 border-red-200'
} as const;

type NewTaskShape = {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  tags: string[];
  status: 'assigned' | 'in-progress' | 'completed' | 'on-hold';
  attachments: File[] | null;
  projectId: string;
  employeeId: string;
};

export const NewTaskModal: React.FC<{
  isOpen: boolean;
  isLoading: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  newTask: NewTaskShape;
  assignee: string;
  setNewTask: (t: any) => void;
  handleSubmit: () => void;
  handleAddTag: (tag: string) => void;
  handleRemoveTag: (tag: string) => void;
  projectsLoading: boolean;
  switchToUserId: string;
  setSwitchToUserId: React.Dispatch<React.SetStateAction<string>>;
  selectedUsers: any[];
  setSelectedUsers: React.Dispatch<React.SetStateAction<any[]>>;
  allEmployees: any[];
  user: any[];
  handleRemoveUserFromGroup: (user: any) => void;
  projects: { id: string; name: string }[];
}> = ({ isOpen, onClose, mode, isLoading, assignee, newTask, setNewTask, handleSubmit, handleAddTag, handleRemoveTag, projectsLoading, projects, selectedUsers, setSelectedUsers, allEmployees, handleRemoveUserFromGroup, user, switchToUserId, setSwitchToUserId }) => {
  const [originalEmployeeId, setOriginalEmployeeId] = useState<string | null>(null);

  useEffect(() => {
    if (mode === "edit" && newTask.employeeId) {
      setOriginalEmployeeId(newTask.employeeId);
    }

    if (mode === "create") {
      setOriginalEmployeeId(null);
    }
  }, [mode]);

  if (!isOpen) return null;

  const removeAttachment = (index: number) => {
    setNewTask((prev) => {
      if (!prev.attachments) return prev;

      const updated = prev.attachments.filter((_, i) => i !== index);

      return {
        ...prev,
        attachments: updated.length ? updated : null,
      };
    });
  };

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4">
      <Toaster position="top-right" />
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-2xl rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-[#0a0a0a]">
        <div className="sticky top-0 z-10 border-b px-6 py-4 border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0a0a0a]">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {mode === "edit" ? "Edit Task" : "Create New Task"}
            </h2>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Task Title *</label>
            <input
              type="text"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              placeholder="Enter task title..."
              className="w-full px-4 py-3 rounded-lg border bg-white dark:bg-[#111] border-gray-300 dark:border-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Describe Your Task</label>

            <RichTextEditor
              content={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Assignee</label>
              <div className="flex items-center gap-2 pl-1">
                <User className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                <p className="text-gray-900 dark:text-white font-medium">
                  {assignee || "Loading..."}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Due Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                <input
                  type="date"
                  value={newTask.dueDate}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border bg-white dark:bg-[#111] border-gray-300 dark:border-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Priority</label>
              <div className="flex gap-2">
                {(['low', 'medium', 'high'] as const).map((priority) => (
                  <button
                    key={priority}
                    onClick={() => setNewTask({ ...newTask, priority })}
                    className={`flex-1 px-4 py-3 rounded-lg border font-medium capitalize transition-all ${newTask.priority === priority
                      ? priority === 'low'
                        ? 'bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-500/20 dark:text-blue-300 dark:border-blue-500/50'
                        : priority === 'medium'
                          ? 'bg-yellow-100 text-yellow-700 border-yellow-300 dark:bg-yellow-500/20 dark:text-yellow-300 dark:border-yellow-500/50'
                          : 'bg-red-100 text-red-700 border-red-300 dark:bg-red-500/20 dark:text-red-300 dark:border-red-500/50'
                      : 'bg-white dark:bg-[#111] border-gray-300 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-700'
                      }`}
                  >
                    {priority}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Status</label>
              <select
                value={newTask.status}
                onChange={(e) => setNewTask({ ...newTask, status: e.target.value as Task['status'] })}
                className="w-full px-4 py-3 rounded-lg border bg-white dark:bg-[#111] border-gray-300 dark:border-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="assigned">Assigned</option>
                <option value="in-progress">In Progress</option>
                <option value="on-hold">On Hold</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
              Project *
            </label>

            <select
              value={newTask.projectId}
              disabled={projectsLoading}
              onChange={(e) =>
                setNewTask({ ...newTask, projectId: e.target.value })
              }
              className="w-full px-4 py-3 rounded-lg border bg-white dark:bg-[#111]
      border-gray-300 dark:border-gray-800 text-gray-900 dark:text-white
      focus:outline-none focus:ring-2 focus:ring-blue-500
      disabled:opacity-60"
            >
              <option value="">
                {projectsLoading ? "Loading projects..." : "Select a project"}
              </option>

              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>

          {mode === "edit" && (
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                Switch To
              </label>

              <select
                value={switchToUserId}
                onChange={(e) => {
                  setSwitchToUserId(e.target.value);
                }}
                className="w-full px-4 py-3 rounded-lg border bg-white dark:bg-[#111]
    border-gray-300 dark:border-gray-800
    text-gray-900 dark:text-white
    focus:outline-none focus:ring-2 focus:ring-blue-500
    transition-all duration-200"
              >
                <option value="">Select user</option>

                {user
                  .filter((u) => u.id !== originalEmployeeId) // ✅ hide only original owner
                  .map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name}
                    </option>
                  ))}
              </select>

              {/* Selected User Visual */}
              {switchToUserId &&
                newTask.employeeId !== originalEmployeeId && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {user
                      .filter((u) => u.id === switchToUserId)
                      .map((selected) => (
                        <div
                          key={selected.id}
                          className="
              flex items-center justify-between
              px-4 py-2.5
              rounded-xl
              bg-white dark:bg-[#1a1a1a]
              border border-gray-200 dark:border-gray-700
              shadow-sm
              min-w-[140px]
            "
                        >
                          <div className="flex items-center gap-2">
                            <div className="
                w-8 h-8
                rounded-full
                flex items-center justify-center
                text-sm font-semibold
                bg-gradient-to-br from-[#1a1a1a] to-[#222222]
                text-white
              ">
                              {selected.name.charAt(0)}
                            </div>

                            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                              {selected.name}
                            </span>
                          </div>

                          {/* <button
              onClick={() =>
                setNewTask({ ...newTask, employeeId: "" })
              }
              className="
                ml-3
                w-7 h-7
                flex items-center justify-center
                rounded-full
                text-red-500
                hover:bg-red-100 dark:hover:bg-red-500/20
                transition-all duration-200
                text-xl
              "
            >
              ×
            </button> */}
                        </div>
                      ))}
                  </div>
                )}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold mb-2">
              Assign To
            </label>

            <select
              value=""
              onChange={(e) => {
                const selectedEmp = allEmployees.find(
                  (emp) => emp.id === e.target.value
                );

                if (!selectedEmp) return;

                setSelectedUsers((prev) =>
                  prev.some((u) => u.userId === selectedEmp.id)
                    ? prev
                    : [
                      ...prev,
                      {
                        userId: selectedEmp.id,
                        name: selectedEmp.name,
                        role: selectedEmp.role,
                      },
                    ]
                );
              }}
              className="w-full px-4 py-3 rounded-lg border bg-white dark:bg-[#111]
  border-gray-300 dark:border-gray-800 text-gray-900 dark:text-white
  focus:outline-none focus:ring-2 focus:ring-blue-500
  disabled:opacity-60"
            >
              <option value="">Select employee</option>

              {allEmployees
                .filter(
                  (emp) => !selectedUsers.some((u) => u.userId === emp.id)
                )
                .map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name}
                  </option>
                ))}
            </select>

            <div className="flex flex-wrap gap-2 mt-3">
              {selectedUsers.map((user) => (
                <div
                  key={user.userId}
                  className="
    flex items-center justify-between
    px-4 py-2.5
    rounded-xl
    bg-white dark:bg-[#1a1a1a]
    border border-gray-200 dark:border-gray-700
    shadow-sm hover:shadow-md
    transition-all duration-200
    min-w-[120px]
  "
                >
                  <div className="flex items-center gap-2">
                    <div className="
      w-8 h-8
      rounded-full
      flex items-center justify-center
      text-sm font-semibold
      bg-gradient-to-br from-[#1a1a1a] to-[#222222]
      text-white
      shadow
    ">
                      {user.name.charAt(0)}
                    </div>

                    <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                      {user.name}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      if (mode === "edit" && user.taskId) {
                        handleRemoveUserFromGroup(user);
                      } else {
                        setSelectedUsers((prev) =>
                          prev.filter((u) => u.userId !== user.userId)
                        );
                      }
                    }}
                    className="
      ml-3
      w-7 h-7
      flex items-center justify-center
      rounded-full
      text-red-500
      hover:bg-red-100 dark:hover:bg-red-500/20
      transition-all duration-200
      text-2xl
    "
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Tags</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {newTask.tags.map(tag => (
                <span key={tag} className="px-3 py-1 rounded-lg text-sm font-medium flex items-center gap-2 bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-500/10 dark:text-purple-300 dark:border-purple-500/20">
                  {tag}
                  <button onClick={() => handleRemoveTag(tag)} className="hover:opacity-70">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              placeholder="Add tags (press Enter)..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTag(e.currentTarget.value);
                  e.currentTarget.value = '';
                }
              }}
              className="w-full px-4 py-3 rounded-lg border bg-white dark:bg-[#111] border-gray-300 dark:border-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div
            className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
             border-gray-300 bg-gray-50
             dark:border-gray-800 dark:bg-[#111]"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const files = Array.from(e.dataTransfer.files || []);
              if (!files.length) return;

              setNewTask((prev) => {
                const existing = prev.attachments ?? [];

                return {
                  ...prev,
                  attachments: [...existing, ...files],
                };
              });
            }}


            onClick={() => document.getElementById("task-file-input")?.click()}
          >
            <Paperclip className="w-8 h-8 mx-auto mb-2 text-gray-400 dark:text-gray-600" />

            <p className="text-sm mb-1 text-gray-600 dark:text-gray-400">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-600">
              PDF, DOC, Images up to 10MB each
            </p>

            <input
              id="task-file-input"
              type="file"
              multiple
              className="hidden"
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                if (!files.length) return;

                setNewTask((prev) => {
                  const existing = prev.attachments ?? [];

                  return {
                    ...prev,
                    attachments: [...existing, ...files],
                  };
                });

                e.target.value = '';
              }}


            />
          </div>


          {newTask.attachments?.length > 0 && (
            <div className="mt-3 space-y-2">
              {newTask.attachments.map((file, index) => (
                <div
                  key={`${file.name}-${index}`}
                  className="flex items-center justify-between text-sm px-4 pr-3 py-3.5 rounded-lg bg-white dark:bg-[#111] border border-gray-300 dark:border-gray-800 dark:text-white text-gray-900">
                  <span className="truncate max-w-[80%]">{file.name}</span>

                  <button
                    type="button"
                    onClick={() => removeAttachment(index)}>
                    <LucideXCircle size={18} className="text-red-400" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button onClick={onClose} className="flex-1 px-6 py-3 rounded-lg font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
              Cancel
            </button>

            <button onClick={isLoading ? () => { } : handleSubmit} disabled={isLoading || !newTask.title.trim() || !newTask.description.trim() || !newTask.dueDate}
              className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-50 text-white rounded-lg font-medium transition-colors grid place-items-center">
              {isLoading ? (<LucideLoader className='animate-spin text-white' size={24} />) :
                mode === "edit" ? "Update Task" : "Create Task"
              }
            </button>

          </div>
        </div>
      </div>
    </div>
  );
};

export const SidePanel: React.FC<{
  selectedTask: Task | null;
  onClose: () => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  commentText: string;
  setCommentText: (v: string) => void;
  handleAddComment: () => void;
  handleReport: () => void;
  open: boolean;
  setOpen: (v: boolean) => void;
  message: string;
  setMessage: (v: string) => void;
  loading: boolean;
  reportCount: number;
  reportMessages: { message: string }[];
  reportsLoading: boolean;
  currentUserId: string;
  handleEditComment: (commentId: string, newContent: string) => void;
  handleDeleteComment: (commentId: string) => void;
}> = ({
  selectedTask,
  onClose,
  onEditTask,
  onDeleteTask,
  commentText,
  setCommentText,
  handleAddComment,
  reportsLoading,
  loading,
  open,
  setOpen,
  message,
  setMessage,
  handleReport,
  reportCount,
  reportMessages,
  currentUserId,
  handleEditComment,
  handleDeleteComment,
}) => {
    const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
    const [confirmDelete, setConfirmDelete] = useState<Task | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [editContent, setEditContent] = useState('');
    const [deleteComment, setDeleteComment] = useState<{
      id: string;
      author: string;
    } | null>(null);

    if (!selectedTask) return null;


    // const handleAttachmentDelete = async (id: string) => {
    //   const res = await fetch("/api/kanban/task")
    // }


    const startEdit = (comment: Comment) => {
      setEditingCommentId(comment.id);
      setEditContent(comment.content);
    };

    const cancelEdit = () => {
      setEditingCommentId(null);
      setEditContent('');
    };

    const saveEdit = (commentId: string) => {
      if (editContent.trim()) {
        handleEditComment(commentId, editContent.trim());
        setEditingCommentId(null);
        setEditContent('');
      }
    };

    const getFileIcon = (type: string) => {
      switch (type) {
        case 'pdf':
          return '📄';
        case 'image':
          return '🖼️';
        case 'figma':
          return '🎨';
        case 'zip':
          return '📦';
        case 'json':
          return '📋';
        default:
          return '📎';
      }
    };

    return (
      <div className="fixed inset-0 z-9999 flex justify-end">
        <div className="flex-1 bg-black/50 backdrop-blur-sm" onClick={onClose} />

        <div className="w-[600px] h-full bg-white dark:bg-[#0a0a0a] shadow-2xl overflow-y-auto">
          <div className="sticky top-0 z-10 border-b px-6 py-4 border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0a0a0a]">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Task Details</h2>
              <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className='flex gap-3'>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedTask.title}</h1>
                  <span className={`px-2 py-1 rounded-lg text-sm font-medium border ${priorityClasses[selectedTask.priority]}`}>
                    <Flag className="w-3 h-3 inline mr-1" />
                    {selectedTask.priority}
                  </span>
                </div>
                <div className='flex  items-center '>
                  <div>
                    <button
                      className=" px-3 py-1.5 rounded-md"
                      onClick={() => {
                        if (!selectedTask) return;
                        onEditTask(selectedTask);
                      }}
                    >
                      <SquarePen size={19} className='text-gray-400 hover:text-blue-600' />
                    </button>

                  </div>
                  <div ><button
                    className="  px-3 py-1.5 rounded-md"
                    onClick={() => setConfirmDelete(selectedTask)}
                  >
                    <Trash2 size={19} className='text-gray-400 hover:text-red-700' />
                  </button>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Task ID: #{selectedTask.id}</p>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-200">Explaination</h3>
              <RenderRichText html={selectedTask.description} />
              {/* <p className="text-gray-400 dark:text-gray-200">{selectedTask.description}</p> */}
            </div>


            <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-gray-50 dark:bg-[#111]">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Assignee</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold bg-gradient-to-br from-blue-400 to-green-400 text-white dark:from-blue-500 dark:to-green-500">
                    {selectedTask.assignee.charAt(0)}
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white">{selectedTask.assignee}</span>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Due Date</span>
                </div>
                <span className="font-medium text-gray-900 dark:text-white">
                  {new Date(selectedTask.dueDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Tag className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Tags</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {selectedTask.tags.length > 0 ? selectedTask.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 rounded-md text-xs font-medium bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-300">
                      {tag}
                    </span>
                  )) : <p className="text-xs text-gray-400 dark:text-gray-500 ml-4 ">No Tags Provided</p>
                  }
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Paperclip className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Attachments</span>
                </div>
                <span className="font-medium text-gray-900 dark:text-white">{selectedTask.attachments.length} files</span>
              </div>
            </div>
            {
              selectedTask?.Project && (
                <div className="w-full h-16 rounded-lg dark:bg-[#111] bg-gray-50 flex justify-start px-4 items-center">
                  <p className='text-base'>Project: <span className='font-semibold'>{selectedTask.Project.name}</span></p>
                </div>
              )
            }

            <div className="p-4 rounded-xl border bg-red-50 border-red-200 dark:bg-red-500/5 dark:border-red-500/20">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-600 dark:text-red-400" />
                <div className="flex-1">
                  <h3 className="font-semibold mb-1 text-red-700 dark:text-red-400">
                    {reportMessages.length === 0
                      ? "Report an Issue"
                      : `${reportMessages.length} issue${reportMessages.length > 1 ? "s" : ""} reported`}
                  </h3>
                  <p className="text-sm mb-3 text-red-600/70 dark:text-red-300/70">
                    {reportCount === 0
                      ? "Found a problem? Let us know and we'll help resolve it."
                      : "Issue reported. Team will review soon."}
                  </p>
                  {/* Reports Section */}
                  {reportsLoading ? (
                    <div className="text-sm text-red-700 dark:text-red-300 mb-3">
                      Loading reports...
                    </div>
                  ) : reportMessages.length > 0 ? (
                    <div className="space-y-2 mb-3">
                      {reportMessages.map((msg, index) => (
                        <div
                          key={index}
                          className="text-sm p-2 rounded-md  text-red-700 dark:text-red-300 border"
                        >
                          {msg.message}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                      No issues reported for this task.
                    </div>
                  )}

                  <button
                    onClick={() => setOpen(true)}
                    className="px-3 py-1.5 rounded-lg text-sm font-medium bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-500/20 dark:text-red-300"
                  >
                    Report Issue
                  </button>

                </div>
              </div>
            </div>

            {open && (
              <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                <div className="bg-white dark:bg-[#111] w-full max-w-md p-6 rounded-xl shadow-xl border border-gray-200 dark:border-gray-800">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">Report an Issue</h2>
                    <button
                      onClick={() => setOpen(false)}
                      className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-800"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  <textarea
                    className="w-full h-32 p-3 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-black outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Describe the issue here..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                  <div className="flex justify-end gap-2 mt-4">
                    <button
                      onClick={() => setOpen(false)}
                      className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleReport}
                      disabled={loading}
                      className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                    >
                      {loading ? "Submitting..." : "Submit"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {selectedTask.attachments.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-900 dark:text-white">
                    <Paperclip className="w-5 h-5" />
                    Attachments ({selectedTask.attachments.length})
                  </h3>
                </div>
                <div className="space-y-2">
                  {selectedTask.attachments?.map((file, id) => (
                    <div
                      key={file.id ?? id}
                      className="flex items-center justify-between p-3 rounded-lg border bg-gray-50 border-gray-200 hover:border-gray-300 dark:bg-[#111] dark:border-gray-800 dark:hover:border-gray-700 transition-colors group"
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <span className="text-2xl">{getFileIcon(file.type)}</span>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate text-gray-900 dark:text-white">
                            {file.originalName}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-500">
                            {file.size}
                          </p>
                        </div>
                      </div>
                      <a
                        href={file.url}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-sm px-3 py-1 rounded-md"
                      >
                        <Eye className='hover:text-blue-400' size={20} />
                      </a>
                      <button
                        onClick={async () => {
                          const res = await fetch(file.url);
                          const blob = await res.blob();

                          const a = document.createElement("a");
                          a.href = URL.createObjectURL(blob);
                          a.title = file.name;
                          a.download = file.name;
                          a.click();

                          URL.revokeObjectURL(a.href);
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-sm py-1 rounded-md"
                      >
                        <Download className='hover:text-green-300' size={20} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ENHANCED COMMENTS SECTION */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
                <MessageSquare className="w-5 h-5" />
                Comments ({selectedTask?.comments?.length})
              </h3>

              <div className="space-y-4 mb-4">
                {selectedTask.comments?.map(comment => (
                  <div key={comment.id} className="p-4 pt-3 rounded-xl bg-gray-50 dark:bg-[#111] group">
                    <div className="flex items-start gap-3">

                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold bg-gradient-to-br from-green-400 to-teal-400 text-white dark:from-green-500 dark:to-teal-500 mt-2">
                        {
                          comment.user?.image ? (
                            <div className="w-full h-full overflow-hidden rounded-full border border-blue-600">
                              <Image
                                src={comment.user.image}
                                alt='avatar'
                                width={1080}
                                height={1080}
                                className='w-full h-full object-cover'
                              />
                            </div>
                          ) : (
                              <p>
                                {comment.user?.name?.charAt(0) || "U"}
                              </p>
                          )
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <div className="w-full flex justify-start items-start flex-col">
                            <span className="text-xs text-gray-500 dark:text-gray-500">
                              {new Date(comment.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                            <span className="font-semibold text-gray-900 dark:text-white">{comment?.user?.name}</span>
                          </div>

                          {/* EDIT/DELETE BUTTONS - Only show if current user is the author */}
                          {comment.user?.id === currentUserId && (
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              {editingCommentId === comment.id ? (
                                <>
                                  <button
                                    onClick={() => saveEdit(comment.id)}
                                    className="p-1.5 rounded-md hover:bg-green-100 dark:hover:bg-green-500/20 text-green-600 dark:text-green-400"
                                    title="Save"
                                  >
                                    <Save className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={cancelEdit}
                                    className="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
                                    title="Cancel"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    onClick={() => startEdit(comment)}
                                    className="p-1.5 rounded-md hover:bg-blue-100 dark:hover:bg-blue-500/20 text-blue-600 dark:text-blue-400"
                                    title="Edit"
                                  >
                                    <Edit2 className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() =>
                                      setDeleteComment({
                                        id: comment.id,
                                        author: comment.user?.name || "Unknown User",
                                      })
                                    }
                                    className="p-1.5 rounded-md hover:bg-red-100 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400"
                                    title="Delete"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </>
                              )}
                            </div>
                          )}
                        </div>

                        {/* COMMENT CONTENT OR EDIT TEXTAREA */}
                        {editingCommentId === comment.id ? (
                          <textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-[#0a0a0a] border-gray-300 dark:border-gray-800 text-gray-900 dark:text-white"
                            rows={3}
                            autoFocus
                          />
                        ) : (
                          <p className="text-sm text-gray-700 dark:text-gray-300">{comment.content}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-xl border bg-gray-50 border-gray-200 dark:bg-[#111] dark:border-gray-800">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Add a comment..."
                  className="w-full px-3 py-2 rounded-lg border resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-[#0a0a0a] border-gray-300 dark:border-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600"
                  rows={3}
                />
                <div className="flex justify-end mt-3">
                  <button
                    onClick={handleAddComment}
                    disabled={!commentText.trim()}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-medium flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Comment
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* DELETE TASK MODAL */}
        {confirmDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white dark:bg-[#111] rounded-xl p-6 w-full max-w-sm shadow-xl">
              <h3 className="text-lg font-bold text-red-600 mb-2">
                Delete Task
              </h3>

              <p className="text-sm text-gray-700 dark:text-gray-300 mb-5">
                Are you sure you want to delete
                <span className="font-semibold"> “{confirmDelete.title}”</span>?
                <br />
                This action cannot be undone.
              </p>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                >
                  Cancel
                </button>

                <button
                  disabled={deleting}
                  onClick={() => {
                    if (!selectedTask) return;
                    onDeleteTask(selectedTask.id);
                    setConfirmDelete(null)
                  }}
                  className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white disabled:opacity-50"
                >
                  {deleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Comment Delete Modal */}
        {deleteComment && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-sm shadow-xl">

              <h2 className="text-lg font-bold text-red-600">
                Delete Comment
              </h2>

              <p className="text-sm mt-2 text-gray-700 dark:text-gray-300">
                Are you sure you want to delete this comment by{" "}
                <strong>{deleteComment.author}</strong>?
                This action cannot be undone.
              </p>

              <div className="flex justify-end gap-3 mt-5">
                {/* Cancel */}
                <button
                  onClick={() => setDeleteComment(null)}
                  className="
            px-4 py-2 rounded-md border
            text-gray-700 dark:text-gray-300
            bg-white dark:bg-gray-800
            hover:bg-gray-100 dark:hover:bg-gray-700
            hover:border-gray-400
            transition-all duration-200
            active:scale-95
            focus:outline-none focus:ring-2 focus:ring-gray-400/50
          "
                >
                  Cancel
                </button>

                {/* Delete */}
                <button
                  onClick={async () => {
                    await handleDeleteComment(deleteComment.id);
                    setDeleteComment(null);
                  }}
                  className="
            px-4 py-2 rounded-md
            bg-red-600 text-white
            hover:bg-red-700
            transition-all duration-200
            active:scale-95
            focus:outline-none focus:ring-2 focus:ring-red-500/60
          "
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    );
  };

export default function KanbanBoard() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [reportCount, setReportCount] = useState(0);
  const [reportMessages, setReportMessages] = useState<{ message: string }[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  // const [selectedTaskId, setSelectedTaskId] = useState(String);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [commentText, setCommentText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [newTask, setNewTask] = useState<NewTaskShape>({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    tags: [],
    status: 'assigned',
    attachments: null,
    projectId: '',
    employeeId: '',
  });

  const [assigne, setAssigne] = useState<string>('');
  const [user, setUser] = useState<any[]>([]);
  const [switchToUserId, setSwitchToUserId] = useState<string>("");

  const [tasks, setTasks] = useState<Task[]>([]);
  const [tasksLoading, setTasksLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [employees, setEmployees] = useState<any[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<string>("__ME__");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [taskemployee, settaskemployee] = useState<any>(null);
  const [taskMode, setTaskMode] = useState<"create" | "edit">("create");
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [reportsLoading, setReportsLoading] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [transition, setTransition] = useState(false)
  const [selectedUsers, setSelectedUsers] = useState<
    {
      userId: string;
      name: string;
      role?: string;
      taskId?: string;
    }[]
  >([]);

  const [activeGroup, setActiveGroup] = useState<any>(null);

  const fetchProjects = async () => {
    try {
      setProjectsLoading(true);
      const res = await fetch("/api/project"); // your projects API
      const data = await res.json();
      setProjects(data.projects || []);
    } catch (err) {
      console.error("Failed to load projects", err);
    } finally {
      setProjectsLoading(false);
    }
  };

  const fetchAdmin = async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      if (data.user) {
        setAssigne(data.user.name);
      }
    }
    catch (err) {
      console.error("Failed to load Me", err);
      toast.error("Failed to load Me");
    }
  }
  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    fetchAdmin();
    fetchUserRole();
  }, []);

  // useEffect(() => {
  //   if (selectedEmployee === "__ME__") {
  //     fetchTasks(currentUser?.employeeId);
  //     settaskemployee(currentUser?.employeeId);
  //   } else {
  //     fetchTasks(selectedEmployee);
  //     settaskemployee(selectedEmployee);
  //   }
  // }, [selectedEmployee]);

  useEffect(() => {
    if (!currentUser) return;
    if (selectedEmployee === "__ME__") {
      fetchTasks(); // no param = use token's userId
      settaskemployee(currentUser.id);
    } else {
      fetchTasks(selectedEmployee);
      settaskemployee(selectedEmployee);
    }
  }, [selectedEmployee, currentUser]);

  const fetchUserRole = async () => {
    //     const res = await fetch("/api/user");
    // const data = await res.json();

    // if (data.user) {
    //   setCurrentUser(data.user);
    //   const role = data.user.role?.toUpperCase();
    //   setUserRole(role);

    //   if (role === "ADMIN") {
    //     fetchEmployees();
    //   }
    // }
    const res = localStorage.getItem("user");
    const data = res ? JSON.parse(res) : null;

    // if (data) {
    //   setCurrentUser(data);
    //   const role = data.subRole?.role?.toUpperCase();
    //   setUserRole(role.name);

    //   if (role.name === "ADMIN") {
    //     fetchEmployees();
    //   }
    // }

    if (data) {
      setCurrentUser(data);

      const roleName = data.role?.toUpperCase();
      setUserRole(roleName);

      if (roleName === "ADMIN") {
        fetchEmployees();
      }
    }
  };

  const fetchEmployees = async () => {
    const res = await fetch('/api/user?all=true');
    const data = await res.json();
    if (data.success) {
      setUser(data.users);
      // setEmployees(data.users.filter((u: any) => u.role.name === 'EMPLOYEE'));
      setEmployees(
        data.users.filter((u: any) => u.role === "MEMBER")
      );
    }
  };

  const fetchTasks = async (employeeId?: string) => {
    try {
      setTasksLoading(true);
      const url = new URL("/api/kanban/task", window.location.origin);
      if (employeeId) url.searchParams.set("employeeId", employeeId);
      const res = await fetch(url.toString(), { credentials: "include" });
      const data = await res.json();
      setTasks(data.tasks ?? []);
    } catch (err) {
      console.error("Kanban Fetch Error:", err);
      setTasks([]);
    } finally {
      setTasksLoading(false);
    }
  };


  useEffect(() => {
    if (!selectedTaskId) return;

    const task = tasks.find(t => t.id === selectedTaskId);
    if (task) {
      setSelectedTask(task);
    }
  }, [tasks, selectedTaskId]);

  const columns = [
    { id: 'on-hold', title: 'On Hold', icon: BellElectric, color: 'orange' },
    { id: 'assigned', title: 'Assigned', icon: User, color: 'blue' },
    { id: 'in-progress', title: 'In Progress', icon: Clock, color: 'yellow' },
    { id: 'completed', title: 'Completed', icon: CheckCircle2, color: 'green' }
  ];

  const handleDragStart = (task: Task) => {
    setDraggedTask(task);
  };

  // const handleUpdateTask = async () => {
  //   if (!taskToEdit) return;

  //   try {
  //     setTransition(true)
  //     const formData = new FormData();
  //     formData.append("id", taskToEdit.id);
  //     formData.append("title", newTask.title.trim());
  //     formData.append("description", newTask.description.trim());
  //     formData.append("assignee", assigne);
  //     formData.append("priority", newTask.priority);
  //     formData.append("dueDate", newTask.dueDate);
  //     formData.append("status", newTask.status);
  //     formData.append("tags", newTask.tags.join(","));
  //     formData.append("projectId", newTask.projectId)

  //     if (newTask.attachments?.length) {
  //       newTask.attachments.forEach((file) => {
  //         formData.append("attachment", file);
  //       });
  //     }

  //     const res = await fetch("/api/kanban/task", {
  //       method: "PUT",
  //       body: formData,
  //     });

  //     const data = await res.json();
  //     if (!res.ok) {
  //       toast.error("Update failed");
  //       return;
  //     }

  //     setTasks(prev =>
  //       prev.map(t => (t.id === data.task.id ? data.task : t))
  //     );

  //     setSelectedTask(data.task);
  //     setShowNewTaskModal(false);
  //     setTaskMode("create");
  //     setTaskToEdit(null);
  //     toast.success("Task updated");
  //   } catch (err) {
  //     console.error(err);
  //     toast.error("Something went wrong");
  //   }
  //   finally {
  //     setTransition(false)
  //   }
  // };

  const handleUpdateTask = async () => {
    if (!taskToEdit) return;

    try {
      setTransition(true);

      // 1️⃣ Update current task
      const formData = new FormData();
      formData.append("id", taskToEdit.id);
      formData.append("title", newTask.title.trim());
      formData.append("description", newTask.description.trim());
      formData.append("assignee", assigne);
      formData.append("priority", newTask.priority);
      formData.append("dueDate", newTask.dueDate);
      formData.append("status", newTask.status);
      formData.append("tags", newTask.tags.join(","));
      formData.append("projectId", newTask.projectId);

      if (switchToUserId) {
        formData.append("switchToUserId", switchToUserId);

      }
      if (newTask.attachments?.length) {
        newTask.attachments.forEach((file) => {
          formData.append("attachment", file);
        });
      }

      const res = await fetch("/api/kanban/task", {
        method: "PUT",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error("Update failed");

      // 2️⃣ Detect NEW users (users added in edit)
      const newUsers = selectedUsers.filter((u) => !u.taskId);

      const createdTasks: any[] = [];

      for (const user of newUsers) {
        const newForm = new FormData();

        newForm.append("title", newTask.title.trim());
        newForm.append("description", newTask.description.trim());
        newForm.append("assignee", user.name);
        newForm.append("employeeId", user.userId);
        newForm.append("priority", newTask.priority);
        newForm.append("dueDate", newTask.dueDate);
        newForm.append("status", newTask.status);
        newForm.append("tags", newTask.tags.join(","));
        newForm.append("projectId", newTask.projectId);

        const createRes = await fetch("/api/kanban/task", {
          method: "POST",
          body: newForm,
        });

        const created = await createRes.json();

        if (!createRes.ok) {
          console.error("Create Task API Error:", created);
          throw new Error(created.message || created.error || "Failed to create task");
        }

        createdTasks.push(created.task);

        // 3️⃣ Add new user into existing group
        if (activeGroup) {
          await fetch("/api/kanban/multi-task-group/add-user", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              groupId: activeGroup.id,
              user: {
                taskId: created.task.id,
                userId: user.userId,
                name: user.name,
                role: user.role,
              },
            }),
          });
        }
      }

      // 4️⃣ Update UI state
      setTasks((prev) => [
        ...prev.map((t) => (t.id === data.task.id ? data.task : t)),
        ...createdTasks,
      ]);

      toast.success("Task updated successfully");

      setShowNewTaskModal(false);
      setTaskMode("create");
      setTaskToEdit(null);
      setSelectedUsers([]);
    } catch (err) {
      console.error(err);
      toast.error("Update failed");
    } finally {
      setTransition(false);
      setNewTask({
        title: '',
        description: '',
        priority: 'medium',
        dueDate: '',
        tags: [],
        status: 'assigned',
        attachments: null,
        projectId: '',
        employeeId: '',
      });
    }
  };


  const handleSubmitTask = async () => {
    if (taskMode === "edit") {
      await handleUpdateTask();
    } else {
      await handleCreateTask();
    }
  };

  // const handleEditTask = (task: Task) => {
  //   setTaskMode("edit");
  //   setTaskToEdit(task);

  //   setNewTask({
  //     title: task.title,
  //     description: task.description,
  //     priority: task.priority,
  //     dueDate: task.dueDate.split("T")[0],
  //     tags: task.tags,
  //     status: task.status,
  //     attachments: null,
  //     projectId: task?.Project?.id || "",
  //   });

  //   setShowNewTaskModal(true);
  // };

  const handleEditTask = async (task: Task) => {
    setTaskMode("edit");
    setTaskToEdit(task);


    setNewTask({
      title: task.title,
      description: task.description,
      priority: task.priority,
      dueDate: task.dueDate.split("T")[0],
      tags: task.tags,
      status: task.status,
      attachments: null,
      projectId: task?.Project?.id || "",
      employeeId: task.employeeId,
    });

    const res = await fetch(`/api/kanban/multi-task-group/${task.id}`);
    const data = await res.json();

    if (data.group) {
      setActiveGroup(data.group);

      const mapped = data.group.users.map((u: any) => ({
        userId: u.userId,
        name: u.name,
        role: u.role,
        taskId: u.taskId,
      }));

      setSelectedUsers(mapped);
    } else {
      setActiveGroup(null);
      setSelectedUsers([]);
    }

    setShowNewTaskModal(true);
  };

  const handleRemoveUserFromGroup = async (user: any) => {
    if (!activeGroup) return;

    try {
      await fetch("/api/kanban/task", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: user.taskId }),
      });

      await fetch("/api/kanban/multi-task-group/remove-user", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          groupId: activeGroup.id,
          userId: user.userId,
        }),
      });

      setSelectedUsers((prev) =>
        prev.filter((u) => u.userId !== user.userId)
      );

      setTasks((prev) =>
        prev.filter((t) => t.id !== user.taskId)
      );

    } catch {
      toast.error("Remove failed");
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      const res = await fetch("/api/kanban/task", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: taskId }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to delete task");
        return;
      }

      toast.success("Task deleted successfully");

      setTasks(prev => prev.filter(t => t.id !== taskId));
      setSelectedTask(null);
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Something went wrong");
    }
  };


  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (newStatus: Task["status"]) => {
    if (!draggedTask) return;

    const prevTasks = [...tasks];

    setTasks(prev =>
      prev.map(task =>
        task.id === draggedTask.id ? { ...task, status: newStatus } : task
      )
    );

    try {
      const res = await fetch("/api/kanban/task", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: draggedTask.id,
          status: newStatus,
        }),
      });

      if (draggedTask.projectId && newStatus === "completed") {
        await fetch("/api/project/work-done", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            projectId: draggedTask.projectId,
            taskId: draggedTask.id,
            title: draggedTask.title,
            description: draggedTask.description,
            priority: draggedTask.priority,
            dueDate: draggedTask.dueDate,
            tags: draggedTask.tags,
            userId: currentUser.id,
          }),
        })
      }

      if (draggedTask.projectId && draggedTask.status === "completed" && newStatus !== "completed") {
        await fetch(`/api/project/work-done?taskId=${draggedTask.id}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" }
        })
      }

      if (!res.ok) {
        throw new Error("Failed to update");
      }
    } catch (err) {
      console.error("API Update Failed:", err);
      setTasks(prevTasks);
    }

    setDraggedTask(null);
  };

  const handleAddComment = async () => {
    if (!commentText.trim() || !selectedTask) return;

    try {
      const res = await fetch("/api/kanban/comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: commentText,
          taskId: selectedTask.id,
        }),
      });

      const data = await res.json();

      if (data.success && data.comment) {
        const newComment = data.comment;

        setTasks(tasks.map(task =>
          task.id === selectedTask.id
            ? { ...task, comments: [...(task.comments || []), newComment] }
            : task
        ));

        setSelectedTask({
          ...selectedTask,
          comments: [...(selectedTask.comments || []), newComment],
        });

        setCommentText("");
      }
    } catch (err) {
      console.error("Failed to add comment:", err);
    }
  };

  const handleEditComment = async (commentId: string, newContent: string) => {
    if (!selectedTask) return;

    try {
      const res = await fetch("/api/kanban/comment", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          commentId,
          content: newContent,
        }),
      });

      const data = await res.json();

      if (data.success) {
        const updatedComments = selectedTask.comments.map(c =>
          c.id === commentId ? { ...c, content: newContent } : c
        );

        setTasks(tasks.map(task =>
          task.id === selectedTask.id
            ? { ...task, comments: updatedComments }
            : task
        ));

        setSelectedTask({
          ...selectedTask,
          comments: updatedComments,
        });
      }
    } catch (err) {
      console.error("Failed to edit comment:", err);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!selectedTask) return;

    try {
      const res = await fetch("/api/kanban/comment", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commentId }),
      });

      const data = await res.json();

      if (data.success) {
        const updatedComments = selectedTask.comments.filter(c => c.id !== commentId);

        setTasks(tasks.map(task =>
          task.id === selectedTask.id
            ? { ...task, comments: updatedComments }
            : task
        ));

        setSelectedTask({
          ...selectedTask,
          comments: updatedComments,
        });
      }
    } catch (err) {
      console.error("Failed to delete comment:", err);
    }
  };


  const fetchReports = async (taskId: string) => {
    try {
      setReportsLoading(true);
      setReportMessages([]);

      const res = await fetch(`/api/kanban/report?taskId=${taskId}`);
      const data = await res.json();

      if (data.success) {
        setReportCount(data.count || 0);
        setReportMessages(data.messages || []);
      }
    } catch (err) {
      console.error("Failed to fetch reports:", err);
    } finally {
      setReportsLoading(false);
    }
  };

  useEffect(() => {
    if (!selectedTask) return;
    fetchReports(selectedTask.id);
  }, [selectedTask?.id]);

  // const handleCreateTask = async () => {
  //   if (!newTask.title.trim()) return;

  //   try {
  //     setTransition(true)
  //     const formData = new FormData();
  //     const assigneeName = assigne || "Unassigned";
  //     const employeeId = taskemployee || currentUser.employeeId || "";

  //     formData.append("title", newTask.title.trim());
  //     formData.append("description", newTask.description.trim());
  //     formData.append("assignee", assigneeName);
  //     formData.append("employeeId", employeeId);
  //     formData.append("projectId", newTask.projectId)
  //     formData.append(
  //       "assigneeAvatar",
  //       assigneeName !== "Unassigned"
  //         ? assigneeName
  //           .split(" ")
  //           .map(n => n[0])
  //           .join("")
  //           .toUpperCase()
  //         : ""
  //     );
  //     formData.append("priority", newTask.priority);
  //     formData.append("dueDate", newTask.dueDate);
  //     formData.append("status", newTask.status);
  //     formData.append("tags", newTask.tags.join(","));

  //     if (newTask.attachments?.length) {
  //       newTask.attachments.forEach((file) => {
  //         formData.append("attachment", file);
  //       });
  //     }

  //     const res = await fetch("/api/kanban/task", {
  //       method: "POST",
  //       body: formData,
  //     });

  //     const data = await res.json();

  //     if (!res.ok) {
  //       console.error("Create Task Error:", data);
  //       return;
  //     }

  //     setTasks(prev => [...prev, data.task]);

  //     setShowNewTaskModal(false);
  //     setNewTask({
  //       title: "",
  //       description: "",
  //       priority: "medium",
  //       dueDate: "",
  //       tags: [],
  //       status: "assigned",
  //       attachments: null,
  //       projectId: "",
  //     });

  //   } catch (error) {
  //     console.error("Create Task Exception:", error);
  //   }
  //   finally {
  //     setTransition(false);
  //   }
  // };

  const handleCreateTask = async () => {
    if (!newTask.title.trim()) return;

    try {
      setTransition(true);

      const usersToAssign =
        selectedUsers.length > 0
          ? selectedUsers
          : [
            {
              userId: taskemployee || currentUser?.id,
              name: assigne,
            },
          ];

      const createdTasks: any[] = [];
      const groupUsersPayload: any[] = [];

      for (const user of usersToAssign) {
        const formData = new FormData();


        formData.append("title", newTask.title.trim());
        formData.append("description", newTask.description.trim());
        formData.append("assignee", user.name);
        formData.append("employeeId", user.userId);
        formData.append("priority", newTask.priority);
        formData.append("dueDate", newTask.dueDate);
        formData.append("status", newTask.status);
        formData.append("tags", newTask.tags.join(","));
        formData.append("projectId", newTask.projectId);

        const res = await fetch("/api/kanban/task", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (!res.ok) throw new Error("Create failed");

        createdTasks.push(data.task);

        groupUsersPayload.push({
          taskId: data.task.id,
          userId: user.userId,
          name: user.name,
          role: user.role,
        });
      }

      // if (groupUsersPayload.length > 1) {
      //   await fetch("/api/kanban/multi-task-group", {
      //     method: "POST",
      //     headers: { "Content-Type": "application/json" },
      //     body: JSON.stringify({
      //       createdBy: currentUser.id,
      //       users: groupUsersPayload,
      //     }),
      //   });
      // }

      if (groupUsersPayload.length > 1) {
        const groupRes = await fetch("/api/kanban/multi-task-group", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            createdBy: currentUser.id,
            users: groupUsersPayload,
          }),
        });

        const groupData = await groupRes.json();

        if (groupRes.ok) {
          setActiveGroup(groupData.group);  // ✅ STORE GROUP
        }
      }

      setTasks((prev) => [...prev, ...createdTasks]);
      setSelectedUsers([]);
      setShowNewTaskModal(false);

    } catch (err) {
      toast.error("Failed to create");
    } finally {
      setTransition(false);
      setNewTask({
        title: '',
        description: '',
        priority: 'medium',
        dueDate: '',
        tags: [],
        status: 'assigned',
        attachments: null,
        projectId: '',
        employeeId: '',
      });
    }
  };

  const handleAddTag = (tag: string) => {
    if (tag.trim() && !newTask.tags.includes(tag.trim())) {
      setNewTask({ ...newTask, tags: [...newTask.tags, tag.trim()] });
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setNewTask({ ...newTask, tags: newTask.tags.filter(tag => tag !== tagToRemove) });
  };

  const handleReport = async () => {
    if (!message.trim() || !selectedTask) {
      toast.error("Message cannot be empty");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/kanban/report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          taskId: selectedTask.id
        }),
      });

      const data = await res.json();

      if (data.success) {
        setReportCount(prev => prev + 1);
        toast.success("Report submitted successfully");
        setMessage("");
        setOpen(false);
        await fetchReports(selectedTask.id);
      } else {
        toast.error(data.error || "Failed to send report");
      }
    } catch (err) {
      console.error("Report error:", err);
      toast.error("Something went wrongg");

    } finally {
      setLoading(false);
    }
  };

  // const filterTasksByUser = (task: Task) => {
  //   if (userRole === "ADMIN") {
  //     if (selectedEmployee === "__ME__" || !selectedEmployee) {
  //       return task.assignee === currentUser?.name;
  //     }
  //     return task.assignee === selectedEmployee;
  //   }

  //   // EMPLOYEE
  //   return task.assignee === currentUser?.name;
  // };


  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTasksByStatus = (status: Task['status']) =>
    filteredTasks.filter(task => task.status === status);

  return (
    <div className="min-h-screen transition-colors duration-200">
      <Toaster position="top-right" />
      <div className="border-b sticky top-0 z-10">
        <div className="max-w-[1600px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Kanban Board</h1>

            <div className="flex items-center gap-3">
              {userRole === 'ADMIN' && (
                <select
                  value={selectedEmployee}
                  onChange={(e) => setSelectedEmployee(e.target.value)}
                  className="px-4 py-2 rounded-lg border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="__ME__">My Tasks</option>
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name} - {emp.employeeId}
                    </option>
                  ))}
                </select>
              )}

              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 rounded-lg border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 w-80"
                />
              </div>

              <button
                onClick={() => {
                  setShowNewTaskModal(true);
                  if (currentUser) {
                    setNewTask(prev => ({
                      ...prev,
                      assignee: currentUser.name,
                      assigneeAvatar: currentUser.name
                        .split(" ")
                        .map(n => n[0])
                        .join("")
                        .toUpperCase(),
                    }));
                  }
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center gap-2 transition-colors"
              >
                <Plus className="w-4 h-4" />
                New Task
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 py-6">
        {tasksLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading tasks...</p>
            </div>
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No tasks found</h3>
            <button
              onClick={() => setShowNewTaskModal(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center gap-2 mx-auto transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create Task
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-6">
            {columns.map(column => {
              const Icon = column.icon;
              const columnTasks = getTasksByStatus(column.id as Task['status']);

              return (
                <div key={column.id} className="flex flex-col h-full">
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200 dark:border-gray-800">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-lg ${column.color === 'blue' ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400' :
                        column.color === 'yellow' ? 'bg-yellow-50 text-yellow-600 dark:bg-yellow-500/10 dark:text-yellow-400' : column.color === "orange" ? "bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400" :
                          'bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400'
                        }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <h2 className="font-semibold text-lg text-gray-900 dark:text-white">{column.title}</h2>
                    </div>
                    <h2 className="font-medium text-base text-gray-600 dark:text-white mr-4"> {columnTasks.length}</h2>
                  </div>

                  <div
                    onDragOver={handleDragOver}
                    onDrop={() => handleDrop(column.id as Task['status'])}
                    className={`flex-1 space-y-3 min-h-[200px] p-1 rounded-lg ${draggedTask && draggedTask.status !== column.id ? 'bg-gray-100/50 dark:bg-gray-800/30' : ''}`}
                  >
                    {columnTasks.map(task => (
                      <div
                        key={task.id}
                        draggable
                        onDragStart={() => handleDragStart(task)}
                        onClick={() => setSelectedTaskId(task.id)}
                        className={`p-4 rounded-xl border cursor-pointer transition-all bg-white dark:bg-gray-800/[0.5] border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 hover:shadow-lg hover:shadow-blue-500/10 dark:hover:shadow-blue-500/5 ${draggedTask?.id === task.id ? 'opacity-50' : ''}`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="font-semibold text-gray-600 dark:text-white line-clamp-2">{task.title}</h3>
                          <span className={`px-2 py-1 rounded-md text-xs font-medium border ${priorityClasses[task.priority]} flex-shrink-0 ml-2`}>
                            {task.priority}
                          </span>
                        </div>

                        <p className="text-sm mb-3 line-clamp-2 text-gray-600 dark:text-gray-400">{htmlToText(task.description)}</p>

                        <div className="flex flex-wrap gap-2 mb-3">
                          {task.tags.map(tag => (
                            <span key={tag} className="px-2 py-1 rounded-md text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-500/10 dark:text-purple-300 dark:border-purple-500/20">
                              {tag}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-800">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1">
                              <MessageSquare className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                              <span className="text-sm text-gray-600 dark:text-gray-400">{task.comments?.length}</span>
                            </div>
                            {task.attachments.length > 0 && (
                              <div className="flex items-center gap-1">
                                <Paperclip className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                                <span className="text-sm text-gray-600 dark:text-gray-400">{task.attachments.length}</span>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold bg-gradient-to-br from-blue-500 to-green-500 text-white">
                              {task.assignee.charAt(0)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <SidePanel
        selectedTask={selectedTask}
        onClose={() => setSelectedTask(null)}
        onEditTask={handleEditTask}
        onDeleteTask={handleDeleteTask}
        commentText={commentText}
        setCommentText={setCommentText}
        handleAddComment={handleAddComment}
        reportsLoading={reportsLoading}
        loading={loading}
        open={open}
        setOpen={setOpen}
        message={message}
        setMessage={setMessage}
        handleReport={handleReport}
        reportCount={reportCount}
        reportMessages={reportMessages}
        currentUserId={currentUser?.id || ''}
        handleEditComment={handleEditComment}
        handleDeleteComment={handleDeleteComment}
      />

      <NewTaskModal
        isOpen={showNewTaskModal}
        assignee={assigne}
        onClose={() => {
          setShowNewTaskModal(false);
          setTaskMode("create");
          setTaskToEdit(null);
          setActiveGroup(null);
          setSelectedUsers([]);
        }}
        mode={taskMode}
        newTask={newTask}
        setNewTask={setNewTask}
        handleSubmit={handleSubmitTask}
        handleAddTag={handleAddTag}
        handleRemoveTag={handleRemoveTag}
        projectsLoading={projectsLoading}
        projects={projects}
        isLoading={transition}
        selectedUsers={selectedUsers}
        setSelectedUsers={setSelectedUsers}
        allEmployees={employees}
        handleRemoveUserFromGroup={handleRemoveUserFromGroup}
        user={user}
        switchToUserId={switchToUserId}
        setSwitchToUserId={setSwitchToUserId}
      />

    </div>
  );
};