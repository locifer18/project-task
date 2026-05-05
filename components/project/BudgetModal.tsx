'use client';

import { useState, useMemo } from 'react';
import { X, Upload, FileText, Receipt, Wallet, Minus } from 'lucide-react';

interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientId: string;
  projectId: string;
  currentData: {
    scopeTitle: string;
    paidAmount: number;
    totalBudget: number;
    docs?: any[];
  };
  onUpdate: () => void;
}

const BudgetModal = ({ isOpen, onClose, clientId, projectId, currentData, onUpdate }: BudgetModalProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    paidAmount: currentData.paidAmount || 0,
    totalBudget: currentData.totalBudget || 0,
  });
  
  const [files, setFiles] = useState({
    latestInvoice: null as File | null,
    paymentHistory: [] as File[],
    scopeTitle: null as File | null,
  });

  const [existingDocs, setExistingDocs] = useState(currentData.docs || []);
  const [docsToDelete, setDocsToDelete] = useState<string[]>([]);

  const categorizedDocs = useMemo(() => {
    const invoice = existingDocs.find(doc => doc.title?.toLowerCase().includes('invoice'));
    const scope = existingDocs.find(doc => doc.title?.toLowerCase().includes('scope'));
    const payments = existingDocs.filter(doc => doc.title?.toLowerCase().includes('payment history'));
    return { invoice, scope, payments };
  }, [existingDocs]);

  const hasInvoice = categorizedDocs.invoice && !docsToDelete.includes(categorizedDocs.invoice.id);
  const hasScope = categorizedDocs.scope && !docsToDelete.includes(categorizedDocs.scope.id);

  const removeExistingDoc = (docId: string) => {
    setDocsToDelete(prev => [...prev, docId]);
  };

  const handleFileChange = (type: string, file: File | File[]) => {
    if (type === 'paymentHistory' && Array.isArray(file)) {
      setFiles(prev => ({ ...prev, paymentHistory: [...prev.paymentHistory, ...file] }));
    } else if (type !== 'paymentHistory' && !Array.isArray(file)) {
      setFiles(prev => ({ ...prev, [type]: file }));
    }
  };

  const removePaymentFile = (index: number) => {
    setFiles(prev => ({
      ...prev,
      paymentHistory: prev.paymentHistory.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Delete documents first
      if (docsToDelete.length > 0) {
        await fetch('/api/client/analytics/budget/docs', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ docIds: docsToDelete }),
        });
      }

      const formDataToSend = new FormData();
      formDataToSend.append('clientId', clientId);
      formDataToSend.append('projectId', projectId);
      formDataToSend.append('paidAmount', formData.paidAmount.toString());
      formDataToSend.append('totalBudget', formData.totalBudget.toString());

      if (files.latestInvoice) {
        formDataToSend.append('latestInvoice', files.latestInvoice);
      }
      if (files.scopeTitle) {
        formDataToSend.append('scopeTitle', files.scopeTitle);
      }
      files.paymentHistory.forEach((file, index) => {
        formDataToSend.append(`paymentHistory_${index}`, file);
      });

      const response = await fetch('/api/client/analytics/budget', {
        method: 'PUT',
        body: formDataToSend,
      });

      if (response.ok) {
        onUpdate();
        onClose();
      }
    } catch (error) {
      console.error('Error updating budget:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-100">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Edit Budget & Documents</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Budget Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 dark:text-white">Paid Amount</label>
              <input
                type="number"
                value={formData.paidAmount}
                onChange={(e) => setFormData(prev => ({ ...prev, paidAmount: Number(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 dark:text-white">Total Budget</label>
              <input
                type="number"
                value={formData.totalBudget}
                onChange={(e) => setFormData(prev => ({ ...prev, totalBudget: Number(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2 dark:text-white">Remaining Amount</label>
              <input
                type="number"
                value={Math.max(0, formData.totalBudget - formData.paidAmount)}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 dark:bg-gray-600 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>

          {/* Existing Documents */}
          {existingDocs.filter(doc => !docsToDelete.includes(doc.id)).length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-3 dark:text-white">Existing Documents</h3>
              <div className="space-y-2">
                {existingDocs.filter(doc => !docsToDelete.includes(doc.id)).map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <FileText size={16} className="text-blue-500" />
                      <span className="text-sm font-medium">{doc.title}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <a 
                        href={doc.fileUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-700 text-sm"
                      >
                        View
                      </a>
                      <button
                        type="button"
                        onClick={() => removeExistingDoc(doc.id)}
                        className="text-red-500 hover:text-red-700 p-1"
                        title="Remove document"
                      >
                        <Minus size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* File Uploads */}
          <div className="space-y-4">
            {/* Latest Invoice */}
            <div>
              <label className="block text-sm font-medium mb-2 dark:text-white flex items-center gap-2">
                <Receipt size={16} />
                Latest Invoice (PDF only)
              </label>
              <input
                type="file"
                accept=".pdf"
                disabled={hasInvoice}
                onChange={(e) => e.target.files?.[0] && handleFileChange('latestInvoice', e.target.files[0])}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
              />
              {hasInvoice && (
                <p className="text-sm text-amber-600 mt-1">Remove existing invoice to upload new one</p>
              )}
              {files.latestInvoice && (
                <p className="text-sm text-green-600 mt-1">Selected: {files.latestInvoice.name}</p>
              )}
            </div>

            {/* Scope Title */}
            <div>
              <label className="block text-sm font-medium mb-2 dark:text-white flex items-center gap-2">
                <FileText size={16} />
                Scope Title Document (PDF only)
              </label>
              <input
                type="file"
                accept=".pdf"
                disabled={hasScope}
                onChange={(e) => e.target.files?.[0] && handleFileChange('scopeTitle', e.target.files[0])}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
              />
              {hasScope && (
                <p className="text-sm text-amber-600 mt-1">Remove existing scope document to upload new one</p>
              )}
              {files.scopeTitle && (
                <p className="text-sm text-green-600 mt-1">Selected: {files.scopeTitle.name}</p>
              )}
            </div>

            {/* Payment History */}
            <div>
              <label className="block text-sm font-medium mb-2 dark:text-white flex items-center gap-2">
                <Wallet size={16} />
                Payment History (Multiple PDFs allowed)
              </label>
              <input
                type="file"
                accept=".pdf"
                multiple
                onChange={(e) => e.target.files && handleFileChange('paymentHistory', Array.from(e.target.files))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              {files.paymentHistory.length > 0 && (
                <div className="mt-2 space-y-1">
                  {files.paymentHistory.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 p-2 rounded">
                      <span className="text-sm">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => removePaymentFile(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Submit Buttons */}
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
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Upload size={16} />
                  Update Budget
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BudgetModal;