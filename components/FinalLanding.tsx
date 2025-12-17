'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { videoUrls } from '../config/videoUrls';
import SmartVideo, { preloadVideosSequentially } from './SmartVideo';
import { useAnalytics } from '@/hooks/useAnalytics';
import { getDeviceCapabilities, getAnimationConfig } from '@/lib/deviceDetection';

gsap.registerPlugin(ScrollTrigger);

const backgrounds = [
  '/backgrounds/backg1.webp',
  '/backgrounds/backg2.webp',
  '/backgrounds/backg2.webp',
  '/backgrounds/backg3.webp',
  '/backgrounds/backg3.webp',
  '/backgrounds/backg4.webp',
  '/backgrounds/backg5.webp',
  '/backgrounds/backg6.webp',
  '/backgrounds/backg6.webp', // CTA uses same background as section 8
];

const FinalLanding = () => {
  // Initialize analytics
  const analytics = useAnalytics();

  // Detect device capabilities for performance optimization (client-only to avoid hydration errors)
  const [deviceCapabilities, setDeviceCapabilities] = useState({
    isLowEndDevice: false,
    isMobile: false,
    isIOS: false,
    shouldReduceMotion: false,
    maxConcurrentBackgrounds: 3,
    maxConcurrentVideos: 2,
  });
  const [animConfig, setAnimConfig] = useState({
    scrollScrub: 1.2,
    snapDuration: { min: 0.4, max: 1.0 },
    snapDelay: 0.2,
    enableBackgroundTransitions: true,
    enableParallax: true,
    enableBlur: true,
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);

  // Section Refs
  const heroRef = useRef<HTMLDivElement>(null);
  const section2Ref = useRef<HTMLDivElement>(null);
  const section3Ref = useRef<HTMLDivElement>(null);
  const section4Ref = useRef<HTMLDivElement>(null);
  const section5Ref = useRef<HTMLDivElement>(null);
  const section6Ref = useRef<HTMLDivElement>(null);
  const section7Ref = useRef<HTMLDivElement>(null);
  const section8Ref = useRef<HTMLDivElement>(null);
  const section9Ref = useRef<HTMLDivElement>(null);

  const riseTextRef = useRef<HTMLParagraphElement>(null);

  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [activeSection, setActiveSection] = useState(0);
  const [currentNotification, setCurrentNotification] = useState(1);
  const [showLocked, setShowLocked] = useState(false);
  const [disclaimerExpanded, setDisclaimerExpanded] = useState(false);

  // Low-end background handling: keep a single background mounted and only swap after load
  const [lowEndBgIndex, setLowEndBgIndex] = useState(0);
  const loadedBgIndexesRef = useRef<Set<number>>(new Set());
  const bgLoadPromisesRef = useRef<Map<number, Promise<void>>>(new Map());
  const pendingLowEndBgIndexRef = useRef<number>(0);

  // Non-low-end background tracking so our rendered layers always include the GSAP-selected bgIndex
  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  const currentBgIndexRef = useRef(0);

  // Helper function to scroll to a specific section (0-8)
  const scrollToSection = (sectionIndex: number) => {
    const container = containerRef.current;
    if (!container) return;

    // Geometry-based mapping from section index to scroll position:
    // progress 0 => container top aligned with viewport top
    // progress 1 => container bottom aligned with viewport bottom
    const rect = container.getBoundingClientRect();
    const containerTop = rect.top + window.scrollY;
    const containerHeight = rect.height;
    const viewportHeight = window.innerHeight;

    const scrollRange = containerHeight - viewportHeight;
    if (scrollRange <= 0) return;

    // Section indices map linearly onto the 0–1 ScrollTrigger progress
    const totalSections = 9;
    const segment = 1 / totalSections;

    let targetProgress: number;
    if (sectionIndex <= 0) {
      targetProgress = 0;
    } else if (sectionIndex >= totalSections - 1) {
      targetProgress = 1;
    } else {
      // Use the center of the section (e.g. section 1 -> 1.5/9)
      targetProgress = (sectionIndex + 0.5) * segment;
    }
    const targetScroll = containerTop + scrollRange * targetProgress;

    // Use GSAP tween so ScrollTrigger-driven cross-fades animate smoothly
    const startScroll = window.scrollY;
    const distance = targetScroll - startScroll;

    if (Math.abs(distance) < 2) return; // already effectively there

    const tweenState = { value: 0 };
    gsap.to(tweenState, {
      value: 1,
      duration: 1.4,
      ease: 'power2.inOut',
      onUpdate: () => {
        const next = startScroll + distance * tweenState.value;
        window.scrollTo({ top: next });
      },
      onComplete: () => {
        // Ensure we land exactly on the computed target
        window.scrollTo({ top: targetScroll });
      }
    });
  };

  // Detect device capabilities on mount (client-only)
  useEffect(() => {
    const capabilities = getDeviceCapabilities();
    setDeviceCapabilities(capabilities);
    setAnimConfig(getAnimationConfig(capabilities));

    // Emergency memory cleanup for Safari crashes
    if (capabilities.isIOS) {
      // Listen for memory warnings on iOS
      const handleMemoryWarning = () => {
        console.warn('Memory warning detected - cleaning up');
        // Force garbage collection by clearing caches
        ScrollTrigger.getAll().forEach(st => st.kill());
        gsap.globalTimeline.clear();
      };

      // iOS fires pagehide before crash
      window.addEventListener('pagehide', handleMemoryWarning);
      
      return () => {
        window.removeEventListener('pagehide', handleMemoryWarning);
      };
    }
  }, []);

  // Low-end iOS: progressively preload backgrounds and only swap once the new background is loaded
  useEffect(() => {
    if (!deviceCapabilities.shouldReduceMotion) return;

    const targetIndex = Math.max(0, Math.min(activeSection, backgrounds.length - 1));
    const prefetchIndex = Math.max(0, Math.min(targetIndex + 1, backgrounds.length - 1));

    pendingLowEndBgIndexRef.current = targetIndex;

    const ensureLoaded = (index: number): Promise<void> => {
      if (loadedBgIndexesRef.current.has(index)) {
        return Promise.resolve();
      }

      const existing = bgLoadPromisesRef.current.get(index);
      if (existing) return existing;

      const promise = new Promise<void>((resolve) => {
        const img = new window.Image();
        const done = () => {
          loadedBgIndexesRef.current.add(index);
          bgLoadPromisesRef.current.delete(index);
          resolve();
        };
        img.onload = done;
        img.onerror = done;
        img.src = backgrounds[index];
      });

      bgLoadPromisesRef.current.set(index, promise);
      return promise;
    };

    // Load the target background; switch only after it's ready
    ensureLoaded(targetIndex).then(() => {
      if (pendingLowEndBgIndexRef.current === targetIndex) {
        setLowEndBgIndex(targetIndex);
      }
    });

    // Prefetch next section background in the background
    void ensureLoaded(prefetchIndex);
  }, [activeSection, deviceCapabilities.shouldReduceMotion]);

  // Track section changes
  useEffect(() => {
    const sectionNames = [
      'Hero',
      'Expert Coaches',
      'Daily Check-ins',
      'Notifications',
      'Privacy First',
      'Rise',
      'Testimonials',
      'Reviews',
      'CTA'
    ];
    
    if (activeSection >= 0 && activeSection < sectionNames.length) {
      analytics.sectionVisible(activeSection, sectionNames[activeSection]);
    }
  }, [activeSection, analytics]);

  // Configure GSAP for low-end device optimization
  useEffect(() => {
    if (deviceCapabilities.shouldReduceMotion) {
      // Reduce ScrollTrigger refresh rate on low-end devices to prevent crashes
      ScrollTrigger.config({
        autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load', // Disable resize refresh
        limitCallbacks: true, // Throttle callbacks
      });
    }
  }, [deviceCapabilities]);

  // Preload images first (critical for initial render)
  useEffect(() => {
    // On low-end devices, only preload hero background + coaches to prevent crash
    const imagesToPreload = deviceCapabilities.shouldReduceMotion
      ? [
          backgrounds[0], // Only hero background
          '/coaches/c1.png',
          '/coaches/c2.png',
          '/coaches/c3.png',
        ]
      : [
          ...backgrounds,
          '/coaches/c1.png',
          '/coaches/c2.png',
          '/coaches/c3.png',
          '/coaches/c4.png',
          '/coaches/c5.png',
          '/coaches/c6.png',
        ];

    let loadedCount = 0;
    const totalImages = imagesToPreload.length;

    // Shorter minimum time - just enough to prevent flash
    const minDisplayTime = setTimeout(() => {
      // After 1.5s, show content even if not everything is loaded
      setImagesLoaded(true);
    }, 1500);

    imagesToPreload.forEach((src) => {
      const img = new window.Image();
      img.onload = () => {
        loadedCount++;
        if (loadedCount === totalImages) {
          clearTimeout(minDisplayTime);
          setImagesLoaded(true);
        }
      };
      img.onerror = () => {
        loadedCount++;
        if (loadedCount === totalImages) {
          clearTimeout(minDisplayTime);
          setImagesLoaded(true);
        }
      };
      img.src = src;
    });

    return () => clearTimeout(minDisplayTime);
  }, [deviceCapabilities]);

  // Preload videos progressively AFTER images are loaded
  // Hero video first, then others in background
  useEffect(() => {
    if (!imagesLoaded) return;

    // On low-end devices, only preload the hero video to conserve memory
    if (deviceCapabilities.shouldReduceMotion) {
      preloadVideosSequentially(
        [videoUrls.video1], // Only hero video on low-end devices
        [] // Skip preloading other videos
      );
    } else {
      // Start preloading videos in the background
      // Hero video (video1) gets priority, others load sequentially
      preloadVideosSequentially(
        [videoUrls.video1], // Priority: hero video
        [videoUrls.video2, videoUrls.video3, videoUrls.video4, videoUrls.video5] // Others (no video6, lock now uses images)
      );
    }
  }, [imagesLoaded, deviceCapabilities]);

  // Cycle through notification groups when in section 5
  useEffect(() => {
    if (activeSection === 5) {
      const interval = setInterval(() => {
        setCurrentNotification(prev => prev === 1 ? 2 : 1); // Toggle between group 1 and 2
      }, 8000); // Change notification every 8 seconds (longer stay)

      return () => clearInterval(interval);
    }
  }, [activeSection]);

  useEffect(() => {
    if (activeSection === 7) {
      const timer = setTimeout(() => {
        setShowLocked(true);
      }, 900);

      return () => {
        clearTimeout(timer);
        setShowLocked(false);
      };
    } else {
      setShowLocked(false);
    }
  }, [activeSection]);

  // Smooth background transitions and Section animations with GSAP
  useEffect(() => {
    if (!imagesLoaded) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: animConfig.scrollScrub, // Device-optimized scrub value
        snap: {
          snapTo: (progress) => {
            // Don't snap at the very start (prevents auto-scroll on load)
            if (progress < 0.01) {
              return 0;
            }
            
            // Get current scroll velocity
            const velocity = Math.abs(ScrollTrigger.getById('main-scroll')?.getVelocity() || 0);

            // If scrolling very fast, don't snap - let user fly through
            if (velocity > 200) {
              return progress;
            }

            // Define section center points for snapping
            const totalSections = 9;
            const segment = 1 / totalSections;

            const snapPoints = Array.from({ length: totalSections }, (_, index) => {
              if (index === 0) return 0;          // Hero pinned at top
              if (index === totalSections - 1) return 1; // CTA pinned at end
              return (index + 0.5) * segment;    // Centers for middle sections
            });

            // Snap to the closest section center
            const targetSnap = snapPoints.reduce((prev, curr) =>
              Math.abs(curr - progress) < Math.abs(prev - progress) ? curr : prev
            );

            return targetSnap;
          },
          duration: animConfig.snapDuration, // Device-optimized snap duration
          delay: animConfig.snapDelay, // Device-optimized snap delay
          ease: "power2.inOut"
        },
        id: 'main-scroll', // Give it an ID so we can reference it for velocity
        onUpdate: (self) => {
          const progress = self.progress;

          // Update Active Section (0-7) for conditional rendering of heavy components
          // We use a slight buffer to ensure we don't flicker at boundaries
          const newSection = Math.min(Math.floor(progress * 9), 8);
          setActiveSection((prev) => (prev !== newSection ? newSection : prev));

          // Debug log for section 5 (rise section)
          if (newSection === 5) {
            console.log('Section 5 active - checking text opacity');
            if (riseTextRef.current) {
              const style = window.getComputedStyle(riseTextRef.current);
              const opacity = style.opacity;
              const transform = style.transform;
              console.log('Text debug - opacity:', opacity, 'transform:', transform);
            }
          }

          // --- Background Logic ---
          // On low-end devices, we use a single background layer driven by activeSection
          // (handled in a separate effect) to avoid flicker/dark frames when an image isn't loaded yet.
          if (!deviceCapabilities.shouldReduceMotion) {
            const exactBgIndex = progress * (backgrounds.length - 1);
            const bgIndex = Math.floor(exactBgIndex);
            const nextBgIndex = Math.min(bgIndex + 1, backgrounds.length - 1);

            // Keep render window centered on the GSAP-driven background index (prevents dark flashes)
            if (currentBgIndexRef.current !== bgIndex) {
              currentBgIndexRef.current = bgIndex;
              setCurrentBgIndex(bgIndex);
            }

            if (backgroundRef.current && animConfig.enableBackgroundTransitions) {
              backgrounds.forEach((_, index) => {
                const bg = backgroundRef.current!.querySelector(`[data-bg="${index}"]`) as HTMLElement;
                if (bg) gsap.set(bg, { opacity: 0 });
              });

              const currentBg = backgroundRef.current.querySelector(`[data-bg="${bgIndex}"]`) as HTMLElement;
              const nextBg = backgroundRef.current.querySelector(`[data-bg="${nextBgIndex}"]`) as HTMLElement;

              if (currentBg && nextBg && bgIndex !== nextBgIndex) {
                const bgProgress = exactBgIndex - bgIndex;
                const delayedStart = 0.20;
                const delayedEnd = 0.80;
                const transitionWindow = delayedEnd - delayedStart;

                let adjustedProgress = 0;
                if (bgProgress < delayedStart) {
                  adjustedProgress = 0;
                } else if (bgProgress > delayedEnd) {
                  adjustedProgress = 1;
                } else {
                  const normalizedProgress = (bgProgress - delayedStart) / transitionWindow;
                  adjustedProgress = gsap.parseEase('power1.inOut')(normalizedProgress);
                }

                gsap.set(currentBg, { opacity: 1 - adjustedProgress });
                gsap.set(nextBg, { opacity: adjustedProgress });
              } else if (currentBg) {
                gsap.set(currentBg, { opacity: 1 });
              }
            }
          }

          // --- Helper Functions for Section Animations ---
          const getSectionOpacity = (sectionStart: number, sectionEnd: number) => {
            if (progress < sectionStart || progress >= sectionEnd) return 0;

            const sectionDuration = sectionEnd - sectionStart;
            // Wider fade regions so cross-fades are more visible
            const fadeInEnd = sectionStart + sectionDuration * 0.25;
            const fadeOutStart = sectionEnd - sectionDuration * 0.25;

            if (progress < fadeInEnd) {
              return gsap.utils.mapRange(sectionStart, fadeInEnd, 0, 1, progress);
            } else if (progress > fadeOutStart) {
              return 1 - gsap.utils.mapRange(fadeOutStart, sectionEnd, 0, 1, progress);
            }
            return 1;
          };

          // --- Apply Animations to Sections ---

          // Section 1: Hero (0 - 1/9)
          if (heroRef.current) {
            // Custom logic for Hero from original: fade out only
            const opacity = progress <= 1 / 9 ? (progress < 0.07 ? 1 : 1 - gsap.utils.mapRange(0.07, 1 / 9, 0, 1, progress)) : 0;
            heroRef.current.style.opacity = String(opacity);
            heroRef.current.style.pointerEvents = progress < 1 / 9 ? 'auto' : 'none';
          }

          // Section 2: Network (1/9 - 2/9)
          if (section2Ref.current) {
            const start = 1 / 9, end = 2 / 9;
            const opacity = getSectionOpacity(start, end);
            section2Ref.current.style.opacity = String(opacity);
            section2Ref.current.style.pointerEvents = progress >= start && progress < end ? 'auto' : 'none';

            // Transform logic for text content (first child)
            const textContent = section2Ref.current.querySelector('.text-content') as HTMLElement;
            if (textContent) {
              textContent.style.transform = progress >= start && progress < end ? 'translateY(0px) scale(1)' : 'translateY(30px) scale(0.95)';
            }
          }

          // Section 3: Understanding (2/9 - 3/9)
          if (section3Ref.current) {
            const start = 2 / 9, end = 3 / 9;
            section3Ref.current.style.opacity = String(getSectionOpacity(start, end));
            section3Ref.current.style.pointerEvents = progress >= start && progress < end ? 'auto' : 'none';

            const leftCol = section3Ref.current.querySelector('.left-col') as HTMLElement;
            const rightCol = section3Ref.current.querySelector('.right-col') as HTMLElement;
            const centerVideo = section3Ref.current.querySelector('.center-video') as HTMLElement;

            const isActive = progress >= start && progress < end;
            if (leftCol) leftCol.style.transform = isActive ? 'translateX(0) scale(1)' : 'translateX(-30px) scale(0.95)';
            if (rightCol) rightCol.style.transform = isActive ? 'translateX(0) scale(1)' : 'translateX(30px) scale(0.95)';
            if (centerVideo) centerVideo.style.transform = isActive ? 'scale(1)' : 'scale(0.9)';
          }

          // Section 4: Insights (3/9 - 4/9)
          if (section4Ref.current) {
            const start = 3 / 9, end = 4 / 9;
            section4Ref.current.style.opacity = String(getSectionOpacity(start, end));
            section4Ref.current.style.pointerEvents = progress >= start && progress < end ? 'auto' : 'none';

            const leftCol = section4Ref.current.querySelector('.left-col') as HTMLElement;
            const rightCol = section4Ref.current.querySelector('.right-col') as HTMLElement;
            const centerVideo = section4Ref.current.querySelector('.center-video') as HTMLElement;

            const isActive = progress >= start && progress < end;
            if (leftCol) leftCol.style.transform = isActive ? 'translateX(0) scale(1)' : 'translateX(-30px) scale(0.95)';
            if (rightCol) rightCol.style.transform = isActive ? 'translateX(0) scale(1)' : 'translateX(30px) scale(0.95)';
            if (centerVideo) centerVideo.style.transform = isActive ? 'scale(1)' : 'scale(0.9)';
          }

          // Section 5: Strategies (4/9 - 5/9)
          if (section5Ref.current) {
            const start = 4 / 9, end = 5 / 9;
            section5Ref.current.style.opacity = String(getSectionOpacity(start, end));
            section5Ref.current.style.pointerEvents = progress >= start && progress < end ? 'auto' : 'none';

            const leftCol = section5Ref.current.querySelector('.left-col') as HTMLElement;
            const rightCol = section5Ref.current.querySelector('.right-col') as HTMLElement;
            const centerVideo = section5Ref.current.querySelector('.center-video') as HTMLElement;

            const isActive = progress >= start && progress < end;
            if (leftCol) leftCol.style.transform = isActive ? 'translateX(0) scale(1)' : 'translateX(-30px) scale(0.95)';
            if (rightCol) rightCol.style.transform = isActive ? 'translateX(0) scale(1)' : 'translateX(30px) scale(0.95)';
            if (centerVideo) centerVideo.style.transform = isActive ? 'scale(1)' : 'scale(0.9)';
          }

          // Section 6: Rise (5/9 - 6/9)
          if (section6Ref.current) {
            const start = 5 / 9, end = 6 / 9;
            section6Ref.current.style.opacity = String(getSectionOpacity(start, end));
            const isActive = progress >= start && progress < end;
            section6Ref.current.style.pointerEvents = isActive ? 'auto' : 'none';

            // Animate heading ("Rise with" + "daily guidance") together
            const heading = section6Ref.current.querySelector('.rise-heading') as HTMLElement;
            if (heading) {
              // Finish the rise animation in the first ~25% of the section scroll
              const animEnd = start + (end - start) * 0.25;
              const localProgress = gsap.utils.clamp(
                0,
                1,
                gsap.utils.mapRange(start, animEnd, 0, 1, progress)
              );
              const eased = gsap.parseEase('power2.out')(localProgress);
              const y = 40 * (1 - eased);
              heading.style.transform = `translateY(${y}px)`;
            }

            // Keep text paragraph static and fully visible
            if (riseTextRef.current) {
              riseTextRef.current.style.opacity = "1";
              riseTextRef.current.style.transform = "translateY(0px)";
            }
          }

          // Section 7: Reviews (6/9 - 7/9)
          if (section7Ref.current) {
            const start = 6 / 9, end = 7 / 9;
            section7Ref.current.style.opacity = String(getSectionOpacity(start, end));
            section7Ref.current.style.pointerEvents = progress >= start && progress < end ? 'auto' : 'none';

            // The paragraph inside reviews has specific opacity logic
            const pText = section7Ref.current.querySelector('.reviews-text') as HTMLElement;
            if (pText) {
              const pVal = progress >= start && progress < end
                ? gsap.utils.mapRange(start, start + 0.1, 0, 1, Math.min(progress, start + 0.1))
                : 0;
              pText.style.opacity = String(pVal);
            }
          }

          // Section 8: Privacy (7/9 - 8/9)
          if (section8Ref.current) {
            const start = 7 / 9, end = 8 / 9;
            section8Ref.current.style.opacity = String(getSectionOpacity(start, end));
            section8Ref.current.style.pointerEvents = progress >= start && progress < end ? 'auto' : 'none';
          }

          // Section 9: CTA (8/9 - 1) - stays visible at end
          if (section9Ref.current) {
            const start = 8 / 9;
            const isActive = progress >= start;
            
            // Fade in and STAY fully visible (no fade out)
            let opacity = 0;
            if (isActive) {
              // Quick fade in, then stay at 1
              opacity = Math.min((progress - start) * 18, 1); // Faster fade in
            }
            
            section9Ref.current.style.opacity = String(opacity);
            section9Ref.current.style.pointerEvents = isActive ? 'auto' : 'none';
            
            // Animate the content - settle into final position
            const ctaInner = section9Ref.current.querySelector('.cta-inner') as HTMLElement;
            if (ctaInner) {
              const animProgress = Math.min((progress - start) * 18, 1);
              const scale = 0.95 + 0.05 * animProgress;
              const y = 30 - 30 * animProgress;
              ctaInner.style.transform = `translateY(${y}px) scale(${scale})`;
            }
          }
        }
      });
    });

    return () => ctx.revert();
  }, [imagesLoaded, animConfig]);

  const coaches = [
    { id: 1, img: '/coaches/c1.png', delay: 0 },
    { id: 2, img: '/coaches/c2.png', delay: 0.4 },
    { id: 3, img: '/coaches/c3.png', delay: 0.8 },
    { id: 4, img: '/coaches/c4.png', delay: 1.2 },
    { id: 5, img: '/coaches/c5.png', delay: 1.6 },
    { id: 6, img: '/coaches/c6.png', delay: 2.0 },
  ];

  const reviews = [
    {
      name: "Maya, 32, Berlin",
      category: "Personal Growth & Clarity",
      text: "SeeMe helped me connect the dots in my life. It's like having a calm, intelligent coach who actually remembers me and keeps me focused.",
      rating: 5
    },
    {
      name: "Daniel, 29, Toronto",
      category: "Privacy & Safety",
      text: "I never realized how much I held back with other AI tools until SeeMe. Knowing my data stays mine changes everything. I can actually be honest.",
      rating: 5
    },
    {
      name: "Lina, 27, San Francisco",
      category: "Daily Reflection & Balance",
      text: "The morning check-ins are my favorite part of the day. They keep me grounded and remind me to slow down before things spiral.",
      rating: 5
    },
    {
      name: "Sophie, 41, London",
      category: "Expert-Guided Coaching Feel",
      text: "It feels like talking to a real mentor. Thoughtful questions, real structure, and gentle accountability without pressure.",
      rating: 5
    },
    {
      name: "Arjun, 35, Mumbai",
      category: "Emotional Connection & Trust",
      text: "SeeMe listens in a way no app ever has. It doesn't just respond. It understands where I am and helps me grow from there.",
      rating: 5
    },
    {
      name: "Isabella, 30, New York",
      category: "Intelligent Questions / Deep Understanding",
      text: "It's wild how well SeeMe knows me now. The questions it asks cut right to the heart of what I'm feeling. Like it sees what I can't yet name.",
      rating: 5
    }
  ];

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-black">
      {/* Background - fixed, extends into safe areas */}
      {/* Only render backgrounds near the active section to reduce GPU memory */}
      <div 
        ref={backgroundRef}
        className="fixed z-0 pointer-events-none"
        style={{
          top: 'calc(-1 * env(safe-area-inset-top, 0px))',
          right: 'calc(-1 * env(safe-area-inset-right, 0px))',
          bottom: 'calc(-1 * env(safe-area-inset-bottom, 0px))',
          left: 'calc(-1 * env(safe-area-inset-left, 0px))',
          width: 'calc(100% + env(safe-area-inset-left, 0px) + env(safe-area-inset-right, 0px))',
          height: 'calc(100% + env(safe-area-inset-top, 0px) + env(safe-area-inset-bottom, 0px))',
        }}
        aria-hidden="true"
      >
        {deviceCapabilities.shouldReduceMotion ? (
          <div
            data-bg="low-end"
            className="absolute inset-0"
            style={{
              opacity: 1,
              backgroundImage: `url(${backgrounds[lowEndBgIndex] || backgrounds[0]})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        ) : (
          backgrounds.map((bg, index) => {
            // Limit concurrent background layers, but keep window centered on currentBgIndex
            const maxDistance = deviceCapabilities.maxConcurrentBackgrounds - 1;
            const shouldRender = Math.abs(index - currentBgIndex) <= maxDistance || index === 0;
            if (!shouldRender) return null;

            return (
              <div
                key={`bg-${index}`}
                data-bg={index}
                className="absolute inset-0"
                style={{
                  opacity: index === 0 ? 1 : 0,
                  backgroundImage: `url(${bg})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  willChange: index === currentBgIndex ? 'opacity' : 'auto',
                  backfaceVisibility: 'hidden',
                }}
              />
            );
          })
        )}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div ref={containerRef} className="h-[1800vh] w-screen max-w-full relative z-10 overflow-x-hidden">
        
        {/* Fixed viewport container */}
        <div className="fixed inset-0 w-screen max-w-full" style={{ overflow: 'clip' }}>

        {/* Section 1 - Hero with SeeMe */}
        <div
          ref={heroRef}
          className="absolute inset-0 flex items-center justify-center"
          style={{ opacity: 1, pointerEvents: 'auto' }}
        >
          <div
            className="relative z-10 flex flex-col items-center justify-center px-4 md:px-8"
            style={{ gap: 'clamp(1.5rem, 3vh, 3rem)' }}
          >
            {/* Text Group */}
            <div
            className="flex flex-col items-center flex-shrink-0"
          >
            {/* Title */}
            <h1
              className="font-black tracking-tight text-white"
              style={{
                fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
                fontWeight: 900,
                fontSize: 'clamp(4.5rem, 16vw, 9rem)',
                marginBottom: 'clamp(0.25rem, 0.5vh, 0.75rem)'
              }}
            >
              SeeMe
              </h1>

              {/* Subtitle */}
              <p
                className="text-white/90 text-center px-4 whitespace-nowrap font-medium"
                style={{
                  fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
                  fontSize: 'clamp(0.875rem, 2.5vw, 1.6rem)'
                }}
              >
                Private personal intelligence for your growth
              </p>
            </div>

            {/* Video Mockup Container */}
            <div
              className="relative rounded-[30px] border-4 border-white/30 bg-black shadow-lg overflow-hidden flex-shrink-0"
              style={{
                width: '240px',
                height: '528px',
                aspectRatio: '240 / 528',
                marginTop: 'clamp(0.5rem, 1vh, 1.5rem)'
              }}
            >
              {(!deviceCapabilities.shouldReduceMotion || activeSection === 0) && (
                <SmartVideo
                  src={videoUrls.video1}
                  priority={true}
                  className="rounded-[28px]"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center 45%'
                  }}
                />
              )}
            </div>

            {/* Scroll Indicator */}
            <motion.div
              className="flex flex-col items-center gap-2 cursor-pointer mt-4 md:mt-1"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 0.6 }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95, y: 1 }}
              onClick={() => {
                analytics.scrollIndicatorClick();
                scrollToSection(1); // Scroll to section 2 (index 1)
              }}
            >
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="opacity-70"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Section 2 - Your Network of Expert Coaches */}
        <div
          ref={section2Ref}
          className="absolute inset-0 flex items-center justify-center"
          style={{ opacity: 0, pointerEvents: 'none' }}
        >
          {/* Centered group container */}
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-20 px-4 md:-translate-x-12">
            {/* Text content - Desktop: all together, Mobile: heading only */}
            <div
              className="text-center text-content w-full md:w-auto md:max-w-sm md:mb-0"
            >
              <h2
                className="text-3xl md:text-5xl text-white/80 leading-[1.1]"
                style={{ fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif', fontWeight: 600 }}
              >
                Your network of<br />
                <span className="text-white font-bold">
                  expert coaches
                </span>
              </h2>
              {/* Desktop paragraph - hidden on mobile */}
              <p
                className="hidden md:block text-white/90 text-lg mt-6 font-normal"
                style={{
                  fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
                }}
              >
                Crafted with <span className="text-white font-semibold">real coaches and therapists</span>, supporting life, work, wellness, and mindset.
              </p>
            </div>

            {/* Video mockup */}
            <div className="relative rounded-[32px] border-4 border-white/30 bg-black shadow-lg overflow-hidden w-[240px] h-[520px] md:w-[280px] md:h-[615px] flex-shrink-0">
              {((deviceCapabilities.shouldReduceMotion && activeSection === 1) || (!deviceCapabilities.shouldReduceMotion && (activeSection === 0 || activeSection === 1 || activeSection === 2))) && (
                <SmartVideo
                  src={videoUrls.video2}
                  className="w-full h-full object-cover rounded-[28px]"
                  style={{ objectPosition: 'center 45%' }}
                />
              )}

              <AnimatePresence>
                {activeSection === 1 && coaches.map((coach, index) => {
                  const angle = (index / coaches.length) * Math.PI * 2;
                  const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 1024;
                  const radius = isDesktop ? 700 : 360;
                  const startX = Math.cos(angle) * radius;
                  const startY = Math.sin(angle) * radius;
                  const duration = isDesktop ? 3.2 : 2.5;

                  return (
                    <motion.div
                      key={coach.id}
                      initial={{
                        x: startX,
                        y: startY,
                        opacity: 0,
                        scale: 0.8
                      }}
                      animate={{
                        x: [startX, 0],
                        y: [startY, 0],
                        opacity: [0, 1, 1, 0],
                        scale: [0.8, 1, 0.6, 0.3]
                      }}
                      transition={{
                        duration,
                        delay: coach.delay + 0.3,
                        ease: "easeInOut",
                        times: [0, 0.4, 0.8, 1]
                      }}
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 md:w-20 md:h-20 pointer-events-none"
                    >
                      <div className="relative w-full h-full rounded-full border-4 border-white shadow-lg overflow-hidden">
                        <Image
                          src={coach.img}
                          alt={`Coach ${coach.id}`}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Mobile paragraph - shown below video */}
            <p
              className="md:hidden text-white/90 text-sm text-center font-normal px-2"
              style={{ fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif' }}
            >
              Crafted with <span className="text-white font-semibold">real coaches and therapists</span>, supporting life, work, wellness, and mindset.
            </p>
          </div>
        </div>

        {/* Section 3 - Coaches that really KNOW you */}
        <div
          ref={section3Ref}
          className="absolute inset-0 flex items-center justify-center transition-opacity duration-500"
          style={{ opacity: 0, pointerEvents: 'none' }}
        >
          {/* Centered group container */}
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-20 px-4 md:-translate-x-12">
            {/* Text content */}
            <div
              className="text-center w-full md:w-auto md:max-w-sm md:mb-0"
            >
              <h2
                className="text-3xl md:text-5xl text-white/80 leading-[1.1]"
                style={{ fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif', fontWeight: 600 }}
              >
                Coaches that<br />
                <span className="text-white font-bold">
                  truly understand you
                </span>
              </h2>
              {/* Desktop paragraph */}
              <p
                className="hidden md:block text-white/90 text-lg mt-6 font-normal"
                style={{ fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif' }}
              >
                Learning from your <span className="text-white font-semibold">sessions, reflections, calendar, health,</span> and <span className="text-white font-semibold">screen time</span> patterns.
              </p>
            </div>

            {/* Video mockup */}
            <div className="relative rounded-[32px] border-4 border-white/30 bg-black shadow-lg overflow-hidden w-[240px] h-[520px] md:w-[280px] md:h-[615px] flex-shrink-0">
              {((deviceCapabilities.shouldReduceMotion && activeSection === 2) || (!deviceCapabilities.shouldReduceMotion && (activeSection === 1 || activeSection === 2 || activeSection === 3))) && (
                <SmartVideo
                  src={videoUrls.video3}
                  className="w-full h-full object-cover rounded-[28px]"
                  style={{ objectPosition: 'center 45%' }}
                />
              )}
            </div>

            {/* Mobile paragraph */}
            <p
              className="md:hidden text-white/90 text-sm text-center font-normal px-2"
              style={{ fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif' }}
            >
              Learning from your <span className="text-white font-semibold">sessions, reflections, calendar, health,</span> and <span className="text-white font-semibold">screen time</span> patterns.
            </p>
          </div>
        </div>

        {/* Section 4 - Unparalleled insights */}
        <div
          ref={section4Ref}
          className="absolute inset-0 flex items-center justify-center"
          style={{ opacity: 0, pointerEvents: 'none' }}
        >
          {/* Centered group container */}
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-20 px-4 md:-translate-x-12">
            {/* Text content */}
            <div
              className="text-center w-full md:w-auto md:max-w-sm md:mb-0"
            >
              <h2
                className="text-3xl md:text-5xl text-white/80 leading-[1.1]"
                style={{
                  fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
                  fontWeight: 600
                }}
              >
                <span className="text-white font-bold">
                  Unparalleled insights
                </span><br />
                from your life
              </h2>
              {/* Desktop paragraph */}
              <p
                className="hidden md:block text-white/90 text-lg mt-6 font-normal"
                style={{ fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif' }}
              >
                Ask anything. SeeMe <span className="text-white font-semibold">reveals patterns</span>, <span className="text-white font-semibold">highlights blind spots</span>, and guides you when it matters.
              </p>
            </div>

            {/* Video mockup */}
            <div className="relative rounded-[32px] border-4 border-white/30 bg-black shadow-lg overflow-hidden w-[240px] h-[520px] md:w-[280px] md:h-[615px] flex-shrink-0">
              {((deviceCapabilities.shouldReduceMotion && activeSection === 3) || (!deviceCapabilities.shouldReduceMotion && (activeSection === 2 || activeSection === 3 || activeSection === 4))) && (
                <SmartVideo
                  src={videoUrls.video4}
                  className="w-full h-full object-cover rounded-[28px]"
                  style={{ objectPosition: 'center center' }}
                />
              )}
            </div>

            {/* Mobile paragraph */}
            <p
              className="md:hidden text-white/90 text-sm text-center font-normal px-2"
              style={{ fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif' }}
            >
              Ask anything. SeeMe <span className="text-white font-semibold">reveals patterns</span>, <span className="text-white font-semibold">highlights blind spots</span>, and guides you when it matters.
            </p>
          </div>
        </div>

        {/* Section 5 - Expert Strategies */}
        <div
          ref={section5Ref}
          className="absolute inset-0 flex items-center justify-center transition-opacity duration-500"
          style={{ opacity: 0, pointerEvents: 'none' }}
        >
          {/* Centered group container */}
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-20 px-4 md:-translate-x-12">
            {/* Text content */}
            <div
              className="text-center w-full md:w-auto md:max-w-sm md:mb-0"
            >
              <h2
                className="text-3xl md:text-5xl text-white/80 leading-[1.1]"
                style={{
                  fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
                  fontWeight: 600
                }}
              >
                <span className="text-white font-bold">
                  Expert strategies,
                </span><br />
                tailored to you
              </h2>
              {/* Desktop paragraph */}
              <p
                className="hidden md:block text-white/90 text-lg mt-6 font-normal"
                style={{ fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif' }}
              >
                <span className="text-white font-semibold">Evidence-based methods</span> and guided sessions, adapted to your goals and daily reality.
              </p>
            </div>

            {/* Video mockup */}
            <div className="relative rounded-[32px] border-4 border-white/30 bg-black shadow-lg overflow-hidden w-[240px] h-[520px] md:w-[280px] md:h-[615px] flex-shrink-0">
              {((deviceCapabilities.shouldReduceMotion && activeSection === 4) || (!deviceCapabilities.shouldReduceMotion && (activeSection === 3 || activeSection === 4 || activeSection === 5))) && (
                <SmartVideo
                  src={videoUrls.video5}
                  className="w-full h-full object-cover rounded-[28px]"
                  style={{ objectPosition: 'center 45%' }}
                />
              )}
            </div>

            {/* Mobile paragraph */}
            <p
              className="md:hidden text-white/90 text-sm text-center font-normal px-2"
              style={{ fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif' }}
            >
              <span className="text-white font-semibold">Evidence-based methods</span> and guided sessions, adapted to your goals and daily reality.
            </p>
          </div>
        </div>

        {/* Section 6 - So you can RISE */}
        <div
          ref={section6Ref}
          className="absolute inset-0 flex items-start justify-center pt-32"
          style={{ opacity: 0, pointerEvents: 'none' }}
        >
          <div className="relative z-10 text-center px-4 w-full max-w-7xl mx-auto ">
            <h2
              className="rise-heading text-4xl md:text-7xl text-white/80 leading-[1.1] transition-all duration-1000 ease-out"
              style={{
                fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
                fontWeight: 400,
              }}
            >
              Rise with<br />
              <span className="text-white font-black inline-block">
                daily guidance
              </span>
            </h2>
            <p
              ref={riseTextRef}
              className="text-white/90 text-base md:text-xl max-w-2xl mx-auto mt-6 font-normal"
              style={{
                fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
              }}
            >
              Timely boosts and reminders aligned with your <span className="text-white font-semibold">mood, energy, and intentions.</span>
            </p>
          </div>

          {/* Notification Images - iOS-style below text for mobile, scattered for desktop */}
          {activeSection === 5 && (
            <>
              {/* Mobile: 3 notifications in vertical stack, below the text */}
              <div className="absolute inset-0 pointer-events-none block md:hidden flex items-end justify-center pb-20">
                <div className="flex flex-col gap-3 items-center">
                  <AnimatePresence>
                    {activeSection === 5 && [0, 1, 2].map((offset, idx) => {
                      const notifNum = currentNotification === 1 ? [1, 3, 5][offset] : [2, 4, 6][offset];
                      return (
                        <motion.div
                          key={`${currentNotification}-${offset}`}
                          variants={{
                            enter: { opacity: 1, scale: 1 },
                            exit: { opacity: 0, scale: 0.95 }
                          }}
                          initial="exit"
                          animate="enter"
                          exit="exit"
                          transition={{
                            duration: 0.3, // Quick for both enter and exit
                            ease: "easeOut"
                          }}
                          className="w-[98%] max-w-[420px]"
                        >
                          <Image
                            src={`/notifications/notif${notifNum}.png`}
                            alt="Notification"
                            width={350}
                            height={110}
                            className=" w-full h-auto"
                          />
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              </div>

              {/* Desktop: Better notification layout */}
              <div className="absolute inset-0 pointer-events-none hidden md:block">
                {/* Notification container - ensures all notifications stay within bounds */}
                <div className="absolute inset-x-8 inset-y-16 max-w-6xl mx-auto">
                  {/* Top notifications row */}
                  <div className="absolute top-8 left-0 right-0 flex justify-between px-12">
                    <motion.div
                      initial={{ opacity: 0, y: -50, scale: 0.8 }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        scale: 1
                      }}
                      transition={{
                        duration: 0.6,
                        delay: 0,
                        ease: [0.34, 1.56, 0.64, 1]
                      }}
                      className="pointer-events-none z-20"
                    >
                      <Image
                        src="/notifications/notif5.png"
                        alt="Notification"
                        width={320}
                        height={100}
                        className=""
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: -50, scale: 0.8 }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        scale: 1
                      }}
                      transition={{
                        duration: 0.6,
                        delay: 0.3,
                        ease: [0.34, 1.56, 0.64, 1]
                      }}
                      className="pointer-events-none z-20"
                    >
                      <Image
                        src="/notifications/notif6.png"
                        alt="Notification"
                        width={320}
                        height={100}
                        className=""
                      />
                    </motion.div>
                  </div>

                  {/* Middle notifications - positioned on sides */}
                  <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 flex justify-between px-4">
                    <motion.div
                      initial={{ opacity: 0, x: -50, scale: 0.8 }}
                      animate={{
                        opacity: 1,
                        x: 0,
                        scale: 1
                      }}
                      transition={{
                        duration: 0.6,
                        delay: 0.6,
                        ease: [0.34, 1.56, 0.64, 1]
                      }}
                      className="pointer-events-none z-20"
                    >
                      <Image
                        src="/notifications/notif3.png"
                        alt="Notification"
                        width={300}
                        height={90}
                        className=""
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: 50, scale: 0.8 }}
                      animate={{
                        opacity: 1,
                        x: 0,
                        scale: 1
                      }}
                      transition={{
                        duration: 0.6,
                        delay: 0.9,
                        ease: [0.34, 1.56, 0.64, 1]
                      }}
                      className="pointer-events-none z-20"
                    >
                      <Image
                        src="/notifications/notif4.png"
                        alt="Notification"
                        width={300}
                        height={90}
                        className=""
                      />
                    </motion.div>
                  </div>

                  {/* Bottom notifications row */}
                  <div className="absolute bottom-16 left-0 right-0 flex justify-center gap-40">
                    <motion.div
                      initial={{ opacity: 0, y: 50, scale: 0.8 }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        scale: 1
                      }}
                      transition={{
                        duration: 0.6,
                        delay: 1.2,
                        ease: [0.34, 1.56, 0.64, 1]
                      }}
                      className="pointer-events-none z-20"
                    >
                      <Image
                        src="/notifications/notif1.png"
                        alt="Notification"
                        width={320}
                        height={100}
                        className=""
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 50, scale: 0.8 }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        scale: 1
                      }}
                      transition={{
                        duration: 0.6,
                        delay: 1.5,
                        ease: [0.34, 1.56, 0.64, 1]
                      }}
                      className="pointer-events-none z-20"
                    >
                      <Image
                        src="/notifications/notif2.png"
                        alt="Notification"
                        width={320}
                        height={100}
                        className=""
                      />
                    </motion.div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Section 7 - Reviews Section with Motion animations */}
        <div
          ref={section7Ref}
          className="absolute inset-0 flex items-center justify-center"
          style={{ opacity: 0, pointerEvents: 'none', overflow: 'visible' }}
        >
          <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8" style={{ overflow: 'visible' }}>
            <motion.h2
              initial={{ opacity: 0, y: -30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-4xl md:text-5xl text-white text-center mb-6 leading-[1.1]"
              style={{
                fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
                fontWeight: 600
              }}
            >
              Loved by people like you
            </motion.h2>
            <p
              className="text-white/90 text-base md:text-xl max-w-2xl mx-auto mb-12 reviews-text font-normal text-center"
              style={{
                fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
                opacity: 0
              }}
            >
              Authentic stories of <span className="text-white font-semibold">clarity, confidence, and balance</span> from SeeMe's early community.
            </p>

            {/* Infinite auto-scroll carousel with edge fade - only render when section is active */}
            {(activeSection === 5 || activeSection === 6) && (
            <div 
              className="overflow-hidden pb-6 relative"
              style={{ 
                pointerEvents: 'auto',
                maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
                WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)'
              }}
            >
              <motion.div 
                className="flex gap-6"
                animate={{
                  x: activeSection === 6 ? [0, -((350 + 24) * reviews.length)] : 0
                }}
                transition={{
                  x: {
                    duration: 60,
                    repeat: Infinity,
                    ease: "linear",
                    repeatType: "loop"
                  }
                }}
                style={{ willChange: 'auto' }}
              >
                {/* Single set of reviews - reduced from doubled for memory savings */}
                {reviews.map((review, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={activeSection === 6 ? {
                      opacity: 1,
                      y: 0
                    } : {
                      opacity: 0,
                      y: 30
                    }}
                    transition={{
                      delay: (index % reviews.length) * 0.1,
                      duration: 0.5
                    }}
                    className="bg-white/10 rounded-2xl p-5 md:p-6 border border-white/20 shadow-md flex-shrink-0 w-[300px] md:w-[350px]"
                  >
                    <div className="mb-3">
                      <p className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-2"
                        style={{ fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif' }}>
                        {review.category}
                      </p>
                      <div className="flex mb-3">
                        {[...Array(review.rating)].map((_, i) => (
                          <svg
                            key={i}
                            className="w-4 h-4 text-yellow-400 fill-current"
                            viewBox="0 0 20 20"
                          >
                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                    <p
                      className="text-white/90 text-sm md:text-base mb-4 leading-relaxed"
                      style={{ fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif' }}
                    >
                      "{review.text}"
                    </p>
                    <p
                      className="text-white/70 text-xs font-medium italic"
                      style={{ fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif' }}
                    >
                      {review.name}
                    </p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
            )}
          </div>
        </div>

        {/* Section 8 - Completely Private */}
        <div
          ref={section8Ref}
          className="absolute inset-0 flex items-center justify-center"
          style={{ opacity: 0, pointerEvents: 'none' }}
        >
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-20 px-4 md:-translate-x-12">
            {/* Text content */}
            <div className="text-center w-full md:w-auto md:max-w-sm md:mb-0">
              <h2
                className="text-3xl md:text-5xl text-white/80 leading-[1.1]"
                style={{
                  fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
                  fontWeight: 600
                }}
              >
                Your data.<br />
                <span className="text-white font-bold">
                  Always your own.
                </span>
              </h2>
              {/* Desktop paragraph */}
              <p
                className="hidden md:block text-white/90 text-lg mt-6 font-normal"
                style={{
                  fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
                }}
              >
                Built <span className="text-white font-semibold">private-first</span> with on-device intelligence and secure optional cloud enhancements.
              </p>
            </div>

            {/* Lock icon - simplified, no animation on mobile for performance */}
            <div className="relative flex items-center justify-center w-32 h-32 md:w-40 md:h-40 flex-shrink-0">
              {(activeSection === 6 || activeSection === 7 || activeSection === 8) && (
                <>
                  <div
                    className="absolute inset-0 transition-opacity duration-700"
                    style={{ opacity: showLocked ? 0 : 1 }}
                  >
                    <Image
                      src="/unlock.png"
                      alt="Unlocked"
                      fill
                      className="object-contain brightness-0 invert"
                      sizes="128px"
                    />
                  </div>
                  <div
                    className="absolute inset-0 transition-opacity duration-700"
                    style={{ opacity: showLocked ? 1 : 0 }}
                  >
                    <Image
                      src="/lock.png"
                      alt="Locked"
                      fill
                      className="object-contain brightness-0 invert"
                      sizes="128px"
                    />
                  </div>
                </>
              )}
            </div>

            {/* Mobile paragraph */}
            <p
              className="md:hidden text-white/90 text-sm text-center font-normal px-2"
              style={{ fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif' }}
            >
              Built <span className="text-white font-semibold">private-first</span> with on-device intelligence and secure optional cloud enhancements.
            </p>
          </div>
        </div>

        {/* Section 9 - CTA */}
        <div
          ref={section9Ref}
          className="absolute inset-0 flex items-center justify-center z-50 cursor-auto"
          style={{ opacity: 0, pointerEvents: 'none' }}
        >
          <div className="cta-inner relative z-10 flex flex-col items-center justify-center text-center px-4 cursor-auto">
            <h2
              className="text-3xl md:text-6xl text-white/80 leading-[1.1]"
              style={{
                fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
                fontWeight: 600
              }}
            >
              Begin your journey<br />
              <span className="text-white font-bold">
                today.
              </span>
            </h2>
            <p
              className="text-white/90 text-base md:text-xl max-w-lg mt-6 font-normal"
              style={{
                fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
              }}
            >
              Start building your personal intelligence. Calmly, privately, and on your terms.
            </p>
            
            {/* App Store Button */}
            <a
              href="https://apps.apple.com"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-10 inline-flex items-center gap-3 bg-white text-black px-8 py-4 rounded-full hover:bg-white/90 transition-all duration-300 hover:scale-105 shadow-lg cursor-pointer"
              style={{
                fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
              }}
              onClick={() => {
                analytics.buttonClick('Download on the App Store', 'Final CTA');
              }}
            >
              <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              <span className="text-lg font-semibold whitespace-nowrap">Download on the App Store</span>
            </a>

            {/* Disclaimer Section - Below CTA */}
            <div className="mt-16 max-w-2xl mx-auto">
              <button
                onClick={() => setDisclaimerExpanded(!disclaimerExpanded)}
                className="w-full flex items-center justify-center gap-2 text-white/40 hover:text-white/60 transition-colors text-xs py-2 cursor-pointer"
                aria-expanded={disclaimerExpanded}
              >
                <span>Important Disclaimer</span>
                <motion.svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  animate={{ rotate: disclaimerExpanded ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <polyline points="6 9 12 15 18 9" />
                </motion.svg>
              </button>
              
              <AnimatePresence>
                {disclaimerExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-5 mt-3 text-left border border-white/10">
                      <p className="text-white/60 text-xs leading-relaxed mb-3">
                        SeeMe LLC provides an AI-powered coaching and reflection tool. We do not provide medical, mental health, psychological, legal, or financial services, and we do not monitor or respond to emergencies.
                      </p>
                      <p className="text-white/70 text-xs leading-relaxed mb-2">
                        <strong className="text-white/80">SeeMe does not and cannot:</strong>
                      </p>
                      <ul className="text-white/60 text-xs leading-relaxed mb-3 space-y-1.5 pl-4">
                        <li className="list-disc">Monitor your content in real time</li>
                        <li className="list-disc">Contact emergency services, law enforcement, or third parties for you</li>
                        <li className="list-disc">Take responsibility for any harm, injury, or unlawful activity arising from your use of the app</li>
                      </ul>
                      <p className="text-white/60 text-xs leading-relaxed">
                        You remain solely responsible for your own decisions, actions, safety, and well-being. Always seek help from qualified professionals and emergency services when needed.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        </div>
      </div>

      </div>

      {/* Footer - at absolute bottom of scroll */}
      <footer 
        className="absolute bottom-0 left-0 right-0 z-20 py-6 text-center"
        style={{ fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif' }}
      >
        <div className="flex items-center justify-center gap-4 text-white/40 text-sm">
          <a
            href="/privacy"
            className="hover:text-white/70 transition-colors"
          >
            Privacy Policy
          </a>
          <span>·</span>
          <a
            href="mailto:info@seemeapp.ai"
            className="hover:text-white/70 transition-colors"
          >
            Contact
          </a>
        </div>
        <p className="mt-2 text-white/30 text-xs">
          © {new Date().getFullYear()} SeeMe. All rights reserved.
        </p>
      </footer>
    </main>
  );
};

export default FinalLanding;
