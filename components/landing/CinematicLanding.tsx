'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import SmartVideo from '@/components/SmartVideo';
import { videoUrls } from '@/config/videoUrls';
import { REVIEWS } from './data/reviews';

// --- Cinematic text reveal component ---
const CinematicText = ({
  children,
  delay = 0,
  duration = 0.8,
  className = '',
  onComplete,
}: {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  onComplete?: () => void;
}) => {
  useEffect(() => {
    if (onComplete) {
      const timer = setTimeout(onComplete, (delay + duration) * 1000 + 500);
      return () => clearTimeout(timer);
    }
  }, [delay, duration, onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      exit={{ opacity: 0, y: -20, filter: 'blur(5px)' }}
      transition={{ duration, delay, ease: [0.25, 0.4, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// --- Scene definitions ---
type Scene = {
  id: string;
  duration: number; // seconds
  background?: string;
  content: React.ReactNode;
};

// --- Main Cinematic Component ---
export const CinematicLanding = () => {
  const [currentScene, setCurrentScene] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [showControls, setShowControls] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [canScroll, setCanScroll] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Scene content - the "movie" script
  const scenes: Scene[] = [
    {
      id: 'open',
      duration: 3,
      background: '/backgrounds/backg3.webp', // Starry night
      content: (
        <div className="flex items-center justify-center h-full">
          <CinematicText className="text-center">
            <p className="text-white/40 text-lg md:text-xl tracking-[0.3em] uppercase">
              Imagine
            </p>
          </CinematicText>
        </div>
      ),
    },
    {
      id: 'problem1',
      duration: 4,
      background: '/backgrounds/backg4.webp', // City
      content: (
        <div className="flex items-center justify-center h-full px-8">
          <CinematicText className="text-center max-w-4xl">
            <h2 className="text-3xl md:text-6xl lg:text-7xl font-bold leading-tight">
              You have thoughts you've
              <br />
              <span className="text-white/50">never told anyone</span>
            </h2>
          </CinematicText>
        </div>
      ),
    },
    {
      id: 'problem2',
      duration: 4,
      background: '/backgrounds/backg3.webp',
      content: (
        <div className="flex items-center justify-center h-full px-8">
          <CinematicText className="text-center max-w-4xl">
            <h2 className="text-3xl md:text-6xl lg:text-7xl font-bold leading-tight">
              Patterns you can't see
              <br />
              <span className="text-white/50">in yourself</span>
            </h2>
          </CinematicText>
        </div>
      ),
    },
    {
      id: 'problem3',
      duration: 4,
      background: '/backgrounds/backg1.webp', // Mountains
      content: (
        <div className="flex items-center justify-center h-full px-8">
          <CinematicText className="text-center max-w-4xl">
            <h2 className="text-3xl md:text-6xl lg:text-7xl font-bold leading-tight">
              Questions that keep you
              <br />
              <span className="text-white/50">awake at 3am</span>
            </h2>
          </CinematicText>
        </div>
      ),
    },
    {
      id: 'transition',
      duration: 3,
      background: '/backgrounds/backg3.webp',
      content: (
        <div className="flex items-center justify-center h-full px-8">
          <CinematicText className="text-center">
            <p className="text-white/60 text-xl md:text-3xl font-light tracking-wide">
              What if there was someone who could help?
            </p>
          </CinematicText>
        </div>
      ),
    },
    {
      id: 'solution1',
      duration: 4,
      background: '/backgrounds/backg2.webp', // Clouds
      content: (
        <div className="flex items-center justify-center h-full px-8">
          <CinematicText className="text-center max-w-4xl">
            <h2 className="text-3xl md:text-6xl lg:text-7xl font-bold leading-tight">
              Someone who listens
              <br />
              <span className="text-white">without judgment</span>
            </h2>
          </CinematicText>
        </div>
      ),
    },
    {
      id: 'solution2',
      duration: 4,
      background: '/backgrounds/backg2.webp',
      content: (
        <div className="flex items-center justify-center h-full px-8">
          <CinematicText className="text-center max-w-4xl">
            <h2 className="text-3xl md:text-6xl lg:text-7xl font-bold leading-tight">
              Remembers
              <br />
              <span className="text-white">everything</span>
            </h2>
          </CinematicText>
        </div>
      ),
    },
    {
      id: 'solution3',
      duration: 4,
      background: '/backgrounds/backg5.webp', // Zen
      content: (
        <div className="flex items-center justify-center h-full px-8">
          <CinematicText className="text-center max-w-4xl">
            <h2 className="text-3xl md:text-6xl lg:text-7xl font-bold leading-tight">
              And keeps your secrets
              <br />
              <span className="text-white font-black">completely private</span>
            </h2>
          </CinematicText>
        </div>
      ),
    },
    {
      id: 'privacy',
      duration: 5,
      background: '/backgrounds/backg4.webp',
      content: (
        <div className="flex items-center justify-center h-full px-8">
          <CinematicText className="text-center max-w-3xl">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="mb-8"
            >
              <svg className="w-16 h-16 md:w-24 md:h-24 mx-auto text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </motion.div>
            <p className="text-lg md:text-2xl text-white/70 font-light leading-relaxed">
              Your data stays on your device.
              <br />
              <span className="text-white font-medium">No cloud. No compromise.</span>
            </p>
          </CinematicText>
        </div>
      ),
    },
    {
      id: 'reveal',
      duration: 5,
      background: '/backgrounds/backg6.webp', // Island
      content: (
        <div className="flex items-center justify-center h-full">
          <CinematicText className="text-center">
            <motion.h1
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="text-7xl md:text-[10rem] lg:text-[14rem] font-black tracking-tighter"
              style={{ textShadow: '0 0 100px rgba(255,255,255,0.2)' }}
            >
              SeeMe
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="text-lg md:text-2xl text-white/60 mt-6"
            >
              Your private personal intelligence
            </motion.p>
          </CinematicText>
        </div>
      ),
    },
    {
      id: 'phone',
      duration: 6,
      background: '/backgrounds/backg6.webp',
      content: (
        <div className="flex items-center justify-center h-full gap-8 md:gap-16 px-8">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 1 }}
            className="hidden md:block max-w-md"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              A network of expert coaches
            </h2>
            <p className="text-lg text-white/60">
              Crafted from real practitioners. Available whenever you need them.
            </p>
          </motion.div>

          {/* Phone mockup */}
          <motion.div
            initial={{ opacity: 0, y: 100, rotateY: -20 }}
            animate={{ opacity: 1, y: 0, rotateY: 0 }}
            transition={{ delay: 0.5, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
            style={{ perspective: '1000px' }}
          >
            <div className="relative w-[220px] h-[460px] md:w-[280px] md:h-[580px]">
              {/* Glow */}
              <div
                className="absolute -inset-8 rounded-[60px] opacity-40"
                style={{ background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.15) 0%, transparent 70%)' }}
              />
              {/* Phone */}
              <div className="absolute inset-0 bg-black rounded-[40px] md:rounded-[50px] border-[6px] md:border-[8px] border-neutral-800 shadow-2xl overflow-hidden">
                <SmartVideo
                  src={videoUrls.video1}
                  poster="/mockups/mock1.webp"
                  className="w-full h-full object-cover"
                  priority={true}
                />
              </div>
            </div>
          </motion.div>

          {/* Mobile text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="md:hidden absolute bottom-24 left-0 right-0 text-center px-8"
          >
            <h2 className="text-2xl font-bold mb-3">Expert coaches, always available</h2>
            <p className="text-sm text-white/60">Crafted from real practitioners</p>
          </motion.div>
        </div>
      ),
    },
    {
      id: 'features',
      duration: 5,
      background: '/backgrounds/backg5.webp',
      content: (
        <div className="flex items-center justify-center h-full px-8">
          <div className="text-center max-w-4xl">
            <CinematicText>
              <h2 className="text-3xl md:text-5xl font-bold mb-12">
                It learns what makes you, <span className="text-white/50">you</span>
              </h2>
            </CinematicText>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex flex-wrap justify-center gap-4"
            >
              {['Your sessions', 'Your reflections', 'Your calendar', 'Your health', 'Your patterns'].map((item, i) => (
                <motion.span
                  key={item}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1 + i * 0.15 }}
                  className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-full text-sm md:text-base text-white/70"
                >
                  {item}
                </motion.span>
              ))}
            </motion.div>
          </div>
        </div>
      ),
    },
    {
      id: 'testimonial',
      duration: 6,
      background: '/backgrounds/backg2.webp',
      content: (
        <div className="flex items-center justify-center h-full px-8">
          <CinematicText className="text-center max-w-3xl">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.8 }}
              className="bg-white/[0.03] backdrop-blur-sm border border-white/10 rounded-3xl p-8 md:p-12"
            >
              <p className="text-xl md:text-3xl font-light italic text-white/80 leading-relaxed mb-8">
                "{REVIEWS[5].text}"
              </p>
              <p className="text-white/40">{REVIEWS[5].name}</p>
            </motion.div>
          </CinematicText>
        </div>
      ),
    },
    {
      id: 'cta',
      duration: 0, // Final scene - no auto-advance
      background: '/backgrounds/backg6.webp',
      content: (
        <div className="flex flex-col items-center justify-center h-full px-8">
          <CinematicText className="text-center">
            <h2 className="text-5xl md:text-8xl font-black mb-8">
              Begin
            </h2>
            <p className="text-lg md:text-xl text-white/50 mb-12 max-w-md">
              Start your journey. Privately. On your terms.
            </p>
            <motion.a
              href="https://apps.apple.com"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-3 bg-white text-black px-10 py-5 rounded-full font-semibold text-lg shadow-2xl"
            >
              <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              Download for iOS
            </motion.a>
          </CinematicText>

          {/* Replay button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            onClick={() => {
              setCurrentScene(0);
              setIsPlaying(true);
            }}
            className="absolute bottom-12 text-white/30 hover:text-white/60 transition-colors text-sm flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Watch again
          </motion.button>
        </div>
      ),
    },
  ];

  // Auto-advance scenes
  useEffect(() => {
    if (!isPlaying) return;

    const scene = scenes[currentScene];
    if (scene.duration === 0) {
      setIsPlaying(false);
      return;
    }

    timeoutRef.current = setTimeout(() => {
      if (currentScene < scenes.length - 1) {
        setCurrentScene(prev => prev + 1);
      } else {
        setIsPlaying(false);
      }
    }, scene.duration * 1000);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [currentScene, isPlaying, scenes.length]);

  // Show controls on mouse move
  useEffect(() => {
    let hideTimeout: NodeJS.Timeout;

    const handleMouseMove = () => {
      setShowControls(true);
      clearTimeout(hideTimeout);
      hideTimeout = setTimeout(() => setShowControls(false), 3000);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(hideTimeout);
    };
  }, []);

  // Handle click to advance
  const handleClick = useCallback(() => {
    if (!hasInteracted) {
      setHasInteracted(true);
      return;
    }

    if (currentScene < scenes.length - 1) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setCurrentScene(prev => prev + 1);
    }
  }, [currentScene, hasInteracted, scenes.length]);

  // Get current background
  const currentBg = scenes[currentScene]?.background || '/backgrounds/backg3.webp';

  // Calculate progress
  const progress = ((currentScene + 1) / scenes.length) * 100;

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen bg-black text-white overflow-hidden cursor-pointer select-none"
      onClick={handleClick}
    >
      {/* Background layer */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentBg}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${currentBg})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        </AnimatePresence>
        {/* Cinematic bars overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60" />
        {/* Vignette */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.4) 100%)',
          }}
        />
      </div>

      {/* Scene content */}
      <div className="relative z-10 w-full h-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={scenes[currentScene].id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full"
          >
            {scenes[currentScene].content}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 z-30 h-1 bg-white/10">
        <motion.div
          className="h-full bg-white/50"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Controls overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showControls ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="absolute top-0 left-0 right-0 z-40 p-6 flex items-center justify-between"
      >
        {/* Logo */}
        <div className="text-white/60 font-bold tracking-tight">SeeMe</div>

        {/* Control buttons */}
        <div className="flex items-center gap-4">
          {/* Scene indicator */}
          <span className="text-white/40 text-sm">
            {currentScene + 1} / {scenes.length}
          </span>

          {/* Play/Pause */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsPlaying(!isPlaying);
            }}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            {isPlaying ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          {/* Skip to end */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setCurrentScene(scenes.length - 1);
              setIsPlaying(false);
            }}
            className="text-white/40 hover:text-white/70 transition-colors text-sm"
          >
            Skip
          </button>
        </div>
      </motion.div>

      {/* Click to continue hint (first scene only) */}
      {!hasInteracted && currentScene === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-16 left-0 right-0 z-30 text-center"
        >
          <p className="text-white/30 text-sm">Click anywhere to continue</p>
        </motion.div>
      )}

      {/* Scene navigation dots */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 z-30 hidden md:flex flex-col gap-2">
        {scenes.map((_, i) => (
          <button
            key={i}
            onClick={(e) => {
              e.stopPropagation();
              setCurrentScene(i);
            }}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              i === currentScene ? 'bg-white scale-125' : 'bg-white/30 hover:bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default CinematicLanding;
