'use client';

import { useEffect, useState } from 'react';

export function useIntersectionScroll(
  sectionRefs: React.RefObject<HTMLDivElement | null>[],
  backgroundRef: React.RefObject<HTMLDivElement | null>,
  backgrounds: string[]
) {
  const [activeSection, setActiveSection] = useState(0);
  const [currentBgIndex, setCurrentBgIndex] = useState(0);

  useEffect(() => {
    const totalSections = sectionRefs.length;
    
    const handleScroll = () => {
      // Calculate which section should be visible based on scroll position
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollProgress = window.scrollY / scrollHeight;
      
      // Determine active section (0 to totalSections-1)
      const sectionIndex = Math.min(
        Math.floor(scrollProgress * totalSections),
        totalSections - 1
      );
      
      setActiveSection(sectionIndex);
      setCurrentBgIndex(sectionIndex);

      // Update section opacities
      sectionRefs.forEach((ref, index) => {
        if (ref.current) {
          if (index === sectionIndex) {
            ref.current.style.opacity = '1';
            ref.current.style.pointerEvents = 'auto';
            ref.current.style.transition = 'opacity 0.5s ease-in-out';
          } else {
            ref.current.style.opacity = '0';
            ref.current.style.pointerEvents = 'none';
            ref.current.style.transition = 'opacity 0.5s ease-in-out';
          }
        }
      });

      // Update backgrounds - only the ones that are rendered
      if (backgroundRef.current) {
        const bgLayers = backgroundRef.current.querySelectorAll('[data-bg]');
        bgLayers.forEach((layer) => {
          const bgElement = layer as HTMLElement;
          const bgIndex = parseInt(bgElement.getAttribute('data-bg') || '0');
          
          if (bgIndex === sectionIndex) {
            bgElement.style.opacity = '1';
          } else {
            bgElement.style.opacity = '0';
          }
        });
      }
    };

    // Set initial state
    sectionRefs.forEach((ref, index) => {
      if (ref.current) {
        ref.current.style.opacity = index === 0 ? '1' : '0';
        ref.current.style.pointerEvents = index === 0 ? 'auto' : 'none';
      }
    });

    if (backgroundRef.current) {
      const bgLayers = backgroundRef.current.querySelectorAll('[data-bg]');
      bgLayers.forEach((layer, idx) => {
        const bgElement = layer as HTMLElement;
        bgElement.style.opacity = idx === 0 ? '1' : '0';
      });
    }

    // Listen to scroll events
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [sectionRefs, backgroundRef, backgrounds]);

  return {
    activeSection,
    currentBgIndex,
    setActiveSection,
    setCurrentBgIndex,
    scrollToSection: (index: number) => {
      const totalSections = sectionRefs.length;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const targetScroll = (index / totalSections) * scrollHeight;
      
      window.scrollTo({ top: targetScroll, behavior: 'smooth' });
    },
  };
}
