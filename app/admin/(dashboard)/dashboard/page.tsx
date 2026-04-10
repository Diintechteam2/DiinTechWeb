"use client";

import React, { useEffect, useState } from 'react';
import api from '@/admin_lib/api';
import { 
  Users, 
  Briefcase, 
  CheckCircle, 
  TrendingUp,
  Activity,
  ArrowUpRight
} from 'lucide-react';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    projects: 0,
    solutions: 0,
    admins: 1,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [projectsRes, solutionsRes] = await Promise.all([
          api.get('/projects'),
          api.get('/solutions')
        ]);
        setStats({
          projects: projectsRes.data.count || 0,
          solutions: solutionsRes.data.count || 0,
          admins: 1,
        });
      } catch (err) {
        console.error('Failed to fetch stats', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statsConfig = [
    { label: 'Total Projects', value: stats.projects, icon: Briefcase, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'AI Solutions', value: stats.solutions, icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'Active Admins', value: stats.admins, icon: Users, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { label: 'System Status', value: 'Healthy', icon: Activity, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Welcome Back, Admin</h1>
        <p className="text-gray-400">Everything looks good today. Here is what is happening across Diin Technologies.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsConfig.map((stat, i) => (
          <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/[0.07] transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className={cn("p-3 rounded-xl", stat.bg)}>
                <stat.icon className={cn("w-6 h-6", stat.color)} />
              </div>
              <TrendingUp className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="space-y-1">
              <h3 className="text-gray-400 text-sm font-medium">{stat.label}</h3>
              <p className="text-2xl font-bold text-white">{loading ? '...' : stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Verification Card */}
      <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-white/10 rounded-3xl p-8 relative overflow-hidden group">
        <div className="relative z-10">
          <h2 className="text-2xl font-bold text-white mb-4">Data Verification Ready</h2>
          <p className="text-blue-100/80 max-w-xl mb-6">
            All your static content from the frontend has been successfully mirrored. You can now visit the sections to ensure the data is exactly what you expect.
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="bg-white text-blue-600 px-6 py-2.5 rounded-xl font-semibold hover:bg-blue-50 transition-colors flex items-center gap-2">
              Verify Projects <ArrowUpRight className="w-4 h-4" />
            </button>
            <button className="bg-white/10 text-white border border-white/20 px-6 py-2.5 rounded-xl font-semibold hover:bg-white/20 transition-colors">
              Check Hero Settings
            </button>
          </div>
        </div>
        <div className="absolute right-0 top-0 w-64 h-64 bg-blue-500/20 blur-[100px] -mr-16 -mt-16 group-hover:bg-blue-500/30 transition-all duration-500"></div>
      </div>
    </div>
  );
}

// Inline CN since it was missing in this specific context earlier
function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
