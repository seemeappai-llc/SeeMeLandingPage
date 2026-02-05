// app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Analytics } from '@vercel/analytics/next';
import { Space_Grotesk, Syne, Manrope } from 'next/font/google';
import "./globals.css";

// Dramatic display font for headlines
const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

// Modern geometric sans for body
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
});

// Clean, readable sans for UI elements
const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
  weight: ['200', '300', '400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: "SeeMe",
  description: "Your personal network of support",
  icons: {
    icon: "/logo.ico",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover", // important for iOS edge-to-edge
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`scroll-smooth ${syne.variable} ${spaceGrotesk.variable} ${manrope.variable}`}>
      <head>
        {/* iOS Web App Meta Tags */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="SeeMe" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#000000" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="apple-touch-fullscreen" content="yes" />

        {/* Optional: keep or remove; not required for the black bar fix */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('scrollRestoration' in history) {
                history.scrollRestoration = 'manual';
              }
              window.scrollTo(0, 0);
              
              // Prevent keyboard zoom (Ctrl/Cmd +/-)
              document.addEventListener('keydown', function(e) {
                if ((e.ctrlKey || e.metaKey) && (e.key === '+' || e.key === '-' || e.key === '=' || e.key === '0')) {
                  e.preventDefault();
                }
              }, { passive: false });
              
              // Prevent mouse wheel zoom
              document.addEventListener('wheel', function(e) {
                if (e.ctrlKey || e.metaKey) {
                  e.preventDefault();
                }
              }, { passive: false });
            `,
          }}
        />
      </head>
      <body className="font-manrope antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
