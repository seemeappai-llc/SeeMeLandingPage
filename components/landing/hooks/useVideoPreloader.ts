import { useEffect } from 'react';
import { preloadVideosSequentially } from '@/components/SmartVideo';
import { videoUrls } from '@/config/videoUrls';

export const useVideoPreloader = (
  imagesLoaded: boolean,
  isIOS: boolean,
  shouldReduceMotion: boolean
) => {
  useEffect(() => {
    // Disabled video preloading to reduce memory usage
    // Videos will load on-demand when their section becomes active
    // This prevents loading all 5 videos into memory at once
  }, [imagesLoaded, isIOS, shouldReduceMotion]);
};
