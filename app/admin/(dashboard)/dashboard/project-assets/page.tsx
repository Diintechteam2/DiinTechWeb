"use client";

import React, { useEffect, useState, useRef } from 'react';
import api from '@/admin_lib/api';
import axios from 'axios';
import {
  Plus,
  Search,
  ExternalLink,
  Trash2,
  Image,
  Video,
  X,
  Loader2,
  Briefcase,
  Share2,
  FileText,
  Upload,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';

interface Project {
  _id: string;
  name: string;
  slug: string;
  logoUrl?: string;
}

interface ProjectAsset {
  _id: string;
  project: Project;
  title: string;
  type: 'image' | 'video';
  url: string;
  key: string;
  createdAt: string;
}

export default function ProjectAssetsDashboard() {
  const [assets, setAssets] = useState<ProjectAsset[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Navigation states
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [activeAssetTab, setActiveAssetTab] = useState<'image' | 'video'>('image');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  // Form states
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [assetTitle, setAssetTitle] = useState('');
  const [assetType, setAssetType] = useState<'image' | 'video'>('image');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [assetsRes, projectsRes] = await Promise.all([
        api.get('project-assets'),
        api.get('projects')
      ]);
      setAssets(assetsRes.data.data || []);
      setProjects(projectsRes.data.data || []);
    } catch (err) {
      console.error('Failed to fetch data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
      
      // Auto-detect type
      if (file.type.startsWith('video/')) {
        setAssetType('video');
      } else {
        setAssetType('image');
      }

      // Pre-fill title if empty
      if (!assetTitle) {
        const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
        setAssetTitle(nameWithoutExt);
      }
    }
  };

  const handleUploadAndSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectId) {
      alert('Please select a project');
      return;
    }
    if (!selectedFile) {
      alert('Please select a file to upload');
      return;
    }

    try {
      setUploading(true);
      setUploadProgress(5);

      // 1. Get presigned upload URL from backend
      const presignedRes = await api.post('project-assets/presigned-url', {
        filename: selectedFile.name,
        contentType: selectedFile.type
      });

      const { uploadUrl, fileUrl, key } = presignedRes.data.data;
      setUploadProgress(20);

      // 2. Upload file directly to Cloudflare R2 bucket using PUT
      await axios.put(uploadUrl, selectedFile, {
        headers: {
          'Content-Type': selectedFile.type
        },
        onUploadProgress: (progressEvent) => {
          const total = progressEvent.total || selectedFile.size;
          const current = progressEvent.loaded;
          const percentage = Math.round((current / total) * 80);
          setUploadProgress(20 + percentage);
        }
      });

      setUploadProgress(95);

      // 3. Save R2 metadata details to backend database
      await api.post('project-assets', {
        project: selectedProjectId,
        title: assetTitle,
        type: assetType,
        url: fileUrl,
        key: key
      });

      setUploadProgress(100);
      alert('Asset uploaded and saved successfully!');
      
      // Reset form and close modal
      setIsModalOpen(false);
      resetForm();
      setActiveAssetTab(assetType);
      fetchData();
    } catch (err: any) {
      console.error(err);
      const errMsg = err.response?.data?.message || err.message || 'Upload failed';
      alert(`Error uploading file: ${errMsg}`);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this asset from storage and database?')) return;

    try {
      await api.delete(`project-assets/${id}`);
      fetchData();
    } catch (err) {
      alert('Failed to delete asset');
    }
  };

  const copyShareLink = (assetId: string) => {
    const publicUrl = window.location.origin + `/projects?tab=assets&assetId=${assetId}`;
    navigator.clipboard.writeText(publicUrl);
    alert('Share link copied to clipboard!');
  };

  const resetForm = () => {
    // If inside a project view, pre-fill project ID
    setSelectedProjectId(activeProjectId || '');
    setAssetTitle('');
    setAssetType('image');
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const openUploadModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  // Helper to count assets
  const getProjectAssetCounts = (projId: string) => {
    const projAssets = assets.filter(a => a.project?._id === projId);
    const images = projAssets.filter(a => a.type === 'image').length;
    const videos = projAssets.filter(a => a.type === 'video').length;
    return { images, videos, total: projAssets.length };
  };

  // Filters projects list by search term
  const filteredProjects = projects.filter((proj) =>
    proj.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filters assets inside the active project view
  const filteredAssets = assets.filter((asset) => {
    if (asset.project?._id !== activeProjectId) return false;
    return asset.title.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const imageAssets = filteredAssets.filter(a => a.type === 'image');
  const videoAssets = filteredAssets.filter(a => a.type === 'video');

  const activeProjectDetails = projects.find(p => p._id === activeProjectId);

  const renderAssetCard = (asset: ProjectAsset) => (
    <div
      key={asset._id}
      className="bg-neutral-900/60 border border-white/10 rounded-2xl overflow-hidden flex flex-col group hover:border-blue-500/30 transition-all duration-300 shadow-lg hover:shadow-2xl"
    >
      <div className="aspect-video relative bg-black/40 flex items-center justify-center overflow-hidden border-b border-white/5">
        {asset.type === 'image' ? (
          <img
            src={asset.url}
            alt={asset.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://placehold.co/600x400/171717/ffffff?text=Image+Load+Error';
            }}
          />
        ) : (
          <div className="relative w-full h-full flex items-center justify-center bg-blue-950/20 group-hover:bg-blue-950/30 transition-colors">
            <video
              src={asset.url}
              className="w-full h-full object-cover opacity-60 group-hover:opacity-75 transition-opacity"
              muted
              preload="metadata"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-blue-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Video className="w-6 h-6" />
              </div>
            </div>
          </div>
        )}

        {/* Indicator Icon badge */}
        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-xs font-semibold text-white flex items-center gap-1.5">
          {asset.type === 'image' ? <Image className="w-3.5 h-3.5 text-sky-400" /> : <Video className="w-3.5 h-3.5 text-emerald-400" />}
          <span className="capitalize">{asset.type}</span>
        </span>
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between">
        <h3 className="text-white font-bold truncate text-base mb-1" title={asset.title}>
          {asset.title || 'Untitled Asset'}
        </h3>

        {/* Actions Button Group */}
        <div className="flex items-center justify-between gap-3 mt-4 pt-3 border-t border-white/5">
          <button
            onClick={() => copyShareLink(asset._id)}
            className="flex items-center gap-1.5 px-3 py-2 bg-white/5 hover:bg-blue-600/10 text-gray-300 hover:text-blue-400 text-xs font-semibold rounded-lg transition-colors"
            title="Copy Share Link"
          >
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </button>

          <div className="flex items-center gap-2">
            <a
              href={asset.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white rounded-lg transition-colors"
              title="Open Original Resource"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
            <button
              onClick={() => handleDelete(asset._id)}
              className="p-2 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white rounded-lg transition-colors"
              title="Delete Asset"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return <div className="text-white p-8 font-bold flex items-center gap-2">
      <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
      Loading Project Assets...
    </div>;
  }

  return (
    <div className="space-y-8">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Project Assets</h1>
          <p className="text-gray-400">Manage photos or reels linked to each project (Stored in Cloudflare R2).</p>
        </div>
        {activeProjectId && (
          <button
            onClick={openUploadModal}
            className="flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)] hover:scale-[1.02]"
          >
            <Plus className="w-5 h-5" />
            <span>Upload Asset</span>
          </button>
        )}
      </div>

      {/* VIEW 1: Main Projects Grid List (All projects) */}
      {activeProjectId === null ? (
        <div className="space-y-6">
          {/* Search bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => {
              const counts = getProjectAssetCounts(project._id);
              return (
                <div
                  key={project._id}
                  onClick={() => {
                    setActiveProjectId(project._id);
                    setSearchTerm('');
                    const counts = getProjectAssetCounts(project._id);
                    if (counts.images === 0 && counts.videos > 0) {
                      setActiveAssetTab('video');
                    } else {
                      setActiveAssetTab('image');
                    }
                  }}
                  className="bg-neutral-900/60 border border-white/10 rounded-2xl p-6 flex flex-col justify-between cursor-pointer group hover:border-blue-500/40 transition-all duration-300 shadow-md hover:shadow-xl"
                >
                  <div>
                    {/* Project Logo */}
                    <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600/15 text-blue-500 group-hover:scale-105 transition-transform duration-300 overflow-hidden">
                      {project.logoUrl ? (
                        <img
                          src={project.logoUrl}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Briefcase className="w-6 h-6" />
                      )}
                    </div>

                    <h2 className="text-xl font-bold text-white group-hover:text-blue-500 transition-colors">{project.name}</h2>
                    <p className="text-gray-400 text-xs mt-1.5 truncate">/projects/{project.slug}</p>
                  </div>

                  {/* Asset Counts & View Action */}
                  <div className="flex items-center justify-between pt-5 mt-6 border-t border-white/5 text-xs font-semibold">
                    <div className="flex items-center gap-3 text-gray-400">
                      {counts.total === 0 ? (
                        <span className="text-gray-500">No assets</span>
                      ) : (
                        <>
                          {counts.images > 0 && (
                            <span className="flex items-center gap-1">
                              <Image className="w-3.5 h-3.5 text-sky-400" />
                              {counts.images}
                            </span>
                          )}
                          {counts.images > 0 && counts.videos > 0 && <span>•</span>}
                          {counts.videos > 0 && (
                            <span className="flex items-center gap-1">
                              <Video className="w-3.5 h-3.5 text-emerald-400" />
                              {counts.videos}
                            </span>
                          )}
                        </>
                      )}
                    </div>

                    <span className="text-blue-500 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                      Manage Assets <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (

        /* VIEW 2: Inside a project assets */
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Sub Header Navigation */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between border-b border-white/5 pb-5">
            <button
              onClick={() => {
                setActiveProjectId(null);
                setSearchTerm('');
                setActiveAssetTab('image');
              }}
              className="inline-flex items-center gap-2 text-sm font-semibold text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Projects grid</span>
            </button>

            <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-xl border border-white/5">
              {activeProjectDetails?.logoUrl && (
                <img
                  src={activeProjectDetails.logoUrl}
                  alt=""
                  className="w-6 h-6 rounded object-cover"
                />
              )}
              <h2 className="text-base font-bold text-white">
                {activeProjectDetails?.name} Assets List
              </h2>
            </div>
          </div>

          {/* Search bar & Tabs row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Search bar inside */}
            <div className="relative max-w-md w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search assets inside this project..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-2.5 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Tab Switched */}
            <div className="flex bg-neutral-950 p-1 rounded-xl border border-white/5 self-start md:self-auto">
              <button
                onClick={() => setActiveAssetTab('image')}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                  activeAssetTab === 'image'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Image className="w-4 h-4" />
                <span>Photos ({imageAssets.length})</span>
              </button>
              <button
                onClick={() => setActiveAssetTab('video')}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                  activeAssetTab === 'video'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Video className="w-4 h-4" />
                <span>Videos & Reels ({videoAssets.length})</span>
              </button>
            </div>
          </div>

          {/* Grid lists of files */}
          {filteredAssets.length === 0 ? (
            <div className="text-center py-20 bg-white/5 border border-white/5 rounded-2xl">
              <FileText className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400 font-medium">No assets found</p>
              <p className="text-gray-500 text-sm mt-1">Click "Upload Asset" above to add files for {activeProjectDetails?.name}.</p>
            </div>
          ) : activeAssetTab === 'image' ? (
            /* Images Grid */
            imageAssets.length === 0 ? (
              <div className="text-center py-16 bg-white/5 border border-white/5 rounded-2xl">
                <Image className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400 font-medium">No photos uploaded yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {imageAssets.map((asset) => renderAssetCard(asset))}
              </div>
            )
          ) : (
            /* Videos Grid */
            videoAssets.length === 0 ? (
              <div className="text-center py-16 bg-white/5 border border-white/5 rounded-2xl">
                <Video className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400 font-medium">No videos or reels uploaded yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {videoAssets.map((asset) => renderAssetCard(asset))}
              </div>
            )
          )}
        </div>
      )}

      {/* Upload Asset Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="bg-neutral-900 border border-white/10 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Upload className="w-5 h-5 text-blue-500" />
                Upload New Asset
              </h2>
              <button
                onClick={() => !uploading && setIsModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                disabled={uploading}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleUploadAndSave} className="p-6 space-y-5">
              {/* Select Project */}
              <div>
                <label className="block text-gray-300 text-sm font-semibold mb-2">Associate Project *</label>
                {activeProjectId ? (
                  <div className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white flex items-center gap-3">
                    {activeProjectDetails?.logoUrl ? (
                      <img
                        src={activeProjectDetails.logoUrl}
                        alt=""
                        className="w-6 h-6 rounded object-cover"
                      />
                    ) : (
                      <Briefcase className="w-4 h-4 text-blue-500" />
                    )}
                    <span className="font-medium">{activeProjectDetails?.name}</span>
                  </div>
                ) : (
                  <select
                    required
                    value={selectedProjectId}
                    onChange={(e) => setSelectedProjectId(e.target.value)}
                    disabled={uploading}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
                  >
                    <option value="" className="bg-neutral-900 text-gray-400">Select listed project...</option>
                    {projects.map((proj) => (
                      <option key={proj._id} value={proj._id} className="bg-neutral-900 text-white">
                        {proj.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Asset Title */}
              <div>
                <label className="block text-gray-300 text-sm font-semibold mb-2">Asset Title</label>
                <input
                  type="text"
                  placeholder="e.g. BadhAI Promo Reel, Dashboard Mockup"
                  value={assetTitle}
                  onChange={(e) => setAssetTitle(e.target.value)}
                  disabled={uploading}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              {/* Asset Type Selector */}
              <div>
                <label className="block text-gray-300 text-sm font-semibold mb-2">Asset Type *</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setAssetType('image')}
                    disabled={uploading}
                    className={`py-3 rounded-xl border flex items-center justify-center gap-2 font-semibold transition-all ${
                      assetType === 'image'
                        ? 'bg-blue-600/25 border-blue-500 text-white shadow-lg shadow-blue-500/10'
                        : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                    }`}
                  >
                    <Image className="w-5 h-5 text-sky-400" />
                    Image
                  </button>
                  <button
                    type="button"
                    onClick={() => setAssetType('video')}
                    disabled={uploading}
                    className={`py-3 rounded-xl border flex items-center justify-center gap-2 font-semibold transition-all ${
                      assetType === 'video'
                        ? 'bg-blue-600/25 border-blue-500 text-white shadow-lg shadow-blue-500/10'
                        : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                    }`}
                  >
                    <Video className="w-5 h-5 text-emerald-400" />
                    Video/Reel
                  </button>
                </div>
              </div>

              {/* File Upload input */}
              <div>
                <label className="block text-gray-300 text-sm font-semibold mb-2">Select File *</label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  required
                  disabled={uploading}
                  accept={assetType === 'image' ? 'image/*' : 'video/*'}
                  className="w-full text-sm text-gray-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20 file:cursor-pointer file:transition-colors bg-white/5 border border-white/10 p-2.5 rounded-xl"
                />
                {selectedFile && (
                  <p className="text-gray-400 text-xs mt-2 truncate">
                    File selected: <span className="text-white font-medium">{selectedFile.name}</span> ({Math.round(selectedFile.size / 1024 / 1024 * 100) / 100} MB)
                  </p>
                )}
              </div>

              {/* Upload Progress bar */}
              {uploading && (
                <div className="space-y-2 mt-4 bg-black/30 p-4 rounded-xl border border-white/5">
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-500" />
                      Uploading directly to Cloudflare R2...
                    </span>
                    <span className="font-bold text-white">{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-600 h-full rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={uploading}
                  className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-gray-300 font-semibold rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)] disabled:opacity-50 flex items-center gap-2"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <span>Start Upload</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
