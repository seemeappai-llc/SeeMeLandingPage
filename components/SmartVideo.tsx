'use client';

import React, { useRef, useEffect, useState } from 'react';
import { analytics } from '@/lib/analytics';

interface SmartVideoProps {
  src: string;
  priority?: boolean; // If true, load immediately (for hero)
  className?: string;
  style?: React.CSSProperties;
  onLoad?: () => void;
  poster?: string; // Optional poster image
  disabled?: boolean;
}

// Global video cache to track loaded videos
const videoCache = new Map<string, boolean>();
const loadingPromises = new Map<string, Promise<void>>();

// Detect network quality for adaptive timeouts
const getNetworkQuality = (): 'fast' | 'slow' | 'unknown' => {
  if (typeof navigator === 'undefined' || !('connection' in navigator)) {
    return 'unknown';
  }
  
  const conn = (navigator as any).connection;
  if (!conn) return 'unknown';
  
  // Check effective type (4g, 3g, 2g, slow-2g)
  if (conn.effectiveType === '4g' || conn.effectiveType === '5g') {
    return 'fast';
  }
  
  if (conn.effectiveType === '3g' || conn.effectiveType === '2g' || conn.effectiveType === 'slow-2g') {
    return 'slow';
  }
  
  // Check downlink speed (Mbps)
  if (conn.downlink && conn.downlink > 5) {
    return 'fast';
  }
  
  if (conn.downlink && conn.downlink < 1.5) {
    return 'slow';
  }
  
  return 'unknown';
};

// Preload a video and cache it
export const preloadVideo = (src: string): Promise<void> => {
  if (videoCache.has(src)) {
    return Promise.resolve();
  }
  
  if (loadingPromises.has(src)) {
    return loadingPromises.get(src)!;
  }
  
  const promise = new Promise<void>((resolve) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.muted = true;
    let hasCompleted = false;

    const cleanup = () => {
      try {
        video.pause();
        video.removeAttribute('src');
        video.load();
      } catch {
        // ignore
      }
    };

    const handleLoaded = () => {
      if (hasCompleted) return;
      hasCompleted = true;
      clearTimeout(timeoutId);
      videoCache.set(src, true);
      loadingPromises.delete(src);
      cleanup();
      resolve();
    };

    const handleError = () => {
      if (hasCompleted) return;
      hasCompleted = true;
      clearTimeout(timeoutId);
      // Still mark as "loaded" to prevent blocking
      videoCache.set(src, true);
      loadingPromises.delete(src);
      cleanup();
      resolve();
    };

    const handleTimeout = () => {
      if (hasCompleted) return;
      hasCompleted = true;
      console.warn(`Preload timeout for: ${src}`);
      // Mark as loaded to prevent blocking
      videoCache.set(src, true);
      loadingPromises.delete(src);
      cleanup();
      resolve();
    };

    // Network-aware timeout for preloading
    const networkQuality = getNetworkQuality();
    const timeoutMs = networkQuality === 'slow' ? 6000 : networkQuality === 'fast' ? 3000 : 4000;
    const timeoutId = setTimeout(handleTimeout, timeoutMs);

    video.addEventListener('loadeddata', handleLoaded, { once: true });
    video.addEventListener('error', handleError, { once: true });

    video.src = src;
    video.load();
  });
  
  loadingPromises.set(src, promise);
  return promise;
};

// Preload multiple videos in sequence (priority first, then others)
export const preloadVideosSequentially = async (
  priorityVideos: string[],
  otherVideos: string[]
): Promise<void> => {
  // Load priority videos first (in parallel)
  await Promise.all(priorityVideos.map(preloadVideo));
  
  // Then load others one by one to not overwhelm bandwidth
  for (const src of otherVideos) {
    await preloadVideo(src);
  }
};

const SmartVideo: React.FC<SmartVideoProps> = ({
  src,
  priority = false,
  className = '',
  style = {},
  onLoad,
  poster,
  disabled = false,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(disabled ? !poster : videoCache.has(src));
  const [isVisible, setIsVisible] = useState(disabled ? false : priority);
  const [hasError, setHasError] = useState(false);
  const loadStartTime = useRef<number>(0);

  // Set video src using ref - React not rendering src attribute properly
  useEffect(() => {
    const video = videoRef.current;
    if (!video || disabled) return;
    
    video.src = src;
    video.load();
  }, [src, disabled]);

  useEffect(() => {
    if (!disabled) return;
    if (!poster) {
      setIsLoaded(true);
      onLoad?.();
    }
  }, [disabled, poster, onLoad]);

  // Aggressively release video decoder/memory when unmounting or when src changes
  useEffect(() => {
    if (disabled) return;
    const video = videoRef.current;
    return () => {
      if (!video) return;
      try {
        video.pause();
        // Detach sources to free iOS decoder buffers
        while (video.firstChild) {
          video.removeChild(video.firstChild);
        }
        video.removeAttribute('src');
        video.load();
      } catch {
        // ignore
      }
    };
  }, [src]);

  // Intersection observer for lazy loading non-priority videos
  useEffect(() => {
    if (disabled) return;
    if (priority) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      {
        threshold: 0,
        rootMargin: '200px', // Start loading 200px before visible
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [priority, disabled]);

  // Load video when visible
  useEffect(() => {
    if (disabled) return;
    if (isLoaded) return;

    const video = videoRef.current;
    if (!video) return;

    // Track load start time
    loadStartTime.current = Date.now();
    let timeoutId: NodeJS.Timeout;
    let hasCompleted = false;

    const handleCanPlay = () => {
      if (hasCompleted) return;
      hasCompleted = true;
      clearTimeout(timeoutId);
      
      const loadTime = Date.now() - loadStartTime.current;
      setIsLoaded(true);
      videoCache.set(src, true);
      onLoad?.();
      
      // Track successful video load
      analytics.videoLoaded(src, loadTime);
      
      // Try to play with exponential backoff
      const tryPlay = (attempts = 0) => {
        video.play()
          .then(() => {
            // Track video playing
            analytics.videoPlaying(src);
          })
          .catch(() => {
            if (attempts < 3) {
              setTimeout(() => tryPlay(attempts + 1), 100 * (attempts + 1));
            }
          });
      };
      tryPlay();
    };

    const handleError = (e: Event) => {
      if (hasCompleted) return;
      hasCompleted = true;
      clearTimeout(timeoutId);
      
      const errorMsg = (e as ErrorEvent).message || 'Unknown error';
      setHasError(true);
      setIsLoaded(true); // Don't block UI
      onLoad?.();
      
      // Track video error
      analytics.videoError(src, errorMsg);
    };

    const handleTimeout = () => {
      if (hasCompleted) return;
      hasCompleted = true;
      
      const loadTime = Date.now() - loadStartTime.current;
      console.warn(`Video load timeout after ${loadTime}ms: ${src}`);
      
      // Force show video anyway - it might still load in background
      setIsLoaded(true);
      videoCache.set(src, true);
      onLoad?.();
      
      // Track timeout as error
      analytics.videoError(src, `Timeout after ${loadTime}ms`);
      
      // Still try to play in case it loads
      const tryPlay = (attempts = 0) => {
        video.play()
          .then(() => {
            analytics.videoPlaying(src);
          })
          .catch(() => {
            if (attempts < 3) {
              setTimeout(() => tryPlay(attempts + 1), 100 * (attempts + 1));
            }
          });
      };
      tryPlay();
    };

    // Network-aware timeout: adjust based on connection quality
    const networkQuality = getNetworkQuality();
    let timeoutMs: number;
    
    if (networkQuality === 'slow') {
      timeoutMs = priority ? 5000 : 8000; // More lenient on slow connections
    } else if (networkQuality === 'fast') {
      timeoutMs = priority ? 2000 : 4000; // Aggressive on fast connections
    } else {
      timeoutMs = priority ? 3000 : 5000; // Default
    }
    
    timeoutId = setTimeout(handleTimeout, timeoutMs);

    video.addEventListener('canplaythrough', handleCanPlay, { once: true });
    video.addEventListener('loadeddata', handleCanPlay, { once: true });
    video.addEventListener('error', handleError, { once: true });

    return () => {
      clearTimeout(timeoutId);
      video.removeEventListener('canplaythrough', handleCanPlay);
      video.removeEventListener('loadeddata', handleCanPlay);
      video.removeEventListener('error', handleError);
    };
  }, [isLoaded, src, onLoad, disabled, priority]);

  return (
    <div ref={containerRef} className="relative w-full h-full">
      {/* Loading skeleton */}
      {!isLoaded && (
        <div 
          className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center overflow-hidden"
          style={style}
        >
          {/* Shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
          <div className="w-10 h-10 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
        </div>
      )}
      
      {/* Error state */}
      {hasError && (
        <div 
          className="absolute inset-0 bg-gray-900 flex items-center justify-center"
          style={style}
        >
          <span className="text-white/50 text-sm">Video unavailable</span>
        </div>
      )}
      
      {disabled ? (
        poster ? (
          <img
            src={poster}
            alt=""
            className={`${className} transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
            style={style}
            loading={priority ? 'eager' : 'lazy'}
            onLoad={() => {
              if (!isLoaded) {
                setIsLoaded(true);
                onLoad?.();
              }
            }}
            onError={() => {
              setHasError(true);
              setIsLoaded(true);
              onLoad?.();
            }}
          />
        ) : null
      ) : (
        <video
          key={src}
          ref={videoRef}
          className={`${className} transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          style={style}
          autoPlay
          loop
          muted
          playsInline
          preload={priority ? 'metadata' : 'none'}
          poster={poster}
        >
          <source src={src} type="video/webm" />
        </video>
      )}
    </div>
  );
};

export default SmartVideo;
