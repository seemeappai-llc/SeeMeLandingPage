import { useEffect, RefObject } from 'react';
import type { AnimConfig } from './useDeviceOptimization';
import { TOTAL_SECTIONS } from '../constants';

/**
 * Simplified scroll animation for iOS devices (iPhone 13 and lower)
 * Uses native scroll events and CSS transitions instead of GSAP to prevent crashes
 */
export const useSimpleScrollAnimation = (
  containerRef: RefObject<HTMLDivElement | null>,
  backgroundRef: RefObject<HTMLDivElement | null>,
  sectionRefs: RefObject<HTMLDivElement | null>[],
  imagesLoaded: boolean,
  setActiveSection: (section: number) => void,
  setCurrentBgIndex: (index: number) => void,
  backgrounds: string[]
) => {
  useEffect(() => {
    if (!imagesLoaded) return;

    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const containerTop = rect.top;
      const containerHeight = rect.height;
      const viewportHeight = window.innerHeight;
      const scrollRange = containerHeight - viewportHeight;

      if (scrollRange <= 0) return;

      // Calculate scroll progress (0 to 1)
      const progress = Math.max(0, Math.min(1, -containerTop / scrollRange));

      // Update active section
      const sectionIndex = Math.floor(progress * TOTAL_SECTIONS);
      const newSection = Math.min(sectionIndex, TOTAL_SECTIONS - 1);
      setActiveSection(newSection);

      // Update background index
      const bgIndex = Math.floor(progress * (backgrounds.length - 1));
      setCurrentBgIndex(Math.min(bgIndex, backgrounds.length - 1));

      // Update section opacities using CSS
      sectionRefs.forEach((ref, index) => {
        if (!ref.current) return;
        
        const sectionStart = index / TOTAL_SECTIONS;
        const sectionEnd = (index + 1) / TOTAL_SECTIONS;
        const sectionCenter = (sectionStart + sectionEnd) / 2;
        const distanceFromCenter = Math.abs(progress - sectionCenter);
        const halfDuration = (sectionEnd - sectionStart) / 2;
        const overlap = halfDuration * 0.2;

        let opacity = 0;
        let pointerEvents = 'none';

        if (index === 0 && progress < sectionEnd) {
          // First section
          const fadeOutStart = sectionEnd * 0.7;
          if (progress < fadeOutStart) {
            opacity = 1;
          } else {
            opacity = 1 - ((progress - fadeOutStart) / (sectionEnd - fadeOutStart));
          }
          pointerEvents = opacity > 0.5 ? 'auto' : 'none';
        } else if (index === TOTAL_SECTIONS - 1) {
          // Last section
          const fadeInStart = sectionStart - overlap;
          const fadeInEnd = sectionStart + overlap;
          
          if (progress >= fadeInEnd) {
            opacity = 1;
            pointerEvents = 'auto';
          } else if (progress >= fadeInStart) {
            opacity = (progress - fadeInStart) / (2 * overlap);
            pointerEvents = opacity > 0.5 ? 'auto' : 'none';
          }
        } else {
          // Middle sections
          if (distanceFromCenter < halfDuration + overlap) {
            const fadeRange = 2 * overlap;
            const distFromPlateau = distanceFromCenter - (halfDuration - overlap);

            if (distFromPlateau < 0) {
              opacity = 1;
            } else {
              opacity = 1 - (distFromPlateau / fadeRange);
            }
            pointerEvents = opacity > 0.5 ? 'auto' : 'none';
          }
        }

        // Apply styles directly with CSS transitions
        ref.current.style.opacity = String(opacity);
        ref.current.style.pointerEvents = pointerEvents;
      });

      // Update background opacity using CSS
      if (backgroundRef.current) {
        const bgLayers = backgroundRef.current.querySelectorAll('[data-bg]');
        const exactBgIndex = progress * (backgrounds.length - 1);
        const currentBgIndex = Math.floor(exactBgIndex);
        const nextBgIndex = Math.min(currentBgIndex + 1, backgrounds.length - 1);
        const fraction = exactBgIndex - currentBgIndex;

        bgLayers.forEach((layer) => {
          const layerIndex = parseInt((layer as HTMLElement).getAttribute('data-bg') || '0');
          let bgOpacity = 0;

          if (layerIndex === currentBgIndex) {
            bgOpacity = 1 - fraction;
          } else if (layerIndex === nextBgIndex) {
            bgOpacity = fraction;
          }

          (layer as HTMLElement).style.opacity = String(bgOpacity);
        });
      }
    };

    // Use passive scroll listener for better performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [imagesLoaded, backgrounds.length, sectionRefs, containerRef, backgroundRef, setActiveSection, setCurrentBgIndex]);

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

    // Use native smooth scroll
    window.scrollTo({ 
      top: targetScroll, 
      behavior: 'smooth' 
    });
  };

  return { scrollToSection };
};
