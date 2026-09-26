"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollToPlugin);

interface UseSectionSnapOptions {
  enabled?: boolean;
  touchThreshold?: number; // Minimum px to trigger snap (default 30px)
  wheelThreshold?: number; // Minimum wheel delta (default 15)
  animationDuration?: number; // GSAP transition duration (default 0.7s)
  cooldown?: number; // Cooldown lock ms (default 750ms)
}

export function useSectionSnap({
  enabled = true,
  touchThreshold = 30,
  wheelThreshold = 15,
  animationDuration = 0.7,
  cooldown = 750,
}: UseSectionSnapOptions = {}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const isAnimatingRef = useRef(false);
  const currentIndexRef = useRef(0);
  const touchStartRef = useRef<{ x: number; y: number; time: number; target: EventTarget | null } | null>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Helper to query all snap sections in DOM order
  const getSections = useCallback((): HTMLElement[] => {
    return Array.from(
      document.querySelectorAll<HTMLElement>("[data-snap-section='true']")
    );
  }, []);

  // Find which section is currently closest to the top of viewport
  const findClosestSectionIndex = useCallback((): number => {
    const sections = getSections();
    if (sections.length === 0) return 0;

    const scrollY = window.scrollY;
    let closestIndex = 0;
    let minDistance = Infinity;

    for (let i = 0; i < sections.length; i++) {
      const top = sections[i].offsetTop;
      const distance = Math.abs(scrollY - top);
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = i;
      }
    }

    return closestIndex;
  }, [getSections]);

  // Programmatic scroll to section by index
  const scrollToIndex = useCallback(
    (index: number, customDuration?: number) => {
      const sections = getSections();
      if (sections.length === 0) return;

      const clampedIndex = Math.max(0, Math.min(index, sections.length - 1));
      const target = sections[clampedIndex];
      if (!target) return;

      isAnimatingRef.current = true;
      currentIndexRef.current = clampedIndex;
      setCurrentIndex(clampedIndex);

      const targetTop = target.offsetTop;

      gsap.to(window, {
        scrollTo: { y: targetTop, autoKill: false },
        duration: customDuration ?? animationDuration,
        ease: "power2.out",
        overwrite: "auto",
        onComplete: () => {
          // Keep lock briefly to let any touch inertia / trackpad bounce settle
          setTimeout(() => {
            isAnimatingRef.current = false;
          }, 80);
        },
      });
    },
    [getSections, animationDuration]
  );

  const scrollToNext = useCallback(() => {
    const sections = getSections();
    const current = findClosestSectionIndex();
    if (current < sections.length - 1) {
      scrollToIndex(current + 1);
    }
  }, [getSections, findClosestSectionIndex, scrollToIndex]);

  const scrollToPrev = useCallback(() => {
    const current = findClosestSectionIndex();
    if (current > 0) {
      scrollToIndex(current - 1);
    }
  }, [findClosestSectionIndex, scrollToIndex]);

  useEffect(() => {
    if (!enabled) return;

    // Helper: is gesture currently allowed?
    const isGestureAllowed = (target: EventTarget | null): boolean => {
      if (isAnimatingRef.current) return false;
      // Check if lightbox modal is open
      if (document.querySelector("[data-modal-open='true']")) return false;
      // Check if inside a non-snap interactive zone (e.g. cake knife drag)
      if (target instanceof HTMLElement && target.closest("[data-no-snap='true']")) {
        return false;
      }
      return true;
    };

    // 1. TOUCH EVENTS
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      touchStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        time: Date.now(),
        target: e.target,
      };
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStartRef.current) return;
      const start = touchStartRef.current;
      touchStartRef.current = null;

      if (!isGestureAllowed(start.target)) return;

      const changedTouch = e.changedTouches[0];
      if (!changedTouch) return;

      const deltaY = start.y - changedTouch.clientY; // positive = swipe up (go next)
      const deltaX = start.x - changedTouch.clientX;
      const duration = Date.now() - start.time;

      // Ignore if predominantly horizontal swipe
      if (Math.abs(deltaX) > Math.abs(deltaY) * 1.2) return;

      // Trigger if passed threshold or fast flick
      const isFlick = duration < 300 && Math.abs(deltaY) > 20;
      const isDrag = Math.abs(deltaY) >= touchThreshold;

      if (isFlick || isDrag) {
        if (deltaY > 0) {
          scrollToNext();
        } else {
          scrollToPrev();
        }
      } else if (Math.abs(deltaY) > 5) {
        // Slight nudge that didn't cross threshold: snap back cleanly to current section
        scrollToIndex(findClosestSectionIndex(), 0.4);
      }
    };

    // 2. WHEEL / TRACKPAD EVENT
    let lastWheelTime = 0;
    const handleWheel = (e: WheelEvent) => {
      if (!isGestureAllowed(e.target)) return;

      // Filter out small micro-scrolls
      if (Math.abs(e.deltaY) < wheelThreshold) return;

      const now = Date.now();
      if (now - lastWheelTime < cooldown) return;

      e.preventDefault();
      lastWheelTime = now;

      if (e.deltaY > 0) {
        scrollToNext();
      } else {
        scrollToPrev();
      }
    };

    // 3. KEYBOARD NAVIGATION
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isGestureAllowed(e.target)) return;

      if (["ArrowDown", "PageDown", " "].includes(e.key)) {
        e.preventDefault();
        scrollToNext();
      } else if (["ArrowUp", "PageUp"].includes(e.key)) {
        e.preventDefault();
        scrollToPrev();
      }
    };

    // 4. SCROLL END SETTLING (Fallback guarantee so screen is NEVER stuck partially offset)
    const handleScroll = () => {
      if (isAnimatingRef.current) return;

      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      scrollTimeoutRef.current = setTimeout(() => {
        if (isAnimatingRef.current) return;
        if (document.querySelector("[data-modal-open='true']")) return;

        // Check if we are currently resting between sections
        const sections = getSections();
        const scrollY = window.scrollY;
        const closestIndex = findClosestSectionIndex();
        const target = sections[closestIndex];

        if (target && Math.abs(scrollY - target.offsetTop) > 8) {
          scrollToIndex(closestIndex, 0.4);
        }
      }, 160);
    };

    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Initial sync
    setCurrentIndex(findClosestSectionIndex());

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [
    enabled,
    touchThreshold,
    wheelThreshold,
    cooldown,
    scrollToNext,
    scrollToPrev,
    scrollToIndex,
    findClosestSectionIndex,
    getSections,
  ]);

  return {
    currentIndex,
    scrollToIndex,
    scrollToNext,
    scrollToPrev,
  };
}
