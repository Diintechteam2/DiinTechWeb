"use client";

import React, { useEffect, useState } from 'react';
import api from '@/admin_lib/api';
import { 
  Sparkles, 
  Save, 
  RefreshCcw,
  Layout,
  Type,
  AlignLeft,
  BarChart3,
  MousePointer2
} from 'lucide-react';

export default function HeroPage() {
  const [hero, setHero] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchHero();
  }, []);

  const fetchHero = async () => {
    try {
      const response = await api.get('hero');
      setHero(response.data.data);
    } catch (err) {
      console.error('Failed to fetch hero data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put(`hero/${hero._id}`, hero);
      alert('Hero section updated successfully!');
    } catch (err) {
      alert('Failed to update hero section');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-white p-8 font-bold animate-pulse">Loading Hero Settings...</div>;

  if (!hero) return (
    <div className="text-white p-8 text-center bg-white/5 rounded-3xl border border-dashed border-white/20">
      <p className="text-gray-400 mb-4">Hero section data not found in database.</p>
      <button onClick={fetchHero} className="text-blue-500 hover:underline">Try Again</button>
    </div>
  );

  return (
    <div className="space-y-8 text-left">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Hero Section</h1>
        <p className="text-gray-400">Manage the main landing page content and statistics.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSave} className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-6">
            <div className="space-y-4">
               <div className="flex items-center gap-2 text-blue-500 mb-4">
                  <Type className="w-5 h-5" />
                  <h3 className="font-bold">Content & Typography</h3>
               </div>
               
               <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-400">Badge Text</label>
                <input 
                  value={hero.badgeText}
                  onChange={(e) => setHero({...hero, badgeText: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50"
                  placeholder="e.g. Next-Generation AI"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-400">Main Heading</label>
                <textarea 
                  rows={2}
                  value={hero.mainHeading}
                  onChange={(e) => setHero({...hero, mainHeading: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50 resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-400">Subheading / Description</label>
                <textarea 
                  rows={4}
                  value={hero.subHeading}
                  onChange={(e) => setHero({...hero, subHeading: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50 resize-none"
                />
              </div>
            </div>

            <div className="space-y-4 pt-6 border-t border-white/10">
               <div className="flex items-center gap-2 text-emerald-500 mb-4">
                  <BarChart3 className="w-5 h-5" />
                  <h3 className="font-bold">Statistics</h3>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {hero.stats.map((stat: any, index: number) => (
                    <div key={index} className="flex gap-2">
                      <input 
                        value={stat.value}
                        onChange={(e) => {
                          const newStats = [...hero.stats];
                          newStats[index].value = e.target.value;
                          setHero({...hero, stats: newStats});
                        }}
                        className="w-24 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white font-bold"
                      />
                      <input 
                        value={stat.label}
                        onChange={(e) => {
                          const newStats = [...hero.stats];
                          newStats[index].label = e.target.value;
                          setHero({...hero, stats: newStats});
                        }}
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm"
                      />
                    </div>
                  ))}
               </div>
            </div>

            <div className="flex justify-end pt-6">
               <button 
                type="submit"
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] disabled:opacity-50"
               >
                 {saving ? <RefreshCcw className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                 {saving ? 'Saving...' : 'Save Changes'}
               </button>
            </div>
          </form>
        </div>

        <div className="space-y-6">
           <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/20 rounded-3xl p-8">
              <div className="flex items-center gap-3 text-blue-400 mb-6 font-bold uppercase tracking-widest text-xs">
                <Layout className="w-4 h-4" />
                Live Preview (Mirror)
              </div>
              <div className="space-y-4">
                <div className="inline-block px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] text-blue-400 font-bold">
                  {hero.badgeText}
                </div>
                <h2 className="text-2xl font-bold text-white leading-tight">
                  {hero.mainHeading}
                </h2>
                <p className="text-sm text-gray-400">
                  {hero.subHeading}
                </p>
                <div className="grid grid-cols-2 gap-4 mt-6">
                  {hero.stats.slice(0, 2).map((s: any, i: number) => (
                    <div key={i} className="text-center p-3 bg-white/5 rounded-2xl">
                      <div className="text-lg font-bold text-white">{s.value}</div>
                      <div className="text-[10px] text-gray-500">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
           </div>

           <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2 text-sm">
                <MousePointer2 className="w-4 h-4 text-gray-400" />
                Call to Action Buttons
              </h3>
              <div className="space-y-3">
                {hero.ctaButtons.map((btn: any, i: number) => (
                  <div key={i} className="flex flex-col gap-2 p-3 bg-white/5 border border-white/10 rounded-xl">
                    <input 
                      value={btn.text}
                      onChange={(e) => {
                        const newBtns = [...hero.ctaButtons];
                        newBtns[i].text = e.target.value;
                        setHero({...hero, ctaButtons: newBtns});
                      }}
                      className="bg-transparent border-none text-white font-semibold text-sm focus:ring-0 p-0"
                    />
                    <div className="text-[10px] text-gray-600">Link: {btn.link}</div>
                  </div>
                ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
