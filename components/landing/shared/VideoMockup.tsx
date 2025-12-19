'use client';

import React from 'react';
import SmartVideo from '@/components/SmartVideo';

interface VideoMockupProps {
  videoUrl: string;
  posterUrl?: string;
  isActive: boolean;
  disabled?: boolean;
  priority?: boolean;
  className?: string;
  objectPosition?: string;
}

export const VideoMockup: React.FC<VideoMockupProps> = ({
  videoUrl,
  posterUrl,
  isActive,
  disabled = false,
  priority = false,
  className = 'w-full h-full object-cover rounded-[28px]',
  objectPosition = 'center 45%',
}) => {
  // Directly render SmartVideo - isActive is handled by parent's conditional render
  return (
    <SmartVideo
      src={videoUrl}
      poster={posterUrl}
      disabled={disabled}
      priority={priority}
      className={className}
      style={{ objectPosition }}
    />
  );
};
