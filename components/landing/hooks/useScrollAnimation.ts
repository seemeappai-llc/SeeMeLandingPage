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
        scrub: 1.0, // Reduced from 1.5 for snappier response
        // Snap removed to prevent "unexpected scroll snap" issues
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
              // UNIFIED CROSSFADE for Last Section (CTA)
              const halfDuration = (sectionEnd - sectionStart) / 2;
              const overlap = halfDuration * 0.2; // Match overlap with generic sections

              const fadeInStart = sectionStart - overlap;
              const fadeInEnd = sectionStart + overlap;

              if (progress >= fadeInEnd) {
                opacity = 1;
                pointerEvents = 'auto';
              } else if (progress >= fadeInStart) {
                // Fade in across the boundary (-overlap to +overlap)
                opacity = (progress - fadeInStart) / (2 * overlap);
                pointerEvents = opacity > 0.5 ? 'auto' : 'none';
              }
            } else {
              // UNIFIED CROSSFADE for Generic Sections
              const sectionCenter = (sectionStart + sectionEnd) / 2;
              const distanceFromCenter = Math.abs(progress - sectionCenter);
              const halfDuration = (sectionEnd - sectionStart) / 2;

              // Allow overlap beyond standard boundary
              const overlap = halfDuration * 0.2; // 20% overlap for smooth crossfade

              if (distanceFromCenter < halfDuration + overlap) {
                const fadeRange = 2 * overlap;
                // Distance from where fading starts (plateau edge)
                const distFromPlateau = distanceFromCenter - (halfDuration - overlap);

                if (distFromPlateau < 0) {
                  // Inside full opacity plateau
                  opacity = 1;
                } else {
                  // Fading out (crossfading)
                  opacity = 1 - (distFromPlateau / fadeRange);
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
