import { useEffect, RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { AnimConfig } from './useDeviceOptimization';
import { TOTAL_SECTIONS } from '../constants';

gsap.registerPlugin(ScrollTrigger);

/**
 * Mathematical Scroll System V2
 * 
 * Core Principles:
 * 1. Each section occupies exactly 1/TOTAL_SECTIONS of the total scroll range
 * 2. Section opacity transitions happen in the middle 60% of each section's range
 * 3. Backgrounds change exactly when sections reach 50% opacity
 * 4. Auto-scroll triggers when user stops within 15% of a section boundary
 * 5. All calculations are viewport-agnostic (use progress 0-1, not pixels)
 */

interface SectionRange {
  start: number;      // 0-1 progress where section starts
  end: number;        // 0-1 progress where section ends
  center: number;     // 0-1 progress at section center
  fadeInStart: number;  // Where fade-in begins
  fadeInEnd: number;    // Where fade-in completes
  fadeOutStart: number; // Where fade-out begins
  fadeOutEnd: number;   // Where fade-out completes
}

/**
 * Calculate precise section ranges for all sections
 */
function calculateSectionRanges(totalSections: number): SectionRange[] {
  const sectionWidth = 1 / totalSections;
  
  return Array.from({ length: totalSections }, (_, index) => {
    const start = index * sectionWidth;
    const end = (index + 1) * sectionWidth;
    const center = (start + end) / 2;
    
    // Very tight fade zones: 5% fade in, 5% fade out
    // This ensures sections transition quickly with minimal overlap
    const fadeZone = sectionWidth * 0.05;
    
    const fadeInStart = Math.max(0, start);
    const fadeInEnd = Math.max(0, start + fadeZone);
    const fadeOutStart = Math.min(1, end - fadeZone);
    const fadeOutEnd = Math.min(1, end);
    
    return {
      start,
      end,
      center,
      fadeInStart,
      fadeInEnd,
      fadeOutStart,
      fadeOutEnd
    };
  });
}

/**
 * Calculate section opacity based on scroll progress
 */
function calculateSectionOpacity(progress: number, range: SectionRange, isFirst: boolean, isLast: boolean): number {
  // First section: visible from start, fades out at end
  if (isFirst) {
    if (progress < range.fadeOutStart) return 1;
    if (progress >= range.fadeOutEnd) return 0;
    return 1 - ((progress - range.fadeOutStart) / (range.fadeOutEnd - range.fadeOutStart));
  }
  
  // Last section: fades in at start, stays visible
  if (isLast) {
    if (progress < range.fadeInStart) return 0;
    if (progress >= range.fadeInEnd) return 1;
    return (progress - range.fadeInStart) / (range.fadeInEnd - range.fadeInStart);
  }
  
  // Middle sections: fade in and fade out
  if (progress < range.fadeInStart) return 0;
  if (progress < range.fadeInEnd) {
    // Fading in
    return (progress - range.fadeInStart) / (range.fadeInEnd - range.fadeInStart);
  }
  if (progress < range.fadeOutStart) return 1;
  if (progress < range.fadeOutEnd) {
    // Fading out
    return 1 - ((progress - range.fadeOutStart) / (range.fadeOutEnd - range.fadeOutStart));
  }
  return 0;
}

/**
 * Determine which background should be shown based on section visibility
 * Backgrounds map 1:1 with sections (8 sections, 8 backgrounds)
 */
function calculateBackgroundIndex(progress: number, ranges: SectionRange[], backgrounds: string[]): number {
  // Find the section with highest opacity
  let maxOpacity = 0;
  let dominantSection = 0;
  
  ranges.forEach((range, index) => {
    const opacity = calculateSectionOpacity(progress, range, index === 0, index === ranges.length - 1);
    if (opacity > maxOpacity) {
      maxOpacity = opacity;
      dominantSection = index;
    }
  });
  
  // Direct 1:1 mapping: Section N uses Background N
  return dominantSection;
}

export const useScrollAnimationV2 = (
  containerRef: RefObject<HTMLDivElement | null>,
  backgroundRef: RefObject<HTMLDivElement | null>,
  sectionRefs: RefObject<HTMLDivElement | null>[],
  animConfig: AnimConfig,
  imagesLoaded: boolean,
  shouldReduceMotion: boolean,
  currentBgIndexRef: React.MutableRefObject<number>,
  setCurrentBgIndex: (index: number) => void,
  setActiveSection: (section: number) => void,
  backgrounds: string[]
) => {
  useEffect(() => {
    if (!imagesLoaded) return;
    
    if (shouldReduceMotion) {
      ScrollTrigger.config({
        autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load',
        limitCallbacks: true,
      });
    }

    const sectionRanges = calculateSectionRanges(TOTAL_SECTIONS);
    const sectionWidth = 1 / TOTAL_SECTIONS;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.1,
        snap: {
          snapTo: (progress) => {
            // Don't snap at very start
            if (progress < 0.01) return 0;
            
            // Find nearest section center
            const nearestRange = sectionRanges.reduce((prev, curr) => 
              Math.abs(curr.center - progress) < Math.abs(prev.center - progress) ? curr : prev
            );
            
            // Calculate distance to nearest boundary
            const distanceToStart = Math.abs(progress - nearestRange.start);
            const distanceToEnd = Math.abs(progress - nearestRange.end);
            const distanceToBoundary = Math.min(distanceToStart, distanceToEnd);
            
            // If within 15% of a boundary, snap to nearest center
            if (distanceToBoundary < sectionWidth * 0.15) {
              return nearestRange.center;
            }
            
            // Otherwise, don't snap
            return progress;
          },
          duration: animConfig.snapDuration,
          delay: 0.2,
          ease: "power2.inOut",
          inertia: false
        },
        id: 'main-scroll',
        onUpdate: (self) => {
          const progress = self.progress;
          
          // Calculate all section opacities
          const calculatedOpacities = sectionRanges.map((range, index) => ({
            section: index,
            opacity: calculateSectionOpacity(progress, range, index === 0, index === TOTAL_SECTIONS - 1)
          }));
          
          // Update active section (section with highest opacity)
          let maxOpacity = 0;
          let activeIdx = 0;
          calculatedOpacities.forEach(({ section, opacity }) => {
            if (opacity > maxOpacity) {
              maxOpacity = opacity;
              activeIdx = section;
            }
          });
          setActiveSection(activeIdx);

          // Update backgrounds with perfect synchronization
          if (!shouldReduceMotion && backgroundRef.current && animConfig.enableBackgroundTransitions) {
            const targetBgIndex = calculateBackgroundIndex(progress, sectionRanges, backgrounds);
            
            if (currentBgIndexRef.current !== targetBgIndex) {
              currentBgIndexRef.current = targetBgIndex;
              setCurrentBgIndex(targetBgIndex);
            }

            // Smooth background crossfade synced with section transitions
            const bgLayers = backgroundRef.current.querySelectorAll('[data-bg]');
            
            // Each background should exactly match its corresponding section's opacity
            bgLayers.forEach((layer) => {
              const layerIndex = parseInt((layer as HTMLElement).getAttribute('data-bg') || '0');
              
              // Get the section range for this background
              const range = sectionRanges[layerIndex];
              if (!range) {
                gsap.set(layer, { opacity: 0 });
                return;
              }
              
              // Calculate opacity using the SAME function as sections
              const bgOpacity = calculateSectionOpacity(progress, range, layerIndex === 0, layerIndex === TOTAL_SECTIONS - 1);
              
              gsap.set(layer, { opacity: bgOpacity });
            });
          }

          // Update section opacities - use direct DOM manipulation
          sectionRefs.forEach((ref, index) => {
            if (!ref.current) return;
            
            const range = sectionRanges[index];
            const opacity = calculateSectionOpacity(progress, range, index === 0, index === TOTAL_SECTIONS - 1);
            const pointerEvents = opacity > 0.5 ? 'auto' : 'none';
            
            ref.current.style.opacity = String(opacity);
            ref.current.style.pointerEvents = pointerEvents;
          });
        },
      });
    });

    return () => ctx.revert();
  }, [imagesLoaded, animConfig, shouldReduceMotion]);

  const scrollToSection = (sectionIndex: number) => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const containerTop = rect.top + window.scrollY;
    const containerHeight = rect.height;
    const viewportHeight = window.innerHeight;
    const scrollRange = containerHeight - viewportHeight;

    if (scrollRange <= 0) return;

    const sectionRanges = calculateSectionRanges(TOTAL_SECTIONS);
    const targetProgress = sectionRanges[Math.min(sectionIndex, TOTAL_SECTIONS - 1)].center;
    const targetScroll = containerTop + scrollRange * targetProgress;
    const startScroll = window.scrollY;
    const distance = targetScroll - startScroll;

    if (Math.abs(distance) < 2) return;

    const tweenState = { value: 0 };
    gsap.to(tweenState, {
      value: 1,
      duration: 1.2,
      ease: 'power1.inOut',
      onUpdate: () => {
        const next = startScroll + distance * tweenState.value;
        window.scrollTo({ top: next });
      },
      onComplete: () => {
        window.scrollTo({ top: targetScroll });
      }
    });
  };

  return { scrollToSection };
};
