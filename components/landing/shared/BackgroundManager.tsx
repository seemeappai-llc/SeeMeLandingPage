'use client';

import React, { forwardRef } from 'react';

interface BackgroundManagerProps {
  backgrounds: string[];
  shouldReduceMotion: boolean;
  lowEndBgIndex: number;
  currentBgIndex: number;
  maxConcurrentBackgrounds: number;
}

export const BackgroundManager = forwardRef<HTMLDivElement, BackgroundManagerProps>(({
  backgrounds,
  shouldReduceMotion,
  lowEndBgIndex,
  currentBgIndex,
  maxConcurrentBackgrounds,
}, ref) => {
  return (
    <div ref={ref} className="fixed inset-0 w-screen h-screen z-0">
      {shouldReduceMotion ? (
        <div
          data-bg="low-end"
          className="absolute inset-0"
          style={{
            opacity: 1,
            backgroundImage: `url(${backgrounds[lowEndBgIndex] || backgrounds[0]})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      ) : (
        backgrounds.map((bg, index) => {
          const maxDistance = maxConcurrentBackgrounds - 1;
          const shouldRender = Math.abs(index - currentBgIndex) <= maxDistance || index === 0;
          if (!shouldRender) return null;

          return (
            <div
              key={`bg-${index}`}
              data-bg={index}
              className="absolute inset-0"
              style={{
                opacity: index === 0 ? 1 : 0,
                backgroundImage: `url(${bg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                willChange: index === currentBgIndex ? 'opacity' : 'auto',
                backfaceVisibility: 'hidden',
              }}
            />
          );
        })
      )}
      <div className="absolute inset-0 bg-black/40" />
    </div>
  );
});

BackgroundManager.displayName = 'BackgroundManager';
