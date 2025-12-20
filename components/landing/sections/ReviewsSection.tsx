'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface ReviewsSectionProps {
  sectionRef: React.RefObject<HTMLDivElement | null>;
  activeSection: number;
}

const reviews = [
  {
    name: "Maya, 32, Berlin",
    category: "Personal Growth & Clarity",
    text: "SeeMe helped me connect the dots in my life. It's like having a calm, intelligent coach who actually remembers me and keeps me focused.",
    rating: 5
  },
  {
    name: "Daniel, 29, Toronto",
    category: "Privacy & Safety",
    text: "I never realized how much I held back with other AI tools until SeeMe. Knowing my data stays mine changes everything. I can actually be honest.",
    rating: 5
  },
  {
    name: "Lina, 27, San Francisco",
    category: "Daily Reflection & Balance",
    text: "The morning check-ins are my favorite part of the day. They keep me grounded and remind me to slow down before things spiral.",
    rating: 5
  },
  {
    name: "Sophie, 41, London",
    category: "Expert-Guided Coaching Feel",
    text: "It feels like talking to a real mentor. Thoughtful questions, real structure, and gentle accountability without pressure.",
    rating: 5
  },
  {
    name: "Arjun, 35, Mumbai",
    category: "Emotional Connection & Trust",
    text: "SeeMe listens in a way no app ever has. It doesn't just respond. It understands where I am and helps me grow from there.",
    rating: 5
  },
  {
    name: "Isabella, 30, New York",
    category: "Intelligent Questions / Deep Understanding",
    text: "It's wild how well SeeMe knows me now. The questions it asks cut right to the heart of what I'm feeling. Like it sees what I can't yet name.",
    rating: 5
  }
];

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({
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

        {/* Infinite auto-scroll carousel with edge fade - only render when section is active */}
        {(activeSection === 5 || activeSection === 6 || activeSection === 7) && (
          <div
            className="overflow-hidden pb-6 relative"
            style={{
              pointerEvents: 'auto',
            }}
          >
            <div className="w-full overflow-hidden">
              <motion.div
                className="flex gap-6 w-max"
                animate={{
                  x: ["0%", "-25%"]
                }}
                transition={{
                  x: {
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                    repeatType: "loop"
                  }
                }}
                style={{ willChange: 'transform' }}
              >
                {/* Render 4 sets for seamless infinite loop on all screen sizes */}
                {[...reviews, ...reviews, ...reviews, ...reviews].map((review, index) => (
                  <div
                    key={`${index}-${review.name}`}
                    // Enhanced glass style to match Disclaimer: bg-white/[0.02], backdrop-blur-sm, border-white/10, no shadow
                    className="bg-white/[0.02] backdrop-blur-sm rounded-xl p-5 md:p-6 border border-white/10 flex-shrink-0 w-[300px] md:w-[350px]"
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
                            className="w-4 h-4 text-white/50 fill-current"
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
                      className="text-white/50 text-xs font-medium italic"
                      style={{ fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif' }}
                    >
                      {review.name}
                    </p>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
