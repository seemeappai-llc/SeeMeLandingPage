import { useEffect } from 'react';
import { preloadVideosSequentially } from '@/components/SmartVideo';
import { videoUrls } from '@/config/videoUrls';

export const useVideoPreloader = (
  imagesLoaded: boolean,
  isIOS: boolean,
  shouldReduceMotion: boolean
) => {
  useEffect(() => {
    if (!imagesLoaded) return;
    if (isIOS) return; // Skip video preloading on iOS

    if (shouldReduceMotion) {
      preloadVideosSequentially(
        [videoUrls.video1],
        []
      );
    } else {
      preloadVideosSequentially(
        [videoUrls.video1],
        [videoUrls.video2, videoUrls.video3, videoUrls.video4, videoUrls.video5]
      );
    }
  }, [imagesLoaded, isIOS, shouldReduceMotion]);
};
