// Cloudflare R2 CDN - using public dev URL temporarily
// Custom domain https://media.seemeai.app returning 403 - needs DNS/domain config fix
const R2_CDN_BASE = 'https://pub-7d6831def8c4461cab4ebe1fa9199d29.r2.dev';

export const videoUrls = {
  video1: `${R2_CDN_BASE}/cloudfare-vids/video1.webm`,
  video2: `${R2_CDN_BASE}/cloudfare-vids/video2.webm`,
  video3: `${R2_CDN_BASE}/cloudfare-vids/video3.webm`,
  video4: `${R2_CDN_BASE}/cloudfare-vids/video4.webm`,
  video5: `${R2_CDN_BASE}/cloudfare-vids/video5.webm`,
};
