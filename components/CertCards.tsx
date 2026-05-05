'use client';

import { useState, useEffect } from 'react';
import { Download, Trash2, Plus, LucideLoader } from 'lucide-react';
import toast from 'react-hot-toast';

interface Certificate {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  assignedTo?: string;
  createdAt: string;
}

interface CertCardsProps {
  onUpload?: () => void;
  refreshTrigger?: number;
  isAdmin?: boolean;
}

export default function CertCards({ onUpload, refreshTrigger, isAdmin = false }: CertCardsProps) {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<any[]>([]);

  const fetchCertificates = async () => {
    try {
      const [certsResponse, usersResponse] = await Promise.all([
        fetch(`/api/certificates${isAdmin ? '?admin=true' : ''}`),
        fetch('/api/user?all=true')
      ]);

      if (certsResponse.ok && usersResponse.ok) {
        const certsData = await certsResponse.json();
        const usersData = await usersResponse.json();

        if (usersData.success) {
          setUsers(usersData.users);
        }
        setCertificates(certsData);
      }
    } catch (error) {
      toast.error('Failed to fetch certificates');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this certificate?')) return;

    try {
      const response = await fetch(`/api/certificates?id=${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        toast.success('Certificate deleted successfully');
        fetchCertificates();
      } else {
        toast.error('Failed to delete certificate');
      }
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  const handleDownload = (imageUrl: string, title: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `${title}.jpg`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    fetchCertificates();
  }, [refreshTrigger, isAdmin]);
  
if (loading) {
  return (
      <div className="w-full h-[50vh] flex justify-center items-center">
        <LucideLoader className='animate-spin text-blue-300' size={40} />
      </div>
    );
}

return (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold dark:text-white">Certificates</h1>
      {isAdmin && onUpload && (
        <button
          onClick={onUpload}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          Upload Certificate
        </button>
      )}
    </div>

    {certificates.length === 0 ? (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <p className="text-gray-500 dark:text-gray-400">
          {isAdmin ? 'No certificates uploaded yet' : 'No certificates assigned to you'}
        </p>
        {isAdmin && onUpload && (
          <button
            onClick={onUpload}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Upload First Certificate
          </button>
        )}
      </div>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certificates.map((cert) => (
          <div key={cert.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="relative h-48">
              <img
                src={cert.imageUrl}
                alt={cert.title}
                className="w-full h-full object-cover"
              />
              {isAdmin && (
                <button
                  onClick={() => handleDelete(cert.id)}
                  className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>

            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2 dark:text-white">{cert.title}</h3>
              {cert.description && (
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                  {cert.description}
                </p>
              )}
              {cert.assignedTo && (
                <p className="text-blue-600 dark:text-blue-400 text-sm mb-3">
                  Assigned to: {users.find(u => u.id === cert.assignedTo)?.name || 'Unknown'}
                </p>
              )}


              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(cert.createdAt).toLocaleDateString()}
                </span>
                <button
                  onClick={() => handleDownload(cert.imageUrl, cert.title)}
                  className="flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                >
                  <Download size={14} />
                  Download
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);
}