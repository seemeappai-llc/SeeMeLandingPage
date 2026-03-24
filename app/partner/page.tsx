'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import SeemeButton from '@/components/ui/SeemeButton';
import { getSupabase } from '@/lib/supabase';

const COACHING_PILLARS = [
  {
    num: '01',
    label: 'Your method',
    title: 'Your methodology, not generic AI',
    body: 'Train SeeMe on your voice, frameworks, prompts, and exercises so clients experience your approach between sessions.',
  },
  {
    num: '02',
    label: 'Between sessions',
    title: 'Support that keeps momentum alive',
    body: 'Check-ins, reflections, homework, and progress tracking keep clients engaged while you stay focused on the work only you can do live.',
  },
  {
    num: '03',
    label: 'Capacity',
    title: 'Better outcomes with more room to grow',
    body: 'You arrive to every session with context already in place and create space to support more clients without multiplying your hours.',
  },
];

const HOW_IT_WORKS = [
  {
    step: '1',
    title: 'You train SeeMe on how you coach',
    body: 'We help you turn your methodology, language, and session structure into a living system your clients can use between calls.',
  },
  {
    step: '2',
    title: 'Clients get support between sessions',
    body: 'SeeMe delivers check-ins, reflections, and homework in your style so the work continues after the call ends.',
  },
  {
    step: '3',
    title: 'You arrive with context and go deeper',
    body: 'Instead of spending time catching up, you step into each session already knowing what shifted and where to focus.',
  },
];

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
          <Image src="/SeeMeB2BIcon.png" alt="SeeMe" width={22} height={22} style={{ display: 'block' }} />
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
            SeeMe keeps your coaching methodology working between sessions through check-ins, reflections, homework, and progress tracking.
          </motion.p>
          <motion.div className="cta-row" variants={heroItemVariants}>
            <SeemeButton href="#apply" variant="filled" size="lg">Apply to pilot</SeemeButton>
          </motion.div>
        </motion.div>
      </section>

      <motion.div
        className="section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionRevealVariants}
      >
        <div className="inner">
          <div className="sh">
            <div className="eyebrow">What Coaching 3.0 Means</div>
            <h2>
              The session no longer
              <br />
              ends the coaching.
            </h2>
            <p>SeeMe extends your coaching into the space between calls, so clients feel supported, the work keeps moving, and your live time becomes more valuable.</p>
          </div>

          <div className="cx-grid partner-pillars-grid">
            {COACHING_PILLARS.map((pillar) => (
              <div key={pillar.num} className="cx-card">
                <div className="cx-label">{pillar.label}</div>
                <h4>{pillar.title}</h4>
                <p>{pillar.body}</p>
              </div>
            ))}
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
            <div className="eyebrow">How It Works</div>
            <h2>
              A simple system for
              <br />
              <em>modern coaching.</em>
            </h2>
          </div>

          <div className="steps">
            {HOW_IT_WORKS.map((item) => (
              <div key={item.step} className="step">
                <div className="step-n">{item.step}</div>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </div>
              </div>
            ))}
          </div>
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
              or <em>your AI does.</em>
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
                <div>
                  <div className="mode-scale-n">2-3×</div>
                  <div className="mode-scale-l">more clients<br />same live hours</div>
                </div>
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
                <div>
                  <div className="mode-scale-n">100+</div>
                  <div className="mode-scale-l">clients from<br />one dashboard</div>
                </div>
              </div>
            </button>
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

          <button type="button" className="f-submit" onClick={handleApply} disabled={submitting}>
            {submitting ? 'Submitting...' : 'Apply to pilot →'}
          </button>

          {submitError ? <p className="f-note partner-form-error">{submitError}</p> : null}
          {!submitError && submitted ? <p className="f-note partner-form-success">Thanks, {name.trim().split(' ')[0]}! We&apos;ll be in touch within 48 hours.</p> : null}
          {!submitError && !submitted ? <p className="f-note">No commitment. We&apos;ll follow up within 48 hours.</p> : null}
        </div>
      </motion.div>

      <footer>
        <div className="f-logo">See<em>Me</em></div>
        <ul className="f-links">
          <li><Link href="/privacy">Privacy</Link></li>
          <li><a href="#">Terms</a></li>
          <li><a href="#">Support</a></li>
          <li><Link href="/">seemeai.app</Link></li>
        </ul>
        <div className="f-copy">© 2026 SeeMe</div>
      </footer>
    </div>
  );
}
