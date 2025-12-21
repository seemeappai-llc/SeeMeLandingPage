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
    maxConcurrentBackgrounds: 2, // Must be at least 2 to support crossfade (Current + Next)
    maxConcurrentVideos: 1,
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

    // No cleanup needed - Intersection Observer handles its own memory management
  }, []);

  return { deviceCapabilities, animConfig };
};
