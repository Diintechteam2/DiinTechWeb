"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Layers, 
  Briefcase, 
  Settings, 
  LogOut, 
  Building2,
  Menu,
  X,
  FileText,
  Image
} from 'lucide-react';
import { cn } from '@/admin_lib/utils';

const sidebarItems = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/admin/dashboard' },
  { name: 'Hero Section', icon: Layers, href: '/admin/dashboard/hero' },
  { name: 'Projects', icon: Briefcase, href: '/admin/dashboard/projects' },
  { name: 'Project Assets', icon: Image, href: '/admin/dashboard/project-assets' },
  { name: 'Solutions', icon: Layers, href: '/admin/dashboard/solutions' },
  { name: 'Industries', icon: Building2, href: '/admin/dashboard/industries' },
  { name: 'Site Content', icon: FileText, href: '/admin/dashboard/site-content' },
  { name: 'General Settings', icon: Settings, href: '/admin/dashboard/settings' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/admin/login');
  };

  return (
    <>
      {/* Mobile Toggle */}
      <button 
        className="lg:hidden fixed top-4 right-4 z-50 p-2 bg-blue-600 rounded-lg text-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      <aside className={cn(
        "fixed left-0 top-0 h-screen transition-all duration-300 z-40 border-r border-white/10 bg-black/40 backdrop-blur-2xl flex flex-col pt-8",
        isOpen ? "w-64" : "w-0 lg:w-20 -translate-x-full lg:translate-x-0 overflow-hidden"
      )}>
        {/* Brand */}
        <div className="flex items-center gap-3 px-6 mb-12">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center glow-blue">
            <span className="text-white font-extrabold text-xl">D</span>
          </div>
          {isOpen && (
            <div className="flex flex-col">
              <span className="text-white font-bold tracking-tight">DiinTech</span>
              <span className="text-[10px] text-blue-500 font-bold uppercase tracking-widest">Admin Panel</span>
            </div>
          )}
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-4 space-y-2">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all group relative",
                  isActive ? "bg-blue-600/10 text-blue-500 font-medium" : "text-gray-400 hover:text-white hover:bg-white/5"
                )}
              >
                <item.icon className={cn("w-5 h-5", isActive ? "text-blue-500" : "group-hover:text-white")} />
                {isOpen && <span className="text-sm truncate">{item.name}</span>}
                {isActive && <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-600 rounded-l-full shadow-[0_0_10px_#2563eb]" />}
              </Link>
            )
          })}
        </nav>

        {/* Footer info */}
        <div className="p-4 mt-auto border-t border-white/5">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors text-sm font-medium"
          >
            <LogOut className="w-5 h-5" />
            {isOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
