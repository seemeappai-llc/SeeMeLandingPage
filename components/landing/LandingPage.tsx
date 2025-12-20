'use client';

import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useDeviceOptimization } from './hooks/useDeviceOptimization';
import { useImagePreloader } from './hooks/useImagePreloader';
import { useVideoPreloader } from './hooks/useVideoPreloader';
import { useBackgroundManager } from './hooks/useBackgroundManager';
import { useScrollAnimation } from './hooks/useScrollAnimation';
import { BackgroundManager } from './shared/BackgroundManager';
import { HeroSection } from './sections/HeroSection';
import { CoachesSection } from './sections/CoachesSection';
import { InsightsSection } from './sections/InsightsSection';
import { NotificationsSection } from './sections/NotificationsSection';
import { PrivacySection } from './sections/PrivacySection';
import { RiseSection } from './sections/RiseSection';
import { ReviewsSection } from './sections/ReviewsSection';
import { CTASection } from './sections/CTASection';
import { BACKGROUNDS, COACHES, SECTION_NAMES } from './constants';

gsap.registerPlugin(ScrollTrigger);

export const LandingPage = () => {
  const analytics = useAnalytics();
  const { deviceCapabilities, animConfig } = useDeviceOptimization();

  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const section2Ref = useRef<HTMLDivElement>(null);
  const section3Ref = useRef<HTMLDivElement>(null);
  const section4Ref = useRef<HTMLDivElement>(null);
  const section5Ref = useRef<HTMLDivElement>(null);
  const section6Ref = useRef<HTMLDivElement>(null);
  const section8Ref = useRef<HTMLDivElement>(null);
  const section9Ref = useRef<HTMLDivElement>(null);
  const riseTextRef = useRef<HTMLParagraphElement>(null);

  const sectionRefs = [
    heroRef,
    section2Ref,
    section3Ref,
    section4Ref,
    section5Ref,
    section6Ref,
    section8Ref, // Reviews
    section9Ref, // CTA
  ];

  // State
  const [activeSection, setActiveSection] = useState(0);

  // Background management
  const {
    lowEndBgIndex,
    currentBgIndex,
    currentBgIndexRef,
    setCurrentBgIndex,
  } = useBackgroundManager(activeSection, BACKGROUNDS, deviceCapabilities.shouldReduceMotion);

  // Image preloading
  const imagesToPreload = deviceCapabilities.shouldReduceMotion
    ? [
      BACKGROUNDS[0],
      '/coaches/c1.png',
      '/coaches/c2.png',
      '/coaches/c3.png',
    ]
    : [
      ...BACKGROUNDS,
      ...COACHES.map(c => c.img),
    ];

  const imagesLoaded = useImagePreloader(imagesToPreload);

  // Video preloading
  useVideoPreloader(imagesLoaded, deviceCapabilities.isIOS, deviceCapabilities.shouldReduceMotion);

  // GSAP ScrollTrigger configuration
  useEffect(() => {
    if (deviceCapabilities.shouldReduceMotion) {
      ScrollTrigger.config({
        autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load',
        limitCallbacks: true,
      });
    }
  }, [deviceCapabilities]);

  // Scroll animation
  const { scrollToSection } = useScrollAnimation(
    containerRef,
    backgroundRef,
    sectionRefs,
    animConfig,
    imagesLoaded,
    deviceCapabilities.shouldReduceMotion,
    currentBgIndexRef,
    setCurrentBgIndex,
    setActiveSection,
    BACKGROUNDS
  );

  // Track section changes
  useEffect(() => {
    if (activeSection >= 0 && activeSection < SECTION_NAMES.length) {
      analytics.sectionVisible(activeSection, SECTION_NAMES[activeSection]);
    }
  }, [activeSection, analytics]);

  // Loading screen
  if (!imagesLoaded) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
          <p className="text-white/60 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-black">
      <BackgroundManager
        ref={backgroundRef}
        backgrounds={BACKGROUNDS}
        shouldReduceMotion={deviceCapabilities.shouldReduceMotion}
        lowEndBgIndex={lowEndBgIndex}
        currentBgIndex={currentBgIndex}
        maxConcurrentBackgrounds={deviceCapabilities.maxConcurrentBackgrounds}
      />

      {/* Desktop Sticky CTA */}
      <a
        href="https://apps.apple.com"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed top-6 right-6 z-50 hidden md:flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/10 px-4 py-2.5 rounded-full hover:bg-white/20 transition-all duration-300 hover:scale-105 group"
        onClick={() => analytics.buttonClick('Sticky CTA', 'Global')}
      >
        <div className="relative w-6 h-6 rounded-lg overflow-hidden shadow-inner">
          <img src="/logo.png" alt="SeeMe Logo" className="w-full h-full object-cover" />
        </div>
        <span
          className="text-white text-sm font-medium tracking-wide"
          style={{ fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif' }}
        >
          Download SeeMe
        </span>
      </a>

      <div ref={containerRef} className="h-[1800vh] w-screen max-w-full relative z-10 overflow-x-hidden">
        <div className="fixed inset-0 w-screen max-w-full" style={{ overflow: 'clip' }}>
          <HeroSection
            sectionRef={heroRef}
            activeSection={activeSection}
            isIOS={deviceCapabilities.isIOS}
            shouldReduceMotion={deviceCapabilities.shouldReduceMotion}
            onScrollIndicatorClick={() => {
              analytics.scrollIndicatorClick();
              scrollToSection(1);
            }}
          />

          <CoachesSection
            sectionRef={section2Ref}
            activeSection={activeSection}
            isIOS={deviceCapabilities.isIOS}
            shouldReduceMotion={deviceCapabilities.shouldReduceMotion}
          />

          <InsightsSection
            sectionRef={section3Ref}
            activeSection={activeSection}
            isIOS={deviceCapabilities.isIOS}
            shouldReduceMotion={deviceCapabilities.shouldReduceMotion}
          />

          <NotificationsSection
            sectionRef={section4Ref}
            activeSection={activeSection}
            isIOS={deviceCapabilities.isIOS}
            shouldReduceMotion={deviceCapabilities.shouldReduceMotion}
          />

          <PrivacySection
            sectionRef={section5Ref}
            activeSection={activeSection}
            isIOS={deviceCapabilities.isIOS}
            shouldReduceMotion={deviceCapabilities.shouldReduceMotion}
          />

          <RiseSection
            sectionRef={section6Ref}
            riseTextRef={riseTextRef}
            activeSection={activeSection}
          />

          <ReviewsSection
            sectionRef={section8Ref}
            activeSection={activeSection}
          />

          <CTASection
            sectionRef={section9Ref}
            onAppStoreClick={() => {
              analytics.buttonClick('Download on the App Store', 'Final CTA');
            }}
          />
        </div>
      </div>

      <footer
        className="absolute bottom-0 left-0 right-0 z-20 py-6 text-center"
        style={{ fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif' }}
      >
        <div className="flex items-center justify-center gap-4 text-white/40 text-sm">
          <a href="/privacy" className="hover:text-white/70 transition-colors">
            Privacy Policy
          </a>
          <span>·</span>
          <a href="mailto:info@seemeapp.ai" className="hover:text-white/70 transition-colors">
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

export default LandingPage;
