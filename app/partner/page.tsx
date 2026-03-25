'use client';

import { CalendarCheck2, Handshake, SlidersHorizontal } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import SeemeButton from '@/components/ui/SeemeButton';
import { getSupabase } from '@/lib/supabase';

const COACHING_30_STEPS = [
  {
    step: '1',
    icon: SlidersHorizontal,
    title: 'Set up SeeMe around how you coach',
    body: 'We turn your methodology, language, prompts, and exercises into a secure system that feels entirely like your coaching.',
  },
  {
    step: '2',
    icon: CalendarCheck2,
    title: 'See every client and assign prep work',
    body: 'You can see all your clients in one place, track their status, and create and assign prep sessions, reflections, and check-ins to keep them accountable between calls.',
  },
  {
    step: '3',
    icon: Handshake,
    title: 'Create a smooth handoff into the real session',
    body: 'By the time you show up live, the context is already there. Prep sessions can handle much of the heavy lifting, so you need fewer in-person sessions and can use live time for the deeper work only you can do.',
  },
];

const PARTNER_SOCIAL_PROOF = [
  {
    quote: 'This is the future of coaching. I deliver deeper sessions, while taking on more clients. Win-win.',
  },
  {
    quote: 'Incredible what AI can do to our industry when used ethically, with us in control and privacy at its core.',
  },
  {
    quote: 'It’s sink or swim in the coaching field. This feels like adapting and moving these practices into the best direction.',
  },
] as const;

type Mode = 'hybrid' | 'fullai';

const heroContentVariants = {
  hidden: { opacity: 0, y: 28, filter: 'blur(10px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.9,
      ease: [0.22, 1, 0.36, 1] as const,
      staggerChildren: 0.12,
    },
  },
};

const heroItemVariants = {
  hidden: { opacity: 0, y: 20, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

const sectionRevealVariants = {
  hidden: { opacity: 0, y: 28, filter: 'blur(10px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

export default function PartnerPage() {
  const [selectedMode, setSelectedMode] = useState<Mode>('hybrid');
  const [coachType, setCoachType] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (window.innerWidth < 768) {
      window.scrollTo(0, 70);
    }
  }, []);

  const handleApply = async () => {
    if (!name.trim() || !email.trim() || !coachType) {
      setSubmitError('Please fill in your name, email, and coach type before applying.');
      setSubmitted(false);
      return;
    }

    setSubmitError('');
    setSubmitting(true);

    try {
      const supabase = getSupabase();
      if (!supabase) {
        setSubmitError('Unable to connect. Please try again later.');
        setSubmitting(false);
        return;
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any).from('partner_applications').insert({
        name: name.trim(),
        email: email.trim(),
        coach_type: coachType,
        selected_mode: selectedMode,
      });

      if (error) {
        setSubmitError('Something went wrong. Please try again.');
        setSubmitting(false);
        return;
      }

      setSubmitted(true);
      setName('');
      setEmail('');
      setCoachType('');
      setSelectedMode('hybrid');
      setSubmitting(false);
    } catch {
      setSubmitError('Something went wrong. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <div className="partner-page">
      <div className="new-landing-topbar is-visible">
        <Link href="/" className="new-landing-topbar-logo" aria-label="SeeMe home">
          <Image src="/SeeMeB2CIcon.png" alt="SeeMe" width={22} height={22} style={{ display: 'block' }} />
        </Link>
        <div className="new-landing-topbar-actions">
          <SeemeButton href="/" variant="unfilled" size="sm" className="new-landing-topbar-cta">
            Back to home
          </SeemeButton>
        </div>
      </div>

      <section className="hero">
        <motion.div
          className="partner-hero-content"
          variants={heroContentVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="eyebrow" variants={heroItemVariants}>Coaching 3.0</motion.div>
          <motion.h1 variants={heroItemVariants}>
            Multiply your impact.
            <br />
            <em>Without multiplying your hours.</em>
          </motion.h1>
          <motion.p variants={heroItemVariants}>
            Your coaching presence, working between every session — through check-ins, reflections, and prep sessions that keep clients moving and every live session worth more.
          </motion.p>
          <motion.div className="cta-row" variants={heroItemVariants}>
            <SeemeButton href="#apply" variant="filled" size="lg">Apply to pilot</SeemeButton>
          </motion.div>
        </motion.div>
      </section>

      <motion.div
        className="section alt"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionRevealVariants}
      >
        <div className="inner">
          <div className="sh">
            <div className="eyebrow">How it works</div>
            <h2>
              The session no longer
              <br />
              <em>ends the coaching.</em>
            </h2>
            <p>SeeMe extends your coaching into the space between calls, so clients feel supported, the work keeps moving, and your live time becomes more valuable.</p>
          </div>

          <div className="steps">
            {COACHING_30_STEPS.map((item) => (
              <div key={item.step} className="step">
                <div className="step-n">{item.step}</div>
                <div className="step-body">
                  <div className="step-icon" aria-hidden="true">
                    <item.icon size={20} strokeWidth={2.2} />
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="partner-client-bridge">
            Your clients also get the SeeMe platform: their own private, personal, intelligent AI built around them, with the option to bring in other specialized coaches whose context can be shared securely too.
            {' '}
            <Link href="/">See the client experience.</Link>
          </p>
        </div>
      </motion.div>

      <motion.div
        className="section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionRevealVariants}
      >
        <div className="inner">
          <div className="sh">
            <div className="eyebrow">Two Ways To Use It</div>
            <h2>
              You coach live,
              <br />
              or <em>your AI does</em>
            </h2>
            <p>Both modes keep your methodology at the center. The difference is how much of the delivery layer SeeMe takes on.</p>
          </div>

          <div className="modes-grid" id="modes-grid">
            <button
              type="button"
              className={`mode-card mode-selectable${selectedMode === 'hybrid' ? ' selected' : ''}`}
              onClick={() => setSelectedMode('hybrid')}
            >
              <div className="mode-chip">Hybrid</div>
              <h3>You coach live.</h3>
              <p>SeeMe handles preparation sessions, check-ins, reflections, and homework so every handoff into the real session is smooth and your live time goes deeper faster.</p>
              <div className="mode-scale">
                <div className="mode-scale-stat">
                  <div className="mode-scale-n">2-3×</div>
                  <div className="mode-scale-l">more clients<br />same live hours</div>
                </div>
                <div className="mode-scale-stat">
                  <div className="mode-scale-n">+$2.3K/mo</div>
                  <div className="mode-scale-l">added income<br />at current rates</div>
                </div>
              </div>
              <div className="mode-fine-print">
                Based on an average live session rate of $230 USD/hour and roughly 10 additional sessions per month.
              </div>
            </button>

            <button
              type="button"
              className={`mode-card mode-selectable${selectedMode === 'fullai' ? ' selected' : ''}`}
              onClick={() => setSelectedMode('fullai')}
            >
              <div className="mode-chip">Full AI</div>
              <h3>Your AI runs the program.</h3>
              <p>SeeMe delivers the full structured experience using your methodology while you oversee progress and step in when needed.</p>
              <div className="mode-scale">
                <div className="mode-scale-stat">
                  <div className="mode-scale-n">100+</div>
                  <div className="mode-scale-l">clients from<br />one dashboard</div>
                </div>
                <div className="mode-scale-stat">
                  <div className="mode-scale-n">+$5K/mo</div>
                  <div className="mode-scale-l">added income<br />at scale</div>
                </div>
              </div>
              <div className="mode-fine-print">
                Based on 100 clients paying $50 USD per month for the full AI experience.
              </div>
            </button>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="section alt"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionRevealVariants}
      >
        <div className="inner">
          <div className="sh">
            <div className="eyebrow">From coaches</div>
            <h2>
              How coaches talk
              <br />
              <em>about the shift.</em>
            </h2>
          </div>

          <div className="partner-social-grid">
            {PARTNER_SOCIAL_PROOF.map((item) => (
              <div key={item.quote} className="partner-social-card">
                <p>&ldquo;{item.quote}&rdquo;</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      <motion.div
        className="apply"
        id="apply"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionRevealVariants}
      >
        <h2>
          Join a select group of
          <br />
          <em>forward-thinking coaches.</em>
        </h2>
        <p>We&apos;re onboarding a small group of coaches to shape the platform with us. Every applicant gets a personal response within 48 hours.</p>

        <div className="form">
          <AnimatePresence mode="wait">
            {submitted && !submitError ? (
              <motion.div
                key="success"
                className="partner-success-card"
                initial={{ opacity: 0, y: 24, scale: 0.98, filter: 'blur(10px)' }}
                animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -18, scale: 0.98, filter: 'blur(8px)' }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="partner-success-mark" aria-hidden="true">✓</div>
                <h3>Application received</h3>
                <p>Thanks. We&apos;ll review your submission and get back to you within 48 hours.</p>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 18, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -20, scale: 0.98, filter: 'blur(10px)' }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="f-field">
                  <label htmlFor="partner-name">Full name</label>
                  <input id="partner-name" type="text" placeholder="Sarah Kim" value={name} onChange={(event) => setName(event.target.value)} />
                </div>

                <div className="f-field">
                  <label htmlFor="partner-email">Email</label>
                  <input id="partner-email" type="email" placeholder="sarah@yourpractice.com" value={email} onChange={(event) => setEmail(event.target.value)} />
                </div>

                <div className="f-field">
                  <label htmlFor="partner-coach-type">Coach type</label>
                  <select id="partner-coach-type" value={coachType} onChange={(event) => setCoachType(event.target.value)}>
                    <option value="" disabled>Select your primary practice</option>
                    <option value="life">Life Coach</option>
                    <option value="therapist">Therapist</option>
                    <option value="executive">Executive / Leadership Coach</option>
                    <option value="career">Career Coach</option>
                    <option value="health">Health &amp; Wellness Coach</option>
                    <option value="relationship">Relationship Coach</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="f-field">
                  <label htmlFor="partner-mode">Mode interested in</label>
                  <select id="partner-mode" value={selectedMode} onChange={(event) => setSelectedMode(event.target.value as Mode)}>
                    <option value="hybrid">Hybrid</option>
                    <option value="fullai">Full AI</option>
                  </select>
                </div>

                <SeemeButton
                  type="button"
                  variant="filled"
                  size="lg"
                  fullWidth
                  className="partner-submit-button"
                  onClick={handleApply}
                  disabled={submitting}
                >
                  {submitting ? 'Submitting...' : 'Submit'}
                </SeemeButton>

                {submitError ? <p className="f-note partner-form-error">{submitError}</p> : null}
                {!submitError ? <p className="f-note">No commitment. We&apos;ll follow up within 48 hours.</p> : null}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <footer className="new-landing-footer">
        <div className="new-landing-footer-links">
          <Link href="/privacy" className="new-landing-footer-link">Privacy</Link>
          <span className="new-landing-footer-dot">·</span>
          <a href="mailto:info@seemeapp.ai" className="new-landing-footer-link">Contact</a>
          <span className="new-landing-footer-dot">·</span>
          <span className="new-landing-footer-copy">© 2026 SeeMe</span>
        </div>
      </footer>
    </div>
  );
}
