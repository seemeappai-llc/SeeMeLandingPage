// app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Analytics } from '@vercel/analytics/next';
import SmoothScroll from '@/components/SmoothScroll';
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://seemeai.app"),
  title: "SeeMe",
  description: "Your personal network of support",
  icons: {
    icon: [
      { url: "/logo.png", type: "image/png" },
      { url: "/logo.ico", rel: "shortcut icon" },
    ],
    apple: "/logo.png",
    shortcut: "/logo.ico",
  },
  openGraph: {
    title: "SeeMe",
    description: "Your personal network of support",
    url: "https://seemeai.app",
    siteName: "SeeMe",
    images: [
      {
        url: "/thumbnail.jpeg",
        width: 2568,
        height: 1448,
        alt: "SeeMe thumbnail",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SeeMe",
    description: "Your personal network of support",
    images: ["/thumbnail.jpeg"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover", // important for iOS edge-to-edge
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        {/* iOS Web App Meta Tags */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="SeeMe" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#000000" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="apple-touch-fullscreen" content="yes" />

        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('scrollRestoration' in history) {
                history.scrollRestoration = 'manual';
              }
              window.scrollTo(0, 0);
            `,
          }}
        />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        <SmoothScroll>
          {children}
        </SmoothScroll>
        <Analytics />
      </body>
    </html>
  );
}
