"use client";

import React, { useEffect, useState } from 'react';
import api from '@/admin_lib/api';
import { 
  TrendingUp, 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  ChevronRight,
  GripVertical,
  X,
  Palette
} from 'lucide-react';

export default function SolutionsPage() {
  const [solutions, setSolutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSolution, setCurrentSolution] = useState<any>(null);
  const [formData, setFormData] = useState<any>({
    title: '',
    description: '',
    icon: 'TrendingUp',
    features: [],
    color: 'from-cyan-500/20 to-blue-500/20',
    borderColor: 'border-cyan-500/30',
    order: 0
  });

  const fetchSolutions = async () => {
    try {
      const response = await api.get('solutions');
      setSolutions(response.data.data || []);
    } catch (err) {
      console.error('Failed to fetch solutions', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSolutions();
  }, []);

  const handleEdit = (solution: any) => {
    setCurrentSolution(solution);
    setFormData(solution);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this solution?')) {
      try {
        await api.delete(`solutions/${id}`);
        fetchSolutions();
      } catch (err) {
        alert('Failed to delete solution');
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (currentSolution) {
        await api.put(`solutions/${currentSolution._id}`, formData);
      } else {
        await api.post('solutions', formData);
      }
      setIsModalOpen(false);
      fetchSolutions();
      resetForm();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to save solution');
    }
  };

  const resetForm = () => {
    setCurrentSolution(null);
    setFormData({
      title: '',
      description: '',
      icon: 'TrendingUp',
      features: [],
      color: 'from-cyan-500/20 to-blue-500/20',
      borderColor: 'border-cyan-500/30',
      order: solutions.length
    });
  };

  if (loading) return <div className="text-white p-8 font-bold">Loading AI Solutions...</div>;

  return (
    <div className="space-y-8 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">AI Solutions</h1>
          <p className="text-gray-400">Manage the core AI service offerings shown on the main page.</p>
        </div>
        <button 
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)]"
        >
          <Plus className="w-5 h-5" /> Add Solution
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {solutions.map((solution: any) => (
          <div key={solution._id} className="group relative bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/[0.08] transition-all">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
                 <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                 <button onClick={() => handleEdit(solution)} className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white"><Edit3 className="w-4 h-4" /></button>
                 <button onClick={() => handleDelete(solution._id)} className="p-2 hover:bg-red-500/10 rounded-lg text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>

            <h3 className="text-xl font-bold text-white mb-3">{solution.title}</h3>
            <p className="text-sm text-gray-400 mb-6 leading-relaxed">
              {solution.description}
            </p>

            <div className="space-y-2 border-t border-white/5 pt-6">
               <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">Core Features</p>
               {solution.features.map((feature: string, i: number) => (
                 <div key={i} className="flex items-center gap-2 text-xs text-gray-300">
                    <ChevronRight className="w-3 h-3 text-blue-500" />
                    <span>{feature}</span>
                 </div>
               ))}
            </div>

            <div className="mt-8 flex items-center justify-between text-[10px] font-bold">
               <div className="flex gap-1">
                  <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${solution.color}`} />
                  <span className="text-gray-500 uppercase">Style: {solution.borderColor.split('-')[1]}</span>
               </div>
               <span className="text-gray-600">Order: {solution.order}</span>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0f1115] border border-white/10 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
             <div className="p-8 border-b border-white/10 flex justify-between items-center sticky top-0 bg-[#0f1115] z-10">
                <h2 className="text-2xl font-bold text-white">{currentSolution ? 'Edit Solution' : 'Add Solution'}</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/5 rounded-xl text-gray-400 hover:text-white"><X className="w-6 h-6" /></button>
             </div>

             <form onSubmit={handleSave} className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-400">Solution Title</label>
                      <input 
                        required 
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50"
                        placeholder="e.g. AI Sales Cloud"
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-400">Lucide Icon Name</label>
                      <input 
                        required 
                        value={formData.icon}
                        onChange={(e) => setFormData({...formData, icon: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50"
                        placeholder="TrendingUp, Headphones, etc."
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

                <div className="space-y-4">
                   <label className="text-sm font-semibold text-gray-400">Features (Comma separated)</label>
                   <textarea 
                     rows={2}
                     value={formData.features.join(', ')}
                     onChange={(e) => setFormData({...formData, features: e.target.value.split(',').map(s => s.trim()).filter(s => s !== '')})}
                     className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50 resize-none font-mono text-xs"
                     placeholder="Feature 1, Feature 2, Feature 3..."
                   />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-white/5">
                   <div className="space-y-4">
                      <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase mb-2">
                         <Palette className="w-3.5 h-3.5" />
                         Visual Styling (Tailwind)
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-bold text-gray-600">Gradient Colors</label>
                         <input 
                           value={formData.color}
                           onChange={(e) => setFormData({...formData, color: e.target.value})}
                           className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-blue-400 font-mono"
                         />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-bold text-gray-600">Border Utility</label>
                         <input 
                           value={formData.borderColor}
                           onChange={(e) => setFormData({...formData, borderColor: e.target.value})}
                           className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-blue-400 font-mono"
                         />
                      </div>
                   </div>

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
                      {currentSolution ? 'Update Solution' : 'Save Solution'}
                   </button>
                </div>
             </form>
          </div>
        </div>
      )}
    </div>
  );
}
