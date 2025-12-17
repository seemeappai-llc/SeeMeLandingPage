/**
 * Device detection utilities for performance optimization
 * Helps identify low-end devices that need reduced animations/GPU usage
 */

export interface DeviceCapabilities {
  isLowEndDevice: boolean;
  isMobile: boolean;
  isIOS: boolean;
  shouldReduceMotion: boolean;
  maxConcurrentBackgrounds: number;
  maxConcurrentVideos: number;
}

/**
 * Detect if device is low-end (iPhone 13 or below, older Android)
 */
export function getDeviceCapabilities(): DeviceCapabilities {
  if (typeof window === 'undefined') {
    return {
      isLowEndDevice: false,
      isMobile: false,
      isIOS: false,
      shouldReduceMotion: false,
      maxConcurrentBackgrounds: 3,
      maxConcurrentVideos: 2,
    };
  }

  const ua = navigator.userAgent;
  const isMobile = /iPhone|iPad|iPod|Android/i.test(ua);
  const isIOS = /iPhone|iPad|iPod/i.test(ua);
  
  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  // Detect low-end devices
  let isLowEndDevice = false;
  
  if (isIOS) {
    // iPhone model detection via screen dimensions and pixel ratio
    const width = window.screen.width;
    const height = window.screen.height;
    const ratio = window.devicePixelRatio || 1;
    
    // iPhone 13 and below have lower GPU memory
    // iPhone 13: 390x844 @3x, iPhone 12: 390x844 @3x, iPhone 11: 414x896 @2x
    // iPhone SE (2020/2022): 375x667 @2x, iPhone 8 and below
    const isOlderIPhone = (
      (width === 375 && height === 667) || // iPhone SE, 6, 7, 8
      (width === 414 && height === 896 && ratio === 2) || // iPhone 11, XR
      (width === 390 && height === 844) || // iPhone 12, 13
      (width === 375 && height === 812) || // iPhone X, XS, 11 Pro
      width < 375 // Older iPhones
    );
    
    isLowEndDevice = isOlderIPhone;
  } else if (/Android/i.test(ua)) {
    // Android: check for low RAM indicators
    // @ts-ignore - deviceMemory is experimental
    const deviceMemory = (navigator as any).deviceMemory;
    const hardwareConcurrency = navigator.hardwareConcurrency || 4;
    
    // Low-end Android: <= 4GB RAM or <= 4 cores
    isLowEndDevice = (deviceMemory && deviceMemory <= 4) || hardwareConcurrency <= 4;
  }
  
  // Check GPU capabilities
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  let hasLimitedGPU = false;
  
  if (gl) {
    // @ts-ignore
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    if (debugInfo) {
      // @ts-ignore
      const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
      // Apple GPU A13 and below are more limited
      hasLimitedGPU = /Apple A([0-9]|1[0-3]) GPU/i.test(renderer);
    }
  }
  
  const shouldReduceMotion = prefersReducedMotion || isLowEndDevice || hasLimitedGPU;
  
  return {
    isLowEndDevice: isLowEndDevice || hasLimitedGPU,
    isMobile,
    isIOS,
    shouldReduceMotion,
    // Limit concurrent GPU-accelerated layers on low-end devices
    maxConcurrentBackgrounds: shouldReduceMotion ? 1 : (isMobile ? 2 : 3),
    maxConcurrentVideos: shouldReduceMotion ? 1 : 2,
  };
}

/**
 * Get memory-safe animation config based on device
 */
export function getAnimationConfig(capabilities: DeviceCapabilities) {
  if (capabilities.shouldReduceMotion) {
    return {
      // Reduce animation complexity
      scrollScrub: 2, // Slower scrub = less frequent updates
      snapDuration: { min: 0.2, max: 0.5 }, // Faster snaps
      snapDelay: 0.1,
      // Disable expensive effects
      enableBackgroundTransitions: false,
      enableParallax: false,
      enableBlur: false,
    };
  }
  
  if (capabilities.isMobile) {
    return {
      scrollScrub: 1.5,
      snapDuration: { min: 0.3, max: 0.8 },
      snapDelay: 0.15,
      enableBackgroundTransitions: true,
      enableParallax: false, // Disable parallax on mobile
      enableBlur: false,
    };
  }
  
  // Desktop - full effects
  return {
    scrollScrub: 1.2,
    snapDuration: { min: 0.4, max: 1.0 },
    snapDelay: 0.2,
    enableBackgroundTransitions: true,
    enableParallax: true,
    enableBlur: true,
  };
}
