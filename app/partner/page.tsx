'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import SeemeButton from '@/components/ui/SeemeButton';

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

  useEffect(() => {
    window.scrollTo(0, 70);
  }, []);

  const goTo = (idx: number) => {
    setCurrentSlide((idx + SLIDE_COUNT) % SLIDE_COUNT);
  };

  const moveCarousel = (dir: number) => {
    setCurrentSlide((prev) => (prev + dir + SLIDE_COUNT) % SLIDE_COUNT);
  };

  return (
    <div className="partner-page">
      <div className="new-landing-topbar is-visible">
        <Link href="/" className="new-landing-topbar-logo" aria-label="SeeMe home">
          SeeMe
        </Link>
        <div className="new-landing-topbar-actions">
          <SeemeButton href="/partner" variant="unfilled" size="sm" className="new-landing-topbar-cta">
            Partner with us
          </SeemeButton>
        </div>
      </div>

      <section className="hero">
        <div className="eyebrow">Coaching 3.0</div>
        <h1>
          More clients.
          <br />
          <em>Less overhead.</em>
        </h1>
        <p>
          Give every client a personal intelligence platform between sessions - so your live time stays focused on the work only you can do.
        </p>
        <div className="cta-row">
          <SeemeButton href="#apply" variant="filled" size="lg">Apply to pilot</SeemeButton>
          <SeemeButton href="#pricing" variant="unfilled" size="lg">See pricing</SeemeButton>
        </div>
      </section>

      <div className="section alt">
        <div className="inner">
          <div className="sh">
            <div className="eyebrow">What changes</div>
            <h2>Three things that shift<br />when you coach with <em>SeeMe</em>.</h2>
            <p>Coaching 3.0 isn&apos;t about replacing the coach - it&apos;s about extending what&apos;s possible between sessions.</p>
          </div>

          <div className="pillars-wrap">
            <div className="pillar-row">
              <div className="pillar-badge">1</div>
              <div className="pillar-body">
                <div className="pillar-label">Capacity</div>
                <h3>More clients, same hours</h3>
                <p>Between-session continuity is handled by the platform - homework delivered, check-ins tracked, context surfaced before every call. Coaches typically add 5-7 clients without adding a single hour to their schedule.</p>
              </div>
              <div className="pillar-stat-block">
                <div className="pillar-stat-n">+$24-34K</div>
                <div className="pillar-stat-l">per year<br />same schedule</div>
              </div>
            </div>

            <div className="pillar-row">
              <div className="pillar-badge">2</div>
              <div className="pillar-body">
                <div className="pillar-label">Coaching 3.0 - Client Experience</div>
                <h3>A personal intelligence platform for every client</h3>
                <p>Coaching 1.0 was directive. Coaching 2.0 was non-directive and ICF-certified. Coaching 3.0 is the coach augmented - your client has an AI that reflects your methodology, guides their journaling, runs their homework, and tracks their progress 24/7. The relationship doesn&apos;t end when the session does.</p>
              </div>
              <div className="pillar-stat-block">
                <div className="pillar-stat-n">24/7</div>
                <div className="pillar-stat-l">client engagement<br />without your time</div>
              </div>
            </div>

            <div className="pillar-row">
              <div className="pillar-badge">3</div>
              <div className="pillar-body">
                <div className="pillar-label">Operations</div>
                <h3>Less overhead, one place</h3>
                <p>Client CRM, mini-session builder, secure messaging, and scheduling - unified. No patchwork of tools, no manual follow-up, no context-switching between platforms before a call.</p>
              </div>
              <div className="pillar-stat-block">
                <div className="pillar-stat-n">All-in-one</div>
                <div className="pillar-stat-l">practice management<br />built for coaches</div>
              </div>
            </div>
          </div>
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
              <div className="calc-col"><div className="calc-lbl a">DIFFERENCE</div><div className="calc-big a">+$24-34K</div><div className="calc-sm">per year - $2-3K/month</div></div>
            </div>
            <div className="calc-foot">SeeMe Pro is $79/mo. <strong>That&apos;s a 30:1 return on the extra revenue alone.</strong></div>
          </div>
        </div>
      </div>

      <div className="section" id="pricing">
        <div className="inner">
          <div className="sh" style={{ textAlign: 'center' }}>
            <div className="eyebrow">Pricing</div>
            <h2>Scales with your practice.</h2>
          </div>
          <div className="price-grid">
            <div className="p-card feat-card">
              <div className="feat-tag">Most popular</div>
              <div className="p-tier">Pro</div>
              <div className="p-amt"><sup>$</sup>79</div>
              <div className="p-period">per month</div>
              <div className="p-clients">Up to 30 clients</div>
            </div>
          </div>
        </div>
      </div>

      <div className="apply" id="apply">
        <h2>Help us build<br /><em>what&apos;s next.</em></h2>
        <p>We&apos;re onboarding a small cohort of coaches to shape the platform. We&apos;ll be in touch within 48 hours.</p>
        <div className="form">
          <div className="f-row">
            <div className="f-field full"><label>Name</label><input type="text" placeholder="Sarah Kim" /></div>
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
          <div className="f-row">
            <div className="f-field full">
              <label>Has/uses Apple products</label>
              <select defaultValue="">
                <option value="" disabled>Select</option>
                <option>Yes</option>
                <option>No</option>
              </select>
            </div>
          </div>
          <SeemeButton variant="filled" size="lg" fullWidth className="partner-apply-submit">Apply to join →</SeemeButton>
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
