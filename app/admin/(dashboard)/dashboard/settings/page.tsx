"use client";

import React, { useEffect, useState } from 'react';
import api from '@/admin_lib/api';
import {
  Mail,
  Phone,
  MapPin,
  Link as LinkIcon,
  Globe,
  Camera,
  Save,
  MessageCircle,
  ShieldCheck,
  RefreshCcw
} from 'lucide-react';

const defaultSettings = {
  email: '',
  phone: '',
  address: '',
  whatsapp: {
    number: '',
    message: ''
  },
  socialLinks: {
    linkedin: '',
    twitter: '',
    instagram: ''
  }
};

export default function SettingsPage() {
  const [settings, setSettings] = useState(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchSettings = async () => {
    try {
      const response = await api.get('settings');
      const data = response.data.data || defaultSettings;
      setSettings({
        ...defaultSettings,
        ...data,
        whatsapp: {
          ...defaultSettings.whatsapp,
          ...(data.whatsapp || {})
        },
        socialLinks: {
          ...defaultSettings.socialLinks,
          ...(data.socialLinks || {})
        }
      });
    } catch (err) {
      console.error('Failed to fetch settings', err);
      setSettings(defaultSettings);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('settings', settings);
      alert('Global settings updated successfully!');
    } catch {
      alert('Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-white p-8 font-bold">Loading Global Settings...</div>;

  return (
    <div className="space-y-8 text-left">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Global Settings</h1>
        <p className="text-gray-400">Manage contact information, WhatsApp content, and social links used across the site.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-6">
          <form onSubmit={handleSave} className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-8">
            <div className="space-y-6">
              <div className="flex items-center gap-3 text-blue-500 mb-6 font-bold">
                <Mail className="w-5 h-5" />
                <h3>Primary Contact Information</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase ml-1">Support Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                    <input
                      value={settings.email}
                      onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-3 text-white focus:outline-none focus:border-blue-500/50"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase ml-1">Contact Phone</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                    <input
                      value={settings.phone}
                      onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-3 text-white focus:outline-none focus:border-blue-500/50"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Office Address</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-4 w-4 h-4 text-gray-600" />
                  <textarea
                    rows={3}
                    value={settings.address}
                    onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-3 text-white focus:outline-none focus:border-blue-500/50 resize-none"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6 pt-8 border-t border-white/10">
              <div className="flex items-center gap-3 text-emerald-500 mb-6 font-bold">
                <MessageCircle className="w-5 h-5" />
                <h3>WhatsApp Widget</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase ml-1">WhatsApp Number</label>
                  <input
                    value={settings.whatsapp.number}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        whatsapp: { ...settings.whatsapp, number: e.target.value }
                      })
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50"
                  />
                </div>
                <div className="space-y-2 md:col-span-1">
                  <label className="text-xs font-bold text-gray-500 uppercase ml-1">Auto Message</label>
                  <textarea
                    rows={3}
                    value={settings.whatsapp.message}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        whatsapp: { ...settings.whatsapp, message: e.target.value }
                      })
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50 resize-none"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6 pt-8 border-t border-white/10">
              <div className="flex items-center gap-3 text-purple-500 mb-6 font-bold">
                <LinkIcon className="w-5 h-5" />
                <h3>Social Connect</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-600 uppercase ml-1">LinkedIn URL</label>
                  <input
                    value={settings.socialLinks.linkedin}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        socialLinks: { ...settings.socialLinks, linkedin: e.target.value }
                      })
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-gray-300"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-600 uppercase ml-1">Twitter URL</label>
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-gray-600" />
                    <input
                      value={settings.socialLinks.twitter}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          socialLinks: { ...settings.socialLinks, twitter: e.target.value }
                        })
                      }
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-gray-300"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-600 uppercase ml-1">Instagram URL</label>
                  <div className="flex items-center gap-2">
                    <Camera className="w-4 h-4 text-gray-600" />
                    <input
                      value={settings.socialLinks.instagram}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          socialLinks: { ...settings.socialLinks, instagram: e.target.value }
                        })
                      }
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-gray-300"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={saving}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-10 py-4 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] disabled:opacity-50"
              >
                {saving ? <RefreshCcw className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                {saving ? 'Updating...' : 'Update Settings'}
              </button>
            </div>
          </form>
        </div>

        <div className="space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
            <div className="flex items-center gap-3 text-emerald-500 mb-6 font-bold uppercase tracking-widest text-xs">
              <ShieldCheck className="w-4 h-4" />
              System Health
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-emerald-500/5 rounded-xl border border-emerald-500/10">
                <span className="text-xs text-gray-400">Database Connection</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              </div>
              <div className="flex items-center justify-between p-3 bg-emerald-500/5 rounded-xl border border-emerald-500/10">
                <span className="text-xs text-gray-400">API Status</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-white/10 rounded-3xl p-8 relative overflow-hidden group">
            <div className="relative z-10">
              <MessageCircle className="w-8 h-8 text-blue-500 mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Current WhatsApp Copy</h3>
              <p className="text-xs text-gray-500 mb-6">This content can now be updated directly from admin.</p>

              <div className="space-y-3">
                <div className="text-[10px] text-gray-600 font-bold uppercase">Number</div>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-sm text-gray-300">
                  {settings.whatsapp.number || 'No number configured'}
                </div>
                <div className="text-[10px] text-gray-600 font-bold uppercase">Auto Message</div>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10 italic text-sm text-gray-400">
                  {`"${settings.whatsapp.message || 'No message configured'}"`}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
