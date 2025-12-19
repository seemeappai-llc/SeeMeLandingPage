'use client';

import React from 'react';

interface SectionLayoutProps {
  sectionRef: React.RefObject<HTMLDivElement | null>;
  children: React.ReactNode;
}

export const SectionLayout: React.FC<SectionLayoutProps> = ({ sectionRef, children }) => {
  return (
    <div
      ref={sectionRef}
      className="absolute inset-0 flex items-center justify-center transition-opacity duration-500"
      style={{ opacity: 0, pointerEvents: 'none' }}
    >
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-20 px-4 md:-translate-x-12">
        {children}
      </div>
    </div>
  );
};
