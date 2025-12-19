'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface ReviewsSectionProps {
  sectionRef: React.RefObject<HTMLDivElement | null>;
  activeSection: number;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  sectionRef,
  activeSection,
}) => {
  const [showLocked, setShowLocked] = useState(false);

  useEffect(() => {
    if (activeSection === 7) {
      const timer = setTimeout(() => {
        setShowLocked(true);
      }, 900);

      return () => {
        clearTimeout(timer);
        setShowLocked(false);
      };
    } else {
      setShowLocked(false);
    }
  }, [activeSection]);

  return (
    <div
      ref={sectionRef}
      className="absolute inset-0 flex items-center justify-center"
      style={{ opacity: 0, pointerEvents: 'none' }}
    >
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-20 px-4 md:-translate-x-12">
        <div className="text-center w-full md:w-auto md:max-w-sm md:mb-0">
          <h2
            className="text-3xl md:text-5xl text-white/80 leading-[1.1]"
            style={{
              fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
              fontWeight: 600
            }}
          >
            Your data.<br />
            <span className="text-white font-bold">Always your own.</span>
          </h2>
          <p
            className="hidden md:block text-white/90 text-lg mt-6 font-normal"
            style={{
              fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
            }}
          >
            Built <span className="text-white font-semibold">private-first</span> with on-device intelligence and secure optional cloud enhancements.
          </p>
        </div>

        <div className="relative flex items-center justify-center w-32 h-32 md:w-40 md:h-40 flex-shrink-0">
          {(activeSection === 6 || activeSection === 7 || activeSection === 8) && (
            <>
              <div
                className="absolute inset-0 transition-opacity duration-700"
                style={{ opacity: showLocked ? 0 : 1 }}
              >
                <Image
                  src="/unlock.png"
                  alt="Unlocked"
                  fill
                  className="object-contain brightness-0 invert"
                  sizes="160px"
                />
              </div>
              <div
                className="absolute inset-0 transition-opacity duration-700"
                style={{ opacity: showLocked ? 1 : 0 }}
              >
                <Image
                  src="/lock.png"
                  alt="Locked"
                  fill
                  className="object-contain brightness-0 invert"
                  sizes="160px"
                />
              </div>
            </>
          )}
        </div>

        <p
          className="md:hidden text-white/90 text-sm text-center font-normal px-2"
          style={{ fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif' }}
        >
          Built <span className="text-white font-semibold">private-first</span> with on-device intelligence and secure optional cloud enhancements.
        </p>
      </div>
    </div>
  );
};
