# B2C Default Page Design System

This document describes the current design system implemented for the default B2C landing page at [`/Users/jannis/Documents/SeeMe/Website/Website-1/app/page.tsx`](/Users/jannis/Documents/SeeMe/Website/Website-1/app/page.tsx), which renders [`/Users/jannis/Documents/SeeMe/Website/Website-1/components/landing/NewLandingPage.tsx`](/Users/jannis/Documents/SeeMe/Website/Website-1/components/landing/NewLandingPage.tsx). The main styling source is [`/Users/jannis/Documents/SeeMe/Website/Website-1/app/globals.css`](/Users/jannis/Documents/SeeMe/Website/Website-1/app/globals.css).

## 1. Design Intent

The page is built around a premium, calm, cinematic presentation:

- Dark-first visual system with sparse color use.
- Large editorial messaging paired with product mockups.
- Soft glass and blur treatments instead of hard UI chrome.
- High trust cues: privacy, coaching expertise, structured testimonials.
- Motion used to reveal content and create flow, not to add decoration.

## 2. Page Structure

The page follows this sequence:

1. Fixed transparent top bar.
2. Full-viewport hero with staged text reveal and device mockups.
3. Benefit sections on dark surfaces.
4. Social proof and privacy reinforcement.
5. Conversion-focused closing CTA over image background.
6. Minimal legal/footer close.

Implemented sections:

- Hero
- "A system that really knows you"
- "Built with the best in the field"
- "Growth doesn't stop when the sessions end"
- Testimonials
- "Completely Private"
- "Works with your coach. Works without one."
- "Try for Free"
- Footer

## 3. Brand Tokens

Shared tokens are defined in [`/Users/jannis/Documents/SeeMe/Website/Website-1/app/globals.css`](/Users/jannis/Documents/SeeMe/Website/Website-1/app/globals.css#L1007):

| Token | Value | Usage |
| --- | --- | --- |
| `--seeme-bg` | `#000000` | Base background |
| `--seeme-surface` | `#1a1a1a` | Deeper content sections |
| `--seeme-card` | `#333333` | Mid-tone surfaces |
| `--seeme-border` | `rgba(255, 255, 255, 0.15)` | Subtle outline and pill borders |
| `--seeme-text` | `#ffffff` | Primary text |
| `--seeme-subtext` | `rgba(255, 255, 255, 0.7)` | Secondary text |
| `--seeme-muted` | `rgba(255, 255, 255, 0.46)` | Tertiary/supporting text |
| `--seeme-accent` | `#ffffff` | Primary CTA fill |
| `--seeme-red` | `#e05252` | Alert/error usage elsewhere in the system |

Landing spacing tokens are defined in [`/Users/jannis/Documents/SeeMe/Website/Website-1/app/globals.css`](/Users/jannis/Documents/SeeMe/Website/Website-1/app/globals.css#L214):

| Token | Value |
| --- | --- |
| `--new-landing-section-space-desktop` | `72px` |
| `--new-landing-section-space-mobile` | `56px` |

## 4. Typography

### Primary landing typography

The landing page consistently uses `var(--font-sf-pro)` for headlines, body copy, labels, and buttons. That token is defined as an Apple/SF Pro-style system stack in [`/Users/jannis/Documents/SeeMe/Website/Website-1/app/globals.css`](/Users/jannis/Documents/SeeMe/Website/Website-1/app/globals.css#L212).

### App-level font context

The app shell also loads `Syne`, `Space Grotesk`, and `Manrope` in [`/Users/jannis/Documents/SeeMe/Website/Website-1/app/layout.tsx`](/Users/jannis/Documents/SeeMe/Website/Website-1/app/layout.tsx), but the default B2C page does not visibly lean on those families. For this page, SF Pro is the actual design-system font.

### Type scale

| Role | Class | Size treatment | Character |
| --- | --- | --- | --- |
| Hero mark | `new-landing-seeme-title` | `clamp(3.5rem, 7vw, 5.3rem)` | Heavy, tight, iconic |
| Hero statement desktop | `new-landing-mockups-title` | `clamp(1.6rem, 3.5vw, 2.8rem)` | Bold, compact |
| Hero statement mobile | `new-landing-mockups-title-mobile` | `clamp(2rem, 10vw, 3rem)` | Strong stacked lines |
| Section heading | `new-landing-section-heading` | `clamp(1.5rem, 3vw, 2.2rem)` | Clean editorial heading |
| Body copy | `new-landing-section-subtext` | `clamp(0.8rem, 1.3vw, 0.95rem)` | Calm, readable |
| Testimonial copy | `new-landing-testimonial-card p` | `clamp(0.8rem, 1.3vw, 0.95rem)` | Italic, reflective |
| UI buttons | `seeme-button` variants | `0.74rem` to `0.9rem` | Compact, product-like |

Typography traits:

- Tight letter-spacing on headlines for a polished app-brand feel.
- White or near-white text only; hierarchy is driven by opacity, scale, and weight.
- Italics are used sparingly for emphasis and testimonial tone.

## 5. Color and Surface System

The page uses three core surface levels:

- `#000000`: global canvas, hero, footer.
- `#1a1a1a`: content-heavy trust sections like testimonials and privacy.
- `#333333`: lighter dark panels for integrations, frameworks, and notification content.

Surface treatments:

- Borders are consistently translucent white, usually around `rgba(255,255,255,0.12-0.15)`.
- Glass treatments use blur and low-opacity white gradients rather than colored shadows.
- Image-backed sections use black overlays to preserve contrast instead of introducing new palette colors.

## 6. Layout and Spacing Rules

Shared section pattern from [`/Users/jannis/Documents/SeeMe/Website/Website-1/app/globals.css`](/Users/jannis/Documents/SeeMe/Website/Website-1/app/globals.css#L461):

- Full-width sections.
- Horizontal padding: `24px` desktop, `20px` mobile.
- Vertical rhythm controlled by shared section spacing tokens.
- Center-aligned layout throughout.
- Copy widths typically capped between `500px` and `800px`.

Layout principles:

- The hero occupies at least one full viewport height.
- Most sections are vertically stacked single-column compositions.
- Horizontal motion and carousel behavior are reserved mainly for mobile.
- Desktop layouts keep a centered, gallery-like composition instead of dense grids.

## 7. Core Components

### Top bar

Defined in [`/Users/jannis/Documents/SeeMe/Website/Website-1/components/landing/NewLandingPage.tsx`](/Users/jannis/Documents/SeeMe/Website/Website-1/components/landing/NewLandingPage.tsx#L163) and styled in [`/Users/jannis/Documents/SeeMe/Website/Website-1/app/globals.css`](/Users/jannis/Documents/SeeMe/Website/Website-1/app/globals.css#L1100).

Characteristics:

- Fixed placement with safe-area support.
- Transparent until shown, then softly blurred.
- Logo and action group both use pill containers.
- Minimal navigation: one brand mark and one partner CTA.

### Primary button system

Implemented by [`/Users/jannis/Documents/SeeMe/Website/Website-1/components/ui/SeemeButton.tsx`](/Users/jannis/Documents/SeeMe/Website/Website-1/components/ui/SeemeButton.tsx) and styled in [`/Users/jannis/Documents/SeeMe/Website/Website-1/app/globals.css`](/Users/jannis/Documents/SeeMe/Website/Website-1/app/globals.css#L1018).

Button rules:

- Radius: `12px`
- Default weight: `600`
- Filled CTA: white background with black text
- Unfilled CTA: transparent with subtle border
- Hover lifts slightly with `translateY(-1px)`
- App Store CTA is treated as a special visual variant

### Hero system

The hero is the strongest expression of the page's design language:

- Full-bleed lifestyle image background.
- Multi-stop black gradient overlay for contrast.
- Timed two-phase text reveal:
  - Phase 1: standalone "SeeMe" wordmark moment.
  - Phase 2: value proposition plus product mockups.
- Device mockups act as proof, not decoration.
- A soft bouncing chevron invites scroll progression.

### Content blocks

Repeated content primitives include:

- Section heading + supporting paragraph.
- Integration logo row.
- Coach profile pills.
- Notification frame cards.
- Testimonial glass cards.
- Privacy icon block.
- CTA block with supporting microcopy.
- Disclaimer panel.

## 8. Card and Shape Language

The shape system is deliberately soft:

- Pills: coach cards, top-bar containers.
- Rounded rectangles: testimonials, buttons, disclaimer.
- Circular crops: coach avatars.
- Phone mockups: large rounded device corners.

Common border radius patterns:

- `999px` for pills.
- `12px` for buttons.
- `14px` for small utility/image-based surfaces.
- `28px` or higher for larger cards and devices.

## 9. Motion System

Motion is implemented with Framer Motion in [`/Users/jannis/Documents/SeeMe/Website/Website-1/components/landing/NewLandingPage.tsx`](/Users/jannis/Documents/SeeMe/Website/Website-1/components/landing/NewLandingPage.tsx).

Rules observed:

- Most reveals fade in while moving upward `20-50px`.
- Ease curves are smooth and cinematic, often custom cubic-bezier values.
- Entry timing is staggered across repeated items.
- The hero uses timed sequencing to create narrative focus.
- Mobile replaces some static rows with continuous infinite carousels.
- Hover behavior is restrained: small scale-up on CTAs, no flashy transforms.

This is a "quiet motion" system. Animation supports flow and polish, but the page still reads clearly without it.

## 10. Responsive Behavior

The page has a clear mobile adaptation strategy:

- `window.innerWidth < 768` switches to mobile behavior.
- Desktop multi-item rows often become infinite carousels on mobile.
- Hero copy changes from one-line punctuation-heavy phrasing to stacked line breaks.
- Padding drops from `24px` to `20px`.
- Section spacing drops from `72px` to `56px`.
- Several max-width and white-space rules loosen to avoid compression.

Responsive design principle:

Desktop feels cinematic and gallery-like. Mobile feels continuous, swipe-adjacent, and more kinetic.

## 11. Content Tone Guidelines

The B2C page voice is:

- Assured, not clinical.
- Reflective, not technical.
- Trust-building, not sales-heavy.
- Personal and emotionally literate.

Recurring messaging themes:

- Privacy
- Personalization
- Support between coaching sessions
- Human expertise plus AI assistance
- Calm self-improvement rather than productivity hype

## 12. Accessibility and UX Notes

Positive patterns already present:

- Strong text/background contrast.
- Large target shapes for main CTA areas.
- Safe-area support for iOS.
- Decorative motion generally does not block content access.
- `alt` text is present for core imagery and UI images.

Current implementation notes worth remembering:

- Much of the page is center-aligned, so long-form additions should be used carefully.
- Several key interactions rely on motion for polish; any redesign should preserve non-animated readability.
- The top bar is visually subtle, so adding more actions there could weaken clarity.

## 13. Reusable Rules To Preserve

If we extend or redesign this page, these are the strongest system rules to keep:

- Stay within the black / charcoal / white palette.
- Use SF Pro-style typography on the B2C landing surface.
- Favor soft radii and pill geometry over sharp corners.
- Keep CTA styling simple: white fill, black text, minimal color accents.
- Use image overlays and blur instead of introducing bright UI colors.
- Keep sections centered, spacious, and emotionally calm.
- Use motion for sequencing and confidence, not novelty.

## 14. Source of Truth

Primary implementation references:

- [`/Users/jannis/Documents/SeeMe/Website/Website-1/app/page.tsx`](/Users/jannis/Documents/SeeMe/Website/Website-1/app/page.tsx)
- [`/Users/jannis/Documents/SeeMe/Website/Website-1/components/landing/NewLandingPage.tsx`](/Users/jannis/Documents/SeeMe/Website/Website-1/components/landing/NewLandingPage.tsx)
- [`/Users/jannis/Documents/SeeMe/Website/Website-1/components/ui/SeemeButton.tsx`](/Users/jannis/Documents/SeeMe/Website/Website-1/components/ui/SeemeButton.tsx)
- [`/Users/jannis/Documents/SeeMe/Website/Website-1/app/globals.css`](/Users/jannis/Documents/SeeMe/Website/Website-1/app/globals.css)
