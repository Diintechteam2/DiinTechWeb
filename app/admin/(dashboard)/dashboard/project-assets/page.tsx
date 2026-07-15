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
  ArrowRight,
  Pencil
} from 'lucide-react';

interface Project {
  _id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  categories?: string[];
}

interface ProjectAsset {
  _id: string;
  project: Project;
  title: string;
  type: 'image' | 'video';
  url: string;
  key: string;
  category?: string;
  description?: string;
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
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [filesProgress, setFilesProgress] = useState<{ [key: string]: number }>({});
  const [editingAsset, setEditingAsset] = useState<ProjectAsset | null>(null);
  const [editTitle, setEditTitle] = useState('');
  
  // Form states
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [assetTitle, setAssetTitle] = useState('');
  const [assetType, setAssetType] = useState<'image' | 'video'>('image');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const [assetCategory, setAssetCategory] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [assetDescription, setAssetDescription] = useState('');

  const [editCategory, setEditCategory] = useState('');
  const [editNewCategoryName, setEditNewCategoryName] = useState('');
  const [editShowNewCategoryInput, setEditShowNewCategoryInput] = useState(false);
  const [editDescription, setEditDescription] = useState('');
  
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
      const files = Array.from(e.target.files);
      setSelectedFiles(files);
      
      // Auto-detect type from first file
      const firstFile = files[0];
      if (firstFile.type.startsWith('video/')) {
        setAssetType('video');
      } else {
        setAssetType('image');
      }
      
      // Pre-fill title if empty and only 1 file is selected
      if (files.length === 1 && !assetTitle) {
        const nameWithoutExt = firstFile.name.substring(0, firstFile.name.lastIndexOf('.')) || firstFile.name;
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
    if (selectedFiles.length === 0) {
      alert('Please select at least one file to upload');
      return;
    }

    try {
      setUploading(true);

      // Initialize progress mapping
      const initialProgress: { [key: string]: number } = {};
      selectedFiles.forEach((file) => {
        initialProgress[file.name] = 0;
      });
      setFilesProgress(initialProgress);

      // 1. Get presigned upload URLs in bulk
      const filesMeta = selectedFiles.map((f) => ({
        filename: f.name,
        contentType: f.type
      }));

      const presignedRes = await api.post('project-assets/presigned-urls-bulk', {
        files: filesMeta
      });

      const presignedUrlsData = presignedRes.data.data; // array of { filename, uploadUrl, fileUrl, key }

      // 2. Upload files in parallel with controlled concurrency
      const uploadResults: any[] = [];
      const queue = [...selectedFiles];
      const concurrencyLimit = 3;

      const processUpload = async (file: File) => {
        const presignedInfo = presignedUrlsData.find((p: any) => p.filename === file.name);
        if (!presignedInfo) {
          throw new Error(`Failed to find presigned URL for file: ${file.name}`);
        }

        const { uploadUrl, fileUrl, key } = presignedInfo;

        await axios.put(uploadUrl, file, {
          headers: {
            'Content-Type': file.type
          },
          onUploadProgress: (progressEvent) => {
            const total = progressEvent.total || file.size;
            const current = progressEvent.loaded;
            const percentage = Math.round((current / total) * 100);
            setFilesProgress((prev) => ({
              ...prev,
              [file.name]: percentage
            }));
          }
        });

        // Determine title
        let finalTitle = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
        if (assetTitle && selectedFiles.length > 1) {
          const fileIndex = selectedFiles.indexOf(file) + 1;
          finalTitle = `${assetTitle} - ${fileIndex}`;
        } else if (assetTitle && selectedFiles.length === 1) {
          finalTitle = assetTitle;
        }

        uploadResults.push({
          project: selectedProjectId,
          title: finalTitle,
          type: file.type.startsWith('video/') ? 'video' : 'image',
          url: fileUrl,
          key: key,
          category: showNewCategoryInput ? newCategoryName.trim() : assetCategory,
          description: assetDescription.trim()
        });
      };

      const worker = async () => {
        while (queue.length > 0) {
          const file = queue.shift();
          if (file) {
            await processUpload(file);
          }
        }
      };

      // Launch concurrent workers
      const workers = Array(Math.min(concurrencyLimit, selectedFiles.length))
        .fill(null)
        .map(() => worker());

      await Promise.all(workers);

      // 3. Save all asset metadata to backend database in bulk
      await api.post('project-assets/bulk', {
        assets: uploadResults
      });

      alert('All assets uploaded and saved successfully!');
      
      // Reset form and close modal
      setIsModalOpen(false);
      resetForm();
      
      const firstFile = selectedFiles[0];
      if (firstFile) {
        setActiveAssetTab(firstFile.type.startsWith('video/') ? 'video' : 'image');
      }
      fetchData();
    } catch (err: any) {
      console.error(err);
      const errMsg = err.response?.data?.message || err.message || 'Upload failed';
      alert(`Error uploading files: ${errMsg}`);
    } finally {
      setUploading(false);
      setFilesProgress({});
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

  const openEditModal = (asset: ProjectAsset) => {
    setEditingAsset(asset);
    setEditTitle(asset.title);
    setEditCategory(asset.category || '');
    setEditDescription(asset.description || '');
    setEditShowNewCategoryInput(false);
    setEditNewCategoryName('');
    setIsEditModalOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAsset) return;
    if (!editTitle.trim()) {
      alert('Please enter a title');
      return;
    }

    try {
      setUploading(true);
      await api.put(`project-assets/${editingAsset._id}`, {
        title: editTitle,
        category: editShowNewCategoryInput ? editNewCategoryName.trim() : editCategory,
        description: editDescription.trim()
      });

      alert('Asset updated successfully!');
      setIsEditModalOpen(false);
      setEditingAsset(null);
      setEditTitle('');
      fetchData();
    } catch (err: any) {
      console.error(err);
      const errMsg = err.response?.data?.message || err.message || 'Update failed';
      alert(`Error updating asset: ${errMsg}`);
    } finally {
      setUploading(false);
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
    setSelectedFiles([]);
    setFilesProgress({});
    setAssetCategory('');
    setNewCategoryName('');
    setShowNewCategoryInput(false);
    setAssetDescription('');
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

  const existingCategories = Array.from(new Set([
    ...(activeProjectDetails?.categories || []),
    ...assets
      .filter(a => a.project?._id === activeProjectId)
      .map(a => a.category)
      .filter((c): c is string => typeof c === 'string' && c.trim() !== '')
  ]));

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
        <div>
          <h3 className="text-white font-bold truncate text-base mb-1" title={asset.title}>
            {asset.title || 'Untitled Asset'}
          </h3>
          {asset.category && (
            <span className="inline-block bg-blue-600/25 border border-blue-500/20 text-blue-400 text-[10px] font-bold px-2 py-0.5 rounded-md mt-1 capitalize">
              {asset.category}
            </span>
          )}
          {asset.description && (
            <p className="text-gray-400 text-xs mt-2 line-clamp-2 leading-relaxed" title={asset.description}>
              {asset.description}
            </p>
          )}
        </div>

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
              onClick={() => openEditModal(asset)}
              className="p-2 bg-blue-600/10 hover:bg-blue-600 text-blue-400 hover:text-white rounded-lg transition-colors"
              title="Edit Title"
            >
              <Pencil className="w-4 h-4" />
            </button>
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

              {/* Asset Category */}
              <div>
                <label className="block text-gray-300 text-sm font-semibold mb-2 flex items-center justify-between">
                  <span>Category (Optional)</span>
                  <button
                    type="button"
                    onClick={() => setShowNewCategoryInput(!showNewCategoryInput)}
                    className="text-xs text-blue-500 hover:text-blue-400 flex items-center gap-1 font-semibold"
                  >
                    {showNewCategoryInput ? "Select Existing" : "+ Add New"}
                  </button>
                </label>
                
                {showNewCategoryInput ? (
                  <input
                    type="text"
                    required
                    placeholder="Enter new category name..."
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    disabled={uploading}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                ) : (
                  <select
                    value={assetCategory}
                    onChange={(e) => setAssetCategory(e.target.value)}
                    disabled={uploading}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
                  >
                    <option value="" className="bg-neutral-900 text-gray-400">Select Category (Optional)</option>
                    {existingCategories.map((cat) => (
                      <option key={cat} value={cat} className="bg-neutral-900 text-white">
                        {cat}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Asset Description */}
              <div>
                <label className="block text-gray-300 text-sm font-semibold mb-2">Description (Optional)</label>
                <textarea
                  placeholder="Enter asset details or description..."
                  value={assetDescription}
                  onChange={(e) => setAssetDescription(e.target.value)}
                  disabled={uploading}
                  rows={3}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors resize-none"
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
                  multiple
                  disabled={uploading}
                  accept={assetType === 'image' ? 'image/*' : 'video/*'}
                  className="w-full text-sm text-gray-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20 file:cursor-pointer file:transition-colors bg-white/5 border border-white/10 p-2.5 rounded-xl"
                />
                {selectedFiles.length > 0 && (
                  <div className="mt-3 bg-black/20 border border-white/5 rounded-xl p-3 max-h-40 overflow-y-auto space-y-1.5 no-scrollbar animate-in fade-in slide-in-from-top-1.5 duration-200">
                    <p className="text-gray-400 text-xs font-semibold mb-1">
                      Selected Files ({selectedFiles.length}):
                    </p>
                    {selectedFiles.map((file, idx) => (
                      <div key={`${file.name}-${idx}`} className="flex justify-between items-center text-xs text-gray-300">
                        <span className="truncate max-w-[200px]" title={file.name}>
                          {idx + 1}. {file.name}
                        </span>
                        <span className="text-gray-500 shrink-0 font-medium">
                          ({(file.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Upload Progress bars */}
              {uploading && (
                <div className="space-y-3 mt-4 bg-black/30 p-4 rounded-xl border border-white/5 max-h-48 overflow-y-auto no-scrollbar animate-in fade-in slide-in-from-top-1.5 duration-200">
                  <p className="text-xs text-gray-400 font-semibold flex items-center gap-1.5 mb-2">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-500" />
                    Uploading files in parallel...
                  </p>
                  {selectedFiles.map((file, idx) => {
                    const progress = filesProgress[file.name] || 0;
                    return (
                      <div key={`${file.name}-progress-${idx}`} className="space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-gray-300 truncate max-w-[220px]" title={file.name}>
                            {file.name}
                          </span>
                          <span className="font-bold text-white shrink-0">{progress}%</span>
                        </div>
                        <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-blue-600 h-full rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
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

      {/* Edit Asset Modal */}
      {isEditModalOpen && editingAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="bg-neutral-900 border border-white/10 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Pencil className="w-5 h-5 text-blue-500" />
                Edit Asset Title
              </h2>
              <button
                onClick={() => !uploading && setIsEditModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                disabled={uploading}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleUpdate} className="p-6 space-y-5">
              {/* Asset Title */}
              <div>
                <label className="block text-gray-300 text-sm font-semibold mb-2">Asset Title *</label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  disabled={uploading}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              {/* Asset Category */}
              <div>
                <label className="block text-gray-300 text-sm font-semibold mb-2 flex items-center justify-between">
                  <span>Category (Optional)</span>
                  <button
                    type="button"
                    onClick={() => setEditShowNewCategoryInput(!editShowNewCategoryInput)}
                    className="text-xs text-blue-500 hover:text-blue-400 flex items-center gap-1 font-semibold"
                  >
                    {editShowNewCategoryInput ? "Select Existing" : "+ Add New"}
                  </button>
                </label>
                
                {editShowNewCategoryInput ? (
                  <input
                    type="text"
                    required
                    placeholder="Enter new category name..."
                    value={editNewCategoryName}
                    onChange={(e) => setEditNewCategoryName(e.target.value)}
                    disabled={uploading}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                ) : (
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    disabled={uploading}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
                  >
                    <option value="" className="bg-neutral-900 text-gray-400">Select Category (Optional)</option>
                    {existingCategories.map((cat) => (
                      <option key={cat} value={cat} className="bg-neutral-900 text-white">
                        {cat}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Asset Description */}
              <div>
                <label className="block text-gray-300 text-sm font-semibold mb-2">Description (Optional)</label>
                <textarea
                  placeholder="Enter asset details or description..."
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  disabled={uploading}
                  rows={3}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10 mt-6">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
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
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Save Changes</span>
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
