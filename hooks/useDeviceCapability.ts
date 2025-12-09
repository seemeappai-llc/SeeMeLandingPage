// Hook to detect device capability and serve appropriate experience
// Created by Sankritya on Dec 9, 2025

import { useState, useEffect } from 'react';

type DeviceTier = 'low' | 'mid' | 'high';

interface DeviceCapability {
  tier: DeviceTier;
  canUseBlur: boolean;
  canUseDropShadow: boolean;
  canUseHeavyAnimations: boolean;
  canUseMultipleVideos: boolean;
  maxBackgrounds: number;
}

// Detect iOS version from user agent
const getIOSVersion = (): number | null => {
  if (typeof navigator === 'undefined') return null;
  const match = navigator.userAgent.match(/OS (\d+)_/);
  return match ? parseInt(match[1], 10) : null;
};

// Detect if device is older/lower-end iPhone
const isLowEndDevice = (): boolean => {
  if (typeof navigator === 'undefined') return false;
  
  const ua = navigator.userAgent;
  const isIOS = /iPhone|iPad|iPod/.test(ua);
  
  if (!isIOS) return false;
  
  // Check iOS version - older versions = likely older hardware
  const iosVersion = getIOSVersion();
  if (iosVersion && iosVersion < 16) return true;
  
  // Check device memory (if available)
  // @ts-ignore - deviceMemory is not in all browsers
  const memory = navigator.deviceMemory;
  if (memory && memory < 4) return true;
  
  // Check screen size - smaller screens often = older devices
  const screenWidth = window.screen.width;
  const screenHeight = window.screen.height;
  const smallerDimension = Math.min(screenWidth, screenHeight);
  
  // iPhone SE, iPhone 8, etc have smaller screens
  if (smallerDimension < 375) return true;
  
  // Check hardware concurrency (CPU cores)
  const cores = navigator.hardwareConcurrency;
  if (cores && cores < 6) return true;
  
  return false;
};

const isMidTierDevice = (): boolean => {
  if (typeof navigator === 'undefined') return false;
  
  const ua = navigator.userAgent;
  const isIOS = /iPhone|iPad|iPod/.test(ua);
  
  if (!isIOS) return false;
  
  const iosVersion = getIOSVersion();
  // iOS 16-17 on mid-range devices
  if (iosVersion && iosVersion >= 16 && iosVersion < 18) {
    // @ts-ignore
    const memory = navigator.deviceMemory;
    if (memory && memory < 6) return true;
    
    const cores = navigator.hardwareConcurrency;
    if (cores && cores < 8) return true;
  }
  
  return false;
};

export const useDeviceCapability = (): DeviceCapability => {
  const [capability, setCapability] = useState<DeviceCapability>({
    tier: 'high',
    canUseBlur: true,
    canUseDropShadow: true,
    canUseHeavyAnimations: true,
    canUseMultipleVideos: true,
    maxBackgrounds: 9,
  });

  useEffect(() => {
    // Only run on client
    if (typeof window === 'undefined') return;

    let tier: DeviceTier = 'high';
    
    if (isLowEndDevice()) {
      tier = 'low';
    } else if (isMidTierDevice()) {
      tier = 'mid';
    }

    const capabilities: Record<DeviceTier, DeviceCapability> = {
      low: {
        tier: 'low',
        canUseBlur: false,
        canUseDropShadow: false,
        canUseHeavyAnimations: false,
        canUseMultipleVideos: false,
        maxBackgrounds: 3,
      },
      mid: {
        tier: 'mid',
        canUseBlur: false,
        canUseDropShadow: true,
        canUseHeavyAnimations: true,
        canUseMultipleVideos: true,
        maxBackgrounds: 5,
      },
      high: {
        tier: 'high',
        canUseBlur: true,
        canUseDropShadow: true,
        canUseHeavyAnimations: true,
        canUseMultipleVideos: true,
        maxBackgrounds: 9,
      },
    };

    setCapability(capabilities[tier]);
  }, []);

  return capability;
};

export default useDeviceCapability;
