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
          const distance = Math.abs(index - currentBgIndex);
          const isCurrent = index === currentBgIndex;

          // Render if it's the current one, or within safe range
          // With limit 2, we allow distance < 2 (0 and 1) -> Current and Neighbor
          const shouldRender = distance < maxConcurrentBackgrounds;

          if (!shouldRender) return null;

          return (
            <div
              key={`bg-${index}`}
              data-bg={index}
              className="absolute inset-0"
              style={{
                opacity: isCurrent ? 1 : 0,
                backgroundImage: `url(${bg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                willChange: isCurrent ? 'opacity' : 'auto',
                // Important: Ensure we don't hide the neighbor we are crossfading to!
                visibility: 'visible',
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
