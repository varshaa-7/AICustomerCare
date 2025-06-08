import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Upload, Plus, Search, Edit, Trash2, FileText, Save, X } from 'lucide-react';
import { authStore } from '../stores/AuthStore';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

interface FAQ {
  _id: string;
  question: string;
  answer: string;
  category: string;
  keywords: string[];
  priority: number;
  isActive: boolean;
  createdAt: string;
}

const AdminPanel = observer(() => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  
  const [newFaq, setNewFaq] = useState({
    question: '',
    answer: '',
    category: 'General',
    priority: 1
  });

  const [editForm, setEditForm] = useState({
    question: '',
    answer: '',
    category: '',
    priority: 1,
    isActive: true
  });

  const apiUrl = 'https://ai-backend-0ki0.onrender.com/api';

  useEffect(() => {
    loadFAQs();
  }, [searchTerm, selectedCategory]);

  const loadFAQs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (selectedCategory) params.append('category', selectedCategory);
      
      const response = await axios.get(`${apiUrl}/admin/faqs?${params}`);
      setFaqs(response.data.faqs);
    } catch (error) {
      console.error('Error loading FAQs:', error);
      toast.error('Error loading FAQs. Please try again.', {
        duration: 4000,
        position: 'top-right',
        style: {
          background: '#fee2e2',
          color: '#b91c1c',
          borderRadius: '8px',
          padding: '12px 20px',
        },
        iconTheme: {
          primary: '#b91c1c',
          secondary: '#fff',
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${apiUrl}/admin/faqs`, newFaq);
      setNewFaq({ question: '', answer: '', category: 'General', priority: 1 });
      setShowAddForm(false);
      loadFAQs();
      toast.success('FAQ added successfully!', {
        duration: 4000,
        position: 'top-right',
        style: {
          background: '#dcfce7',
          color: '#15803d',
          borderRadius: '8px',
          padding: '12px 20px',
        },
        iconTheme: {
          primary: '#15803d',
          secondary: '#fff',
        },
      });
    } catch (error) {
      console.error('Error adding FAQ:', error);
      toast.error('Error adding FAQ. Please try again.', {
        duration: 4000,
        position: 'top-right',
        style: {
          background: '#fee2e2',
          color: '#b91c1c',
          borderRadius: '8px',
          padding: '12px 20px',
        },
        iconTheme: {
          primary: '#b91c1c',
          secondary: '#fff',
        },
      });
    }
  };

  const handleEditFaq = (faq: FAQ) => {
    setEditingFaq(faq);
    setEditForm({
      question: faq.question,
      answer: faq.answer,
      category: faq.category,
      priority: faq.priority,
      isActive: faq.isActive
    });
  };

  const handleUpdateFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFaq) return;

    try {
      await axios.put(`${apiUrl}/admin/faqs/${editingFaq._id}`, editForm);
      setEditingFaq(null);
      setEditForm({ question: '', answer: '', category: '', priority: 1, isActive: true });
      loadFAQs();
      toast.success('FAQ updated successfully!', {
        duration: 4000,
        position: 'top-right',
        style: {
          background: '#dcfce7',
          color: '#15803d',
          borderRadius: '8px',
          padding: '12px 20px',
        },
        iconTheme: {
          primary: '#15803d',
          secondary: '#fff',
        },
      });
    } catch (error) {
      console.error('Error updating FAQ:', error);
      toast.error('Error updating FAQ. Please try again.', {
        duration: 4000,
        position: 'top-right',
        style: {
          background: '#fee2e2',
          color: '#b91c1c',
          borderRadius: '8px',
          padding: '12px 20px',
        },
        iconTheme: {
          primary: '#b91c1c',
          secondary: '#fff',
        },
      });
    }
  };

  const handleDeleteFaq = async (faqId: string) => {
    if (!confirm('Are you sure you want to delete this FAQ? This action cannot be undone.')) {
      return;
    }

    setDeleteLoading(faqId);
    try {
      await axios.delete(`${apiUrl}/admin/faqs/${faqId}`);
      loadFAQs();
      toast.success('FAQ deleted successfully!', {
        duration: 4000,
        position: 'top-right',
        style: {
          background: '#dcfce7',
          color: '#15803d',
          borderRadius: '8px',
          padding: '12px 20px',
        },
        iconTheme: {
          primary: '#15803d',
          secondary: '#fff',
        },
      });
    } catch (error) {
      console.error('Error deleting FAQ:', error);
      toast.error('Error deleting FAQ. Please try again.', {
        duration: 4000,
        position: 'top-right',
        style: {
          background: '#fee2e2',
          color: '#b91c1c',
          borderRadius: '8px',
          padding: '12px 20px',
        },
        iconTheme: {
          primary: '#b91c1c',
          secondary: '#fff',
        },
      });
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) return;

    setUploadLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', uploadFile);
      formData.append('category', 'Uploaded');

      const response = await axios.post(`${apiUrl}/admin/upload-faqs`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success(`Successfully uploaded ${response.data.faqs} FAQs`, {
        duration: 4000,
        position: 'top-right',
        style: {
          background: '#dcfce7',
          color: '#15803d',
          borderRadius: '8px',
          padding: '12px 20px',
        },
        iconTheme: {
          primary: '#15803d',
          secondary: '#fff',
        },
      });
      setUploadFile(null);
      loadFAQs();
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Error uploading file. Please try again.', {
        duration: 4000,
        position: 'top-right',
        style: {
          background: '#fee2e2',
          color: '#b91c1c',
          borderRadius: '8px',
          padding: '12px 20px',
        },
        iconTheme: {
          primary: '#b91c1c',
          secondary: '#fff',
        },
      });
    } finally {
      setUploadLoading(false);
    }
  };

  const categories = [...new Set(faqs.map(faq => faq.category))];

  if (authStore.user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <X className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
            <p className="text-gray-600 mb-6">You need admin privileges to access this panel.</p>
            <button
              onClick={() => window.location.href = '/'}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Back to Chat
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Add Toaster component */}
      <Toaster />
      
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-800">Admin Panel</h1>
              <p className="text-sm text-gray-500">Manage FAQs and Knowledge Base</p>
            </div>
          </div>
          <div className="flex items-center space-x-8">
          <span className="text-sm text-gray-600 whitespace-nowrap">
            Welcome, {authStore.user?.name}
          </span>

          <div className="flex items-center space-x-2 bg-white rounded-full p-1 shadow border border-gray-200">
            <button
              onClick={() => window.location.href = '/'}
              className="px-4 py-1.5 text-sm font-medium rounded-full text-white bg-blue-500 hover:bg-blue-600 transition-colors focus:outline-none"
            >
              Back to Chat
            </button>
            <button
              onClick={() => authStore.logout()}
              className="px-4 py-1.5 text-sm font-medium rounded-full text-gray-700 hover:text-gray-900 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Controls */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search FAQs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
                />
              </div>
              
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowAddForm(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add FAQ</span>
              </button>
            </div>
          </div>

          {/* File Upload */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Upload FAQ Document</h3>
            <form onSubmit={handleFileUpload} className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select PDF or Text File
                </label>
                <input
                  type="file"
                  accept=".pdf,.txt"
                  onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                disabled={!uploadFile || uploadLoading}
                className="flex items-center space-x-2 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Upload className="w-4 h-4" />
                <span>{uploadLoading ? 'Uploading...' : 'Upload'}</span>
              </button>
            </form>
            <p className="text-sm text-gray-500 mt-2">
              Format: Q: Question here? A: Answer here. Each Q&A pair on separate lines.
            </p>
          </div>
        </div>

        {/* Add FAQ Form */}
        {showAddForm && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-800">Add New FAQ</h3>
              <button
                onClick={() => setShowAddForm(false)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleAddFaq} className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <input
                    type="text"
                    value={newFaq.category}
                    onChange={(e) => setNewFaq({ ...newFaq, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., General, Technical, Billing"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority (1-10)</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={newFaq.priority}
                    onChange={(e) => setNewFaq({ ...newFaq, priority: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Question</label>
                <input
                  type="text"
                  value={newFaq.question}
                  onChange={(e) => setNewFaq({ ...newFaq, question: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter the question..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Answer</label>
                <textarea
                  value={newFaq.answer}
                  onChange={(e) => setNewFaq({ ...newFaq, answer: e.target.value })}
                  required
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter the answer..."
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center space-x-2 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>Save FAQ</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Edit FAQ Form */}
        {editingFaq && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-800">Edit FAQ</h3>
              <button
                onClick={() => setEditingFaq(null)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleUpdateFaq} className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <input
                    type="text"
                    value={editForm.category}
                    onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., General, Technical, Billing"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority (1-10)</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={editForm.priority}
                    onChange={(e) => setEditForm({ ...editForm, priority: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={editForm.isActive ? 'active' : 'inactive'}
                    onChange={(e) => setEditForm({ ...editForm, isActive: e.target.value === 'active' })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Question</label>
                <input
                  type="text"
                  value={editForm.question}
                  onChange={(e) => setEditForm({ ...editForm, question: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter the question..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Answer</label>
                <textarea
                  value={editForm.answer}
                  onChange={(e) => setEditForm({ ...editForm, answer: e.target.value })}
                  required
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter the answer..."
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setEditingFaq(null)}
                  className="px-4 py-2 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center space-x-2 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>Update FAQ</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* FAQs List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-800">
              FAQs ({faqs.length})
            </h3>
          </div>
          
          <div className="divide-y divide-gray-200">
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                <p className="text-gray-500 mt-2">Loading FAQs...</p>
              </div>
            ) : faqs.length === 0 ? (
              <div className="p-8 text-center">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No FAQs found. Add some to get started!</p>
              </div>
            ) : (
              faqs.map((faq) => (
                <div key={faq._id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {faq.category}
                        </span>
                        <span className="text-xs text-gray-500">
                          Priority: {faq.priority}
                        </span>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          faq.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {faq.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      
                      <h4 className="text-lg font-medium text-gray-800 mb-2">
                        {faq.question}
                      </h4>
                      
                      <p className="text-gray-600 mb-3">
                        {faq.answer}
                      </p>
                      
                      {faq.keywords.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {faq.keywords.slice(0, 5).map((keyword, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-600"
                            >
                              {keyword}
                            </span>
                          ))}
                          {faq.keywords.length > 5 && (
                            <span className="text-xs text-gray-500">
                              +{faq.keywords.length - 5} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => handleEditFaq(faq)}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        title="Edit FAQ"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteFaq(faq._id)}
                        disabled={deleteLoading === faq._id}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
                        title="Delete FAQ"
                      >
                        {deleteLoading === faq._id ? (
                          <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

export default AdminPanel;