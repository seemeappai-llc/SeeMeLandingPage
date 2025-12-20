'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import SmartVideo from '@/components/SmartVideo';
import { videoUrls } from '@/config/videoUrls';
import { COACHES } from '../constants';

interface CoachesSectionProps {
  sectionRef: React.RefObject<HTMLDivElement | null>;
  activeSection: number;
  isIOS: boolean;
  shouldReduceMotion: boolean;
}

export const CoachesSection: React.FC<CoachesSectionProps> = ({
  sectionRef,
  activeSection,
  isIOS,
  shouldReduceMotion,
}) => {
  return (
    <div
      ref={sectionRef}
      className="absolute inset-0 flex items-center justify-center"
      style={{ opacity: 0, pointerEvents: 'none' }}
    >
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-20 px-4 md:-translate-x-12">
        <div className="text-center text-content w-full md:w-auto md:max-w-sm md:mb-0">
          <h2
            className="text-3xl md:text-5xl text-white/80 leading-[1.1]"
            style={{ fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif', fontWeight: 600 }}
          >
            Your network of<br />
            <span className="text-white font-bold">expert coaches</span>
          </h2>
          <p
            className="hidden md:block text-white/90 text-lg mt-6 font-normal"
            style={{ fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif' }}
          >
            Crafted with <span className="text-white font-semibold">real coaches and therapists</span>, supporting life, work, wellness, and mindset.
          </p>
        </div>

        <div className="relative rounded-[32px] border-4 border-white/30 bg-black shadow-lg overflow-hidden w-[240px] h-[520px] md:w-[280px] md:h-[615px] flex-shrink-0">
          {((shouldReduceMotion && activeSection === 1) || (!shouldReduceMotion && (activeSection === 0 || activeSection === 1 || activeSection === 2))) && (
            <SmartVideo
              src={videoUrls.video2}
              poster="/mockups/mock2.webp"
              priority={false}
              disabled={isIOS}
              className="w-full h-full object-cover rounded-[28px]"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          )}

          <AnimatePresence>
            {activeSection === 1 && COACHES.map((coach, index) => {
              const angle = (index / COACHES.length) * Math.PI * 2;
              const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 1024;
              const radius = isDesktop ? 700 : 360;
              const startX = Math.cos(angle) * radius;
              const startY = Math.sin(angle) * radius;
              const duration = isDesktop ? 3.2 : 2.5;

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
                    duration,
                    delay: coach.delay + 0.3,
                    ease: "easeInOut",
                    times: [0, 0.4, 0.8, 1]
                  }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 md:w-20 md:h-20 pointer-events-none"
                >
                  <div className="relative w-full h-full rounded-full border-4 border-white shadow-lg overflow-hidden">
                    <Image
                      src={coach.img}
                      alt={`Coach ${coach.id}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        <p
          className="md:hidden text-white/90 text-sm text-center font-normal px-2"
          style={{ fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif' }}
        >
          Crafted with <span className="text-white font-semibold">real coaches and therapists</span>, supporting life, work, wellness, and mindset.
        </p>
      </div>
    </div>
  );
};
