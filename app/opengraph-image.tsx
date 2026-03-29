import { ImageResponse } from 'next/og';
import { getSocialPreviewAssets, SocialPreviewImage } from '@/lib/socialPreview';

export const runtime = 'edge';
export const alt = 'SeeMe';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function OpenGraphImage() {
  const assets = await getSocialPreviewAssets(import.meta.url);

  return new ImageResponse(
    <SocialPreviewImage assets={assets} />,
    size,
  );
}
