'use client';

import { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, FileImage } from 'lucide-react';
import toast from 'react-hot-toast';

interface CertificateUploadProps {
  onUploadSuccess: () => void;
  onClose: () => void;
}

export default function CertificateUpload({ onUploadSuccess, onClose }: CertificateUploadProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignedTo: ''
  });
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/user?all=true');
      const data = await response.json();
      if (data.success) {
        setUsers(data.users.filter((user: any) => (user.subRole?.role?.name !== 'ADMIN' && user.subRole?.role?.name !== 'CLIENT')));
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      const selectedFile = acceptedFiles[0];
      if (selectedFile) {
        setFile(selectedFile);
        setPreview(URL.createObjectURL(selectedFile));
      }
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !formData.title) {
      toast.error('Please fill required fields and select an image');
      return;
    }

    setUploading(true);
    const uploadData = new FormData();
    uploadData.append('file', file);
    uploadData.append('title', formData.title);
    uploadData.append('description', formData.description);
    uploadData.append('assignedTo', formData.assignedTo);
    uploadData.append('createdBy', 'admin');

    try {
      const response = await fetch('/api/certificates', {
        method: 'POST',
        body: uploadData
      });

      if (response.ok) {
        toast.success('Certificate uploaded successfully');
        onUploadSuccess();
        onClose();
      } else {
        toast.error('Failed to upload certificate');
      }
    } catch (error) {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-100">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold dark:text-white">Upload Certificate</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 dark:text-white">
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Certificate title"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 dark:text-white">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Certificate description"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 dark:text-white">
              Assign to Employee
            </label>
            <select
              value={formData.assignedTo}
              onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="">Select employee</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} - {user.employeeId || 'N/A'}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 dark:text-white">
              Certificate Image *
            </label>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                isDragActive
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-300 hover:border-gray-400 dark:border-gray-600'
              }`}
            >
              <input {...getInputProps()} />
              {preview ? (
                <div className="space-y-2">
                  <img src={preview} alt="Preview" className="w-full h-32 object-cover rounded" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">{file?.name}</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <FileImage className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="text-gray-600 dark:text-gray-400">
                    {isDragActive ? 'Drop image here' : 'Drag & drop or click to select'}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700 dark:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {uploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload size={16} />
                  Upload
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}