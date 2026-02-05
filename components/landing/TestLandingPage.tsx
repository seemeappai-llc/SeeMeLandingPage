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
            className={`min-h-screen flex items-center p-6 md:p-20 relative ${
              section.id === 'testimonials' || section.id === 'cta' ? 'justify-center' : ''
            } ${section.id === 'hero' ? 'md:justify-start' : ''}`}
          >
            {/* Rise notifications - OUTSIDE content wrapper, spans full section width */}
            {section.id === 'rise' && (
              <div className="absolute inset-0 hidden md:block">
                <motion.div
                  drag
                  dragMomentum={false}
                  onDragEnd={(e, info) => console.log('notif5:', { x: info.point.x, y: info.point.y })}
                  whileDrag={{ scale: 1.05, cursor: 'grabbing' }}
                  className="absolute top-[10%] left-[55%] cursor-grab z-50"
                >
                  <Image src="/notifications/notif5.png" alt="Notification" width={280} height={90} />
                </motion.div>
                <motion.div
                  drag
                  dragMomentum={false}
                  onDragEnd={(e, info) => console.log('notif6:', { x: info.point.x, y: info.point.y })}
                  whileDrag={{ scale: 1.05, cursor: 'grabbing' }}
                  className="absolute top-[25%] left-[70%] cursor-grab z-50"
                >
                  <Image src="/notifications/notif6.png" alt="Notification" width={270} height={88} />
                </motion.div>
                <motion.div
                  drag
                  dragMomentum={false}
                  onDragEnd={(e, info) => console.log('notif3:', { x: info.point.x, y: info.point.y })}
                  whileDrag={{ scale: 1.05, cursor: 'grabbing' }}
                  className="absolute top-[40%] left-[58%] cursor-grab z-50"
                >
                  <Image src="/notifications/notif3.png" alt="Notification" width={285} height={92} />
                </motion.div>
                <motion.div
                  drag
                  dragMomentum={false}
                  onDragEnd={(e, info) => console.log('notif4:', { x: info.point.x, y: info.point.y })}
                  whileDrag={{ scale: 1.05, cursor: 'grabbing' }}
                  className="absolute top-[55%] left-[68%] cursor-grab z-50"
                >
                  <Image src="/notifications/notif4.png" alt="Notification" width={275} height={88} />
                </motion.div>
                <motion.div
                  drag
                  dragMomentum={false}
                  onDragEnd={(e, info) => console.log('notif1:', { x: info.point.x, y: info.point.y })}
                  whileDrag={{ scale: 1.05, cursor: 'grabbing' }}
                  className="absolute top-[70%] left-[62%] cursor-grab z-50"
                >
                  <Image src="/notifications/notif1.png" alt="Notification" width={280} height={90} />
                </motion.div>
                <motion.div
                  drag
                  dragMomentum={false}
                  onDragEnd={(e, info) => console.log('notif2:', { x: info.point.x, y: info.point.y })}
                  whileDrag={{ scale: 1.05, cursor: 'grabbing' }}
                  className="absolute top-[85%] left-[72%] cursor-grab z-50"
                >
                  <Image src="/notifications/notif2.png" alt="Notification" width={285} height={92} />
                </motion.div>
              </div>
            )}

            {/* Content wrapper */}
            <div className={`${section.id === 'testimonials' ? 'w-full max-w-6xl mx-auto' : section.id === 'hero' ? 'md:absolute md:left-[5vw] md:right-[calc(50%+20vw-100px)] md:top-1/2 md:-translate-y-1/2 md:flex md:flex-col md:items-center md:justify-center' : 'max-w-xl'} transition-all duration-500 ${
              activeSectionIndex === index ? 'opacity-100 translate-y-0' : 'opacity-30 translate-y-10'
            }`}>
              {/* Text Content */}
              <div className={`mb-6 ${section.id === 'testimonials' || section.id === 'cta' ? 'text-center' : ''} ${section.id === 'hero' ? 'md:text-center' : ''}`}>
                <div className="text-4xl md:text-6xl mb-6 font-medium leading-tight text-white/90">
                  {section.title}
                </div>
                <div className="text-lg md:text-xl text-white/70 leading-relaxed font-light">
                  {section.subtitle}
                </div>
              </div>

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
                <div className="overflow-hidden rounded-2xl mt-12 px-4 md:px-8">
                  <motion.div
                    className="flex gap-6"
                    initial={{ x: 0 }}
                    animate={{
                      x: -((350 + 24) * REVIEWS.length)
                    }}
                    transition={{
                      x: {
                        duration: 40,
                        repeat: Infinity,
                        ease: "linear",
                        repeatType: "loop"
                      }
                    }}
                  >
                    {[...REVIEWS, ...REVIEWS].map((review, i) => (
                      <div key={i} className="bg-white/[0.03] backdrop-blur-md p-6 rounded-xl w-[300px] md:w-[350px] border border-white/10 flex-shrink-0">
                        <div className="flex gap-1 mb-3">
                          {[...Array(review.rating)].map((_, j) => (
                            <svg key={j} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                            </svg>
                          ))}
                        </div>
                        <p className="text-xs font-semibold uppercase tracking-wider mb-3 text-white/50">{review.category}</p>
                        <p className="mb-4 text-sm leading-relaxed text-white/80">"{review.text}"</p>
                        <p className="text-xs font-semibold text-white/60">{review.name}</p>
                      </div>
                    ))}
                  </motion.div>
                </div>
              )}

              {section.id === 'cta' && (
                <div className="flex flex-col items-center">
                  <a
                    href="https://apps.apple.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 bg-white text-black px-8 py-4 rounded-full font-semibold hover:scale-105 transition-transform mt-8 shadow-lg"
                  >
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                    </svg>
                    Download on the App Store
                  </a>
                  <CTADisclaimer />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <footer className="relative z-20 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center justify-center gap-3 text-center">
          <div className="flex items-center gap-4 text-sm text-white/40">
            <a href="/privacy" className="hover:text-white/70 transition-colors">Privacy Policy</a>
            <span>·</span>
            <a href="mailto:info@seemeapp.ai" className="hover:text-white/70 transition-colors">Contact</a>
          </div>
          <p className="text-xs text-white/30">© 2025 SeeMe. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

// Disclaimer component
const CTADisclaimer = () => {
  const [disclaimerExpanded, setDisclaimerExpanded] = useState(false);

  return (
    <div className="mt-10 max-w-2xl mx-auto">
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

      {disclaimerExpanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="overflow-hidden"
        >
          <div className="bg-white/[0.02] backdrop-blur-sm rounded-xl p-5 mt-3 text-left border border-white/10">
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
    </div>
  );
};
