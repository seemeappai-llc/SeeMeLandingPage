'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import SmartVideo from '@/components/SmartVideo';
import { videoUrls } from '@/config/videoUrls';
import Image from 'next/image';
import { REVIEWS } from './data/reviews';
import { COACHES, BACKGROUNDS } from './constants';

// --- Types ---
type SectionData = {
  id: string;
  title: React.ReactNode;
  subtitle: React.ReactNode;
  videoUrl?: string;
  posterUrl?: string;
  hasPhone: boolean;
};

// --- Data ---
const SECTIONS: SectionData[] = [
  {
    id: 'hero',
    title: <span className="font-black text-6xl md:text-9xl tracking-tight">SeeMe</span>,
    subtitle: "Private personal intelligence for your growth",
    videoUrl: videoUrls.video1,
    posterUrl: "/mockups/mock1.webp",
    hasPhone: true,
  },
  {
    id: 'coaches',
    title: <>Your network of<br /><span className="text-white font-bold">expert coaches</span></>,
    subtitle: <>Crafted with <span className="text-white font-semibold">real coaches and experts</span>, supporting life, work, wellness, and mindset.</>,
    videoUrl: videoUrls.video2,
    posterUrl: "/mockups/mock2.webp",
    hasPhone: true,
  },
  {
    id: 'insights',
    title: <>Coaches that<br /><span className="text-white font-bold">truly understand you</span></>,
    subtitle: <>Learning from your <span className="text-white font-semibold">sessions, reflections, calendar, health,</span> and <span className="text-white font-semibold">screen time</span> patterns.</>,
    videoUrl: videoUrls.video3,
    posterUrl: "/mockups/mock3.webp",
    hasPhone: true,
  },
  {
    id: 'notifications',
    title: <><span className="text-white font-bold">Unparalleled insights</span><br />from your life</>,
    subtitle: <>Ask anything. SeeMe <span className="text-white font-semibold">reveals patterns</span>, <span className="text-white font-semibold">highlights blind spots</span>, and supports you when it matters.</>,
    videoUrl: videoUrls.video4,
    posterUrl: "/mockups/mock4.webp",
    hasPhone: true,
  },
  {
    id: 'privacy',
    title: <><span className="text-white font-bold">Expert strategies,</span><br />tailored to you</>,
    subtitle: <><span className="text-white font-semibold">Evidence-based methods</span> and guided sessions, adapted to your goals and daily reality.</>,
    videoUrl: videoUrls.video5,
    posterUrl: "/mockups/mock5.webp",
    hasPhone: true,
  },
  {
    id: 'rise',
    title: <>Rise with<br /><span className="text-white font-black">daily guidance</span></>,
    subtitle: <>Timely boosts and reminders aligned with your <span className="text-white font-semibold">mood, energy, and intentions.</span></>,
    hasPhone: false,
  },
  {
    id: 'testimonials',
    title: "Loved by people like you",
    subtitle: <>Authentic stories of <span className="text-white font-semibold">clarity, confidence, and balance</span> from SeeMe's early community.</>,
    hasPhone: false,
  },
  {
    id: 'cta',
    title: <>Begin your journey<br /><span className="text-white font-bold">today.</span></>,
    subtitle: "Start building your personal intelligence. Calmly, privately, and on your terms.",
    hasPhone: false,
  }
];

export const TestLandingPage = () => {
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Detect desktop on client side to avoid hydration mismatch
  useEffect(() => {
    setIsDesktop(window.innerWidth >= 768);
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Handle scroll to update active section
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('[data-section-index]');
      let currentActive = 0;
      
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        // If section is in the middle of the viewport
        if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
          currentActive = parseInt(section.getAttribute('data-section-index') || '0');
        }
      });
      
      setActiveSectionIndex(currentActive);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const currentSection = SECTIONS[activeSectionIndex];
  
  // Find the video needed for the current section
  // If current section has no video, keep showing the last valid video or the first one
  // But for this design, we want the phone to disappear or fade out if no phone.
  const activeVideoUrl = currentSection?.videoUrl || SECTIONS[0].videoUrl;
  const activePosterUrl = currentSection?.posterUrl || SECTIONS[0].posterUrl;
  const showPhone = currentSection?.hasPhone ?? false;

  return (
    <div className="bg-black min-h-screen text-white font-sans selection:bg-white/20">
      {/* 1. Optimized Background Layer - Only loads current + adjacent */}
      <div className="fixed inset-0 z-0">
        {BACKGROUNDS.map((bg: string, index: number) => {
          // Only render backgrounds within 1 index of active section
          const distance = Math.abs(index - activeSectionIndex);
          if (distance > 1) return null;
          
          return (
            <div
              key={`bg-${index}`}
              className="absolute inset-0 transition-opacity duration-700 ease-in-out"
              style={{
                backgroundImage: `url(${bg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                opacity: index === activeSectionIndex ? 1 : 0,
              }}
            />
          );
        })}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* 2. Sticky Phone Container - Single Video Instance */}
      <div className="fixed inset-0 z-10 pointer-events-none flex items-center justify-center">
        <div 
          className={`relative transition-all duration-700 ease-in-out transform ${
            showPhone ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
          }`}
          style={{
            width: '280px',
            height: '600px',
            transform: showPhone 
              ? (isDesktop ? 'translateX(20vw) translateY(0)' : 'translateY(10vh)') 
              : 'translateY(100vh)'
          }}
        >
          {/* Phone Frame */}
          <div className="absolute inset-0 bg-black rounded-[40px] border-[8px] border-neutral-800 shadow-2xl overflow-hidden">
            {/* Single SmartVideo Component - Source switches efficiently */}
            {/* Key is used to force re-render/transition if needed, or omit key to keep same element */}
            <SmartVideo
              key={activeVideoUrl} // Simple transition by re-mounting or remove key for seamless switch
              src={activeVideoUrl || ''}
              poster={activePosterUrl}
              className="w-full h-full object-cover"
              priority={activeSectionIndex === 0}
              disabled={false} // Enable for test
            />
          </div>
        </div>
      </div>

      {/* 3. Scrolling Content Sections */}
      <div className="relative z-20">
        {SECTIONS.map((section, index) => (
          <div 
            key={section.id}
            data-section-index={index}
            className="min-h-screen flex items-center p-6 md:p-20"
          >
            <div className={`max-w-xl transition-all duration-500 ${
              activeSectionIndex === index ? 'opacity-100 translate-y-0' : 'opacity-30 translate-y-10'
            }`}>
              {/* Text Content */}
              <div className="mb-6">
                <div className="text-4xl md:text-6xl mb-6 font-medium leading-tight text-white/90">
                  {section.title}
                </div>
                <div className="text-lg md:text-xl text-white/70 leading-relaxed font-light">
                  {section.subtitle}
                </div>
              </div>
              
              {/* Extra content for specific sections */}
              {section.id === 'coaches' && (
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[600px] md:h-[600px] pointer-events-none z-0">
                  {activeSectionIndex === index && COACHES.map((coach: any, i: number) => {
                    const angle = (i / COACHES.length) * Math.PI * 2;
                    const radius = isDesktop ? 350 : 160; 
                    const startX = Math.cos(angle) * radius;
                    const startY = Math.sin(angle) * radius;
                    
                    return (
                      <motion.div
                        key={coach.id}
                        initial={{ x: startX, y: startY, opacity: 0, scale: 0.8 }}
                        animate={{
                          x: [startX, 0],
                          y: [startY, 0],
                          opacity: [0, 1, 1, 0],
                          scale: [0.8, 1, 0.6, 0.3]
                        }}
                        transition={{
                          duration: 3,
                          delay: coach.delay,
                          ease: "easeInOut",
                          repeat: Infinity,
                          repeatDelay: 2
                        }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 md:w-16 md:h-16"
                      >
                        <div className="relative w-full h-full rounded-full border-2 border-white shadow-lg overflow-hidden">
                          <Image
                            src={coach.img}
                            alt={`Coach ${coach.id}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}

              {section.id === 'testimonials' && (
                <div className="mt-12 flex gap-4 overflow-x-auto pb-4 mask-linear-fade">
                   {REVIEWS.slice(0, 3).map((review, i) => (
                     <div key={i} className="bg-white/10 p-6 rounded-2xl min-w-[300px] border border-white/10 backdrop-blur-sm">
                       <p className="mb-4 text-sm opacity-80">"{review.text}"</p>
                       <p className="text-xs font-bold opacity-60">{review.name}</p>
                     </div>
                   ))}
                </div>
              )}

              {section.id === 'cta' && (
                <a
                  href="https://apps.apple.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 bg-white text-black px-8 py-4 rounded-full font-semibold hover:scale-105 transition-transform mt-8"
                >
                  Download on the App Store
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
