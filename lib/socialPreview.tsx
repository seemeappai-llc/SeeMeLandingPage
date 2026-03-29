import React from 'react';

const HERO_MOCKUPS = [
  { src: '../public/FirstMockupUpdated.png', alt: 'Check-in', rotate: -16, width: 170, height: 348, marginTop: 82, marginLeft: 0 },
  { src: '../public/updatedmockup2.png', alt: 'Capacity View', rotate: -8, width: 182, height: 372, marginTop: 34, marginLeft: -24 },
  { src: '../public/updatedmockup3.png', alt: 'Affirmation', rotate: 0, width: 200, height: 408, marginTop: 0, marginLeft: -20 },
  { src: '../public/updatedmockup4.png', alt: 'Voice Call', rotate: 8, width: 182, height: 372, marginTop: 34, marginLeft: -20 },
  { src: '../public/updatedmockup5.png', alt: 'Chat', rotate: 16, width: 170, height: 348, marginTop: 82, marginLeft: -24 },
] as const;

function bufferToDataUri(buffer: ArrayBuffer, mimeType: string) {
  return `data:${mimeType};base64,${Buffer.from(buffer).toString('base64')}`;
}

async function loadAsset(baseUrl: string, relativePath: string, mimeType: string) {
  const response = await fetch(new URL(relativePath, baseUrl));
  if (!response.ok) {
    throw new Error(`Failed to load asset: ${relativePath}`);
  }

  return bufferToDataUri(await response.arrayBuffer(), mimeType);
}

export async function getSocialPreviewAssets(baseUrl: string) {
  const [background, icon, ...mockups] = await Promise.all([
    loadAsset(baseUrl, '../public/updatedB2CBackground.png', 'image/png'),
    loadAsset(baseUrl, '../public/SeeMeB2CIcon.png', 'image/png'),
    ...HERO_MOCKUPS.map((mockup) => loadAsset(baseUrl, mockup.src, 'image/png')),
  ]);

  return { background, icon, mockups };
}

export function SocialPreviewImage({
  assets,
}: {
  assets: Awaited<ReturnType<typeof getSocialPreviewAssets>>;
}) {
  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        width: '1200px',
        height: '630px',
        overflow: 'hidden',
        backgroundColor: '#1c1210',
        color: '#ffffff',
        fontFamily: 'ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      <img
        src={assets.background}
        alt=""
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(28, 18, 16, 0.36) 0%, rgba(28, 18, 16, 0.2) 28%, rgba(28, 18, 16, 0.3) 58%, rgba(28, 18, 16, 0.72) 100%)',
        }}
      />

      <div
        style={{
          position: 'absolute',
          top: 36,
          left: 42,
          display: 'flex',
          alignItems: 'center',
          gap: 14,
        }}
      >
        <img src={assets.icon} alt="" style={{ width: 34, height: 34, borderRadius: 8 }} />
        <div style={{ display: 'flex', fontSize: 26, fontWeight: 700, letterSpacing: '-0.03em' }}>SeeMe</div>
      </div>

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          padding: '118px 48px 44px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            maxWidth: '860px',
          }}
        >
          <div
            style={{
              display: 'flex',
              fontSize: 66,
              fontWeight: 760,
              lineHeight: 1.03,
              letterSpacing: '-0.05em',
              textShadow: '0 10px 28px rgba(0, 0, 0, 0.42)',
            }}
          >
            Private. Personal. Intelligent.
          </div>
          <div
            style={{
              display: 'flex',
              marginTop: 18,
              fontSize: 28,
              lineHeight: 1.45,
              color: 'rgba(255, 255, 255, 0.82)',
              textShadow: '0 8px 20px rgba(0, 0, 0, 0.4)',
            }}
          >
            AI built around how you think, reflect, and grow - with expert coaches in your corner.
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            width: '100%',
            marginTop: 18,
          }}
        >
          {HERO_MOCKUPS.map((mockup, index) => (
            <div
              key={mockup.alt}
              style={{
                display: 'flex',
                width: mockup.width,
                height: mockup.height,
                marginTop: mockup.marginTop,
                marginLeft: index === 0 ? 0 : mockup.marginLeft,
                transform: `rotate(${mockup.rotate}deg)`,
                boxShadow: '0 24px 48px rgba(0, 0, 0, 0.42)',
                borderRadius: 28,
                overflow: 'hidden',
              }}
            >
              <img
                src={assets.mockups[index]}
                alt={mockup.alt}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
