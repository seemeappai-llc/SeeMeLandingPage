// Created by Mohan
'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

// ========== TYPES ==========
type Phase = 'seeme' | 'content';

// ========== INFINITE CAROUSEL (mobile) ==========
const InfiniteCarousel = ({
  children,
  speed = 30,
  gap = 28,
  className = '',
}: {
  children: React.ReactNode;
  speed?: number;
  gap?: number;
  className?: string;
}) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [duration, setDuration] = useState(10);

  useEffect(() => {
    if (!trackRef.current) return;
    const firstSet = trackRef.current.children[0] as HTMLElement;
    if (!firstSet) return;
    const w = firstSet.offsetWidth;
    setDuration(w / speed);
  }, [children, speed, gap]);

  const setStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: `${gap}px`,
    paddingRight: `${gap}px`,
    flexShrink: 0,
  };

  return (
    <div className={`new-landing-carousel-mask ${className}`}>
      <div
        className="new-landing-carousel-track"
        ref={trackRef}
        style={{ animationDuration: `${duration}s` }}
      >
        <div style={setStyle}>{children}</div>
        <div style={setStyle}>{children}</div>
        <div style={setStyle}>{children}</div>
      </div>
    </div>
  );
};

// ========== FADE-IN WRAPPER ==========
const FadeInWhenVisible = ({
  children,
  delay = 0,
  duration = 0.8,
  className = '',
  y = 30,
}: {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  y?: number;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{ duration, delay, ease: [0.25, 0.4, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// ========== INTEGRATION ICONS DATA ==========
const INTEGRATION_ICONS = [
  { src: '/MicrosoftOutlookIcon.png', alt: 'Microsoft Outlook', width: 42, height: 42, mobileMaxHeight: 30 },
  { src: '/Group.png', alt: 'Google Calendar', width: 42, height: 42, mobileMaxHeight: 30 },
  { src: '/appleHealth.png', alt: 'Apple Health', width: 136, height: 50 },
  { src: '/AppleCalendar.png', alt: 'Apple Calendar', width: 52, height: 52 },
  { src: '/ScreenTime.png', alt: 'Screen Time', width: 52, height: 52 },
];

// ========== COACHES DATA ==========
const COACHES = [
  { name: 'Marius Ketels', role: 'Life Coach', img: '/Marius.png', link: 'https://www.ketelsconsulting.com' },
  { name: 'Justin Richey', role: 'Life Coach', img: '/Justin.png', link: undefined },
  { name: 'Sylvia Schmidt', role: 'Mentor', img: '/Sylvia.png', link: undefined },
];

// ========== TESTIMONIALS DATA ==========
const TESTIMONIALS = [
  { id: 't1', text: "My journal used to just sit there. Now it talks back — and it actually knows what to say." },
  { id: 't2', text: "I've done therapy, read every self-help book. Nothing actually stuck. This did. First week." },
  { id: 't3', text: "It's like texting a friend who actually has their life together and genuinely wants to help with yours." },
  { id: 't4', text: "I check in every morning now. It's the ten minutes that make the rest of the day make sense." },
  { id: 't5', text: "Went in thinking I just needed to be more productive. Came out understanding myself a lot better than that." },
];

// ========== NOTIFICATION FRAME IMAGES ==========
const NOTIF_FRAMES = [
  { id: 'session', src: '/Frame1.png', alt: 'Upcoming Session notification', hasSlider: false },
  { id: 'charlotte', src: '/Frame2.png', alt: 'From Charlotte notification', hasSlider: true },
  { id: 'mo', src: '/Frame3.png', alt: 'From Mo notification', hasSlider: false },
];

// ========== MAIN COMPONENT ==========
export const NewLandingPage = () => {
  const [phase, setPhase] = useState<Phase>('seeme');
  const [isMobile, setIsMobile] = useState(false);
  const [seemeSize, setSeemeSize] = useState<number | null>(null);
  const knowsYouRef = useRef<HTMLDivElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Measure container height (set by sizer) and sync SeeMe font-size to it exactly
  useEffect(() => {
    if (!textContainerRef.current) return;
    const ro = new ResizeObserver(([entry]) => {
      setSeemeSize(entry.contentRect.height);
    });
    ro.observe(textContainerRef.current);
    return () => ro.disconnect();
  }, []);

  const scrollToNextSection = () => {
    knowsYouRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Timed hero animation:
  // Phase 1: "SeeMe" shows for 2.5s, then fades up
  // Phase 2: "Private. Personal. Intelligent." + tagline + mockups appear together
  useEffect(() => {
    const t1 = setTimeout(() => setPhase('content'), 2500);
    return () => clearTimeout(t1);
  }, []);

  return (
    <div className="new-landing-root">
      <div className="new-landing-topbar is-visible">
        <Link href="/" className="new-landing-topbar-logo" aria-label="SeeMe home">
          SeeMe
        </Link>
        <div className="new-landing-topbar-actions">
          <Link href="/partner" className="new-landing-topbar-link">
            Partner with us
          </Link>
          <Link href="/privacy" className="new-landing-topbar-link">
            Privacy
          </Link>
        </div>
      </div>

      {/* ==================== HERO SECTION ==================== */}
      <section className="new-landing-hero">
        {/* Background image */}
        <div className="new-landing-hero-bg">
          <Image
            src="/backgroundLandingPage.png"
            alt="Tuscan landscape"
            fill
            priority
            quality={85}
            style={{ objectFit: 'cover', objectPosition: 'center' }}
          />
          <div className="new-landing-hero-overlay" />
        </div>

        {/* Hero content wrapper — mockups persist across phases */}
        <div className="new-landing-mockups-wrapper">
          {/* Text container — height locked by invisible sizer matching title+subtitle */}
          <div className="new-landing-text-container" ref={textContainerRef}>
            {/* Sizer: always rendered, invisible — defines stable container height */}
            <div className="new-landing-text-sizer" aria-hidden="true">
              <h2 className={isMobile ? 'new-landing-mockups-title-mobile' : 'new-landing-mockups-title'}>
                {isMobile ? (<>Private<br />Personal<br />Intelligent</>) : 'Private. Personal. Intelligent.'}
              </h2>
              <p className="new-landing-mockups-tagline">
                Organize your life and integrate{isMobile ? '\n' : ' '}with expert coaches
              </p>
            </div>

            {/* Animated overlay — both phases absolutely fill the sizer */}
            <AnimatePresence mode="wait">
              {phase === 'seeme' ? (
                <motion.div
                  key="seeme-text"
                  className="new-landing-text-abs"
                  initial={{ opacity: 0, y: 10, filter: 'blur(6px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -16, filter: 'blur(10px)' }}
                  transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                >
                  <h1
                    className="new-landing-seeme-title"
                    style={seemeSize ? { fontSize: `${Math.round(seemeSize * (isMobile ? 0.58 : 1))}px` } : undefined}
                  >SeeMe</h1>
                </motion.div>
              ) : (
                <motion.div
                  key="content-text"
                  className="new-landing-text-abs"
                  initial={{ opacity: 0, y: 16, filter: 'blur(10px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                >
                  <h2 className={isMobile ? 'new-landing-mockups-title-mobile' : 'new-landing-mockups-title'}>
                    {isMobile ? (
                      <>
                        Private<br />
                        Personal<br />
                        Intelligent
                      </>
                    ) : (
                      'Private. Personal. Intelligent.'
                    )}
                  </h2>
                  <motion.p
                    className="new-landing-mockups-tagline"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.7, delay: 0.35 }}
                    style={{ textAlign: 'center' }}
                  >
                    Organize your life and integrate{isMobile ? '\n' : ' '}with expert coaches
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Phone Mockups — always visible, animate in once on mount */}
          <div className="new-landing-phones">
            {isMobile ? (
              <motion.div
                className="new-landing-phone new-landing-phone-single"
                initial={{ opacity: 0, y: 40, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.9, delay: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
              >
                <Image
                  src="/mockUp1.png"
                  alt="SeeMe App - Home Screen"
                  width={280}
                  height={580}
                  quality={90}
                  style={{ borderRadius: '32px', width: '100%', height: 'auto' }}
                />
              </motion.div>
            ) : (
              <>
                {[
                  { src: '/mockUp1.png', alt: 'Home Screen', delay: 0.5 },
                  { src: '/mockUp2.png', alt: 'Capacity View', delay: 0.65 },
                  { src: '/mockUp3.png', alt: 'Coach Chat', delay: 0.8 },
                  { src: '/mockUp4.png', alt: 'Journal Entry', delay: 0.95 },
                ].map((mock) => (
                  <motion.div
                    key={mock.src}
                    className="new-landing-phone"
                    initial={{ opacity: 0, y: 50, scale: 0.85 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{
                      duration: 0.8,
                      delay: mock.delay,
                      ease: [0.25, 0.4, 0.25, 1],
                    }}
                  >
                    <Image
                      src={mock.src}
                      alt={`SeeMe App - ${mock.alt}`}
                      width={220}
                      height={450}
                      quality={90}
                      style={{ borderRadius: '28px', width: '100%', height: 'auto' }}
                    />
                  </motion.div>
                ))}
              </>
            )}
          </div>

          {/* App Store Button — always present, fades in with phones */}
          <motion.a
            href="https://apps.apple.com/us/app/seeme-personal-growth/id6739706517"
            target="_blank"
            rel="noopener noreferrer"
            className="new-landing-appstore-btn"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.9 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            <Image
              src="/appstore.png"
              alt="Download on the App Store"
              width={200}
              height={67}
              style={{ height: 'auto' }}
            />
          </motion.a>

          {/* Scroll indicator — always present, fades in with phones */}
          <motion.div
            className="new-landing-scroll-indicator"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ duration: 0.7, delay: 1.0 }}
            onClick={scrollToNextSection}
            whileHover={{ scale: 1.1, opacity: 1 }}
            style={{ cursor: 'pointer' }}
          >
            <motion.svg
              width="36"
              height="12"
              viewBox="0 0 36 12"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <polyline points="2 2 18 10 34 2" />
            </motion.svg>
          </motion.div>
        </div>
      </section>

      {/* ==================== SECTION 2: A SYSTEM THAT REALLY KNOWS YOU ==================== */}
      <section ref={knowsYouRef} className="new-landing-section new-landing-knows-you">
        <FadeInWhenVisible>
          <h2 className="new-landing-section-heading">
            A system that <em>really</em> knows you.
          </h2>
        </FadeInWhenVisible>

        <FadeInWhenVisible delay={0.15}>
          <p className="new-landing-section-subtext">
            Every session, journal entry, and integration feeds into a picture of you that gets sharper over time — so the guidance you get is never generic.
          </p>
        </FadeInWhenVisible>

        <FadeInWhenVisible delay={0.3}>
          {isMobile ? (
            <InfiniteCarousel speed={42} className="new-landing-integrations-carousel">
              {INTEGRATION_ICONS.map((icon) => (
                <div key={icon.alt} className="new-landing-integration-icon">
                  <Image
                    src={icon.src}
                    alt={icon.alt}
                    width={icon.width}
                    height={icon.height}
                    style={{ objectFit: 'contain', height: 'auto', maxHeight: icon.mobileMaxHeight ? `${icon.mobileMaxHeight}px` : '44px' }}
                  />
                </div>
              ))}
            </InfiniteCarousel>
          ) : (
            <div className="new-landing-integrations">
              {INTEGRATION_ICONS.map((icon, i) => (
                <motion.div
                  key={icon.alt}
                  className="new-landing-integration-icon"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * i, duration: 0.5 }}
                >
                  <Image
                    src={icon.src}
                    alt={icon.alt}
                    width={icon.width}
                    height={icon.height}
                    style={{ objectFit: 'contain', height: 'auto', maxHeight: '52px' }}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </FadeInWhenVisible>
      </section>

      {/* ==================== SECTION 3: EXPERT DESIGNED FRAMEWORKS ==================== */}
      <section className="new-landing-section new-landing-frameworks">
        <FadeInWhenVisible>
          <h2 className="new-landing-section-heading">
            Built with the best in the field.
          </h2>
        </FadeInWhenVisible>

        <FadeInWhenVisible delay={0.15}>
          <p className="new-landing-section-subtext">
            We partnered with coaches and experts worldwide to make sure every interaction is grounded in what actually works.
          </p>
        </FadeInWhenVisible>

        <FadeInWhenVisible delay={0.3}>
          {isMobile ? (
            <InfiniteCarousel speed={34} className="new-landing-coaches-carousel">
              {COACHES.map((coach) => {
                const card = (
                  <div key={coach.name} className="new-landing-coach-card">
                    <div className="new-landing-coach-avatar">
                      <Image
                        src={coach.img}
                        alt={coach.name}
                        width={48}
                        height={48}
                        style={{ borderRadius: '50%', objectFit: 'cover' }}
                      />
                    </div>
                    <div className="new-landing-coach-info">
                      <span className="new-landing-coach-name">{coach.name}</span>
                      <span className="new-landing-coach-role">{coach.role}</span>
                    </div>
                  </div>
                );
                return coach.link ? (
                  <a key={coach.name} href={coach.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>{card}</a>
                ) : card;
              })}
            </InfiniteCarousel>
          ) : (
            <div className="new-landing-coaches">
              {COACHES.map((coach, i) => {
                const card = (
                  <motion.div
                    key={coach.name}
                    className="new-landing-coach-card"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.15 * i, duration: 0.6 }}
                  >
                    <div className="new-landing-coach-avatar">
                      <Image
                        src={coach.img}
                        alt={coach.name}
                        width={48}
                        height={48}
                        style={{ borderRadius: '50%', objectFit: 'cover' }}
                      />
                    </div>
                    <div className="new-landing-coach-info">
                      <span className="new-landing-coach-name">{coach.name}</span>
                      <span className="new-landing-coach-role">{coach.role}</span>
                    </div>
                  </motion.div>
                );
                return coach.link ? (
                  <a key={coach.name} href={coach.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>{card}</a>
                ) : card;
              })}
            </div>
          )}
        </FadeInWhenVisible>
      </section>

      {/* ==================== SECTION 4: INTEGRATED TO MAKE YOU BETTER ==================== */}
      <section className="new-landing-section new-landing-integrated" style={{ paddingBottom: isMobile ? '14px' : '30px' }}>
        <FadeInWhenVisible>
          <h2 className="new-landing-section-heading new-landing-integrated-heading">
            Growth doesn&apos;t stop when the sessions end.
          </h2>
        </FadeInWhenVisible>

        <FadeInWhenVisible delay={0.15}>
          <p className="new-landing-section-subtext">
            SeeMe fills the space between sessions — daily nudges, check-ins, and insights so nothing gets lost. Your scheduled sessions keep you on track, and whenever you need to talk, your coach is ready.
          </p>
        </FadeInWhenVisible>

        <FadeInWhenVisible delay={0.3}>
          {isMobile ? (
            <InfiniteCarousel speed={32} gap={0} className="new-landing-notif-carousel">
              {NOTIF_FRAMES.map((frame) => (
                <div key={frame.id} className="new-landing-notif-frame">
                  <div className="new-landing-notif-icon-overlay">
                    <Image
                      src="/SeeMe-iOS-Dark.png"
                      alt="SeeMe"
                      width={28}
                      height={28}
                      style={{ borderRadius: '6px', objectFit: 'cover' }}
                    />
                  </div>
                  <Image
                    src={frame.src}
                    alt={frame.alt}
                    width={320}
                    height={180}
                    style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
                  />
                  {frame.hasSlider && (
                    <div className="new-landing-notif-slider-overlay">
                      <Image
                        src="/slider.png"
                        alt="Energy gauge"
                        width={260}
                        height={40}
                        style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </InfiniteCarousel>
          ) : (
            <div className="new-landing-notif-grid">
              {NOTIF_FRAMES.map((frame, i) => (
                <motion.div
                  key={frame.id}
                  className="new-landing-notif-frame"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.15 * i, duration: 0.6 }}
                >
                  <div className="new-landing-notif-icon-overlay">
                    <Image
                      src="/SeeMe-iOS-Dark.png"
                      alt="SeeMe"
                      width={28}
                      height={28}
                      style={{ borderRadius: '6px', objectFit: 'cover' }}
                    />
                  </div>
                  <Image
                    src={frame.src}
                    alt={frame.alt}
                    width={320}
                    height={180}
                    style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
                  />
                  {frame.hasSlider && (
                    <div className="new-landing-notif-slider-overlay">
                      <Image
                        src="/slider.png"
                        alt="Energy gauge"
                        width={260}
                        height={40}
                        style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
                      />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </FadeInWhenVisible>
      </section>

      {/* ==================== SECTION 5: TESTIMONIALS ==================== */}
      <section className="new-landing-section new-landing-testimonials">
        <FadeInWhenVisible delay={0.15}>
          <InfiniteCarousel speed={36} gap={20} className="new-landing-testimonials-carousel">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.id}
                className="new-landing-testimonial-card"
              >
                <div className="new-landing-testimonial-card-inner">
                  <p>{t.text}</p>
                </div>
              </div>
            ))}
          </InfiniteCarousel>
        </FadeInWhenVisible>
      </section>

      {/* ==================== SECTION 6: COMPLETELY PRIVATE ==================== */}
      <section className="new-landing-section new-landing-privacy">
        <FadeInWhenVisible>
          <h2 className="new-landing-section-heading">
            Completely Private
          </h2>
        </FadeInWhenVisible>

        <FadeInWhenVisible delay={0.15}>
          <p className="new-landing-section-subtext new-landing-privacy-subtext">
            The more you share, the better SeeMe works — so we made sure none of it has to ever leave your device. No cloud, no ads, no one reading your journal but you.
          </p>
        </FadeInWhenVisible>

        <FadeInWhenVisible delay={0.3}>
          <div className="new-landing-privacy-lock">
            <Image
              src="/lock.png"
              alt="Privacy Lock"
              width={56}
              height={68}
              style={{ objectFit: 'contain' }}
            />
          </div>
        </FadeInWhenVisible>
      </section>

      {/* ==================== SECTION 7: WORKS WITH YOUR COACH ==================== */}
      <section className="new-landing-section new-landing-coach-section">
        <FadeInWhenVisible>
          <h2 className="new-landing-section-heading">
            Works with your coach. Works without one.
          </h2>
        </FadeInWhenVisible>

        <FadeInWhenVisible delay={0.15}>
          <p className="new-landing-section-subtext new-landing-coach-subtext">
            SeeMe fills the space between your real sessions — tracking your moods, thoughts, progress, and light check-ins that keep you moving and arrive ready. When you walk in, your coach is already caught up. No coach? Our AI network is ready whenever you are.
          </p>
        </FadeInWhenVisible>

        <FadeInWhenVisible delay={0.3}>
          <motion.a
            href="/partner"
            className="new-landing-appstore-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            <span className="new-landing-partner-btn">Partner with us</span>
          </motion.a>
        </FadeInWhenVisible>

        <FadeInWhenVisible delay={0.45}>
          <p className="new-landing-b2b-text">
            and explore our coaches platform
          </p>
        </FadeInWhenVisible>
      </section>

      {/* ==================== SECTION 8: TRY FOR FREE ==================== */}
      <section className="new-landing-section new-landing-try-free">
        <div className="new-landing-try-free-bg">
          <Image
            src="/EndBackground.png"
            alt="Tuscan landscape"
            fill
            quality={85}
            style={{ objectFit: 'cover', objectPosition: 'center' }}
          />
          <div className="new-landing-try-free-overlay" />
        </div>

        <div className="new-landing-try-free-content">
          <FadeInWhenVisible>
            <h2 className="new-landing-section-heading new-landing-try-free-heading">
              Try for Free
            </h2>
          </FadeInWhenVisible>

          <FadeInWhenVisible delay={0.15}>
            <p className="new-landing-section-subtext new-landing-try-free-subtext">
              No account and signup required.
            </p>
          </FadeInWhenVisible>

          <FadeInWhenVisible delay={0.3}>
            <motion.a
              href="https://apps.apple.com/us/app/seeme-personal-growth/id6739706517"
              target="_blank"
              rel="noopener noreferrer"
              className="new-landing-appstore-btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
            >
              <Image
                src="/appstore.png"
                alt="Download on the App Store"
                width={200}
                height={67}
                style={{ height: 'auto' }}
              />
            </motion.a>
          </FadeInWhenVisible>

          <FadeInWhenVisible delay={0.45}>
            <div className="new-landing-disclaimer" role="note" aria-label="Disclaimer">
              <p className="new-landing-disclaimer-title">Disclaimer</p>
              <p className="new-landing-disclaimer-text">
                SeeMe is a personal coaching and wellness platform and is not a substitute for professional medical advice, diagnosis, or treatment. If you are experiencing a mental health crisis or emergency, please contact a qualified healthcare provider or emergency services immediately. Use of SeeMe does not create a therapist-patient or doctor-patient relationship. Results may vary.
              </p>
            </div>
          </FadeInWhenVisible>
        </div>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer className="new-landing-footer">
        <div className="new-landing-footer-links">
          <a href="/privacy" className="new-landing-footer-link">Privacy</a>
          <span className="new-landing-footer-dot">·</span>
          <a href="mailto:info@seemeapp.ai" className="new-landing-footer-link">Contact</a>
          <span className="new-landing-footer-dot">·</span>
          <span className="new-landing-footer-copy">© 2026 SeeMe</span>
        </div>
      </footer>
    </div>
  );
};

export default NewLandingPage;
