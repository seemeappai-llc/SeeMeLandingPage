'use client';

import React from 'react';
import { SectionLayout } from '../shared/SectionLayout';
import SmartVideo from '@/components/SmartVideo';
import { videoUrls } from '@/config/videoUrls';

interface InsightsSectionProps {
  sectionRef: React.RefObject<HTMLDivElement | null>;
  activeSection: number;
  isIOS: boolean;
  shouldReduceMotion: boolean;
}

export const InsightsSection: React.FC<InsightsSectionProps> = ({
  sectionRef,
  activeSection,
  isIOS,
  shouldReduceMotion,
}) => {
  return (
    <SectionLayout sectionRef={sectionRef}>
      <div className="text-center w-full md:w-auto md:max-w-sm md:mb-0">
        <h2
          className="text-3xl md:text-5xl text-white/80 leading-[1.1]"
          style={{ fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif', fontWeight: 600 }}
        >
          Coaches that<br />
          <span className="text-white font-bold">truly understand you</span>
        </h2>
        <p
          className="hidden md:block text-white/90 text-lg mt-6 font-normal"
          style={{ fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif' }}
        >
          Learning from your <span className="text-white font-semibold">sessions, reflections, calendar, health,</span> and <span className="text-white font-semibold">screen time</span> patterns.
        </p>
      </div>

      <div className="relative rounded-[32px] border-4 border-white/30 bg-black shadow-lg overflow-hidden w-[240px] h-[520px] md:w-[280px] md:h-[615px] flex-shrink-0">
        {((shouldReduceMotion && activeSection === 2) || (!shouldReduceMotion && (activeSection === 1 || activeSection === 2 || activeSection === 3))) && (
          <SmartVideo
            src={videoUrls.video3}
            priority={false}
            disabled={isIOS}
            className="w-full h-full object-cover rounded-[28px]"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        )}
      </div>

      <p
        className="md:hidden text-white/90 text-sm text-center font-normal px-2"
        style={{ fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif' }}
      >
        Learning from your <span className="text-white font-semibold">sessions, reflections, calendar, health,</span> and <span className="text-white font-semibold">screen time</span> patterns.
      </p>
    </SectionLayout>
  );
};
