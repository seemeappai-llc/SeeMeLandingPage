// Cloudflare R2 CDN with custom domain
const R2_CDN_BASE = 'https://media.seemeai.app';

export const videoUrls = {
  video1: `${R2_CDN_BASE}/cloudfare-vids/video1.webm`,
  video2: `${R2_CDN_BASE}/cloudfare-vids/video2.webm`,
  video3: `${R2_CDN_BASE}/cloudfare-vids/video3.webm`,
  video4: `${R2_CDN_BASE}/cloudfare-vids/video4.webm`,
  video5: `${R2_CDN_BASE}/cloudfare-vids/video5.webm`,
};

// Poster images (optional - not currently uploaded to R2)
export const posterUrls = {
  video1: `${R2_CDN_BASE}/cloudfare-vids/poster1.webp`,
  video2: `${R2_CDN_BASE}/cloudfare-vids/poster2.webp`,
  video3: `${R2_CDN_BASE}/cloudfare-vids/poster3.webp`,
  video4: `${R2_CDN_BASE}/cloudfare-vids/poster4.webp`,
  video5: `${R2_CDN_BASE}/cloudfare-vids/poster5.webp`,
};
