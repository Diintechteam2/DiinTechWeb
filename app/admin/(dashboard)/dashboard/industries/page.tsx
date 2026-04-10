"use client";

import React, { useEffect, useState } from 'react';
import api from '@/admin_lib/api';
import { 
  Building2, 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  ChevronRight,
  GripVertical,
  X
} from 'lucide-react';

export default function IndustriesPage() {
  const [industries, setIndustries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentIndustry, setCurrentIndustry] = useState<any>(null);
  const [formData, setFormData] = useState<any>({
    title: '',
    description: '',
    icon: 'Building2',
    order: 0
  });

  const fetchIndustries = async () => {
    try {
      const response = await api.get('industries');
      setIndustries(response.data.data || []);
    } catch (err) {
      console.error('Failed to fetch industries', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIndustries();
  }, []);

  const handleEdit = (industry: any) => {
    setCurrentIndustry(industry);
    setFormData(industry);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this industry?')) {
      try {
        await api.delete(`industries/${id}`);
        fetchIndustries();
      } catch (err) {
        alert('Failed to delete industry');
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (currentIndustry) {
        await api.put(`industries/${currentIndustry._id}`, formData);
      } else {
        await api.post('industries', formData);
      }
      setIsModalOpen(false);
      fetchIndustries();
      resetForm();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to save industry');
    }
  };

  const resetForm = () => {
    setCurrentIndustry(null);
    setFormData({
      title: '',
      description: '',
      icon: 'Building2',
      order: industries.length
    });
  };

  if (loading) return <div className="text-white p-8 font-bold">Loading Industries...</div>;

  return (
    <div className="space-y-8 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Industries</h1>
          <p className="text-gray-400">Manage the sector-specific AI solutions.</p>
        </div>
        <button 
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)]"
        >
          <Plus className="w-5 h-5" /> Add Industry
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {industries.map((industry: any) => (
          <div key={industry._id} className="group relative bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/[0.08] transition-all">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
                 <Building2 className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                 <button onClick={() => handleEdit(industry)} className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white"><Edit3 className="w-4 h-4" /></button>
                 <button onClick={() => handleDelete(industry._id)} className="p-2 hover:bg-red-500/10 rounded-lg text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>

            <h3 className="text-xl font-bold text-white mb-3">{industry.title}</h3>
            <p className="text-sm text-gray-400 mb-6 leading-relaxed">
              {industry.description}
            </p>

            <div className="mt-8 flex items-center justify-between text-[10px] font-bold">
               <span className="text-gray-600">Order: {industry.order}</span>
               <span className="text-gray-500 uppercase">Icon: {industry.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0f1115] border border-white/10 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
             <div className="p-8 border-b border-white/10 flex justify-between items-center sticky top-0 bg-[#0f1115] z-10">
                <h2 className="text-2xl font-bold text-white">{currentIndustry ? 'Edit Industry' : 'Add Industry'}</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/5 rounded-xl text-gray-400 hover:text-white"><X className="w-6 h-6" /></button>
             </div>

             <form onSubmit={handleSave} className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-400">Industry Title</label>
                      <input 
                        required 
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50"
                        placeholder="e.g. Healthcare"
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-400">Lucide Icon Name</label>
                      <input 
                        required 
                        value={formData.icon}
                        onChange={(e) => setFormData({...formData, icon: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50"
                        placeholder="Building2, Stethoscope, etc."
                      />
                   </div>
                </div>

                <div className="space-y-2">
                   <label className="text-sm font-semibold text-gray-400">Description</label>
                   <textarea 
                     required
                     rows={3}
                     value={formData.description}
                     onChange={(e) => setFormData({...formData, description: e.target.value})}
                     className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50 resize-none"
                   />
                </div>

                <div className="grid grid-cols-1 gap-6 pt-6 border-t border-white/5">
                   <div className="space-y-2">
                       <label className="text-sm font-semibold text-gray-400">Display Order</label>
                       <input 
                         type="number"
                         value={formData.order}
                         onChange={(e) => setFormData({...formData, order: parseInt(e.target.value)})}
                         className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none"
                       />
                   </div>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t border-white/5">
                   <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 text-gray-400 hover:text-white font-semibold">Cancel</button>
                   <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold shadow-[0_0_15px_rgba(37,99,235,0.3)]">
                      {currentIndustry ? 'Update Industry' : 'Save Industry'}
                   </button>
                </div>
             </form>
          </div>
        </div>
      )}
    </div>
  );
}
