import { useEffect, useRef, useState, RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { AnimConfig } from './useDeviceOptimization';
import { TOTAL_SECTIONS } from '../constants';

gsap.registerPlugin(ScrollTrigger);

export const useScrollAnimation = (
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
      // Reduce ScrollTrigger refresh rate on low-end devices
      ScrollTrigger.config({
        autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load',
        limitCallbacks: true,
      });
    }

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.5, // Smoother scroll-linked animation (from GSAP best practices)
        snap: {
          snapTo: (progress) => {
            if (progress < 0.01) return 0;
            const velocity = Math.abs(ScrollTrigger.getById('main-scroll')?.getVelocity() || 0);
            if (velocity > 2000) return progress;
            
            // Snap to section centers where opacity is 1.0, not boundaries
            const segment = 1 / TOTAL_SECTIONS;
            const sectionIndex = Math.round(progress / segment);
            
            // For the last section, snap to 88.89% (8/9) instead of center (94.44%)
            // This ensures the final section is reachable and fully visible
            if (sectionIndex >= TOTAL_SECTIONS - 1) {
              return (TOTAL_SECTIONS - 1) / TOTAL_SECTIONS; // 8/9 = 88.89%
            }
            
            // Snap to center of section: (index + 0.5) / TOTAL_SECTIONS
            const snappedProgress = (sectionIndex + 0.5) / TOTAL_SECTIONS;
            return snappedProgress;
          },
          duration: animConfig.snapDuration,
          delay: animConfig.snapDelay,
          ease: 'power1.inOut', // More natural snap easing (from GSAP best practices)
        },
        id: 'main-scroll',
        onUpdate: (self) => {
          const progress = self.progress;
          const sectionIndex = Math.floor(progress * TOTAL_SECTIONS);
          const newSection = Math.min(sectionIndex, TOTAL_SECTIONS - 1);
          setActiveSection(newSection);

          // Background logic
          if (!shouldReduceMotion) {
            const exactBgIndex = progress * (backgrounds.length - 1);
            const bgIndex = Math.floor(exactBgIndex);
            const nextBgIndex = Math.min(bgIndex + 1, backgrounds.length - 1);

            if (currentBgIndexRef.current !== bgIndex) {
              currentBgIndexRef.current = bgIndex;
              setCurrentBgIndex(bgIndex);
            }

            if (backgroundRef.current && animConfig.enableBackgroundTransitions) {
              const bgLayers = backgroundRef.current.querySelectorAll('[data-bg]');
              const fraction = exactBgIndex - bgIndex;

              bgLayers.forEach((layer) => {
                const layerIndex = parseInt((layer as HTMLElement).getAttribute('data-bg') || '0');
                let opacity = 0;

                if (layerIndex === bgIndex) {
                  opacity = 1 - fraction;
                } else if (layerIndex === nextBgIndex) {
                  opacity = fraction;
                }

                gsap.set(layer, { opacity });
              });
            }
          }

          // Section opacity animations - ensure smooth crossfades without dark gaps
          sectionRefs.forEach((ref, index) => {
            if (!ref.current) return;
            const sectionStart = index / TOTAL_SECTIONS;
            const sectionEnd = (index + 1) / TOTAL_SECTIONS;
            
            let opacity = 0;
            let pointerEvents = 'none';

            // Special handling for first section - always visible at start
            if (index === 0 && progress < sectionEnd) {
              const fadeOutStart = sectionEnd * 0.7; // Start fading at 70% through section
              if (progress < fadeOutStart) {
                opacity = 1;
              } else {
                opacity = 1 - ((progress - fadeOutStart) / (sectionEnd - fadeOutStart));
              }
              pointerEvents = opacity > 0.5 ? 'auto' : 'none';
            } else if (index === TOTAL_SECTIONS - 1) {
              // Special handling for last section - full opacity from 88.89% onwards
              if (progress >= sectionStart) {
                opacity = 1;
                pointerEvents = 'auto';
              } else {
                // Fade in from previous section
                const fadeInStart = sectionStart - (sectionEnd - sectionStart) * 0.3;
                if (progress >= fadeInStart) {
                  opacity = (progress - fadeInStart) / (sectionStart - fadeInStart);
                  pointerEvents = opacity > 0.5 ? 'auto' : 'none';
                }
              }
            } else {
              // Calculate distance from section center for other sections
              const sectionCenter = (sectionStart + sectionEnd) / 2;
              const distanceFromCenter = Math.abs(progress - sectionCenter);
              const halfDuration = (sectionEnd - sectionStart) / 2;

              // Fade based on distance from center - sections overlap during transitions
              if (distanceFromCenter < halfDuration) {
                // Within section range - calculate opacity
                const fadeRegion = halfDuration * 0.2; // 20% fade region for snappier transitions (GSAP best practice)
                
                if (distanceFromCenter < halfDuration - fadeRegion) {
                  // Full opacity in center region (80% of section duration)
                  opacity = 1;
                } else {
                  // Fade out at edges
                  const fadeProgress = (distanceFromCenter - (halfDuration - fadeRegion)) / fadeRegion;
                  opacity = 1 - fadeProgress;
                }
                
                pointerEvents = opacity > 0.5 ? 'auto' : 'none';
              }
            }

            gsap.set(ref.current, { opacity, pointerEvents });
          });
        },
      });
    });

    return () => ctx.revert();
  }, [imagesLoaded, animConfig, shouldReduceMotion, backgrounds.length]);

  const scrollToSection = (sectionIndex: number) => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const containerTop = rect.top + window.scrollY;
    const containerHeight = rect.height;
    const viewportHeight = window.innerHeight;
    const scrollRange = containerHeight - viewportHeight;

    if (scrollRange <= 0) return;

    const segment = 1 / TOTAL_SECTIONS;
    let targetProgress: number;

    if (sectionIndex <= 0) {
      targetProgress = 0;
    } else if (sectionIndex >= TOTAL_SECTIONS - 1) {
      targetProgress = 1;
    } else {
      targetProgress = (sectionIndex + 0.5) * segment;
    }

    const targetScroll = containerTop + scrollRange * targetProgress;
    const startScroll = window.scrollY;
    const distance = targetScroll - startScroll;

    if (Math.abs(distance) < 2) return;

    const tweenState = { value: 0 };
    gsap.to(tweenState, {
      value: 1,
      duration: 1.2, // Slightly faster for snappier feel
      ease: 'power1.inOut', // More natural easing (GSAP best practice)
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
