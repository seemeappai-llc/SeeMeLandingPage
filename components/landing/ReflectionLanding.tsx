'use client';

import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import SmartVideo from '@/components/SmartVideo';
import { videoUrls } from '@/config/videoUrls';
import { REVIEWS } from './data/reviews';

// --- Breathing animation for the entire experience ---
const useBreathing = () => {
  const [breath, setBreath] = useState(0);
  useEffect(() => {
    let frame: number;
    let start = Date.now();
    const animate = () => {
      const elapsed = (Date.now() - start) / 1000;
      setBreath(Math.sin(elapsed * 0.5) * 0.5 + 0.5); // 0 to 1, slow cycle
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);
  return breath;
};

// --- Floating particles for cosmic sections (client-only to avoid hydration mismatch) ---
const FloatingParticles = ({ count = 30, isActive }: { count?: number; isActive: boolean }) => {
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    size: number;
    duration: number;
    delay: number;
  }>>([]);

  // Generate particles only on client to avoid hydration mismatch
  useEffect(() => {
    const generated = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 20 + 20,
      delay: Math.random() * 5,
    }));
    setParticles(generated);
  }, [count]);

  if (particles.length === 0) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
          }}
          initial={{ opacity: 0 }}
          animate={{
            opacity: isActive ? [0, 0.6, 0] : 0,
            y: isActive ? [0, -100, -200] : 0,
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );
};

// --- Typewriter effect ---
const TypeWriter = ({
  text,
  delay = 0,
  speed = 50,
  className = '',
  onComplete
}: {
  text: string;
  delay?: number;
  speed?: number;
  className?: string;
  onComplete?: () => void;
}) => {
  const [displayed, setDisplayed] = useState('');
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const startTimer = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(startTimer);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    if (displayed.length < text.length) {
      const timer = setTimeout(() => {
        setDisplayed(text.slice(0, displayed.length + 1));
      }, speed);
      return () => clearTimeout(timer);
    } else if (onComplete) {
      onComplete();
    }
  }, [started, displayed, text, speed, onComplete]);

  return (
    <span className={className}>
      {displayed}
      {started && displayed.length < text.length && (
        <span className="animate-pulse">|</span>
      )}
    </span>
  );
};

// --- Cursor glow effect ---
const CursorGlow = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
    };
    const handleLeave = () => setIsVisible(false);

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseleave', handleLeave);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseleave', handleLeave);
    };
  }, []);

  return (
    <div
      className="fixed pointer-events-none z-50 hidden md:block"
      style={{
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -50%)',
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.3s ease',
      }}
    >
      <div
        className="w-[400px] h-[400px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%)',
        }}
      />
    </div>
  );
};

// --- Floating review component ---
const FloatingReview = ({
  review,
  index,
  isActive
}: {
  review: typeof REVIEWS[0];
  index: number;
  isActive: boolean;
}) => {
  const positions = [
    { x: '5%', y: '20%' },
    { x: '70%', y: '15%' },
    { x: '15%', y: '60%' },
    { x: '65%', y: '55%' },
    { x: '40%', y: '75%' },
    { x: '80%', y: '40%' },
  ];

  const pos = positions[index % positions.length];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
      animate={{
        opacity: isActive ? 0.9 : 0,
        scale: isActive ? 1 : 0.9,
        filter: isActive ? 'blur(0px)' : 'blur(10px)'
      }}
      transition={{ duration: 1.5, delay: index * 0.3 }}
      className="absolute hidden md:block max-w-xs"
      style={{ left: pos.x, top: pos.y }}
    >
      <div className="bg-white/[0.02] backdrop-blur-sm border border-white/5 rounded-2xl p-6">
        <p className="text-white/60 text-sm leading-relaxed italic mb-3">
          "{review.text}"
        </p>
        <p className="text-white/30 text-xs">{review.name}</p>
      </div>
    </motion.div>
  );
};

// --- Coach presence component ---
const CoachPresence = ({
  src,
  position,
  delay,
  isActive
}: {
  src: string;
  position: 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  delay: number;
  isActive: boolean;
}) => {
  const positionStyles: Record<string, string> = {
    'left': 'left-[5%] top-1/2 -translate-y-1/2',
    'right': 'right-[5%] top-1/2 -translate-y-1/2',
    'top-left': 'left-[10%] top-[15%]',
    'top-right': 'right-[10%] top-[15%]',
    'bottom-left': 'left-[8%] bottom-[20%]',
    'bottom-right': 'right-[8%] bottom-[20%]',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{
        opacity: isActive ? 0.6 : 0,
        scale: isActive ? 1 : 0.8,
      }}
      transition={{ duration: 2, delay, ease: 'easeOut' }}
      className={`absolute ${positionStyles[position]} hidden md:block`}
    >
      <div className="relative w-20 h-20 md:w-28 md:h-28 rounded-full overflow-hidden border border-white/10">
        <Image
          src={src}
          alt="Coach"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      </div>
    </motion.div>
  );
};

// --- Dreamy Phone Glimpse ---
const PhoneGlimpse = ({
  isActive,
  videoUrl,
  posterUrl,
}: {
  isActive: boolean;
  videoUrl: string;
  posterUrl: string;
}) => {
  return (
    <motion.div
      className="absolute right-[5%] md:right-[10%] top-1/2 -translate-y-1/2 z-20 pointer-events-none"
      initial={{ opacity: 0, x: 100, rotateY: -15 }}
      animate={{
        opacity: isActive ? 1 : 0,
        x: isActive ? 0 : 100,
        rotateY: isActive ? -5 : -15,
      }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      style={{
        perspective: '1000px',
      }}
    >
      <div
        className="relative w-[180px] h-[380px] md:w-[240px] md:h-[500px]"
        style={{
          transform: 'perspective(1000px)',
        }}
      >
        {/* Glow effect */}
        <div
          className="absolute -inset-8 rounded-[60px] opacity-30"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.15) 0%, transparent 70%)',
          }}
        />
        {/* Phone frame */}
        <div className="absolute inset-0 bg-black rounded-[36px] md:rounded-[44px] border-[6px] md:border-[8px] border-neutral-800/80 shadow-2xl overflow-hidden">
          <SmartVideo
            src={videoUrl}
            poster={posterUrl}
            className="w-full h-full object-cover"
            priority={false}
            disabled={!isActive}
          />
        </div>
        {/* Reflection overlay */}
        <div
          className="absolute inset-0 rounded-[36px] md:rounded-[44px] pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%, transparent 100%)',
          }}
        />
      </div>
    </motion.div>
  );
};

// --- Mobile review carousel ---
const MobileReviewCarousel = ({ isActive }: { isActive: boolean }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!isActive) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % REVIEWS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isActive]);

  return (
    <div className="absolute bottom-24 left-4 right-4 md:hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 20 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="bg-white/[0.03] backdrop-blur-sm border border-white/10 rounded-2xl p-5"
        >
          <p className="text-white/60 text-sm italic mb-3 leading-relaxed">
            "{REVIEWS[currentIndex].text}"
          </p>
          <p className="text-white/30 text-xs">{REVIEWS[currentIndex].name}</p>
        </motion.div>
      </AnimatePresence>
      {/* Dots indicator */}
      <div className="flex justify-center gap-2 mt-4">
        {REVIEWS.map((_, i) => (
          <div
            key={i}
            className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
              i === currentIndex ? 'bg-white/50' : 'bg-white/20'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

// --- Main component ---
export const ReflectionLanding = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<'question' | 'reveal' | 'journey'>('question');
  const [scrollProgress, setScrollProgress] = useState(0);
  const breath = useBreathing();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  });

  // Smooth scroll progress
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 50, damping: 20 });

  useEffect(() => {
    const unsubscribe = smoothProgress.on('change', (v) => setScrollProgress(v));
    return unsubscribe;
  }, [smoothProgress]);

  // Phase transitions
  useEffect(() => {
    if (phase === 'question') {
      const timer = setTimeout(() => setPhase('reveal'), 3000);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  useEffect(() => {
    if (phase === 'reveal') {
      const timer = setTimeout(() => setPhase('journey'), 2000);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  // Background morphing based on scroll
  const bgIndex = Math.min(5, Math.floor(scrollProgress * 6));
  const bgOpacity = 1 - ((scrollProgress * 6) % 1) * 0.3; // Slight fade during transition

  // Section visibility - completely exclusive, no overlap at all
  const activeSection =
    scrollProgress < 0.143 ? 'hero' :
    scrollProgress < 0.286 ? 'coaches' :
    scrollProgress < 0.429 ? 'insights' :
    scrollProgress < 0.572 ? 'privacy' :
    scrollProgress < 0.715 ? 'rise' :
    scrollProgress < 0.858 ? 'reviews' : 'cta';

  const isHeroActive = activeSection === 'hero';
  const isCoachesActive = activeSection === 'coaches';
  const isInsightsActive = activeSection === 'insights';
  const isPrivacyActive = activeSection === 'privacy';
  const isRiseActive = activeSection === 'rise';
  const isReviewsActive = activeSection === 'reviews';
  const isCTAActive = activeSection === 'cta';

  // Phone visibility - show during specific sections
  const showPhone = isInsightsActive || isPrivacyActive;
  const currentVideoIndex = isPrivacyActive ? 4 : 2; // video3 for insights, video5 for privacy
  const videoSources = [videoUrls.video1, videoUrls.video2, videoUrls.video3, videoUrls.video4, videoUrls.video5];
  const posterSources = ['/mockups/mock1.webp', '/mockups/mock2.webp', '/mockups/mock3.webp', '/mockups/mock4.webp', '/mockups/mock5.webp'];

  // Show particles during starry/cosmic section (backg3)
  const showParticles = bgIndex === 2;

  const backgrounds = [
    '/backgrounds/backg1.webp',
    '/backgrounds/backg2.webp',
    '/backgrounds/backg3.webp',
    '/backgrounds/backg4.webp',
    '/backgrounds/backg5.webp',
    '/backgrounds/backg6.webp',
  ];

  return (
    <div
      ref={containerRef}
      className="relative bg-black text-white selection:bg-white/20"
      style={{ height: '600vh' }}
    >
      {/* Cursor glow */}
      <CursorGlow />

      {/* Background layer with morphing */}
      <div className="fixed inset-0 z-0">
        {backgrounds.map((bg, index) => (
          <motion.div
            key={bg}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{
              opacity: index === bgIndex ? 1 : 0,
              scale: 1 + (breath * 0.02), // Subtle breathing
            }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
            style={{
              backgroundImage: `url(${bg})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        ))}
        {/* Dark overlay that lightens as you scroll */}
        <div
          className="absolute inset-0 transition-opacity duration-1000"
          style={{
            background: `linear-gradient(to bottom,
              rgba(0,0,0,${0.7 - scrollProgress * 0.2}) 0%,
              rgba(0,0,0,${0.5 - scrollProgress * 0.1}) 50%,
              rgba(0,0,0,${0.7 - scrollProgress * 0.2}) 100%
            )`,
          }}
        />
        {/* Floating particles during cosmic section */}
        <FloatingParticles count={40} isActive={showParticles} />
      </div>

      {/* Opening question phase */}
      <AnimatePresence>
        {phase === 'question' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black"
          >
            <h1 className="text-2xl md:text-4xl font-light text-white/80 text-center px-8">
              <TypeWriter
                text="When did you last truly pause?"
                speed={80}
              />
            </h1>
            {/* Skip button */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              transition={{ delay: 1.5 }}
              onClick={() => setPhase('journey')}
              className="absolute bottom-12 text-xs text-white/40 hover:text-white/60 transition-colors"
            >
              Skip intro
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reveal phase - brief flash of light */}
      <AnimatePresence>
        {phase === 'reveal' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.3, 0] }}
            transition={{ duration: 2, times: [0, 0.3, 1] }}
            className="fixed inset-0 z-50 bg-white pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* Dreamy phone glimpse */}
      <PhoneGlimpse
        isActive={showPhone}
        videoUrl={videoSources[currentVideoIndex]}
        posterUrl={posterSources[currentVideoIndex]}
      />

      {/* Main content - fixed position, content changes based on scroll */}
      <div className="fixed inset-0 z-10 flex items-center justify-center overflow-hidden">

        {/* Hero section */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center px-6"
          animate={{
            opacity: isHeroActive ? 1 : 0,
            y: isHeroActive ? 0 : -50,
          }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            animate={{ scale: 1 + breath * 0.02 }}
            className="text-center"
          >
            <h1
              className="text-7xl md:text-[12rem] font-black tracking-tighter mb-6"
              style={{
                textShadow: '0 0 80px rgba(255,255,255,0.1)',
              }}
            >
              SeeMe
            </h1>
            <p className="text-lg md:text-2xl text-white/60 font-light max-w-xl mx-auto">
              Private personal intelligence for your growth
            </p>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-20"
            animate={{ y: [0, 10, 0], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="w-6 h-10 border-2 border-white/20 rounded-full flex items-start justify-center p-2">
              <motion.div
                className="w-1 h-2 bg-white/40 rounded-full"
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
          </motion.div>
        </motion.div>

        {/* Coaches section */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{
            opacity: isCoachesActive ? 1 : 0,
          }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center px-6 max-w-3xl">
            <motion.h2
              className="text-4xl md:text-7xl font-bold mb-8"
              animate={{ y: isCoachesActive ? 0 : 30 }}
              transition={{ duration: 0.8 }}
            >
              A network of minds,<br />
              <span className="text-white/60">attuned to yours</span>
            </motion.h2>
            <motion.p
              className="text-lg md:text-xl text-white/50 max-w-lg mx-auto"
              animate={{ y: isCoachesActive ? 0 : 20, opacity: isCoachesActive ? 1 : 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Expert coaches crafted from real practitioners in life, work, wellness, and mindset.
            </motion.p>
          </div>

          {/* Coach faces emerging at edges */}
          <CoachPresence src="/coaches/c1.png" position="left" delay={0} isActive={isCoachesActive} />
          <CoachPresence src="/coaches/c2.png" position="right" delay={0.3} isActive={isCoachesActive} />
          <CoachPresence src="/coaches/c3.png" position="top-left" delay={0.6} isActive={isCoachesActive} />
          <CoachPresence src="/coaches/c4.png" position="top-right" delay={0.9} isActive={isCoachesActive} />
          <CoachPresence src="/coaches/c5.png" position="bottom-left" delay={1.2} isActive={isCoachesActive} />
          <CoachPresence src="/coaches/c6.png" position="bottom-right" delay={1.5} isActive={isCoachesActive} />
        </motion.div>

        {/* Insights section */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{
            opacity: isInsightsActive ? 1 : 0,
          }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center px-6 max-w-4xl">
            <motion.h2
              className="text-4xl md:text-7xl font-bold mb-8"
              animate={{ y: isInsightsActive ? 0 : 30 }}
            >
              It learns<br />
              <span className="bg-gradient-to-r from-white via-white/80 to-white/40 bg-clip-text text-transparent">
                what you can't explain
              </span>
            </motion.h2>
            <motion.div
              className="flex flex-wrap justify-center gap-4 text-sm md:text-base text-white/40"
              animate={{ opacity: isInsightsActive ? 1 : 0 }}
              transition={{ delay: 0.4 }}
            >
              {['Sessions', 'Reflections', 'Calendar', 'Health', 'Screen time'].map((item, i) => (
                <motion.span
                  key={item}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{
                    opacity: isInsightsActive ? 0.6 : 0,
                    y: isInsightsActive ? 0 : 10
                  }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="px-4 py-2 border border-white/10 rounded-full"
                >
                  {item}
                </motion.span>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Privacy section */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{
            opacity: isPrivacyActive ? 1 : 0,
          }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center px-6 max-w-3xl">
            <motion.div
              className="mb-8"
              animate={{ scale: isPrivacyActive ? 1 : 0.8, opacity: isPrivacyActive ? 1 : 0 }}
            >
              <svg
                className="w-16 h-16 md:w-24 md:h-24 mx-auto text-white/20"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </motion.div>
            <motion.h2
              className="text-4xl md:text-7xl font-bold mb-8"
              animate={{ y: isPrivacyActive ? 0 : 30 }}
            >
              Your thoughts<br />
              <span className="text-white/50">stay yours</span>
            </motion.h2>
            <motion.p
              className="text-lg text-white/40 max-w-md mx-auto"
              animate={{ opacity: isPrivacyActive ? 1 : 0 }}
              transition={{ delay: 0.3 }}
            >
              Private by design. Your data never leaves your control.
            </motion.p>
          </div>
        </motion.div>

        {/* Rise section */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{
            opacity: isRiseActive ? 1 : 0,
          }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center px-6 max-w-3xl">
            <motion.h2
              className="text-4xl md:text-7xl font-bold mb-8"
              animate={{ y: isRiseActive ? 0 : 30 }}
            >
              Rise with<br />
              <span className="font-black">daily guidance</span>
            </motion.h2>
            <motion.p
              className="text-lg text-white/50 max-w-md mx-auto"
              animate={{ opacity: isRiseActive ? 1 : 0 }}
              transition={{ delay: 0.2 }}
            >
              Timely nudges aligned with your mood, energy, and intentions.
            </motion.p>
          </div>

          {/* Floating notifications */}
          <motion.div
            className="absolute right-[10%] top-[20%] hidden md:block"
            animate={{
              opacity: isRiseActive ? 1 : 0,
              x: isRiseActive ? 0 : 50,
            }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <Image src="/notifications/notif1.png" alt="" width={280} height={90} className="rounded-xl shadow-2xl" />
          </motion.div>
          <motion.div
            className="absolute right-[15%] top-[40%] hidden md:block"
            animate={{
              opacity: isRiseActive ? 1 : 0,
              x: isRiseActive ? 0 : 50,
            }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <Image src="/notifications/notif3.png" alt="" width={270} height={88} className="rounded-xl shadow-2xl" />
          </motion.div>
          <motion.div
            className="absolute right-[8%] top-[60%] hidden md:block"
            animate={{
              opacity: isRiseActive ? 1 : 0,
              x: isRiseActive ? 0 : 50,
            }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            <Image src="/notifications/notif5.png" alt="" width={260} height={85} className="rounded-xl shadow-2xl" />
          </motion.div>
        </motion.div>

        {/* Reviews section - floating testimonials */}
        <motion.div
          className="absolute inset-0"
          animate={{
            opacity: isReviewsActive ? 1 : 0,
          }}
          transition={{ duration: 0.8 }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.h2
              className="text-4xl md:text-6xl font-bold text-center z-10"
              animate={{ y: isReviewsActive ? 0 : 30, opacity: isReviewsActive ? 1 : 0 }}
            >
              Stories of<br />
              <span className="text-white/50">transformation</span>
            </motion.h2>
          </div>

          {REVIEWS.map((review, index) => (
            <FloatingReview
              key={index}
              review={review}
              index={index}
              isActive={isReviewsActive}
            />
          ))}

          {/* Mobile reviews - auto-cycling carousel */}
          <MobileReviewCarousel isActive={isReviewsActive} />
        </motion.div>

        {/* CTA section */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center"
          animate={{
            opacity: isCTAActive ? 1 : 0,
          }}
          transition={{ duration: 0.8 }}
        >
          <motion.h2
            className="text-5xl md:text-8xl font-black text-center mb-12 px-6"
            animate={{
              y: isCTAActive ? 0 : 50,
              scale: isCTAActive ? 1 : 0.9,
            }}
            transition={{ duration: 0.8 }}
          >
            Begin
          </motion.h2>

          <motion.a
            href="https://apps.apple.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative px-12 py-5 rounded-full overflow-hidden"
            animate={{ opacity: isCTAActive ? 1 : 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full" />
            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300 rounded-full" />
            <span className="relative flex items-center gap-3 text-white font-medium">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              Download for iOS
            </span>
          </motion.a>

          {/* Disclaimer */}
          <motion.p
            className="absolute bottom-20 text-xs text-white/20 text-center max-w-md px-6"
            animate={{ opacity: isCTAActive ? 1 : 0 }}
            transition={{ delay: 0.5 }}
          >
            SeeMe provides coaching and reflection tools, not medical or mental health services.
          </motion.p>
        </motion.div>
      </div>

      {/* Progress indicator */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col gap-2">
        {['', '', '', '', '', '', ''].map((_, i) => (
          <motion.div
            key={i}
            className="w-1 h-8 rounded-full bg-white/10 overflow-hidden"
          >
            <motion.div
              className="w-full bg-white/40 rounded-full"
              animate={{
                height: scrollProgress >= (i / 7) && scrollProgress < ((i + 1) / 7)
                  ? '100%'
                  : scrollProgress >= ((i + 1) / 7) ? '100%' : '0%',
              }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>
        ))}
      </div>

      {/* Footer - only visible at bottom */}
      <motion.footer
        className="fixed bottom-0 left-0 right-0 z-30 py-6"
        animate={{ opacity: isCTAActive ? 1 : 0 }}
      >
        <div className="flex items-center justify-center gap-6 text-xs text-white/30">
          <a href="/privacy" className="hover:text-white/50 transition-colors">Privacy</a>
          <span>·</span>
          <a href="mailto:info@seemeapp.ai" className="hover:text-white/50 transition-colors">Contact</a>
          <span>·</span>
          <span>© 2025 SeeMe</span>
        </div>
      </motion.footer>
    </div>
  );
};

export default ReflectionLanding;
