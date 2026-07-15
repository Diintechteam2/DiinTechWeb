"use client";

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { 
  ChevronLeft, 
  Share2, 
  X, 
  Play, 
  VolumeX, 
  Volume2, 
  Download,
  Video as VideoIcon,
  Box
} from 'lucide-react';
import type { Project } from '@/lib/projects-data';
import type { ProjectAsset } from '@/lib/projects-api';

interface ProjectVideosClientProps {
  project: Project;
  assets: ProjectAsset[];
  projectsPageContent: any;
}

export function ProjectVideosClient({
  project,
  assets,
  projectsPageContent
}: ProjectVideosClientProps) {
  const [selectedAsset, setSelectedAsset] = useState<ProjectAsset | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [isMuted, setIsMuted] = useState(true);
  const [isShareFeedback, setIsShareFeedback] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);
  
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});
  const modalVideoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isScrollingRef = useRef(false);
  const isProgrammaticScrollRef = useRef(false);

  const categories = ["All", ...Array.from(new Set([
    ...(project.categories || []),
    ...assets
      .map(a => a.category)
      .filter((c): c is string => typeof c === 'string' && c.trim() !== '')
  ]))];

  const filteredAssets = selectedCategory.toLowerCase() === "all"
    ? assets
    : assets.filter(a => a.category?.toLowerCase() === selectedCategory.toLowerCase());

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

  // Clicking a single asset to play/open
  const selectAsset = (asset: ProjectAsset) => {
    setSelectedAsset(asset);
    setIsPaused(false);
  };

  // Closing the modal
  const closeAssetModal = () => {
    setSelectedAsset(null);
    setIsPaused(false);
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

  // Hover play triggers for grid thumbnails
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
      const index = filteredAssets.findIndex(a => a._id === selectedAsset._id);
      if (index !== -1) {
        const containerHeight = container.clientHeight;
        const targetScrollTop = index * containerHeight;
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
  }, [selectedAsset?._id, filteredAssets.length]);

  // Intercept wheel events to allow scrolling only one video at a time on desktop
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || !selectedAsset || selectedAsset.type !== 'video') return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      if (isScrollingRef.current) return;

      const direction = e.deltaY > 0 ? 1 : -1;
      const index = filteredAssets.findIndex(a => a._id === selectedAsset._id);
      
      if (index === -1) return;

      const nextIndex = index + direction;
      if (nextIndex >= 0 && nextIndex < filteredAssets.length) {
        isScrollingRef.current = true;
        isProgrammaticScrollRef.current = true;
        const targetAsset = filteredAssets[nextIndex];
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
  }, [selectedAsset?._id, filteredAssets]);

  // Handle vertical scroll snapping in reels container to update the active reel
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (isProgrammaticScrollRef.current) return;

    const container = e.currentTarget;
    const scrollTop = container.scrollTop;
    const containerHeight = container.clientHeight;
    if (containerHeight === 0) return;

    const idx = Math.round(scrollTop / containerHeight);
    if (idx >= 0 && idx < filteredAssets.length) {
      const activeVideoAsset = filteredAssets[idx];
      if (activeVideoAsset && activeVideoAsset._id !== selectedAsset?._id) {
        setSelectedAsset(activeVideoAsset);
        setIsPaused(false);
      }
    }
  };

  const togglePlayPause = () => {
    setIsPaused(prev => !prev);
  };

  const activeReelIndex = selectedAsset ? filteredAssets.findIndex(a => a._id === selectedAsset._id) : -1;

  return (
    <div className="container mx-auto px-4 lg:px-8 relative z-10 pt-32 pb-24 animate-in fade-in duration-300">
      {/* Back Link */}
      {project.slug?.toLowerCase() !== 'myaiads' && (
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-6 group text-sm"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>{projectsPageContent.backLinkText}</span>
        </Link>
      )}

      {/* Heading Section */}
      {project.slug?.toLowerCase() !== 'myaiads' && (
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6 border-b border-border/40 pb-6">
          <div className="max-w-3xl flex items-center gap-4">
            {project.logoUrl ? (
              <img
                src={project.logoUrl}
                alt=""
                className="w-12 h-12 rounded-xl object-cover border border-border/50"
              />
            ) : (
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary border border-primary/20">
                <Box className="w-6 h-6" />
              </div>
            )}
            <div>
              <h1 className="text-3xl lg:text-5xl font-bold tracking-tight text-foreground">
                {project.name} <span className="text-primary">Videos & Reels</span>
              </h1>
              <p className="text-sm text-muted-foreground mt-2">
                Browse video reels created for {project.name}.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Category Tabs */}
      {categories.length > 2 && (
        <div className="flex flex-wrap items-center gap-2 mb-8 bg-neutral-900/40 p-2 rounded-2xl border border-white/5 self-start">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => {
                setSelectedCategory(category);
                setSelectedAsset(null);
              }}
              className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all border capitalize ${
                selectedCategory.toLowerCase() === category.toLowerCase()
                  ? 'bg-primary text-black border-primary font-bold shadow-lg shadow-primary/10'
                  : 'bg-white/5 border-white/5 text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      )}

      {/* Grid List of Videos */}
      {filteredAssets.length === 0 ? (
        <div className="text-center py-20 bg-card/20 border border-border/30 rounded-2xl">
          <VideoIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground font-medium">No video reels found for this category</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {filteredAssets.map((asset) => (
            <div
              key={asset._id}
              onClick={() => selectAsset(asset)}
              className="group bg-card/30 border border-border/40 hover:border-primary/40 rounded-2xl overflow-hidden flex flex-col cursor-pointer transition-all duration-300 shadow-md hover:shadow-xl relative"
            >
              <div 
                className="aspect-[9/12] relative bg-black/50 overflow-hidden flex items-center justify-center"
              >
                <div className="w-full h-full relative">
                  <video
                    src={asset.url}
                    className="w-full h-full object-cover"
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

                <span className="absolute top-3 left-3 px-2 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-bold text-white flex items-center gap-1">
                  <VideoIcon className="w-3 h-3 text-emerald-400" />
                  <span className="capitalize">{asset.type}</span>
                </span>

                <button
                  onClick={(e) => copyShareLink(e, asset._id)}
                  className="absolute top-3 right-3 p-1.5 rounded-lg bg-black/60 hover:bg-primary/90 text-white hover:text-black border border-white/10 hover:border-transparent transition-all opacity-0 group-hover:opacity-100"
                  title="Copy Share Link"
                >
                  <Share2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reels Modal Viewer */}
      {mounted && selectedAsset && createPortal(
        <div 
          onClick={closeAssetModal}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-md p-0 md:p-4 cursor-pointer"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full h-full flex flex-col bg-neutral-950 border-0 md:border md:border-white/10 rounded-none md:rounded-3xl overflow-hidden shadow-2xl relative transition-all duration-300 cursor-default md:max-w-md md:h-[80vh]"
          >
            {/* Close Button */}
            <button
              onClick={closeAssetModal}
              className="absolute top-4 right-4 z-50 p-2 bg-black/60 hover:bg-black/85 border border-white/10 text-gray-400 hover:text-white rounded-full transition-colors focus:outline-none"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Media Player */}
            <div className="w-full h-full bg-black flex items-center justify-center relative">
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
                  {filteredAssets.map((videoAsset, idx) => {
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
                          <div className="absolute bottom-6 right-6 flex flex-col gap-3 z-20">
                            <button
                              onClick={(e) => copyShareLink(e, videoAsset._id)}
                              className="p-3 bg-black/60 border border-white/10 rounded-full text-white hover:bg-neutral-800 transition-colors"
                              title="Share Link"
                            >
                              <Share2 className="w-5 h-5" />
                            </button>

                            <button
                              onClick={(e) => { e.stopPropagation(); setIsMuted(!isMuted); }}
                              className="p-3 bg-black/60 border border-white/10 rounded-full text-white hover:bg-neutral-800 transition-colors"
                              title={isMuted ? "Unmute" : "Mute"}
                            >
                              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
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
