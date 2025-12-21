# Mathematical Scroll System V2 - Implementation Guide

## Problem Statement
The current scroll system has inconsistencies:
1. Text overlaps when users stop scrolling between sections
2. Background images don't sync perfectly with section transitions
3. Section opacity transitions aren't mathematically precise
4. Issues occur across different viewport sizes

## Solution: Mathematical Scroll System V2

### Core Mathematical Principles

#### 1. **Section Range Calculation**
Each section occupies exactly `1/TOTAL_SECTIONS` of the scroll range (0-1 progress):

```
Section Width = 1 / 8 = 0.125 (12.5% of total scroll)

Section 0 (Hero):     0.000 - 0.125
Section 1 (Coaches):  0.125 - 0.250
Section 2 (Insights): 0.250 - 0.375
Section 3 (Notifs):   0.375 - 0.500
Section 4 (Privacy):  0.500 - 0.625
Section 5 (Rise):     0.625 - 0.750
Section 6 (Reviews):  0.750 - 0.875
Section 7 (CTA):      0.875 - 1.000
```

#### 2. **Opacity Transition Zones**
Each section has 4 critical points:
- `fadeInStart`: Where section starts becoming visible
- `fadeInEnd`: Where section reaches full opacity
- `fadeOutStart`: Where section starts fading out
- `fadeOutEnd`: Where section becomes invisible

```
For a section at center 0.1875 (Section 1):
  fadeInStart:  0.1625 (center - 20% of half-width)
  fadeInEnd:    0.1750 (center - 10% of half-width)
  fadeOutStart: 0.2000 (center + 10% of half-width)
  fadeOutEnd:   0.2125 (center + 20% of half-width)
```

This creates a **40% overlap zone** where sections crossfade smoothly.

#### 3. **Background Synchronization**
Backgrounds change based on which section has the highest opacity:

```
Progress 0.000-0.125: Background 0 (Hero)
Progress 0.125-0.250: Background 1 (Coaches)
Progress 0.250-0.375: Background 2 (Insights)
...and so on
```

The background opacity matches the dominant section's opacity, ensuring perfect sync.

#### 4. **Auto-Scroll at Boundaries**
When user stops within 15% of a section boundary, auto-scroll to nearest center:

```
If progress = 0.240 (near Section 1-2 boundary at 0.250):
  Distance to boundary = 0.010 (1%)
  Threshold = 0.125 * 0.15 = 0.01875 (1.875%)
  Since 0.010 < 0.01875: SNAP to Section 2 center (0.3125)
```

### Implementation Status

✅ **Created**: `useScrollAnimationV2.ts` with all mathematical calculations
✅ **Updated**: `LandingPage.tsx` to use V2 system
❌ **Issue**: GSAP not loading in browser (window.gsap = undefined)

### Why GSAP Isn't Loading

The hooks are being called but the `useEffect` inside them isn't running because:
1. Both `useScrollAnimationV2` and `useSimpleScrollAnimation` are called on every render (React requirement)
2. Only one is used based on `useSimpleScroll` flag
3. The unused hook's `useEffect` still runs but may not initialize GSAP properly

### Solution Required

**Option 1: Conditional Hook Calling** (Recommended)
Only call the hook that will be used:

```typescript
const { scrollToSection } = useSimpleScroll 
  ? useSimpleScrollAnimation(...)
  : useScrollAnimationV2(...);
```

**Option 2: Force GSAP Registration**
Add explicit GSAP registration in component:

```typescript
useEffect(() => {
  if (!useSimpleScroll) {
    gsap.registerPlugin(ScrollTrigger);
    // Expose to window for debugging
    if (typeof window !== 'undefined') {
      window.gsap = gsap;
      window.ScrollTrigger = ScrollTrigger;
    }
  }
}, [useSimpleScroll]);
```

**Option 3: Separate Components**
Create two separate landing page components:
- `LandingPageGSAP.tsx` - Uses V2 mathematical system
- `LandingPageSimple.tsx` - Uses simple scroll for iOS

### Testing Checklist

Once GSAP loads, verify:
- [ ] No text overlap at any scroll position
- [ ] Backgrounds sync perfectly with section visibility
- [ ] Auto-scroll triggers within 15% of boundaries
- [ ] Works on mobile (375px), tablet (768px), desktop (1920px)
- [ ] Smooth transitions at all scroll speeds
- [ ] No performance issues

### Mathematical Advantages

1. **Viewport Agnostic**: All calculations use 0-1 progress, not pixels
2. **Predictable**: Every section behaves identically based on math
3. **No Overlap**: Opacity transitions are precisely calculated
4. **Perfect Sync**: Backgrounds tied directly to section opacity
5. **Smooth Auto-Scroll**: Triggers only near boundaries, not mid-section

### Next Steps

1. Fix GSAP loading issue using one of the solutions above
2. Test V2 system thoroughly
3. Remove old `useScrollAnimation.ts` once V2 is verified
4. Update `useSimpleScrollAnimation.ts` to use same math for iOS
