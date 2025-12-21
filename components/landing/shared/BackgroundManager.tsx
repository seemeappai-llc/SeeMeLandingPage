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
          // Render all backgrounds so V2 scroll animation can control their opacities
          // V2 handles the crossfading logic
          return (
            <div
              key={`bg-${index}`}
              data-bg={index}
              className="absolute inset-0"
              style={{
                opacity: 0, // V2 will control this via gsap.set
                backgroundImage: `url(${bg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
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
