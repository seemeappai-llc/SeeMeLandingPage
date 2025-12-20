'use client';

import React from 'react';
import { motion } from 'framer-motion';
import SmartVideo from '@/components/SmartVideo';
import { videoUrls } from '@/config/videoUrls';

interface HeroSectionProps {
  sectionRef: React.RefObject<HTMLDivElement | null>;
  activeSection: number;
  isIOS: boolean;
  shouldReduceMotion: boolean;
  onScrollIndicatorClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  sectionRef,
  activeSection,
  isIOS,
  shouldReduceMotion,
  onScrollIndicatorClick,
}) => {
  return (
    <div
      ref={sectionRef}
      className="absolute inset-0 flex items-center justify-start"
      style={{
        opacity: 1,
        pointerEvents: 'auto',
        paddingTop: 'max(env(safe-area-inset-top, 0px) + 3rem, 4rem)',
        paddingBottom: 'max(env(safe-area-inset-bottom), 2rem)',
      }}
    >
      <div
        className="relative z-10 flex flex-col items-center w-full max-w-7xl px-4 md:px-8 mx-auto"
        style={{ gap: 'clamp(1rem, 2vh, 2rem)' }}
      >
        <div className="flex flex-col items-center flex-shrink-0">
          <h1
            className="font-black tracking-tight text-white"
            style={{
              fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
              fontWeight: 900,
              fontSize: 'clamp(3.5rem, 14vw, 9rem)',
              lineHeight: '1',
              marginBottom: 'clamp(0.5rem, 1vh, 1rem)'
            }}
          >
            SeeMe
          </h1>

          <p
            className="text-white/90 text-center px-4 font-medium"
            style={{
              fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
              fontSize: 'clamp(0.875rem, 2.5vw, 1.6rem)',
              maxWidth: '90vw',
              lineHeight: '1.4'
            }}
          >
            Private personal intelligence for your growth
          </p>
        </div>

        <div
          className="relative rounded-[30px] border-4 border-white/30 bg-black shadow-lg overflow-hidden flex-shrink-0"
          style={{
            width: '240px',
            height: '528px',
            marginTop: 'clamp(0.5rem, 1vh, 1.5rem)'
          }}
        >
          {((!shouldReduceMotion && activeSection <= 1) || (shouldReduceMotion && activeSection === 0)) && (
            <SmartVideo
              src={videoUrls.video1}
              poster="/mockups/mock1.webp"
              priority={true}
              disabled={isIOS}
              className="rounded-[28px]"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center 45%'
              }}
            />
          )}
        </div>

        <motion.div
          className="flex flex-col items-center gap-2 cursor-pointer mt-4 md:mt-1"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.6 }}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95, y: 1 }}
          onClick={onScrollIndicatorClick}
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="opacity-70"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};
