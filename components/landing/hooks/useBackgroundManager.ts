import { useState, useEffect, useRef } from 'react';

export const useBackgroundManager = (
  activeSection: number,
  backgrounds: string[],
  shouldReduceMotion: boolean
) => {
  const [lowEndBgIndex, setLowEndBgIndex] = useState(0);
  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  const currentBgIndexRef = useRef(0);
  const loadedBgIndexesRef = useRef<Set<number>>(new Set());
  const bgLoadPromisesRef = useRef<Map<number, Promise<void>>>(new Map());
  const pendingLowEndBgIndexRef = useRef<number>(0);

  useEffect(() => {
    if (!shouldReduceMotion) return;

    const targetIndex = Math.max(0, Math.min(activeSection, backgrounds.length - 1));
    const prefetchIndex = Math.max(0, Math.min(targetIndex + 1, backgrounds.length - 1));

    pendingLowEndBgIndexRef.current = targetIndex;

    const ensureLoaded = (index: number): Promise<void> => {
      if (loadedBgIndexesRef.current.has(index)) {
        return Promise.resolve();
      }

      const existing = bgLoadPromisesRef.current.get(index);
      if (existing) return existing;

      const promise = new Promise<void>((resolve) => {
        const img = new window.Image();
        const done = () => {
          loadedBgIndexesRef.current.add(index);
          bgLoadPromisesRef.current.delete(index);
          resolve();
        };
        img.onload = done;
        img.onerror = done;
        img.src = backgrounds[index];
      });

      bgLoadPromisesRef.current.set(index, promise);
      return promise;
    };

    ensureLoaded(targetIndex).then(() => {
      if (pendingLowEndBgIndexRef.current === targetIndex) {
        setLowEndBgIndex(targetIndex);
      }
    });

    void ensureLoaded(prefetchIndex);
  }, [activeSection, shouldReduceMotion, backgrounds]);

  return {
    lowEndBgIndex,
    currentBgIndex,
    currentBgIndexRef,
    setCurrentBgIndex,
  };
};
