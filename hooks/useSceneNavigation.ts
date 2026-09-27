"use client";

import { useState, useEffect, useCallback, useRef } from "react";

export type SceneId =
  | "intro"
  | "sweet_words"
  | "gift_and_cake"
  | "floating_memories"
  | "finale_flower";

export const SCENE_ORDER: SceneId[] = [
  "intro",
  "sweet_words",
  "gift_and_cake",
  "floating_memories",
  "finale_flower",
];

export function useSceneNavigation() {
  const [currentScene, setCurrentScene] = useState<SceneId>("intro");
  const [subStep, setSubStep] = useState(0);
  const [canAdvance, setCanAdvance] = useState(true);
  const [isPuzzleOpen, setIsPuzzleOpen] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const historyRef = useRef<{ scene: SceneId; subStep: number }[]>([]);
  const lastNavTimeRef = useRef<number>(0);

  // Push history before navigating
  const pushHistory = useCallback((scene: SceneId, subStep: number) => {
    historyRef.current.push({ scene, subStep });
  }, []);

  const nextScene = useCallback(() => {
    if (!canAdvance || isPuzzleOpen || isLightboxOpen) return;
    const now = Date.now();
    if (now - lastNavTimeRef.current < 1400) return;
    lastNavTimeRef.current = now;

    if (currentScene === "intro") {
      pushHistory("intro", 0);
      setCurrentScene("sweet_words");
      setSubStep(0);
    } else if (currentScene === "sweet_words") {
      if (subStep < 3) {
        pushHistory("sweet_words", subStep);
        setSubStep((prev) => prev + 1);
      } else {
        pushHistory("sweet_words", subStep);
        setCurrentScene("gift_and_cake");
        setSubStep(0);
        setCanAdvance(false); // Gift requires user interaction first
      }
    } else if (currentScene === "gift_and_cake") {
      pushHistory("gift_and_cake", subStep);
      setCurrentScene("floating_memories");
      setSubStep(0);
      setCanAdvance(false); // Final section is gated by secret puzzle
    }
  }, [canAdvance, isPuzzleOpen, isLightboxOpen, currentScene, subStep, pushHistory]);

  const prevScene = useCallback(() => {
    if (isPuzzleOpen || isLightboxOpen) return;
    const now = Date.now();
    if (now - lastNavTimeRef.current < 1400) return;
    lastNavTimeRef.current = now;
    const prev = historyRef.current.pop();
    if (prev) {
      setCurrentScene(prev.scene);
      setSubStep(prev.subStep);
      setCanAdvance(true);
    }
  }, [isPuzzleOpen, isLightboxOpen]);

  const advanceToMemories = useCallback(() => {
    pushHistory("gift_and_cake", 0);
    setCurrentScene("floating_memories");
    setSubStep(0);
    setCanAdvance(false);
  }, [pushHistory]);

  const goToFinale = useCallback(() => {
    pushHistory(currentScene, subStep);
    setCurrentScene("finale_flower");
    setSubStep(0);
    setCanAdvance(false);
  }, [currentScene, subStep, pushHistory]);

  const restartToBeginning = useCallback(() => {
    historyRef.current = [];
    setCurrentScene("intro");
    setSubStep(0);
    setCanAdvance(true);
    setIsPuzzleOpen(false);
    setIsLightboxOpen(false);
  }, []);

  // Listen for custom go-to-finale event
  useEffect(() => {
    const handleGoToFinale = () => {
      goToFinale();
    };
    window.addEventListener("go-to-finale", handleGoToFinale);
    return () => {
      window.removeEventListener("go-to-finale", handleGoToFinale);
    };
  }, [goToFinale]);

  // Intercept wheel, touchmove, key navigation to prevent any window scrolling
  useEffect(() => {
    const preventDefault = (e: Event) => {
      // Don't prevent if inside an element with explicit allow-scroll class
      if (
        e.target instanceof HTMLElement &&
        e.target.closest("[data-allow-scroll='true']")
      ) {
        return;
      }
      e.preventDefault();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        ["ArrowDown", "ArrowUp", "PageDown", "PageUp", " "].includes(e.key)
      ) {
        if (
          e.target instanceof HTMLElement &&
          e.target.closest("[data-allow-scroll='true']")
        ) {
          return;
        }
        e.preventDefault();
      }
    };

    window.addEventListener("wheel", preventDefault, { passive: false });
    window.addEventListener("touchmove", preventDefault, { passive: false });
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("wheel", preventDefault);
      window.removeEventListener("touchmove", preventDefault);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return {
    currentScene,
    setCurrentScene,
    subStep,
    setSubStep,
    canAdvance,
    setCanAdvance,
    isPuzzleOpen,
    setIsPuzzleOpen,
    isLightboxOpen,
    setIsLightboxOpen,
    nextScene,
    advanceToMemories,
    prevScene,
    goToFinale,
    restartToBeginning,
    hasHistory: historyRef.current.length > 0 || currentScene !== "intro",
  };
}
