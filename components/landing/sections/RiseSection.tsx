'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface RiseSectionProps {
  sectionRef: React.RefObject<HTMLDivElement | null>;
  riseTextRef: React.RefObject<HTMLParagraphElement | null>;
  activeSection: number;
}

export const RiseSection: React.FC<RiseSectionProps> = ({
  sectionRef,
  riseTextRef,
  activeSection,
}) => {
  const [currentNotification, setCurrentNotification] = useState(1);

  useEffect(() => {
    if (activeSection === 5) {
      const interval = setInterval(() => {
        setCurrentNotification(prev => prev === 1 ? 2 : 1);
      }, 8000);
      return () => clearInterval(interval);
    }
  }, [activeSection]);

  return (
    <div
      ref={sectionRef}
      className="absolute inset-0 flex items-start justify-center pt-32"
      style={{ opacity: 0, pointerEvents: 'none' }}
    >
      <div className="relative z-10 text-center px-4 w-full max-w-7xl mx-auto">
        <h2
          className="rise-heading text-4xl md:text-7xl text-white/80 leading-[1.1] transition-all duration-1000 ease-out"
          style={{
            fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
            fontWeight: 400,
          }}
        >
          Rise with<br />
          <span className="text-white font-black inline-block">daily guidance</span>
        </h2>
        <p
          ref={riseTextRef}
          className="text-white/90 text-base md:text-xl max-w-2xl mx-auto mt-6 font-normal"
          style={{
            fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
          }}
        >
          Timely boosts and reminders aligned with your <span className="text-white font-semibold">mood, energy, and intentions.</span>
        </p>
      </div>

      {activeSection === 5 && (
        <>
          {/* Mobile notifications */}
          <div className="absolute inset-0 pointer-events-none block md:hidden flex items-end justify-center pb-20">
            <div className="flex flex-col gap-3 items-center">
              <AnimatePresence>
                {[0, 1, 2].map((offset) => {
                  const notifNum = currentNotification === 1 ? [1, 3, 5][offset] : [2, 4, 6][offset];
                  return (
                    <motion.div
                      key={`${currentNotification}-${offset}`}
                      variants={{
                        enter: { opacity: 1, scale: 1 },
                        exit: { opacity: 0, scale: 0.95 }
                      }}
                      initial="exit"
                      animate="enter"
                      exit="exit"
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="w-[98%] max-w-[420px]"
                    >
                      <Image
                        src={`/notifications/notif${notifNum}.png`}
                        alt="Notification"
                        width={350}
                        height={110}
                        className="w-full h-auto"
                      />
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>

          {/* Desktop notifications */}
          <div className="absolute inset-0 pointer-events-none hidden md:block">
            <div className="absolute inset-x-8 inset-y-16 max-w-6xl mx-auto">
              <div className="absolute top-8 left-0 right-0 flex justify-between px-12">
                <motion.div
                  initial={{ opacity: 0, y: -50, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0, ease: [0.34, 1.56, 0.64, 1] }}
                  className="pointer-events-none z-20"
                >
                  <Image src="/notifications/notif5.png" alt="Notification" width={320} height={100} />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: -50, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
                  className="pointer-events-none z-20"
                >
                  <Image src="/notifications/notif6.png" alt="Notification" width={320} height={100} />
                </motion.div>
              </div>

              <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 flex justify-between px-4">
                <motion.div
                  initial={{ opacity: 0, x: -50, scale: 0.8 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
                  className="pointer-events-none z-20"
                >
                  <Image src="/notifications/notif3.png" alt="Notification" width={300} height={90} />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 50, scale: 0.8 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.9, ease: [0.34, 1.56, 0.64, 1] }}
                  className="pointer-events-none z-20"
                >
                  <Image src="/notifications/notif4.png" alt="Notification" width={300} height={90} />
                </motion.div>
              </div>

              <div className="absolute bottom-16 left-0 right-0 flex justify-center gap-40">
                <motion.div
                  initial={{ opacity: 0, y: 50, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.6, delay: 1.2, ease: [0.34, 1.56, 0.64, 1] }}
                  className="pointer-events-none z-20"
                >
                  <Image src="/notifications/notif1.png" alt="Notification" width={320} height={100} />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 50, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.6, delay: 1.5, ease: [0.34, 1.56, 0.64, 1] }}
                  className="pointer-events-none z-20"
                >
                  <Image src="/notifications/notif2.png" alt="Notification" width={320} height={100} />
                </motion.div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
