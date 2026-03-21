'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import SeemeButton from '@/components/ui/SeemeButton';
import { getSupabase } from '@/lib/supabase';

const SLIDE_COUNT = 4;

const CLIENT_EXPERIENCE_CARDS = [
  {
    num: '01',
    label: 'Between-session check-ins',
    title: "Momentum that doesn't wait for the next call",
    body: "Your AI sends personalised check-in prompts - written in your tone - at exactly the right moments. Clients feel supported, not abandoned, between sessions.",
    type: 'default' as const,
    example: (
      <div className="cx-example">
        <div className="cx-bubble coach">How are you showing up today compared to where we left off?</div>
        <div className="cx-bubble client">Honestly better - I did the thing we talked about.</div>
      </div>
    ),
  },
  {
    num: '02',
    label: 'Guided reflection & homework',
    title: 'Your frameworks, delivered between every session',
    body: "Clients receive guided journaling prompts, exercises, and reflections drawn from your methodology - not generic AI content. The work you assign actually gets done.",
    type: 'highlight' as const,
    example: (
      <div className="cx-example">
        <div className="cx-prompt-tag">This week&apos;s reflection</div>
        <div className="cx-prompt-text">What&apos;s one pattern from this week that you want to bring into our next session?</div>
      </div>
    ),
  },
  {
    num: '03',
    label: 'Visible progress over time',
    title: 'Clients see their own growth - and so do you',
    body: 'Every check-in and session builds a picture of progress. Clients feel the arc of the work. You arrive to every live call already knowing what shifted - without asking.',
    type: 'default' as const,
    example: (
      <div className="cx-mini-stats">
        <div className="cx-stat"><span className="cx-stat-n">8.2</span><span className="cx-stat-l">Focus score this week</span></div>
        <div className="cx-stat"><span className="cx-stat-n cx-up">↑</span><span className="cx-stat-l">Improving vs. last</span></div>
        <div className="cx-stat"><span className="cx-stat-n">5/5</span><span className="cx-stat-l">Sessions done</span></div>
      </div>
    ),
  },
  {
    num: '04',
    label: 'A new client tier',
    title: "Reach people who couldn't afford you before",
    body: "Weekly sessions at your full rate isn't accessible to everyone who needs your work. SeeMe lets you offer an AI-led programme at a lower price point - opening your practice to a broader audience without compromising what you charge for the real thing.",
    type: 'access' as const,
    example: <div className="cx-access-note">Your premium rate stays premium. Your AI extends your reach.</div>,
  },
];

const PILLARS = [
  {
    badge: '1',
    label: 'Capacity',
    title: 'More clients, same hours',
    body: 'Between-session continuity is handled by the platform - homework delivered, check-ins tracked, context surfaced before every call. Coaches typically take on 5-7 more clients without adding a single hour to their schedule.',
    stat: '+$24-34K',
    statLabel: 'per year',
    statSubLabel: 'same schedule',
  },
  {
    badge: '2',
    label: 'Client Experience',
    title: 'Your coaching philosophy, always present.',
    body: "You train SeeMe on your methodology, your language, and how you work. It handles check-ins, guided reflections, and homework delivery in a voice that sounds like you. In full-AI mode it runs the entire client relationship while you stay in control.",
    stat: '10x',
    statLabel: 'more clients',
    statSubLabel: 'full-AI mode',
  },
  {
    badge: '3',
    label: 'Operations',
    title: 'Less overhead, one place',
    body: 'Client CRM, session builder, secure messaging, and scheduling - unified. No patchwork of tools, no manual follow-up, no context-switching between apps before a call.',
    stat: 'All-in-one',
    statLabel: 'practice management',
    statSubLabel: 'built for coaches',
  },
];

const FAQS = [
  {
    question: "Will my clients know they're interacting with AI?",
    answer: "Yes - always. Every client knows that SeeMe is an AI-powered platform. That's transparent by design. What they experience is an AI built on your voice and methodology, not a generic chatbot. Their live sessions with you remain exactly as they were before - nothing about that changes. The AI handles the between-session layer. You handle the human relationship.",
  },
  {
    question: 'Is my client data private and secure?',
    answer: "Client data stays on their device - that's not a policy, it's the architecture. Journals, reflections, and check-in responses are stored locally and never leave the client's phone or Mac unencrypted. As the coach, you only see impersonal metrics: where a client is in their programme, completion rates, and progress scores. You do not see the content of their reflections or private entries. Client data is never used to train AI models - not ours, not anyone else's.",
  },
  {
    question: 'Does it work with my coaching style and methodology?',
    answer: "Yes. SeeMe is methodology-agnostic. Whether you use ICF frameworks, CBT-informed approaches, somatic practices, positive psychology, or your own proprietary system - you train SeeMe on how you work. You write the prompts, design the check-ins, and set the tone. It's your practice, just extended.",
  },
  {
    question: 'Is this appropriate for therapeutic or clinical work?',
    answer: "The Hybrid mode - where you conduct all live sessions and the AI only handles between-session check-ins, reflections, and homework - is appropriate for most therapists and counsellors who want a structured between-session tool. The Full AI mode, where AI conducts programme sessions, is designed for coaching programmes and is not intended for clinical therapeutic work. If you're unsure which applies to you, we'll clarify during our 48-hour follow-up.",
  },
  {
    question: 'What if a client needs urgent support between sessions?',
    answer: "SeeMe is not a crisis tool and is not designed to replace emergency support. If a client's responses indicate distress beyond normal coaching territory, the platform flags this to you immediately. Clients can also request a direct live session at any time through the platform. You set the escalation rules during setup.",
  },
  {
    question: 'Do I need to be technical to set this up?',
    answer: "No. Onboarding is guided and conversational - you'll spend about 2 hours with us setting up your AI, training it on your methodology, and designing your first client programme. No coding, no complex configuration. If you can write a coaching prompt, you can set up SeeMe.",
  },
];

const SUBTYPES: Record<string, { label: string; options: string[] }> = {
  life: {
    label: 'Focus area',
    options: ['Personal Development', 'Mindset & Confidence', 'Goal Setting & Habits', 'Life Transitions', 'General Life Coaching'],
  },
  therapist: {
    label: 'Modality',
    options: ['CBT / Cognitive Behavioral', 'DBT', 'Trauma-Informed', 'Couples & Relationships', 'Psychodynamic', 'Somatic', 'Other'],
  },
  executive: {
    label: 'Client level',
    options: ['C-Suite & Senior Leaders', 'Founders & Entrepreneurs', 'Mid-level Management', 'Team & Culture', 'Other'],
  },
  career: {
    label: 'Specialisation',
    options: ['Career Transitions', 'Job Search & Interview Prep', 'Salary & Negotiation', 'Early Career', 'Other'],
  },
  health: {
    label: 'Focus area',
    options: ['Nutrition & Food', 'Fitness & Movement', 'Stress & Burnout', 'Sleep & Recovery', 'Holistic Wellness'],
  },
  relationship: {
    label: 'Specialisation',
    options: ['Dating & Attraction', 'Marriage & Partnership', 'Family Dynamics', 'Communication & Conflict'],
  },
  other: {
    label: 'Practice type',
    options: ['Spiritual / Mindfulness', 'Financial Coaching', 'Academic / Study', 'Creative / Business', 'Other'],
  },
};

type Mode = 'hybrid' | 'fullai';

export default function PartnerPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedMode, setSelectedMode] = useState<Mode>('hybrid');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [coachType, setCoachType] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [clientCount, setClientCount] = useState('');
  const [usesApple, setUsesApple] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const dots = useMemo(() => Array.from({ length: SLIDE_COUNT }), []);
  const subtypeData = coachType ? SUBTYPES[coachType] : null;

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDE_COUNT);
    }, 4500);

    return () => window.clearInterval(timer);
  }, []);

  // Hero renders in correct position on load — no scroll hack needed

  const goTo = (idx: number) => {
    setCurrentSlide((idx + SLIDE_COUNT) % SLIDE_COUNT);
  };

  const moveCarousel = (dir: number) => {
    setCurrentSlide((prev) => (prev + dir + SLIDE_COUNT) % SLIDE_COUNT);
  };

  const handleCoachTypeChange = (value: string) => {
    setCoachType(value);
    setSpecialization('');
    setClientCount('');
    setUsesApple(false);
    setSubmitError('');
  };

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
        specialization: specialization || null,
        client_count: clientCount || null,
        uses_apple: usesApple,
        selected_mode: selectedMode,
      });

      if (error) {
        if (error.code === '23505') {
          setSubmitError('This email has already been submitted. We\'ll be in touch!');
        } else {
          setSubmitError('Something went wrong. Please try again.');
        }
        setSubmitting(false);
        return;
      }

      setSubmitted(true);
    } catch {
      setSubmitError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="partner-page">
      <div className="new-landing-topbar is-visible">
        <Link href="/" className="new-landing-topbar-logo" aria-label="SeeMe home">
          SeeMe
        </Link>
        <div className="new-landing-topbar-actions">
          <SeemeButton href="/" variant="unfilled" size="sm" className="new-landing-topbar-cta">
            Back to home
          </SeemeButton>
        </div>
      </div>

      <section className="hero">
        <div className="eyebrow">For Coaches</div>
        <h1>
          Multiply your impact.
          <br />
          <em>Without multiplying your hours.</em>
        </h1>
        <p className="hero-sub">
          SeeMe keeps your methodology working between every call — so clients stay on track, momentum doesn&apos;t fade, and your live time goes deeper than ever before.
        </p>
        <div className="cta-row">
          <SeemeButton href="#apply" variant="filled" size="lg">Apply to pilot</SeemeButton>
          <SeemeButton href="#modes-grid" variant="unfilled" size="lg">See how it works</SeemeButton>
        </div>
      </section>

      <div className="section sec-client">
        <div className="inner">
          <div className="sh">
            <div className="eyebrow">What your client gets</div>
            <h2>
              A coach that&apos;s present
              <br />
              even when <em>you&apos;re not in the room.</em>
            </h2>
            <p>
              Your clients don&apos;t just get a tool - they get a consistent, caring experience built entirely around your voice and methodology. And for the first time, coaching becomes accessible to people who couldn&apos;t afford it before.
            </p>
          </div>

          <div className="cx-features">
            {CLIENT_EXPERIENCE_CARDS.map((card, i) => (
              <div
                key={card.title}
                className={`cx-row${i % 2 === 1 ? ' cx-row-reverse' : ''}${card.type === 'highlight' ? ' cx-row-hi' : ''}`}
              >
                <div className="cx-text">
                  <span className="cx-label">{card.label}</span>
                  <h4>{card.title}</h4>
                  <p>{card.body}</p>
                </div>
                <div className="cx-visual">
                  {card.example}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="section sec-pillars">
        <div className="inner">
          <div className="sh">
            <div className="eyebrow">What shifts</div>
            <h2>
              Three things that change
              <br />
              when you coach with <em>SeeMe</em>.
            </h2>
          </div>

          <div className="pillars-grid">
            {PILLARS.map((pillar) => (
              <div key={pillar.badge} className="pillar-card-v2">
                <div className="pillar-card-num">{pillar.badge}</div>
                <div className="pillar-card-stat">
                  <span className="pillar-card-stat-value">{pillar.stat}</span>
                  <span className="pillar-card-stat-label">{pillar.statLabel}</span>
                </div>
                <h3>{pillar.title}</h3>
                <p>{pillar.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="section sec-modes">
        <div className="inner">
          <div className="sh">
            <div className="eyebrow">Pilot Access</div>
            <h2>
              Choose how you
              <br />
              want to <em>scale.</em>
            </h2>
            <p>Both modes give every client a personalised experience built on your methodology.</p>
          </div>

          <div className="modes-toggle-wrap" id="modes-grid">
            <div className="modes-toggle">
              <button
                type="button"
                className={`modes-toggle-btn${selectedMode === 'hybrid' ? ' active' : ''}`}
                onClick={() => setSelectedMode('hybrid')}
              >
                Hybrid
              </button>
              <button
                type="button"
                className={`modes-toggle-btn${selectedMode === 'fullai' ? ' active' : ''}`}
                onClick={() => setSelectedMode('fullai')}
              >
                Full AI
              </button>
              <div className={`modes-toggle-indicator${selectedMode === 'fullai' ? ' right' : ''}`} />
            </div>
          </div>

          <div className="mode-detail">
            <div className={`mode-detail-inner${selectedMode === 'fullai' ? ' fullai' : ''}`}>
              <div className="mode-detail-header">
                <span className="mode-detail-badge">
                  {selectedMode === 'hybrid' ? 'Most popular' : 'Scale mode'}
                </span>
                <h3>
                  {selectedMode === 'hybrid'
                    ? 'You coach live. Your AI handles the rest.'
                    : 'Your AI runs the full programme.'}
                </h3>
                <p>
                  {selectedMode === 'hybrid'
                    ? 'Your AI handles all between-session work in your voice — homework delivery, reflective prompts, check-ins, and progress tracking.'
                    : 'Train SeeMe on your methodology, tone, and session structure. Your AI conducts every programme session. You oversee from a dashboard and step in whenever needed.'}
                </p>
              </div>

              <div className="mode-detail-features">
                {selectedMode === 'hybrid' ? (
                  <>
                    <div className="mode-feature">
                      <div className="mode-feature-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>
                      </div>
                      <div>
                        <strong>AI delivers</strong> homework, journaling &amp; check-ins between sessions
                      </div>
                    </div>
                    <div className="mode-feature">
                      <div className="mode-feature-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>
                      </div>
                      <div>
                        <strong>You arrive</strong> to every session with full context, zero catch-up
                      </div>
                    </div>
                    <div className="mode-feature">
                      <div className="mode-feature-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>
                      </div>
                      <div>
                        <strong>Space out sessions</strong> to bi-weekly — double your calendar room
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="mode-feature">
                      <div className="mode-feature-icon accent">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>
                      </div>
                      <div>
                        <strong>AI conducts</strong> sessions using your frameworks and voice
                      </div>
                    </div>
                    <div className="mode-feature">
                      <div className="mode-feature-icon accent">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>
                      </div>
                      <div>
                        <strong>You oversee</strong> from a dashboard — review, flag, intervene
                      </div>
                    </div>
                    <div className="mode-feature">
                      <div className="mode-feature-icon accent">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>
                      </div>
                      <div>
                        <strong>Client escalation</strong> — anyone can request a live session anytime
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="mode-detail-metric">
                <div className="mode-metric-number">
                  {selectedMode === 'hybrid' ? '2-3×' : '100+'}
                </div>
                <div className="mode-metric-label">
                  {selectedMode === 'hybrid'
                    ? 'more clients, same live hours'
                    : 'clients from one dashboard'}
                </div>
              </div>
            </div>
          </div>

          <div className="modes-cta">
            <SeemeButton href="#apply" variant="filled" size="lg" className="modes-apply-btn">Apply to pilot</SeemeButton>
            <p className="modes-note">No commitment · Invite-only · 48-hour response</p>
          </div>
        </div>
      </div>

      <div className="section sec-platform" style={{ overflow: 'hidden', paddingBottom: 0 }}>
        <div className="inner">
          <div className="sh" style={{ marginBottom: 40, textAlign: 'center' }}>
            <div className="eyebrow">The platform</div>
            <h2>See it in action.</h2>
          </div>
        </div>

        <div className="carousel-wrap">
          <div className="carousel" id="carousel" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
            {/* Slide 1: Client CRM */}
            <div className="carousel-slide">
              <div className="ipad">
                <div className="ipad-screen">
                  <div className="ipad-dummy">
                    <div className="dummy-sidebar">
                      <div className="dummy-logo" />
                      <div className="dummy-nav-item active" />
                      <div className="dummy-nav-item" />
                      <div className="dummy-nav-item" />
                      <div className="dummy-nav-item" />
                      <div className="dummy-sidebar-spacer" />
                      <div className="dummy-nav-item dim" />
                    </div>
                    <div className="dummy-main">
                      <div className="dummy-header">
                        <div className="dummy-title-block">
                          <div className="dummy-label">CLIENT CRM</div>
                          <div className="dummy-heading" />
                        </div>
                        <div className="dummy-badge">12 active</div>
                      </div>
                      <div className="dummy-client-list">
                        <div className="dummy-client-row"><div className="dummy-avatar" /><div className="dummy-client-info"><div className="dummy-name" /><div className="dummy-meta" /></div><div className="dummy-status green" /></div>
                        <div className="dummy-client-row"><div className="dummy-avatar" /><div className="dummy-client-info"><div className="dummy-name" /><div className="dummy-meta" /></div><div className="dummy-status green" /></div>
                        <div className="dummy-client-row"><div className="dummy-avatar" /><div className="dummy-client-info"><div className="dummy-name" /><div className="dummy-meta" /></div><div className="dummy-status amber" /></div>
                        <div className="dummy-client-row"><div className="dummy-avatar" /><div className="dummy-client-info"><div className="dummy-name" /><div className="dummy-meta" /></div><div className="dummy-status green" /></div>
                        <div className="dummy-client-row"><div className="dummy-avatar" /><div className="dummy-client-info"><div className="dummy-name" /><div className="dummy-meta" /></div><div className="dummy-status red" /></div>
                        <div className="dummy-client-row"><div className="dummy-avatar" /><div className="dummy-client-info"><div className="dummy-name" /><div className="dummy-meta" /></div><div className="dummy-status green" /></div>
                        <div className="dummy-client-row"><div className="dummy-avatar" /><div className="dummy-client-info"><div className="dummy-name" /><div className="dummy-meta" /></div><div className="dummy-status green" /></div>
                        <div className="dummy-client-row"><div className="dummy-avatar" /><div className="dummy-client-info"><div className="dummy-name" /><div className="dummy-meta" /></div><div className="dummy-status amber" /></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="ipad-label">Client CRM</div>
              </div>
            </div>

            {/* Slide 2: Session Builder */}
            <div className="carousel-slide">
              <div className="ipad">
                <div className="ipad-screen">
                  <div className="ipad-dummy">
                    <div className="dummy-sidebar">
                      <div className="dummy-logo" />
                      <div className="dummy-nav-item" />
                      <div className="dummy-nav-item active" />
                      <div className="dummy-nav-item" />
                      <div className="dummy-nav-item" />
                      <div className="dummy-sidebar-spacer" />
                      <div className="dummy-nav-item dim" />
                    </div>
                    <div className="dummy-main">
                      <div className="dummy-header">
                        <div className="dummy-title-block">
                          <div className="dummy-label">SESSION BUILDER</div>
                          <div className="dummy-heading" />
                        </div>
                        <div className="dummy-badge teal">+ New session</div>
                      </div>
                      <div className="dummy-builder">
                        <div className="dummy-builder-block">
                          <div className="dummy-block-tag">Reflection prompt</div>
                          <div className="dummy-block-line" />
                          <div className="dummy-block-line short" />
                        </div>
                        <div className="dummy-builder-block">
                          <div className="dummy-block-tag">Check-in scale</div>
                          <div className="dummy-scale-dots"><div /><div /><div className="active" /><div /><div /></div>
                        </div>
                        <div className="dummy-builder-block">
                          <div className="dummy-block-tag">Open journal</div>
                          <div className="dummy-block-line" />
                          <div className="dummy-block-line" />
                          <div className="dummy-block-line short" />
                        </div>
                        <div className="dummy-builder-block">
                          <div className="dummy-block-tag">Homework delivery</div>
                          <div className="dummy-block-line" />
                          <div className="dummy-block-line short" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="ipad-label">Mini-Session Builder</div>
              </div>
            </div>

            {/* Slide 3: Progress Dashboard */}
            <div className="carousel-slide">
              <div className="ipad">
                <div className="ipad-screen">
                  <div className="ipad-dummy">
                    <div className="dummy-sidebar">
                      <div className="dummy-logo" />
                      <div className="dummy-nav-item" />
                      <div className="dummy-nav-item" />
                      <div className="dummy-nav-item active" />
                      <div className="dummy-nav-item" />
                      <div className="dummy-sidebar-spacer" />
                      <div className="dummy-nav-item dim" />
                    </div>
                    <div className="dummy-main">
                      <div className="dummy-header">
                        <div className="dummy-title-block">
                          <div className="dummy-label">CLIENT DASHBOARD</div>
                          <div className="dummy-heading" />
                        </div>
                      </div>
                      <div className="dummy-stats-row">
                        <div className="dummy-stat-card"><div className="dummy-stat-n teal">8.2</div><div className="dummy-stat-l">Focus score</div></div>
                        <div className="dummy-stat-card"><div className="dummy-stat-n">5/5</div><div className="dummy-stat-l">Sessions done</div></div>
                        <div className="dummy-stat-card"><div className="dummy-stat-n teal">↑</div><div className="dummy-stat-l">Trend</div></div>
                      </div>
                      <div className="dummy-chart">
                        <div className="dummy-bar" style={{ height: '35%' }} />
                        <div className="dummy-bar" style={{ height: '48%' }} />
                        <div className="dummy-bar" style={{ height: '42%' }} />
                        <div className="dummy-bar" style={{ height: '58%' }} />
                        <div className="dummy-bar" style={{ height: '52%' }} />
                        <div className="dummy-bar" style={{ height: '68%' }} />
                        <div className="dummy-bar" style={{ height: '62%' }} />
                        <div className="dummy-bar" style={{ height: '75%' }} />
                        <div className="dummy-bar active" style={{ height: '82%' }} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="ipad-label">Progress Dashboard</div>
              </div>
            </div>

            {/* Slide 4: Secure Messaging */}
            <div className="carousel-slide">
              <div className="ipad">
                <div className="ipad-screen">
                  <div className="ipad-dummy">
                    <div className="dummy-sidebar">
                      <div className="dummy-logo" />
                      <div className="dummy-nav-item" />
                      <div className="dummy-nav-item" />
                      <div className="dummy-nav-item" />
                      <div className="dummy-nav-item active" />
                      <div className="dummy-sidebar-spacer" />
                      <div className="dummy-nav-item dim" />
                    </div>
                    <div className="dummy-main">
                      <div className="dummy-header">
                        <div className="dummy-title-block">
                          <div className="dummy-label">SECURE MESSAGING</div>
                          <div className="dummy-heading" />
                        </div>
                        <div className="dummy-lock">🔒</div>
                      </div>
                      <div className="dummy-messages">
                        <div className="dummy-msg coach"><div className="dummy-msg-bubble" /><div className="dummy-msg-bubble short" /></div>
                        <div className="dummy-msg client"><div className="dummy-msg-bubble" /></div>
                        <div className="dummy-msg coach"><div className="dummy-msg-bubble short" /></div>
                        <div className="dummy-msg client"><div className="dummy-msg-bubble" /><div className="dummy-msg-bubble short" /></div>
                        <div className="dummy-msg coach"><div className="dummy-msg-bubble" /></div>
                        <div className="dummy-msg client"><div className="dummy-msg-bubble short" /></div>
                      </div>
                      <div className="dummy-input-row"><div className="dummy-input" /><div className="dummy-send" /></div>
                    </div>
                  </div>
                </div>
                <div className="ipad-label">Secure Messaging</div>
              </div>
            </div>
          </div>

          <div className="carousel-controls">
            <button type="button" className="carr-btn" onClick={() => moveCarousel(-1)} aria-label="Previous slide">←</button>
            <div className="carr-dots" id="carrDots">
              {dots.map((_, idx) => (
                <button
                  type="button"
                  key={idx}
                  className={`carr-dot${idx === currentSlide ? ' active' : ''}`}
                  onClick={() => goTo(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
            <button type="button" className="carr-btn" onClick={() => moveCarousel(1)} aria-label="Next slide">→</button>
          </div>
        </div>
      </div>

      <div className="section sec-math">
        <div className="inner">
          <div className="sh">
            <div className="eyebrow">The math</div>
            <h2>
              What 5 more clients
              <br />
              <em>actually</em> means.
            </h2>
          </div>
          <div className="calc-box">
            <div className="calc-head"><p>Example: $200/session · 2 sessions/month · per client</p></div>
            <div className="calc-cols">
              <div className="calc-col"><div className="calc-lbl b">Without SeeMe</div><div className="calc-big b">15</div><div className="calc-sm">active clients · $6,000/mo</div></div>
              <div className="arr">→</div>
              <div className="calc-col"><div className="calc-lbl a">With SeeMe</div><div className="calc-big a">20-22</div><div className="calc-sm">active clients · $8,000-8,800/mo</div></div>
              <div className="arr">→</div>
              <div className="calc-col"><div className="calc-lbl a">Difference</div><div className="calc-big a">+$24-34K</div><div className="calc-sm">per year · $2-3K/month</div></div>
            </div>
            <div className="calc-foot">Based on $200/session · adjust for your rate. <strong>At $400/session, 5 extra clients adds $48K/year.</strong></div>
          </div>
        </div>
      </div>

      <div className="section sec-faq" id="faq">
        <div className="inner faq-inner">
          <div className="faq-header">
            <div className="eyebrow">FAQ</div>
            <h2>
              Before you <em>apply.</em>
            </h2>
          </div>
          <div className="faq-list">
            {FAQS.map((item, index) => {
              const isOpen = openFaqIndex === index;

              return (
                <button
                  key={item.question}
                  type="button"
                  className={`faq-item${isOpen ? ' open' : ''}`}
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  aria-expanded={isOpen}
                >
                  <div className="faq-q">
                    <span className="faq-num">{String(index + 1).padStart(2, '0')}</span>
                    <span className="faq-q-text">{item.question}</span>
                    <span className="faq-arrow">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
                    </span>
                  </div>
                  <div className="faq-a">{item.answer}</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="apply" id="apply">
        <h2>
          Join the first
          <br />
          <em>cohort of coaches.</em>
        </h2>
        <p>We&apos;re onboarding a small, hand-picked group to shape the platform with us. Every applicant gets a personal response within 48 hours.</p>

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
            <select id="partner-coach-type" value={coachType} onChange={(event) => handleCoachTypeChange(event.target.value)}>
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

          <div className={`f-reveal${subtypeData ? ' visible' : ''}`}>
            <div className="f-field">
              <label htmlFor="partner-specialization">{subtypeData?.label ?? 'Specialisation'}</label>
              <select
                id="partner-specialization"
                value={specialization}
                onChange={(event) => setSpecialization(event.target.value)}
                disabled={!subtypeData}
              >
                <option value="" disabled>Select</option>
                {subtypeData?.options.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>

          <div className={`f-reveal${subtypeData ? ' visible' : ''}`}>
            <div className="f-field">
              <label htmlFor="partner-clients">Active clients</label>
              <select id="partner-clients" value={clientCount} onChange={(event) => setClientCount(event.target.value)} disabled={!subtypeData}>
                <option value="" disabled>How many right now?</option>
                <option value="1-5">1-5</option>
                <option value="6-10">6-10</option>
                <option value="11-20">11-20</option>
                <option value="21-40">21-40</option>
                <option value="40+">40+</option>
              </select>
            </div>
          </div>

          <div className={`f-reveal apple-reveal${subtypeData ? ' visible' : ''}`}>
            <div className="apple-field">
              <div className="apple-label-wrap">
                <span>
                  Do you use Apple products for coaching?
                  <span className="tip-wrap">
                    <em className="tip-icon">?</em>
                    <span className="tip-box">SeeMe uses Apple&apos;s private relay and on-device frameworks to keep all client data end-to-end encrypted. An Apple device - iPhone, iPad, or Mac - is required to participate in the pilot.</span>
                  </span>
                </span>
                <small>iPhone, iPad, or Mac used with clients</small>
              </div>
              <label className="toggle" htmlFor="partner-apple">
                <input
                  id="partner-apple"
                  type="checkbox"
                  checked={usesApple}
                  onChange={(event) => setUsesApple(event.target.checked)}
                />
                <span className="toggle-track" />
                <span className="toggle-thumb" />
              </label>
            </div>
          </div>

          <button type="button" className="f-submit" onClick={handleApply} disabled={submitting}>
            {submitting ? 'Submitting...' : 'Apply to join →'}
          </button>
          {submitError ? <p className="f-note partner-form-error">{submitError}</p> : null}
          {!submitError && submitted ? <p className="f-note partner-form-success">Thanks, {name.trim().split(' ')[0]}! We&apos;ll be in touch within 48 hours.</p> : null}
          {!submitError && !submitted ? <p className="f-note">No commitment. We&apos;ll follow up within 48 hours.</p> : null}
        </div>
      </div>

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
