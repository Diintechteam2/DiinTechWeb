"use client";

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { 
  ArrowRight, 
  Box, 
  ChevronLeft, 
  ExternalLink, 
  Image as ImageIcon, 
  Video as VideoIcon, 
  Share2, 
  X, 
  Play, 
  VolumeX, 
  Volume2, 
  FileText,
  Compass,
  ArrowLeft,
  Download
} from 'lucide-react';
import type { Project } from '@/lib/projects-data';
import type { ProjectAsset } from '@/lib/projects-api';

interface ProjectsDirectoryClientProps {
  projects: Project[];
  initialAssets: ProjectAsset[];
  projectsPageContent: any;
}

export function ProjectsDirectoryClient({
  projects,
  initialAssets,
  projectsPageContent
}: ProjectsDirectoryClientProps) {
  const [activeTab, setActiveTab] = useState<'projects' | 'assets'>('projects');
  const [assets, setAssets] = useState<ProjectAsset[]>(initialAssets);
  const [searchTerm, setSearchTerm] = useState('');
  const [mediaTypeFilter, setMediaTypeFilter] = useState<'image' | 'video'>('video');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);
  
  // Navigation states
  const [selectedProjectForAssets, setSelectedProjectForAssets] = useState<string | null>(null);
  
  // Reels and Modal viewer states
  const [selectedAsset, setSelectedAsset] = useState<ProjectAsset | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isShareFeedback, setIsShareFeedback] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});
  const modalVideoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isScrollingRef = useRef(false);
  const isProgrammaticScrollRef = useRef(false);

  // List of all videos of the selected project for vertical reels snap slider
  const videoReelsList = assets.filter(a => a.project?._id === selectedProjectForAssets && a.type === 'video');

  // Manage playing/pausing of the active video in the reels list
  useEffect(() => {
    // Pause all other modal videos
    Object.keys(modalVideoRefs.current).forEach((id) => {
      const video = modalVideoRefs.current[id];
      if (video && id !== selectedAsset?._id) {
        video.pause();
        video.currentTime = 0;
      }
    });

    // Handle the active video play/pause
    if (selectedAsset && selectedAsset.type === 'video') {
      const activeVideo = modalVideoRefs.current[selectedAsset._id];
      if (activeVideo) {
        if (isPaused) {
          activeVideo.pause();
        } else {
          activeVideo.play().catch((err) => {
            console.log("Auto-play interrupted or blocked:", err);
          });
        }
      }
    }
  }, [selectedAsset?._id, isPaused]);

  // Scroll the active reel into view when modal opens or active asset is set
  useEffect(() => {
    if (selectedAsset && selectedAsset.type === 'video' && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const index = videoReelsList.findIndex(a => a._id === selectedAsset._id);
      if (index !== -1) {
        const containerHeight = container.clientHeight;
        const targetScrollTop = index * containerHeight;
        // Only scroll if we are not already at the target scroll position (e.g. if scroll was manual)
        if (Math.abs(container.scrollTop - targetScrollTop) > 10) {
          isProgrammaticScrollRef.current = true;
          container.scrollTo({
            top: targetScrollTop,
            behavior: 'instant'
          });
          // Reset flag after a tiny timeout to allow async scroll events to fire and get ignored
          setTimeout(() => {
            isProgrammaticScrollRef.current = false;
          }, 100);
        }
      }
    }
  }, [selectedAsset?._id, videoReelsList.length]);

  // Intercept wheel events to allow scrolling only one video at a time on desktop
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || !selectedAsset || selectedAsset.type !== 'video') return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      if (isScrollingRef.current) return;

      const direction = e.deltaY > 0 ? 1 : -1;
      const index = videoReelsList.findIndex(a => a._id === selectedAsset._id);
      
      if (index === -1) return;

      const nextIndex = index + direction;
      if (nextIndex >= 0 && nextIndex < videoReelsList.length) {
        isScrollingRef.current = true;
        isProgrammaticScrollRef.current = true;
        const targetAsset = videoReelsList[nextIndex];
        setSelectedAsset(targetAsset);
        setIsPaused(false);

        // Lock scroll for 800ms
        setTimeout(() => {
          isScrollingRef.current = false;
          isProgrammaticScrollRef.current = false;
        }, 800);
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, [selectedAsset?._id, videoReelsList]);

  // Handle vertical scroll snapping in reels container to update the active reel
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (isProgrammaticScrollRef.current) return;

    const container = e.currentTarget;
    const scrollTop = container.scrollTop;
    const containerHeight = container.clientHeight;
    if (containerHeight === 0) return;

    const idx = Math.round(scrollTop / containerHeight);
    if (idx >= 0 && idx < videoReelsList.length) {
      const activeVideoAsset = videoReelsList[idx];
      if (activeVideoAsset && activeVideoAsset._id !== selectedAsset?._id) {
        setSelectedAsset(activeVideoAsset);
        setIsPaused(false); // Reset pause state when switching reels
      }
    }
  };

  const togglePlayPause = () => {
    setIsPaused(prev => !prev);
  };

  // Sync URL query params with activeTab and selectedAsset selection on page load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab');
    const assetIdParam = params.get('assetId');

    if (tabParam === 'assets' || assetIdParam) {
      setActiveTab('assets');
    }

    if (assetIdParam) {
      const found = initialAssets.find(a => a._id === assetIdParam);
      if (found) {
        setSelectedAsset(found);
        if (found.project?._id) {
          setSelectedProjectForAssets(found.project._id);
        }
      }
    }
  }, [initialAssets]);

  // Prevent background body scroll when asset modal is open
  useEffect(() => {
    if (selectedAsset) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedAsset]);

  // Sync URL query params when activeTab switches
  const handleTabChange = (tab: 'projects' | 'assets') => {
    setActiveTab(tab);
    setSelectedProjectForAssets(null); // Reset inside view
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (tab === 'assets') {
        url.searchParams.set('tab', 'assets');
      } else {
        url.searchParams.delete('tab');
        url.searchParams.delete('assetId');
      }
      window.history.pushState({}, '', url.toString());
    }
  };

  // Navigating inside a project's assets
  const handleSelectProjectForAssets = (projId: string) => {
    setSelectedProjectForAssets(projId);
    setSearchTerm(''); // Clear search when navigating
  };

  // Clicking a single asset to play/open
  const selectAsset = (asset: ProjectAsset) => {
    setSelectedAsset(asset);
    setIsPaused(false);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('tab', 'assets');
      url.searchParams.set('assetId', asset._id);
      window.history.pushState({}, '', url.toString());
    }
  };

  // Closing the modal
  const closeAssetModal = () => {
    setSelectedAsset(null);
    setIsPaused(false);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('tab', 'assets');
      url.searchParams.delete('assetId');
      window.history.pushState({}, '', url.toString());
    }
  };

  const copyShareLink = (e: React.MouseEvent, assetId: string) => {
    e.stopPropagation();
    if (typeof window !== 'undefined') {
      const shareUrl = window.location.origin + `/projects?tab=assets&assetId=${assetId}`;
      navigator.clipboard.writeText(shareUrl).then(() => {
        setIsShareFeedback(true);
        setTimeout(() => setIsShareFeedback(false), 2000);
      });
    }
  };
  const handleDownload = (url: string, title: string) => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
    const downloadUrl = `${apiBaseUrl}/project-assets/download?url=${encodeURIComponent(url)}&filename=${encodeURIComponent(title)}`;
    
    const a = document.createElement('a');
    a.href = downloadUrl;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Hover play triggers
  const handleMouseEnterVideo = (id: string) => {
    const video = videoRefs.current[id];
    if (video) {
      video.play().catch(() => {});
    }
  };

  const handleMouseLeaveVideo = (id: string) => {
    const video = videoRefs.current[id];
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
  };

  // Filter projects for the 'Projects' tab
  const filteredProjects = projects.filter(project => {
    return project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.content.introduction?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Calculate project asset counts helper
  const getProjectAssetCounts = (projId: string) => {
    const projAssets = assets.filter(a => a.project?._id === projId);
    const images = projAssets.filter(a => a.type === 'image').length;
    const videos = projAssets.filter(a => a.type === 'video').length;
    return { images, videos, total: projAssets.length };
  };

  // Get only projects that have at least 1 image or video in the database
  const projectsWithAssets = projects
    .map(proj => {
      // Find matching dynamic project database ID
      const dynamicProj = assets.find(a => a.project?.slug === proj.slug)?.project;
      const dbId = dynamicProj?._id || proj.slug; // fallback to slug if not fetched dynamically
      const counts = getProjectAssetCounts(dbId);
      return { ...proj, dbId, ...counts };
    })
    .filter(proj => proj.total > 0);

  // Filter projects by search term in the Assets tab
  const searchedProjectsWithAssets = projectsWithAssets.filter(proj =>
    proj.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter assets inside the selected project page
  const filteredProjectAssets = assets.filter(asset => {
    if (asset.project?._id !== selectedProjectForAssets) return false;
    
    const matchesSearch = asset.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = asset.type === mediaTypeFilter;
    
    return matchesSearch && matchesType;
  });

  // Selected project model details
  const currentProjectDetails = projectsWithAssets.find(p => p.dbId === selectedProjectForAssets);

  // List of all videos of the selected project for vertical reels snap slider
  const activeReelIndex = selectedAsset ? videoReelsList.findIndex(a => a._id === selectedAsset._id) : -1;

  return (
    <div className="container mx-auto px-4 lg:px-8 relative z-10 pt-32 pb-24">
      {/* Back Link */}
      <Link 
        href="/" 
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-6 group text-sm"
      >
        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span>{projectsPageContent.backLinkText}</span>
      </Link>

      {/* Heading Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
        <div className="max-w-3xl">
          <h1 className="text-3xl lg:text-5xl font-bold tracking-tight text-foreground mb-4">
            {projectsPageContent.titlePrefix}{" "}
            <span className="text-primary">{projectsPageContent.titleHighlight}</span>
          </h1>
          <p className="text-base text-muted-foreground">{projectsPageContent.description}</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-neutral-900/60 p-1 border border-border/50 rounded-xl max-w-fit backdrop-blur-sm self-start md:self-auto">
          <button
            onClick={() => handleTabChange('projects')}
            className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'projects'
                ? 'bg-primary/20 border border-primary/20 text-primary shadow-lg'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Our Projects
          </button>
          <button
            onClick={() => handleTabChange('assets')}
            className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'assets'
                ? 'bg-primary/20 border border-primary/20 text-primary shadow-lg'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Compass className="w-4 h-4" />
            Project Assets
          </button>
        </div>
      </div>

      {/* OUR PROJECTS TAB */}
      {activeTab === 'projects' && (
        <div className="space-y-6">
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-card/40 backdrop-blur-sm border border-border/50 rounded-xl px-4 py-3 text-white placeholder-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <div 
                key={project.slug} 
                className="group relative bg-card/40 backdrop-blur-sm border border-border/50 rounded-2xl p-6 hover:shadow-xl hover:border-primary/45 transition-all duration-300 flex flex-col"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none" />
                
                <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary group-hover:scale-105 transition-transform duration-300 overflow-hidden">
                  {project.logoUrl ? (
                    <img
                      src={project.logoUrl}
                      alt={`${project.name} logo`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Box className="w-6 h-6" />
                  )}
                </div>
                
                <h2 className="text-2xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">{project.name}</h2>
                
                <p className="text-sm text-muted-foreground mb-6 line-clamp-2 leading-relaxed opacity-85 group-hover:opacity-100 transition-opacity">
                  {project.content.introduction}
                </p>
                
                <div className="flex items-center justify-between gap-4 mt-auto pt-4 border-t border-border/50">
                  {project.websiteUrl && project.websiteUrl !== '#' ? (
                    <a 
                      href={project.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm font-semibold text-primary hover:text-primary/80 transition-colors group/link"
                    >
                      {projectsPageContent.visitWebsiteLabel} 
                      <ExternalLink className="w-3.5 h-3.5 ml-1.5 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                    </a>
                  ) : (
                    <span className="text-xs text-muted-foreground/50">No external link</span>
                  )}
                  
                  <div className="flex items-center gap-3">
                    <Link 
                      href={`/projects/${project.slug}/privacy-policy`}
                      className="inline-flex items-center text-xs font-semibold text-muted-foreground hover:text-primary transition-colors whitespace-nowrap"
                    >
                      {projectsPageContent.privacyPolicyLabel} <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Link>

                    {project.termsConditions?.enabled && (
                      <>
                        <span className="text-muted-foreground/30 text-xs">|</span>
                        <Link 
                          href={`/projects/${project.slug}/privacy-policy/terms-conditions`}
                          className="inline-flex items-center text-xs font-semibold text-muted-foreground hover:text-primary transition-colors whitespace-nowrap"
                        >
                          Terms <ArrowRight className="w-3.5 h-3.5 ml-1" />
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PROJECT ASSETS TAB */}
      {activeTab === 'assets' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          
          {/* VIEW 1: Main Project Cards Grid (Only projects with assets) */}
          {selectedProjectForAssets === null ? (
            <div className="space-y-6">
              {/* Search projects */}
              <div className="relative max-w-md">
                <input
                  type="text"
                  placeholder="Search projects with assets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-card/40 backdrop-blur-sm border border-border/50 rounded-xl px-4 py-3 text-white placeholder-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>

              {searchedProjectsWithAssets.length === 0 ? (
                <div className="text-center py-20 bg-card/20 border border-border/30 rounded-2xl">
                  <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground font-medium">No projects with assets found</p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                  {searchedProjectsWithAssets.map((project) => (
                    <div 
                      key={project.slug} 
                      onClick={() => handleSelectProjectForAssets(project.dbId)}
                      className="group relative bg-card/40 backdrop-blur-sm border border-border/50 hover:border-primary/40 rounded-2xl p-5 hover:shadow-xl cursor-pointer transition-all duration-300 flex flex-col justify-between"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none" />
                      
                      <div>
                        {/* Project Logo */}
                        <div className="mb-3 inline-flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary group-hover:scale-105 transition-transform duration-300 overflow-hidden">
                          {project.logoUrl ? (
                            <img
                              src={project.logoUrl}
                              alt={`${project.name} logo`}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Box className="w-5 h-5" />
                          )}
                        </div>
                        
                        <h2 className="text-lg font-bold text-foreground mb-1 group-hover:text-primary transition-colors">{project.name}</h2>
                        
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-4">
                          Browse images and video reels created for {project.name}.
                        </p>
                      </div>

                      {/* Display asset counts */}
                      <div className="flex items-center justify-between pt-4 border-t border-border/40 text-xs font-semibold">
                        <div className="flex items-center gap-3 text-muted-foreground">
                          {project.images > 0 && (
                            <span className="flex items-center gap-1">
                              <ImageIcon className="w-3.5 h-3.5 text-sky-400" />
                              {project.images} {project.images === 1 ? 'Image' : 'Images'}
                            </span>
                          )}
                          {project.images > 0 && project.videos > 0 && <span className="text-border/30">|</span>}
                          {project.videos > 0 && (
                            <span className="flex items-center gap-1">
                              <VideoIcon className="w-3.5 h-3.5 text-emerald-400" />
                              {project.videos} {project.videos === 1 ? 'Video' : 'Videos'}
                            </span>
                          )}
                        </div>

                        <span className="text-primary group-hover:translate-x-1.5 transition-transform flex items-center gap-1">
                          View Assets <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            
            /* VIEW 2: Inside a Selected Project's Assets */
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Inside Header */}
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between border-b border-border/40 pb-5">
                <button
                  onClick={() => setSelectedProjectForAssets(null)}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Projects list</span>
                </button>

                <div className="flex items-center gap-3">
                  {currentProjectDetails?.logoUrl && (
                    <img
                      src={currentProjectDetails.logoUrl}
                      alt=""
                      className="w-8 h-8 rounded-lg object-cover border border-border/50"
                    />
                  )}
                  <h2 className="text-xl font-bold text-white">
                    {currentProjectDetails?.name || 'Project'} Assets
                  </h2>
                </div>
              </div>

              {/* Filters Bar */}
              <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center bg-card/30 backdrop-blur-md p-5 border border-border/40 rounded-2xl">
                <input
                  type="text"
                  placeholder="Search assets inside this project..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-neutral-900/60 border border-border/50 rounded-xl px-4 py-2.5 text-sm text-white placeholder-muted-foreground focus:outline-none focus:border-primary/50 transition-colors w-full lg:max-w-md"
                />

                {/* Media Type Filter */}
                <div className="flex bg-neutral-950/60 p-1 border border-border/40 rounded-xl">
                  <button
                    onClick={() => setMediaTypeFilter('video')}
                    className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                      mediaTypeFilter === 'video'
                        ? 'bg-primary/20 text-primary'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <VideoIcon className="w-3.5 h-3.5" />
                    Videos & Reels
                  </button>
                  <button
                    onClick={() => setMediaTypeFilter('image')}
                    className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                      mediaTypeFilter === 'image'
                        ? 'bg-primary/20 text-primary'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    Images
                  </button>
                </div>
              </div>

              {/* Grid lists of files */}
              {filteredProjectAssets.length === 0 ? (
                <div className="text-center py-20 bg-card/20 border border-border/30 rounded-2xl">
                  <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground font-medium">No assets match your search/type filters</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {filteredProjectAssets.map((asset) => (
                    <div
                      key={asset._id}
                      onClick={() => selectAsset(asset)}
                      className="group bg-card/30 border border-border/40 hover:border-primary/40 rounded-2xl overflow-hidden flex flex-col cursor-pointer transition-all duration-300 shadow-md hover:shadow-xl relative"
                    >
                      {/* Media Hover preview */}
                      <div 
                        className={`${asset.type === 'video' ? 'aspect-[9/12]' : 'aspect-video'} relative bg-black/50 overflow-hidden flex items-center justify-center border-b border-border/40`}
                        onMouseEnter={() => asset.type === 'video' && handleMouseEnterVideo(asset._id)}
                        onMouseLeave={() => asset.type === 'video' && handleMouseLeaveVideo(asset._id)}
                      >
                        {asset.type === 'image' ? (
                          <img
                            src={asset.url}
                            alt={asset.title}
                            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full relative">
                            <video
                              ref={(el) => { videoRefs.current[asset._id] = el }}
                              src={asset.url}
                              className="w-full h-full object-cover opacity-80"
                              muted
                              loop
                              playsInline
                              preload="metadata"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/20 transition-colors">
                              <div className="w-11 h-11 rounded-full bg-primary/95 text-black flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                <Play className="w-5 h-5 fill-black ml-0.5" />
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Indicator Icon badge */}
                        <span className="absolute top-3 left-3 px-2 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-bold text-white flex items-center gap-1">
                          {asset.type === 'image' ? <ImageIcon className="w-3 h-3 text-sky-400" /> : <VideoIcon className="w-3 h-3 text-emerald-400" />}
                          <span className="capitalize">{asset.type}</span>
                        </span>

                        {/* Quick share */}
                        <button
                          onClick={(e) => copyShareLink(e, asset._id)}
                          className="absolute top-3 right-3 p-1.5 rounded-lg bg-black/60 hover:bg-primary/90 text-white hover:text-black border border-white/10 hover:border-transparent transition-all opacity-0 group-hover:opacity-100"
                          title="Copy Share Link"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Card Footer Title */}
                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <h3 className="text-foreground font-bold text-sm truncate" title={asset.title}>
                          {asset.title || 'Untitled Asset'}
                        </h3>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {mounted && selectedAsset && createPortal(
        <div 
          onClick={closeAssetModal}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-md p-0 md:p-4 cursor-pointer"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className={`w-full h-full flex flex-col md:flex-row bg-neutral-950 border-0 md:border md:border-white/10 rounded-none md:rounded-3xl overflow-hidden shadow-2xl relative transition-all duration-300 cursor-default ${
              selectedAsset.type === 'video' ? 'md:max-w-2xl md:h-[75vh]' : 'md:max-w-3xl md:h-[80vh]'
            }`}
          >

            {/* Left side: Media Player */}
            <div className="flex-1 bg-black flex items-center justify-center relative h-[65vh] md:h-full">
              {selectedAsset.type === 'image' ? (
                <img
                  src={selectedAsset.url}
                  alt={selectedAsset.title}
                  className="max-w-full max-h-full object-contain"
                />
              ) : (
                /* REELS PLAYER WITH CSS SCROLL SNAPPING */
                <div className="w-full h-full relative flex items-center justify-center">
                  
                  {/* Vertical Snapping Container */}
                  <div 
                    ref={scrollContainerRef}
                    onScroll={handleScroll}
                    className="w-full h-full overflow-y-scroll snap-y snap-mandatory scroll-smooth flex flex-col items-center no-scrollbar"
                  >
                    <style dangerouslySetInnerHTML={{ __html: `
                      .no-scrollbar::-webkit-scrollbar {
                        display: none !important;
                      }
                      .no-scrollbar {
                        -ms-overflow-style: none !important;
                        scrollbar-width: none !important;
                      }
                    `}} />
                    {videoReelsList.map((videoAsset, idx) => {
                      const isActiveReel = videoAsset._id === selectedAsset._id;
                      return (
                        <div 
                          key={videoAsset._id}
                          className="w-full h-full flex-shrink-0 snap-start snap-always flex items-center justify-center bg-neutral-950 relative"
                          style={{ height: '100%', minHeight: '100%' }}
                        >
                          <div 
                            className="relative w-full h-full max-w-[420px] aspect-[9/16] flex items-center justify-center bg-black cursor-pointer group"
                            onClick={togglePlayPause}
                          >
                            <video
                              ref={(el) => { modalVideoRefs.current[videoAsset._id] = el }}
                              src={videoAsset.url}
                              className="w-full h-full object-cover"
                              muted={isMuted}
                              loop
                              playsInline
                            />
                            
                            {/* Play overlay when paused */}
                            {isActiveReel && isPaused && (
                              <div className="absolute inset-0 flex items-center justify-center bg-black/35 backdrop-blur-[1px] transition-all animate-in fade-in zoom-in duration-200 pointer-events-none z-10">
                                <div className="w-16 h-16 rounded-full bg-black/60 border border-white/20 flex items-center justify-center shadow-2xl">
                                  <Play className="w-7 h-7 text-white fill-white ml-1" />
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Controls overlay */}
                          {isActiveReel && (
                            <>
                              <button
                                onClick={(e) => { e.stopPropagation(); setIsMuted(!isMuted); }}
                                className="absolute bottom-6 right-6 p-3 bg-black/60 border border-white/10 rounded-full text-white hover:bg-neutral-800 transition-colors z-20"
                              >
                                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                              </button>

                              {/* Info Card Overlay inside player */}
                              <div className="absolute left-6 bottom-6 text-white max-w-[280px] z-20 bg-gradient-to-t from-black/80 to-transparent p-4 rounded-xl border border-white/5 backdrop-blur-sm">
                                <span className="px-2 py-0.5 rounded bg-primary/20 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-wider">
                                  Reel {idx + 1} of {videoReelsList.length}
                                </span>
                                <h4 className="font-bold text-sm truncate mt-2">{videoAsset.title}</h4>
                                <p className="text-gray-400 text-xs truncate mt-1">@{videoAsset.project?.name}</p>
                              </div>
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Desktop navigation tracking hint */}
                  <div className="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 flex-col gap-2 z-20">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground text-center mb-1">
                      Scroll
                    </span>
                    <div className="w-1.5 h-16 bg-white/10 rounded-full relative overflow-hidden">
                      <div 
                        className="bg-primary absolute left-0 w-full rounded-full transition-all duration-300"
                        style={{ 
                          height: `${100 / videoReelsList.length}%`, 
                          top: `${(activeReelIndex / videoReelsList.length) * 100}%` 
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right side: Asset information details sidebar */}
            <div className="w-full md:w-72 bg-neutral-900 border-t md:border-t-0 md:border-l border-white/10 p-5 flex flex-col justify-between h-[35vh] md:h-full relative">
              {/* Close Button inside sidebar */}
              <button
                onClick={closeAssetModal}
                className="absolute top-3 right-3 z-50 p-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white rounded-lg transition-colors focus:outline-none"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>

              <div>
                {/* Linked Project info */}
                <div className="flex items-center gap-2 mb-4 bg-white/5 p-3 rounded-xl border border-white/5">
                  {selectedAsset.project?.logoUrl ? (
                    <img
                      src={selectedAsset.project.logoUrl}
                      alt=""
                      className="w-8 h-8 rounded-lg object-cover border border-white/10"
                    />
                  ) : (
                    <Box className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary border border-primary/20" />
                  )}
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground">Associated Project</span>
                    <span className="text-white font-bold text-sm leading-tight truncate">{selectedAsset.project?.name || 'Unknown Project'}</span>
                  </div>
                </div>

                <h3 className="text-white text-lg font-bold mb-1">
                  {selectedAsset.title || 'Untitled Resource'}
                </h3>
                
                <p className="text-xs text-muted-foreground mb-4">
                  Added on {new Date(selectedAsset.createdAt).toLocaleDateString()}
                </p>

                {selectedAsset.type === 'video' && (
                  <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 text-xs text-primary/80 leading-relaxed mb-4">
                    💡 <strong>Tip:</strong> Scroll or drag vertically inside the video box to flip through different reels!
                  </div>
                )}
              </div>

              {/* Share & Download buttons */}
              <div className="space-y-3 pt-4 border-t border-white/5">
                <button
                  onClick={(e) => copyShareLink(e, selectedAsset._id)}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-black font-bold rounded-xl transition-all hover:bg-primary/90 hover:scale-[1.02]"
                >
                  <Share2 className="w-4 h-4" />
                  <span>{isShareFeedback ? 'Copied URL!' : 'Share Asset Link'}</span>
                </button>

                <button
                  onClick={() => handleDownload(selectedAsset.url, selectedAsset.title)}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white font-semibold rounded-xl transition-all text-sm"
                >
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </button>
              </div>

            </div>
          </div>
        </div>,
        document.body
      )}
      
      {/* Toast alert fallback */}
      {isShareFeedback && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 px-6 py-3.5 bg-neutral-900 border border-primary/30 rounded-xl shadow-2xl text-primary font-bold text-sm flex items-center gap-2 animate-in fade-in slide-in-from-bottom-5">
          <Share2 className="w-4 h-4" />
          <span>Asset share link copied successfully!</span>
        </div>
      )}
      
    </div>
  );
}
