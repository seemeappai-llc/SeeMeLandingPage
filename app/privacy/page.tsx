'use client';

import React from 'react';
import Link from 'next/link';

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-black/50 border-b border-white/10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link 
            href="/" 
            className="text-2xl font-bold text-white hover:text-white/80 transition-colors"
            style={{ fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif' }}
          >
            SeeMe
          </Link>
          <Link 
            href="/"
            className="text-white/70 hover:text-white transition-colors text-sm"
          >
            ← Back to Home
          </Link>
        </div>
      </header>

      {/* Content */}
      <article className="max-w-4xl mx-auto px-6 py-12 md:py-20">
        <div className="prose prose-invert prose-lg max-w-none">
          {/* Title */}
          <h1 
            className="text-4xl md:text-5xl font-bold text-white mb-2"
            style={{ fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif' }}
          >
            Privacy Policy
          </h1>
          <p className="text-white/60 text-sm mb-12">Last updated: December 4th, 2025</p>

          {/* Introduction */}
          <div className="bg-white/5 rounded-2xl p-6 md:p-8 mb-12 border border-white/10">
            <p className="text-white/90 text-lg leading-relaxed m-0">
              SeeMe (&ldquo;we,&rdquo; &ldquo;us,&rdquo; &ldquo;our&rdquo;) is built on a simple principle: <strong className="text-white">your data is yours.</strong>
            </p>
            <p className="text-white/80 mt-4 mb-0">
              We collect and store <strong>only the absolute minimum information required</strong> to operate the app and provide a personalized coaching experience. We do not sell data, we do not track users across apps or services, and we do not store personal content such as journals, health data, session transcripts, or calendars.
            </p>
          </div>

          {/* Section 1 */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-semibold text-white mb-6">1. What We Collect</h2>
            <p className="text-white/80 mb-6">We collect <strong>only three types of information</strong>, and all are minimal and purpose-specific.</p>

            <h3 className="text-xl font-semibold text-white/90 mt-8 mb-4">1.1 Basic Profile Information (Provided by You)</h3>
            <p className="text-white/80 mb-4">We collect only what is strictly necessary for app functionality and personalization:</p>
            <ul className="text-white/80 space-y-2 mb-4">
              <li>Your name (optional in future — may be made non-required)</li>
              <li>Age</li>
              <li>Gender</li>
              <li>Answers to onboarding questions (e.g., whether you want notifications, whether you enabled HealthKit, calendar, or screen-time access)</li>
            </ul>
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mt-4">
              <p className="text-white/90 m-0 text-sm">
                <strong>Important:</strong> We do <strong>not</strong> store any of the underlying data from HealthKit, calendar events, or screen time. We only store whether these integrations have been enabled (true/false).
              </p>
            </div>

            <h3 className="text-xl font-semibold text-white/90 mt-8 mb-4">1.2 Anonymous Account Identifier</h3>
            <p className="text-white/80 mb-4">When you start using SeeMe, we generate an <strong>anonymous user ID</strong>. We do <strong>not</strong> require:</p>
            <ul className="text-white/80 space-y-2 mb-4">
              <li>Email address</li>
              <li>Phone number</li>
              <li>Social login</li>
              <li>Any personally identifying details</li>
            </ul>
            <p className="text-white/80">This ID helps us maintain your account and understand high-level app usage patterns across the user base.</p>

            <h3 className="text-xl font-semibold text-white/90 mt-8 mb-4">1.3 Non-Personal Usage Logs</h3>
            <p className="text-white/80 mb-4">To improve app performance and understand general behavior patterns, we store lightweight, non-personal logs such as:</p>
            <ul className="text-white/80 space-y-2 mb-4">
              <li>How long you spent in a session</li>
              <li>Which buttons or screens you interacted with</li>
              <li>Feature usage counts</li>
              <li>Time spent in different areas of the app</li>
            </ul>
            <p className="text-white/80">These logs are <strong>not linked to personal identity</strong>, contain <strong>no conversational, journal, or health content</strong>, and <strong>cannot be traced back to an individual user</strong>.</p>
          </section>

          {/* Section 2 */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-semibold text-white mb-6">2. What We Do Not Collect</h2>
            <p className="text-white/80 mb-4">SeeMe does <strong>not</strong> collect, store, or access:</p>
            <ul className="text-white/80 space-y-2">
              <li>Journaling entries</li>
              <li>Session transcripts</li>
              <li>Emotional insights</li>
              <li>Personal notes or reflections</li>
              <li>HealthKit data (heart rate, sleep, activity, etc.)</li>
              <li>Actual calendar events or screen-time histories</li>
              <li>Email addresses or contact information</li>
              <li>Location data</li>
              <li>Device identifiers</li>
              <li>Advertising identifiers</li>
            </ul>
            <p className="text-white/80 mt-4">None of your personal coaching content is sent to or stored on our servers unless you explicitly choose cloud compute for a specific request (see Section 4).</p>
            <p className="text-white/80 mt-2">By default, <strong>all personal content remains local</strong>, on your device, under your control.</p>
          </section>

          {/* Section 3 */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-semibold text-white mb-6">3. On-Device Storage & Processing (Default Mode)</h2>
            <p className="text-white/80 mb-4">By default, SeeMe runs in <strong>Private On-Device Mode</strong>, meaning:</p>
            <ul className="text-white/80 space-y-2 mb-4">
              <li>All AI processing happens locally on your device</li>
              <li>All personal data (journals, patterns, insights, session content) is stored locally using SwiftData</li>
              <li>No personal content is transmitted to SeeMe&apos;s servers</li>
              <li>No third-party has access (including Apple, except if you later enable iCloud backups)</li>
              <li>You can delete all local data at any time through system settings or by deleting the app</li>
            </ul>
            <p className="text-white/80">In this mode, SeeMe does not and cannot access your personal information. This is the <strong>recommended and most private</strong> way to use the app.</p>
          </section>

          {/* Section 4 */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-semibold text-white mb-6">4. Optional Cloud Compute Mode</h2>
            <p className="text-white/80 mb-4">You may choose to enable <strong>cloud compute</strong> for enhanced AI performance.</p>
            <p className="text-white/80 mb-4">When cloud compute is enabled:</p>
            <ul className="text-white/80 space-y-2 mb-6">
              <li>Certain AI requests may send the <em>relevant snippet</em> of data required to generate a response.</li>
              <li>This may involve providers like OpenAI or Anthropic, depending on your chosen model.</li>
            </ul>
            <h3 className="text-xl font-semibold text-white/90 mb-4">Key Guarantees:</h3>
            <ol className="text-white/80 space-y-3">
              <li><strong>Only the data necessary for that single request is transmitted.</strong> (e.g., a journal entry you are actively processing)</li>
              <li><strong>SeeMe does not store or retain this data.</strong></li>
              <li><strong>Third-party AI providers handle the data according to their published security standards</strong>, including encryption in transit and strict deletion policies.</li>
              <li><strong>Once the computation completes, the data is not stored on our servers or theirs</strong> (per their policies).</li>
            </ol>
            <p className="text-white/80 mt-4">You can disable cloud compute at any time, instantly reverting to strict on-device privacy.</p>
          </section>

          {/* Section 5 */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-semibold text-white mb-6">5. How We Use Data</h2>
            <p className="text-white/80 mb-4">We use the minimal data we collect to:</p>
            <ul className="text-white/80 space-y-2 mb-6">
              <li>Create and maintain your anonymous account</li>
              <li>Provide app functionality</li>
              <li>Deliver your personalized coaching experience</li>
              <li>Understand overall (non-personal) app usage</li>
              <li>Improve performance and reliability</li>
              <li>Ensure the app remains secure and stable</li>
            </ul>
            <p className="text-white/80 mb-4">We <strong>do not</strong> use data for:</p>
            <ul className="text-white/80 space-y-2">
              <li>Advertising</li>
              <li>Profiling beyond the context of your coaching</li>
              <li>Selling to third parties</li>
              <li>Building shadow profiles</li>
            </ul>
          </section>

          {/* Section 6 */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-semibold text-white mb-6">6. How We Share Data</h2>
            <p className="text-white/80 mb-4">We do <strong>not</strong> share personal data with third parties.</p>
            <p className="text-white/80 mb-4">We may share aggregate, anonymized usage patterns for:</p>
            <ul className="text-white/80 space-y-2 mb-4">
              <li>Crash diagnostics</li>
              <li>Performance monitoring</li>
              <li>Feature improvement</li>
            </ul>
            <p className="text-white/80">But never in a way that identifies you. We may share data if required by law, but we will resist overbroad or inappropriate requests.</p>
          </section>

          {/* Section 7 */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-semibold text-white mb-6">7. Children&apos;s Privacy</h2>
            <p className="text-white/80">SeeMe is not intended for children under 16. We do not knowingly collect data from children. If such data is discovered, we will delete it immediately.</p>
          </section>

          {/* Section 8 */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-semibold text-white mb-6">8. Your Privacy Choices</h2>
            <p className="text-white/80 mb-4">You can at any time:</p>
            <ul className="text-white/80 space-y-2">
              <li>Disable cloud compute</li>
              <li>Disable integrations (HealthKit, screen time, calendar)</li>
              <li>Delete your local data</li>
              <li>Request deletion of your anonymous account</li>
              <li>Use SeeMe entirely offline in on-device mode</li>
            </ul>
            <p className="text-white/80 mt-4">Your privacy settings remain accessible at all times.</p>
          </section>

          {/* Section 9 */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-semibold text-white mb-6">9. Data Security</h2>
            <p className="text-white/80 mb-4">We implement industry-standard protections including:</p>
            <ul className="text-white/80 space-y-2">
              <li>On-device encryption</li>
              <li>Encrypted communication for cloud compute</li>
              <li>No database storage of personal content on our servers</li>
              <li>Anonymous, minimal backend storage</li>
              <li>Regular security audits and updates</li>
            </ul>
            <p className="text-white/80 mt-4">Because SeeMe stores so little data, the security surface area is intentionally small.</p>
          </section>

          {/* Google Calendar Section */}
          <section className="mb-12 bg-white/5 rounded-2xl p-6 md:p-8 border border-white/10">
            <h2 className="text-2xl md:text-3xl font-semibold text-white mb-6">Google Calendar Data Access</h2>
            <p className="text-white/80 mb-6">SeeMe offers optional integration with Google Calendar to provide context-aware coaching features. This integration is <strong>fully optional</strong>, and SeeMe maintains a strict minimal-data policy.</p>

            <h3 className="text-xl font-semibold text-white/90 mt-8 mb-4">1. How We Access Google Calendar Data</h3>
            <p className="text-white/80 mb-4">If you choose to enable Calendar access, SeeMe uses Google&apos;s secure OAuth permission flow. This means:</p>
            <ul className="text-white/80 space-y-2">
              <li>You grant access explicitly via Google&apos;s interface</li>
              <li>You can revoke access at any time</li>
              <li>We never see or store your Google login credentials</li>
            </ul>

            <h3 className="text-xl font-semibold text-white/90 mt-8 mb-4">2. What Calendar Data We Collect</h3>
            <p className="text-white/80 mb-4"><strong>We do NOT collect, store, or transmit any calendar event data.</strong></p>
            <p className="text-white/80 mb-4">Specifically:</p>
            <ul className="text-white/80 space-y-2 mb-4">
              <li>We do <strong>not</strong> read event titles</li>
              <li>We do <strong>not</strong> read event descriptions</li>
              <li>We do <strong>not</strong> read attendee lists</li>
              <li>We do <strong>not</strong> store event metadata</li>
              <li>We do <strong>not</strong> send any calendar data to our servers</li>
            </ul>
            <p className="text-white/80">The <em>only</em> information SeeMe retains is: <strong>Whether Calendar access is enabled (true/false)</strong></p>

            <h3 className="text-xl font-semibold text-white/90 mt-8 mb-4">3. How We Use Calendar Data</h3>
            <p className="text-white/80 mb-4">When Calendar access is enabled, SeeMe may <em>temporarily</em> access your <strong>local calendar load information</strong> (e.g., number of events at a certain time) <strong>on your device only</strong>, for the sole purpose of:</p>
            <ul className="text-white/80 space-y-2 mb-4">
              <li>Suggesting session times</li>
              <li>Helping you avoid overload</li>
              <li>Providing context-aware daily insights</li>
            </ul>
            <p className="text-white/80"><strong>No calendar event data is copied or stored. No data leaves your device</strong> (unless you opt into cloud compute — and even then, calendar data is never included).</p>

            <h3 className="text-xl font-semibold text-white/90 mt-8 mb-4">4. How We Store Calendar Data</h3>
            <p className="text-white/80">We do <strong>not</strong> store any calendar data on our servers or on your device. The only stored item is the preference: <strong>Calendar Access Enabled: Yes/No</strong></p>

            <h3 className="text-xl font-semibold text-white/90 mt-8 mb-4">5. How We Share Calendar Data</h3>
            <p className="text-white/80 mb-4">We do <strong>not</strong> share any Calendar data with:</p>
            <ul className="text-white/80 space-y-2">
              <li>Third parties</li>
              <li>Advertisers</li>
              <li>Analytics providers</li>
              <li>Our own backend servers</li>
            </ul>
            <p className="text-white/80 mt-4">Calendar data is never transmitted off your device.</p>

            <h3 className="text-xl font-semibold text-white/90 mt-8 mb-4">6. User&apos;s Rights to Revoke Access</h3>
            <p className="text-white/80 mb-4">You may revoke Calendar permission at any time:</p>
            <div className="bg-black/30 rounded-xl p-4 mb-4">
              <p className="text-white/90 font-semibold mb-2">From Google:</p>
              <p className="text-white/80 m-0">Visit your Google Account permissions page: <a href="https://myaccount.google.com/permissions" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">myaccount.google.com/permissions</a> and remove SeeMe&apos;s access.</p>
            </div>
            <div className="bg-black/30 rounded-xl p-4">
              <p className="text-white/90 font-semibold mb-2">From the App:</p>
              <p className="text-white/80 m-0">You can also disable the Calendar integration directly in SeeMe&apos;s settings.</p>
            </div>
            <p className="text-white/80 mt-4">When you revoke access: SeeMe immediately loses all ability to read your calendar, your experience returns to the default private mode, and no calendar data remains anywhere in our system.</p>
          </section>

          {/* Section 10 */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-semibold text-white mb-6">10. Changes to This Policy</h2>
            <p className="text-white/80">We may update this Privacy Policy from time to time. If changes are significant, we will notify users in-app.</p>
          </section>

          {/* Section 11 */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-semibold text-white mb-6">11. Contact Us</h2>
            <p className="text-white/80 mb-4">For any privacy questions or requests:</p>
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <p className="text-white font-semibold mb-2">SeeMe Privacy Team</p>
              <p className="text-white/80 m-0">
                📧 <a href="mailto:info@seemeapp.ai" className="text-blue-400 hover:text-blue-300 underline">info@seemeapp.ai</a>
              </p>
              <p className="text-white/80 m-0 mt-1">
                🌐 <a href="https://www.seemeai.app" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">www.seemeai.app</a>
              </p>
            </div>
          </section>
        </div>
      </article>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-white/50 text-sm">
            © {new Date().getFullYear()} SeeMe. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
