'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

const SLIDE_COUNT = 4;

export default function PartnerPage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const dots = useMemo(() => Array.from({ length: SLIDE_COUNT }), []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDE_COUNT);
    }, 4500);

    return () => window.clearInterval(timer);
  }, []);

  const goTo = (idx: number) => {
    setCurrentSlide((idx + SLIDE_COUNT) % SLIDE_COUNT);
  };

  const moveCarousel = (dir: number) => {
    setCurrentSlide((prev) => (prev + dir + SLIDE_COUNT) % SLIDE_COUNT);
  };

  return (
    <div className="partner-page">
      <nav>
        <Link className="nav-logo" href="/">
          See<em>Me</em>
        </Link>
        <Link className="nav-back" href="/">
          ← Back
        </Link>
      </nav>

      <section className="hero">
        <div className="eyebrow">For Coaches</div>
        <h1>
          More clients.
          <br />
          <em>Less overhead.</em>
        </h1>
        <p>
          The AI layer that handles between-session work so your live time stays focused on deep coaching.
        </p>
        <div className="cta-row">
          <a className="btn-solid" href="#apply">Apply to pilot</a>
          <a className="btn-ghost" href="#how">How it works</a>
        </div>
      </section>

      <div className="stats">
        <div className="stat">
          <div className="stat-n">5-7</div>
          <div className="stat-l">extra clients without<br />extra hours</div>
        </div>
        <div className="stat">
          <div className="stat-n">15min</div>
          <div className="stat-l">of catch-up eliminated<br />per session</div>
        </div>
        <div className="stat">
          <div className="stat-n">30:1</div>
          <div className="stat-l">ROI at $79/mo vs<br />added client revenue</div>
        </div>
        <div className="stat">
          <div className="stat-n">24/7</div>
          <div className="stat-l">client engagement<br />without your time</div>
        </div>
      </div>

      <div className="section" style={{ overflow: 'hidden', paddingBottom: 0 }}>
        <div className="inner">
          <div className="sh" style={{ marginBottom: 40 }}>
            <div className="eyebrow">The platform</div>
            <h2>See it in action.</h2>
          </div>
        </div>

        <div className="carousel-wrap">
          <div className="carousel" id="carousel" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
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
                      </div>
                    </div>
                  </div>
                </div>
                <div className="ipad-label">Client CRM</div>
              </div>
            </div>

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
                      </div>
                    </div>
                  </div>
                </div>
                <div className="ipad-label">Mini-Session Builder</div>
              </div>
            </div>

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
                        <div className="dummy-bar" style={{ height: '40%' }} />
                        <div className="dummy-bar" style={{ height: '55%' }} />
                        <div className="dummy-bar" style={{ height: '50%' }} />
                        <div className="dummy-bar" style={{ height: '70%' }} />
                        <div className="dummy-bar" style={{ height: '65%' }} />
                        <div className="dummy-bar active" style={{ height: '82%' }} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="ipad-label">Progress Dashboard</div>
              </div>
            </div>

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
            <button className="carr-btn" id="prevBtn" onClick={() => moveCarousel(-1)} aria-label="Previous slide">←</button>
            <div className="carr-dots" id="carrDots">
              {dots.map((_, idx) => (
                <button
                  key={idx}
                  className={`carr-dot${idx === currentSlide ? ' active' : ''}`}
                  onClick={() => goTo(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
            <button className="carr-btn" id="nextBtn" onClick={() => moveCarousel(1)} aria-label="Next slide">→</button>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="inner">
          <div className="sh">
            <div className="eyebrow">The shift</div>
            <h2>Sessions are only <em>half</em> the relationship.</h2>
            <p>What happens between sessions determines outcomes. Until now, there was no infrastructure for it.</p>
          </div>
          <div className="ba-grid">
            <div className="ba-cell"><div className="ba-label b">Before</div><h3>Sessions start with catch-up.</h3><p>15 minutes rebuilding context you already had. Momentum fades. Paid time gets wasted.</p></div>
            <div className="ba-cell"><div className="ba-label a">With SeeMe</div><h3>Sessions start at depth.</h3><p>Clients arrive having done the work. You open the session already knowing where to go.</p></div>
            <div className="ba-cell"><div className="ba-label b">Before</div><h3>Capacity is capped by cognitive load.</h3><p>Holding 15+ clients in your head is exhausting. Quality slips before hours run out.</p></div>
            <div className="ba-cell"><div className="ba-label a">With SeeMe</div><h3>The platform holds the context.</h3><p>Your dashboard surfaces who needs attention, what exercises were completed, and where scores moved.</p></div>
          </div>
        </div>
      </div>

      <div className="section alt" id="how">
        <div className="inner">
          <div className="sh">
            <div className="eyebrow">How it works</div>
            <h2>Built around how<br />you already coach.</h2>
          </div>
          <div className="steps">
            <div className="step"><div className="step-n">01</div><div><h3>Set up your profile</h3><p>Upload your methodology and frameworks. Your clients interact with an AI that genuinely reflects your approach.</p></div></div>
            <div className="step"><div className="step-n">02</div><div><h3>Invite your clients</h3><p>Clients connect to you via the SeeMe app. They opt in to share progress - everything private by default.</p></div></div>
            <div className="step"><div className="step-n">03</div><div><h3>Assign mini-sessions</h3><p>Build exercises and reflections in the session builder. Schedule them between live sessions. The AI delivers and tracks.</p></div></div>
            <div className="step"><div className="step-n">04</div><div><h3>Coach from insight</h3><p>Check your dashboard before each session. See completions, check-in scores, and what surfaced. Every session starts fully briefed.</p></div></div>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="inner">
          <div className="sh">
            <div className="eyebrow">Platform</div>
            <h2>Everything your practice needs.<br /><em>One place.</em></h2>
          </div>
          <div className="feat-grid">
            <div className="feat"><span className="feat-icon">🗂</span><h3>Client CRM</h3><p>Profiles, session history, goals, and notes. See who&apos;s active and who needs attention at a glance.</p></div>
            <div className="feat"><span className="feat-icon">✏️</span><h3>Mini-Session Builder</h3><p>Design exercises and homework sequences. Schedule delivery to any client automatically.</p></div>
            <div className="feat"><span className="feat-icon">🔒</span><h3>Secure Messaging</h3><p>End-to-end encrypted. We cannot read it. ICF confidentiality enforced by architecture, not policy.</p></div>
            <div className="feat"><span className="feat-icon">📊</span><h3>Progress Dashboard</h3><p>Check-in scores, homework completion, focus area trends - only what clients choose to share.</p></div>
            <div className="feat"><span className="feat-icon">🤖</span><h3>AI Coach Persona</h3><p>Your tone and frameworks power the AI. It sounds like you - not a generic assistant.</p></div>
            <div className="feat"><span className="feat-icon">📅</span><h3>Scheduling</h3><p>Live sessions and between-session work, scheduled from one place. Clients get notified automatically.</p></div>
          </div>
        </div>
      </div>

      <div className="section alt">
        <div className="inner">
          <div className="sh">
            <div className="eyebrow">The math</div>
            <h2>What 5 more clients<br /><em>actually</em> means.</h2>
          </div>
          <div className="calc-box">
            <div className="calc-head"><p>Example: $200/session - 2 sessions/month - per client</p></div>
            <div className="calc-cols">
              <div className="calc-col"><div className="calc-lbl b">Without SeeMe</div><div className="calc-big b">15</div><div className="calc-sm">active clients - $6,000/mo</div></div>
              <div className="arr">→</div>
              <div className="calc-col"><div className="calc-lbl a">With SeeMe</div><div className="calc-big a">20-22</div><div className="calc-sm">active clients - $8,000-8,800/mo</div></div>
              <div className="arr">→</div>
              <div className="calc-col"><div className="calc-lbl a">Difference</div><div className="calc-big a">+$24-34K</div><div className="calc-sm">per year - $2-3K/month</div></div>
            </div>
            <div className="calc-foot">SeeMe Pro is $79/mo. <strong>That&apos;s a 30:1 return on the extra revenue alone.</strong></div>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="inner">
          <div className="priv-grid">
            <div>
              <div className="eyebrow" style={{ marginBottom: 18 }}>Built for ICF ethics</div>
              <h2>Confidentiality isn&apos;t a promise.<br /><em>It&apos;s architecture.</em></h2>
              <p>SeeMe is a zero-knowledge relay. We route encrypted data between you and your clients - we are mathematically incapable of reading it.</p>
              <div className="priv-list">
                <div className="priv-item"><div className="priv-dot" /><span><strong>Client data lives on their device.</strong> Nothing leaves without explicit consent.</span></div>
                <div className="priv-item"><div className="priv-dot" /><span><strong>Granular opt-in sharing.</strong> Clients control exactly what you see. Revocable anytime.</span></div>
                <div className="priv-item"><div className="priv-dot" /><span><strong>Your methodology stays yours.</strong> Not used to train any model. Ever.</span></div>
              </div>
            </div>
            <div className="priv-card">
              <div className="priv-card-title">🔐 Data access policy</div>
              <div className="priv-row"><span>Client journal entries</span><span className="no">No coach access</span></div>
              <div className="priv-row"><span>Health &amp; calendar data</span><span className="no">No coach access</span></div>
              <div className="priv-row"><span>Session summaries</span><span className="yes">Client opt-in only</span></div>
              <div className="priv-row"><span>Progress check-ins</span><span className="yes">Client opt-in only</span></div>
              <div className="priv-row"><span>Homework responses</span><span className="yes">Coach-assigned only</span></div>
              <div className="priv-row"><span>Messages</span><span className="yes">E2E encrypted</span></div>
              <div className="priv-row"><span>SeeMe can read messages</span><span className="no">Never</span></div>
            </div>
          </div>
        </div>
      </div>

      <div className="section alt">
        <div className="inner">
          <div className="sh" style={{ textAlign: 'center' }}>
            <div className="eyebrow">Pricing</div>
            <h2>Scales with your practice.</h2>
          </div>
          <div className="price-grid">
            <div className="p-card">
              <div className="p-tier">Starter</div>
              <div className="p-amt"><sup>$</sup>39</div>
              <div className="p-period">per month</div>
              <div className="p-clients">Up to 10 clients</div>
              <hr className="p-divider" />
              <div className="p-feat">Client CRM &amp; profiles</div>
              <div className="p-feat">Session scheduling</div>
              <div className="p-feat">3 mini-session templates</div>
              <div className="p-feat">Secure messaging</div>
              <div className="p-feat">Progress dashboard</div>
              <button className="p-btn ghost">Get started</button>
            </div>
            <div className="p-card feat-card">
              <div className="feat-tag">Most popular</div>
              <div className="p-tier">Pro</div>
              <div className="p-amt"><sup>$</sup>79</div>
              <div className="p-period">per month</div>
              <div className="p-clients">Up to 30 clients</div>
              <hr className="p-divider" />
              <div className="p-feat">Everything in Starter</div>
              <div className="p-feat">Unlimited session builder</div>
              <div className="p-feat">AI coach persona</div>
              <div className="p-feat">Engagement analytics</div>
              <div className="p-feat">AI content suggestions</div>
              <button className="p-btn solid">Get started</button>
            </div>
            <div className="p-card">
              <div className="p-tier">Studio</div>
              <div className="p-amt"><sup>$</sup>149</div>
              <div className="p-period">per month</div>
              <div className="p-clients">Unlimited clients</div>
              <hr className="p-divider" />
              <div className="p-feat">Everything in Pro</div>
              <div className="p-feat">White-label experience</div>
              <div className="p-feat">Group programs</div>
              <div className="p-feat">Team &amp; associate coaches</div>
              <div className="p-feat">Priority support</div>
              <button className="p-btn ghost">Get started</button>
            </div>
          </div>
        </div>
      </div>

      <div className="apply" id="apply">
        <h2>Help us build<br /><em>what&apos;s next.</em></h2>
        <p>We&apos;re onboarding a small cohort of coaches to shape the platform. We&apos;ll be in touch within 48 hours.</p>
        <div className="form">
          <div className="f-row">
            <div className="f-field"><label>First name</label><input type="text" placeholder="Sarah" /></div>
            <div className="f-field"><label>Last name</label><input type="text" placeholder="Kim" /></div>
          </div>
          <div className="f-row">
            <div className="f-field full"><label>Email</label><input type="email" placeholder="sarah@yourpractice.com" /></div>
          </div>
          <div className="f-row">
            <div className="f-field">
              <label>ICF Credential</label>
              <select defaultValue="">
                <option value="" disabled>Select</option>
                <option>ACC</option><option>PCC</option><option>MCC</option>
                <option>Working towards ICF</option><option>Other</option>
              </select>
            </div>
            <div className="f-field">
              <label>Active clients</label>
              <select defaultValue="">
                <option value="" disabled>How many?</option>
                <option>1-5</option><option>6-10</option><option>11-20</option><option>20+</option>
              </select>
            </div>
          </div>
          <div className="f-row">
            <div className="f-field full">
              <label>Coaching focus</label>
              <select defaultValue="">
                <option value="" disabled>Primary specialty</option>
                <option>Life Coaching</option><option>Executive / Leadership</option>
                <option>Career Coaching</option><option>Health &amp; Wellness</option>
                <option>Relationship Coaching</option><option>Other</option>
              </select>
            </div>
          </div>
          <button className="f-submit">Apply to join →</button>
          <p className="f-note">No commitment. We&apos;ll follow up within 48 hours.</p>
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
