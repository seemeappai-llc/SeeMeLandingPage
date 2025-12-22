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
    <div ref={ref} className="fixed inset-0 -z-10">
      {/* Temporarily disabled backgrounds to test crash issue */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800" />
      <div className="absolute inset-0 bg-black/40" />
    </div>
  );
});

BackgroundManager.displayName = 'BackgroundManager';
