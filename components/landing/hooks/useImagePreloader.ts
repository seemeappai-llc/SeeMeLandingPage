import { useState, useEffect } from 'react';

export const useImagePreloader = (
  imagesToPreload: string[],
  minDisplayTime: number = 1500
) => {
  const [imagesLoaded, setImagesLoaded] = useState(false);

  useEffect(() => {
    let loadedCount = 0;
    const totalImages = imagesToPreload.length;

    const minDisplayTimer = setTimeout(() => {
      setImagesLoaded(true);
    }, minDisplayTime);

    imagesToPreload.forEach((src) => {
      const img = new window.Image();
      img.onload = () => {
        loadedCount++;
        if (loadedCount === totalImages) {
          clearTimeout(minDisplayTimer);
          setImagesLoaded(true);
        }
      };
      img.onerror = () => {
        loadedCount++;
        if (loadedCount === totalImages) {
          clearTimeout(minDisplayTimer);
          setImagesLoaded(true);
        }
      };
      img.src = src;
    });

    return () => clearTimeout(minDisplayTimer);
  }, [imagesToPreload, minDisplayTime]);

  return imagesLoaded;
};
