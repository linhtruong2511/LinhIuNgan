# Eager Section Snap Scroll Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement eager, smooth slide-by-slide section snapping using GSAP Observer and ScrollToPlugin so that a light swipe (~35px) on touch or a gentle wheel flick on desktop immediately and accurately scrolls to the next/previous section.

**Architecture:** A centralized hook and navigator component (`hooks/useSectionSnap.ts` and `components/SectionNavigator.tsx`) that discovers all `[data-snap-section="true"]` sections, registers GSAP `Observer` with touch/wheel listeners, applies an animation lock (~750ms), animates using `ScrollToPlugin`, and respects interactive exclusions (knife cutting in `BirthdayCake` and Lightbox in `MemoryGallery`).

**Tech Stack:** Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, GSAP 3.12 (Observer, ScrollToPlugin).

## Global Constraints
- Target threshold: ~35px for touch swipe, ~20px for wheel.
- Animation cooldown lock: 750ms to prevent multi-slide skipping.
- Do not interfere with horizontal knife cutting in `BirthdayCake` (`data-no-snap="true"`).
- Pause snapping when `MemoryGallery` lightbox modal is open.
- Maintain `min-height: 100dvh` / `height: 100dvh` per section.

---

### Task 1: Create `hooks/useSectionSnap.ts` with GSAP Observer & ScrollToPlugin

**Files:**
- Create: `hooks/useSectionSnap.ts`

**Interfaces:**
- Produces:
  ```ts
  export function useSectionSnap(options?: {
    enabled?: boolean;
    tolerance?: number;
    lockDuration?: number;
  }): {
    currentIndex: number;
    scrollToIndex: (index: number) => void;
    scrollToNext: () => void;
    scrollToPrev: () => void;
    sectionsCount: number;
  }
  ```

- [x] **Step 1: Write `hooks/useSectionSnap.ts`**

```ts
"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { Observer } from "gsap/Observer";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(Observer, ScrollToPlugin);

interface UseSectionSnapOptions {
  enabled?: boolean;
  tolerance?: number;
  lockDuration?: number;
}

export function useSectionSnap({
  enabled = true,
  tolerance = 35,
  lockDuration = 750,
}: UseSectionSnapOptions = {}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sectionsCount, setSectionsCount] = useState(0);
  const isAnimatingRef = useRef(false);
  const currentIndexRef = useRef(0);

  const getSections = useCallback((): HTMLElement[] => {
    return Array.from(
      document.querySelectorAll<HTMLElement>("[data-snap-section='true']")
    );
  }, []);

  const scrollToIndex = useCallback(
    (index: number) => {
      const sections = getSections();
      if (index < 0 || index >= sections.length) return;

      isAnimatingRef.current = true;
      currentIndexRef.current = index;
      setCurrentIndex(index);

      const target = sections[index];
      const targetTop = target.offsetTop;

      gsap.to(window, {
        scrollTo: { y: targetTop, autoKill: false },
        duration: 0.7,
        ease: "power2.out",
        overwrite: "auto",
        onComplete: () => {
          setTimeout(() => {
            isAnimatingRef.current = false;
          }, 50);
        },
      });
    },
    [getSections]
  );

  const scrollToNext = useCallback(() => {
    const sections = getSections();
    if (currentIndexRef.current < sections.length - 1) {
      scrollToIndex(currentIndexRef.current + 1);
    }
  }, [getSections, scrollToIndex]);

  const scrollToPrev = useCallback(() => {
    if (currentIndexRef.current > 0) {
      scrollToIndex(currentIndexRef.current - 1);
    }
  }, [scrollToIndex]);

  useEffect(() => {
    if (!enabled) return;

    const sections = getSections();
    setSectionsCount(sections.length);

    // Sync initial index based on current scroll position
    const updateCurrentIndexFromScroll = () => {
      if (isAnimatingRef.current) return;
      const scrollY = window.scrollY;
      const windowH = window.innerHeight;
      const midPoint = scrollY + windowH * 0.4;

      for (let i = 0; i < sections.length; i++) {
        const top = sections[i].offsetTop;
        const bottom = top + sections[i].offsetHeight;
        if (midPoint >= top && midPoint < bottom) {
          currentIndexRef.current = i;
          setCurrentIndex(i);
          break;
        }
      }
    };

    updateCurrentIndexFromScroll();

    // GSAP Observer for touch and wheel
    const observer = Observer.create({
      target: window,
      type: "wheel,touch,pointer",
      tolerance: tolerance,
      preventDefault: false,
      onUp: (self) => {
        // Swiping up / scrolling down
        if (isAnimatingRef.current) return;
        // Check if event target has data-no-snap
        const target = self.event.target as HTMLElement | null;
        if (target && target.closest("[data-no-snap='true']")) return;
        // Check if Lightbox modal is open
        if (document.querySelector("[data-modal-open='true']")) return;

        scrollToNext();
      },
      onDown: (self) => {
        // Swiping down / scrolling up
        if (isAnimatingRef.current) return;
        const target = self.event.target as HTMLElement | null;
        if (target && target.closest("[data-no-snap='true']")) return;
        if (document.querySelector("[data-modal-open='true']")) return;

        scrollToPrev();
      },
    });

    // Keyboard navigation
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isAnimatingRef.current) return;
      if (document.querySelector("[data-modal-open='true']")) return;

      if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ") {
        e.preventDefault();
        scrollToNext();
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        scrollToPrev();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", updateCurrentIndexFromScroll);

    return () => {
      observer.kill();
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", updateCurrentIndexFromScroll);
    };
  }, [enabled, tolerance, getSections, scrollToNext, scrollToPrev]);

  return {
    currentIndex,
    scrollToIndex,
    scrollToNext,
    scrollToPrev,
    sectionsCount,
  };
}
```

- [x] **Step 2: Commit Task 1**

```bash
git add hooks/useSectionSnap.ts
git commit -m "feat: add useSectionSnap hook with GSAP Observer and ScrollTo"
```

---

### Task 2: Create `components/SectionNavigator.tsx` & Integrate into `app/page.tsx`

**Files:**
- Create: `components/SectionNavigator.tsx`
- Modify: `app/page.tsx`

**Interfaces:**
- `SectionNavigator` mounts `useSectionSnap` client-side.

- [x] **Step 1: Create `components/SectionNavigator.tsx`**

```tsx
"use client";

import { useSectionSnap } from "@/hooks/useSectionSnap";

export default function SectionNavigator() {
  useSectionSnap({
    enabled: true,
    tolerance: 35,
    lockDuration: 750,
  });

  return null;
}
```

- [x] **Step 2: Import and mount `SectionNavigator` in `app/page.tsx`**

```tsx
import ParticlesBg from "@/components/ParticlesBg";
import MusicPlayer from "@/components/MusicPlayer";
import SectionNavigator from "@/components/SectionNavigator";
import IntroSplash from "@/components/IntroSplash";
import SweetWords from "@/components/SweetWords";
import GiftBox from "@/components/GiftBox";
import BirthdayCake from "@/components/BirthdayCake";
import LoveLetter from "@/components/LoveLetter";
import MemoryGallery from "@/components/MemoryGallery";

export default function Home() {
  return (
    <main className="relative">
      <SectionNavigator />
      <ParticlesBg />
      <MusicPlayer />
      <IntroSplash />
      <SweetWords />
      <GiftBox />
      <BirthdayCake />
      <LoveLetter />
      <MemoryGallery />
    </main>
  );
}
```

- [x] **Step 3: Commit Task 2**

```bash
git add components/SectionNavigator.tsx app/page.tsx
git commit -m "feat: integrate SectionNavigator into page"
```

---

### Task 3: Tune `app/globals.css` and mark exclusion in `BirthdayCake.tsx` & `MemoryGallery.tsx`

**Files:**
- Modify: `app/globals.css:8-15` & `64-72`
- Modify: `components/BirthdayCake.tsx`
- Modify: `components/MemoryGallery.tsx`

- [x] **Step 1: Update `app/globals.css`**
Remove conflicting `scroll-snap-type: y mandatory;` from `html` while preserving smooth behavior and proper `100dvh` dimensions so GSAP can execute smooth transitions without browser snap jitter:

```css
@layer base {
  html {
    overflow-y: scroll;
    overflow-x: hidden;
    height: 100%;
  }

  body {
    @apply bg-deep-night text-white overflow-x-hidden;
    -webkit-tap-highlight-color: transparent;
    min-height: 100%;
  }
...
```

And in `.snap-section`:
```css
  .snap-section {
    min-height: 100vh;
    min-height: 100dvh;
    height: 100dvh;
    width: 100%;
  }
```

- [x] **Step 2: Add `data-no-snap="true"` to `BirthdayCake.tsx` cake drag area**
On the cake interaction container (lines 66+ in `components/BirthdayCake.tsx`), add `data-no-snap="true"`:
```tsx
<div
  className="relative cursor-pointer select-none touch-none"
  data-no-snap="true"
  onPointerDown={handlePointerDown}
  onPointerMove={handlePointerMove}
  onPointerUp={handlePointerUp}
>
```

- [x] **Step 3: Add `data-modal-open="true"` to Lightbox in `MemoryGallery.tsx`**
When `selectedMemory` is active, mark the Lightbox container with `data-modal-open="true"`:
```tsx
{selectedMemory && (
  <div
    data-modal-open="true"
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in"
    onClick={() => setSelectedMemory(null)}
  >
```

- [x] **Step 4: Commit Task 3**

```bash
git add app/globals.css components/BirthdayCake.tsx components/MemoryGallery.tsx
git commit -m "style: harmonize CSS and add interaction exclusion attributes"
```

---

### Task 4: Verify Build & End-to-End User Experience

**Files:**
- Test all components with `npm run build`

- [x] **Step 1: Run production build**

Run: `npm run build`
Expected: Next.js compiles with 0 errors and output code passes TypeScript checks.

- [x] **Step 2: Verification Checklist**
- Verify swipe gesture triggers smooth scroll with 35px threshold.
- Verify wheel scroll triggers 1 section advance per flick.
- Verify cake knife cutting drag does not trigger scroll.
- Verify lightbox modal does not trigger scroll.
- Verify `ScrollIndicator` click smoothly scrolls to next section.

- [x] **Step 3: Commit all remaining changes**

```bash
git add -A
git commit -m "feat: complete eager section snap scroll UX enhancement"
```
