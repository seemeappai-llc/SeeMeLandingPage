'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { REVIEWS } from '../data/reviews';

interface TestimonialsSectionProps {
  sectionRef: React.RefObject<HTMLDivElement | null>;
  activeSection: number;
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({
  sectionRef,
  activeSection,
}) => {
  return (
    <div
      ref={sectionRef}
      className="absolute inset-0 flex items-center justify-center"
      style={{ opacity: 0, pointerEvents: 'none', overflow: 'visible' }}
    >
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8" style={{ overflow: 'visible' }}>
        <motion.h2
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-4xl md:text-5xl text-white text-center mb-6 leading-[1.1]"
          style={{
            fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
            fontWeight: 600
          }}
        >
          Loved by people like you
        </motion.h2>
        <p
          className="text-white/90 text-base md:text-xl max-w-2xl mx-auto mb-12 reviews-text font-normal text-center"
          style={{
            fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
            opacity: 0
          }}
        >
          Authentic stories of <span className="text-white font-semibold">clarity, confidence, and balance</span> from SeeMe's early community.
        </p>

        {(activeSection === 5 || activeSection === 6) && (
          <div 
            className="overflow-hidden pb-6 relative"
            style={{ 
              pointerEvents: 'auto',
              maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
              WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)'
            }}
          >
            <motion.div 
              className="flex gap-6"
              animate={{
                x: activeSection === 6 ? [0, -((350 + 24) * REVIEWS.length)] : 0
              }}
              transition={{
                x: {
                  duration: 60,
                  repeat: Infinity,
                  ease: "linear",
                  repeatType: "loop"
                }
              }}
              style={{ willChange: 'auto' }}
            >
              {REVIEWS.map((review, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={activeSection === 6 ? {
                    opacity: 1,
                    y: 0
                  } : {
                    opacity: 0,
                    y: 30
                  }}
                  transition={{
                    delay: (index % REVIEWS.length) * 0.1,
                    duration: 0.5
                  }}
                  className="bg-white/10 rounded-2xl p-5 md:p-6 border border-white/20 shadow-md flex-shrink-0 w-[300px] md:w-[350px]"
                >
                  <div className="mb-3">
                    <p className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-2"
                      style={{ fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif' }}>
                      {review.category}
                    </p>
                    <div className="flex mb-3">
                      {[...Array(review.rating)].map((_, i) => (
                        <svg
                          key={i}
                          className="w-4 h-4 text-yellow-400 fill-current"
                          viewBox="0 0 20 20"
                        >
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p
                    className="text-white/90 text-sm md:text-base mb-4 leading-relaxed"
                    style={{ fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif' }}
                  >
                    "{review.text}"
                  </p>
                  <p
                    className="text-white/70 text-xs font-medium italic"
                    style={{ fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif' }}
                  >
                    {review.name}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};
