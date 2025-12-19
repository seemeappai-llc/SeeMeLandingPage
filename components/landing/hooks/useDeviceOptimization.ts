import { useState, useEffect } from 'react';
import { getDeviceCapabilities, getAnimationConfig } from '@/lib/deviceDetection';
import type { DeviceCapabilities } from '@/lib/deviceDetection';

export interface AnimConfig {
  scrollScrub: number;
  snapDuration: { min: number; max: number };
  snapDelay: number;
  enableBackgroundTransitions: boolean;
  enableParallax: boolean;
  enableBlur: boolean;
}

export const useDeviceOptimization = () => {
  const [deviceCapabilities, setDeviceCapabilities] = useState<DeviceCapabilities>({
    isLowEndDevice: false,
    isMobile: false,
    isIOS: false,
    shouldReduceMotion: false,
    maxConcurrentBackgrounds: 3,
    maxConcurrentVideos: 2,
  });

  const [animConfig, setAnimConfig] = useState<AnimConfig>({
    scrollScrub: 1.2,
    snapDuration: { min: 0.4, max: 1.0 },
    snapDelay: 0.2,
    enableBackgroundTransitions: true,
    enableParallax: true,
    enableBlur: true,
  });

  useEffect(() => {
    const capabilities = getDeviceCapabilities();
    setDeviceCapabilities(capabilities);
    setAnimConfig(getAnimationConfig(capabilities));

    // Emergency memory cleanup for Safari crashes
    if (capabilities.isIOS) {
      const handleMemoryWarning = () => {
        console.warn('Memory warning detected - cleaning up');
        // Force garbage collection by clearing caches
        const { ScrollTrigger } = require('gsap/ScrollTrigger');
        ScrollTrigger.getAll().forEach((st: any) => st.kill());
        const gsap = require('gsap');
        gsap.globalTimeline.clear();
      };

      window.addEventListener('pagehide', handleMemoryWarning);
      
      return () => {
        window.removeEventListener('pagehide', handleMemoryWarning);
      };
    }
  }, []);

  return { deviceCapabilities, animConfig };
};
