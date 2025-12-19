'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CTASectionProps {
  sectionRef: React.RefObject<HTMLDivElement | null>;
  onAppStoreClick: () => void;
}

export const CTASection: React.FC<CTASectionProps> = ({
  sectionRef,
  onAppStoreClick,
}) => {
  const [disclaimerExpanded, setDisclaimerExpanded] = useState(false);

  return (
    <div
      ref={sectionRef}
      className="absolute inset-0 flex items-center justify-center z-50 cursor-auto"
      style={{ opacity: 0, pointerEvents: 'none' }}
    >
      <div className="cta-inner relative z-10 flex flex-col items-center justify-center text-center px-4 cursor-auto">
        <h2
          className="text-3xl md:text-6xl text-white/80 leading-[1.1]"
          style={{
            fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
            fontWeight: 600
          }}
        >
          Begin your journey<br />
          <span className="text-white font-bold">today.</span>
        </h2>
        <p
          className="text-white/90 text-base md:text-xl max-w-lg mt-6 font-normal"
          style={{
            fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
          }}
        >
          Start building your personal intelligence. Calmly, privately, and on your terms.
        </p>
        
        <a
          href="https://apps.apple.com"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-10 inline-flex items-center gap-3 bg-white text-black px-8 py-4 rounded-full hover:bg-white/90 transition-all duration-300 hover:scale-105 shadow-lg cursor-pointer"
          style={{
            fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
          }}
          onClick={onAppStoreClick}
        >
          <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
          </svg>
          <span className="text-lg font-semibold whitespace-nowrap">Download on the App Store</span>
        </a>

        <div className="mt-16 max-w-2xl mx-auto">
          <button
            onClick={() => setDisclaimerExpanded(!disclaimerExpanded)}
            className="w-full flex items-center justify-center gap-2 text-white/40 hover:text-white/60 transition-colors text-xs py-2 cursor-pointer"
            aria-expanded={disclaimerExpanded}
          >
            <span>Important Disclaimer</span>
            <motion.svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              animate={{ rotate: disclaimerExpanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <polyline points="6 9 12 15 18 9" />
            </motion.svg>
          </button>
          
          <AnimatePresence>
            {disclaimerExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-5 mt-3 text-left border border-white/10">
                  <p className="text-white/60 text-xs leading-relaxed mb-3">
                    SeeMe LLC provides an AI-powered coaching and reflection tool. We do not provide medical, mental health, psychological, legal, or financial services, and we do not monitor or respond to emergencies.
                  </p>
                  <p className="text-white/70 text-xs leading-relaxed mb-2">
                    <strong className="text-white/80">SeeMe does not and cannot:</strong>
                  </p>
                  <ul className="text-white/60 text-xs leading-relaxed mb-3 space-y-1.5 pl-4">
                    <li className="list-disc">Monitor your content in real time</li>
                    <li className="list-disc">Contact emergency services, law enforcement, or third parties for you</li>
                    <li className="list-disc">Take responsibility for any harm, injury, or unlawful activity arising from your use of the app</li>
                  </ul>
                  <p className="text-white/60 text-xs leading-relaxed">
                    You remain solely responsible for your own decisions, actions, safety, and well-being. Always seek help from qualified professionals and emergency services when needed.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
