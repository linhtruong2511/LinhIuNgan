"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { BIRTHDAY_CONFIG } from "@/lib/constants";

interface GiftAndCakeSceneProps {
  onComplete: () => void;
  setCanAdvance: (can: boolean) => void;
}

type Stage =
  | "box_closed"
  | "cake_ascend"
  | "cake_cut"
  | "box_return"
  | "letter_open";

export default function GiftAndCakeScene({
  onComplete,
  setCanAdvance,
}: GiftAndCakeSceneProps) {
  const [stage, setStage] = useState<Stage>("box_closed");
  const [knifeX, setKnifeX] = useState(0);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const [visibleLines, setVisibleLines] = useState(0);

  const letterLines = BIRTHDAY_CONFIG.letterContent
    .split("\n")
    .filter((line) => line.trim() !== "");

  // Initially lock advance
  useEffect(() => {
    setCanAdvance(false);
  }, [setCanAdvance]);

  // Handle Box Open 1 (Cake emergence)
  const handleOpenBox1 = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (stage !== "box_closed") return;

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { x: 0.5, y: 0.6 },
      colors: ["#E63946", "#FFD93D", "#4ECDC4", "#FF6B6B"],
    });

    setStage("cake_ascend");
  };

  // Handle Knife Drag
  const handlePointerDown = (e: React.PointerEvent) => {
    if (stage !== "cake_ascend") return;
    isDragging.current = true;
    startX.current = e.clientX - knifeX;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current || stage !== "cake_ascend") return;
    const newX = e.clientX - startX.current;
    setKnifeX(newX);

    if (Math.abs(newX) > 70) {
      isDragging.current = false;
      setStage("cake_cut");

      confetti({
        particleCount: 70,
        spread: 60,
        origin: { x: 0.5, y: 0.5 },
        colors: ["#FFD93D", "#FF6B6B", "#4ECDC4"],
      });

      // Transition to box return after cake cut
      setTimeout(() => {
        setStage("box_return");
      }, 2400);
    }
  };

  const handlePointerUp = () => {
    isDragging.current = false;
    if (stage === "cake_ascend") {
      setKnifeX(0);
    }
  };

  // Handle Box Open 2 (Letter emergence)
  const handleOpenBox2 = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (stage !== "box_return") return;

    setStage("letter_open");

    // Typewriter effect
    let lineIdx = 0;
    const interval = setInterval(() => {
      lineIdx++;
      setVisibleLines(lineIdx);
      if (lineIdx >= letterLines.length) {
        clearInterval(interval);
        setCanAdvance(true); // Unlock advance to memories!
      }
    }, 350);
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center px-4 overflow-hidden select-none">
      {/* Ambient background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,217,61,0.12)_0%,_rgba(230,57,70,0.06)_50%,_transparent_70%)] pointer-events-none" />

      {/* 1. STAGE: BOX CLOSED */}
      {stage === "box_closed" && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative z-10 flex flex-col items-center cursor-pointer"
          onClick={handleOpenBox1}
        >
          <div className="w-48 h-40 md:w-56 md:h-48 bg-gradient-to-b from-rose-red to-red-800 rounded-b-xl border-2 border-candle-gold/60 relative shadow-2xl flex items-center justify-center">
            {/* Ribbon */}
            <div className="absolute w-8 h-full bg-candle-gold/70" />
            <div className="absolute h-8 w-full bg-candle-gold/70" />
            <div className="w-12 h-12 bg-candle-gold rounded-full border-2 border-amber-300 z-10 shadow-lg" />
          </div>
          <p className="mt-6 text-xl md:text-2xl font-dancing text-white/90 animate-pulse">
            Chạm để mở hộp quà nhé 🎁
          </p>
        </motion.div>
      )}

      {/* 2 & 3. STAGE: CAKE ASCEND & CAKE CUT */}
      {(stage === "cake_ascend" || stage === "cake_cut") && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, type: "spring", bounce: 0.3 }}
          className="relative z-10 flex flex-col items-center"
        >
          {/* Candles */}
          <div className="flex justify-center gap-4 mb-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex flex-col items-center">
                <div
                  className={`w-2 h-4 bg-gradient-to-t from-candle-gold to-orange-400 rounded-full animate-flicker ${
                    stage === "cake_cut"
                      ? "opacity-0 transition-opacity duration-500"
                      : ""
                  }`}
                  style={{ animationDelay: `${i * 0.1}s` }}
                />
                <div className="w-1.5 h-7 bg-teal-accent rounded-sm" />
              </div>
            ))}
          </div>

          {/* Cake Layers */}
          <div
            className={`flex transition-all duration-700 ${
              stage === "cake_cut" ? "gap-4" : "gap-0"
            }`}
          >
            {/* Left */}
            <div
              className={
                stage === "cake_cut"
                  ? "-translate-x-2 -rotate-3 transition-transform duration-700"
                  : ""
              }
            >
              <div className="w-24 h-10 bg-gradient-to-r from-pink-300 to-rose-red rounded-l-xl border-2 border-r-0 border-pink-200" />
              <div className="w-32 h-12 bg-gradient-to-r from-pink-400 to-rose-red -ml-4 rounded-l-xl border-2 border-r-0 border-pink-300" />
              <div className="w-40 h-14 bg-gradient-to-r from-pink-500 to-red-600 -ml-8 rounded-l-xl border-2 border-r-0 border-pink-400" />
            </div>
            {/* Right */}
            <div
              className={
                stage === "cake_cut"
                  ? "translate-x-2 rotate-3 transition-transform duration-700"
                  : ""
              }
            >
              <div className="w-24 h-10 bg-gradient-to-l from-pink-300 to-rose-red rounded-r-xl border-2 border-l-0 border-pink-200" />
              <div className="w-32 h-12 bg-gradient-to-l from-pink-400 to-rose-red -mr-4 rounded-r-xl border-2 border-l-0 border-pink-300" />
              <div className="w-40 h-14 bg-gradient-to-l from-pink-500 to-red-600 -mr-8 rounded-r-xl border-2 border-l-0 border-pink-400" />
            </div>
          </div>

          <div className="w-52 md:w-60 h-3 bg-white/20 rounded-full mx-auto mt-1" />

          {/* Knife Drag Track */}
          {stage === "cake_ascend" && (
            <div className="relative mt-8 w-48 mx-auto" data-allow-scroll="false">
              <div className="h-1 bg-white/20 rounded-full" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xs text-white/50 pointer-events-none whitespace-nowrap">
                ◄ Kéo dao qua để cắt bánh ►
              </div>
              <div
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                className="absolute -top-4 left-1/2 cursor-grab active:cursor-grabbing touch-none select-none z-20"
                style={{ transform: `translateX(calc(-50% + ${knifeX}px))` }}
              >
                <span className="text-3xl filter drop-shadow">🔪</span>
              </div>
            </div>
          )}

          <p className="mt-6 text-xl md:text-2xl font-dancing text-candle-gold text-glow">
            {stage === "cake_cut"
              ? "Chúc em tuổi mới ngọt ngào như chiếc bánh này! 🎂✨"
              : "Kéo dao qua để cắt bánh nhé 🎂"}
          </p>

          {/* Scaled-down box as base underneath */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5, scale: 0.65 }}
            className="w-40 h-20 bg-red-900/50 rounded-b-xl border border-candle-gold/40 mt-3 flex items-center justify-center"
          >
            <span className="text-xs text-white/40 font-light">Hộp quà</span>
          </motion.div>
        </motion.div>
      )}

      {/* 4. STAGE: BOX RETURN */}
      {stage === "box_return" && (
        <motion.div
          initial={{ scale: 0.7, y: 50, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 180, damping: 14 }}
          className="relative z-10 flex flex-col items-center cursor-pointer"
          onClick={handleOpenBox2}
        >
          <div className="w-48 h-40 md:w-56 md:h-48 bg-gradient-to-b from-rose-red to-red-800 rounded-b-xl border-2 border-candle-gold/60 relative shadow-2xl flex items-center justify-center">
            <div className="absolute w-8 h-full bg-candle-gold/70" />
            <div className="absolute h-8 w-full bg-candle-gold/70" />
            <div className="w-12 h-12 bg-candle-gold rounded-full border-2 border-amber-300 z-10 shadow-lg" />
          </div>
          <p className="mt-6 text-xl md:text-2xl font-dancing text-candle-gold text-glow animate-pulse">
            Vẫn còn một điều bất ngờ nữa trong hộp... 🎁
          </p>
          <span className="text-xs text-white/60 font-light mt-1">
            Chạm để mở nốt nhé
          </span>
        </motion.div>
      )}

      {/* 5. STAGE: LETTER OPEN */}
      {stage === "letter_open" && (
        <motion.div
          initial={{ scale: 0.85, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 w-full max-w-lg bg-paper-cream/95 text-gray-800 rounded-xl p-6 md:p-8 shadow-2xl border border-amber-200/60 max-h-[70vh] overflow-y-auto"
          data-allow-scroll="true"
        >
          <div className="space-y-4 font-light">
            {letterLines.slice(0, visibleLines).map((line, i) => (
              <p
                key={i}
                className={`leading-relaxed ${
                  i === 0
                    ? "font-vibes text-2xl md:text-3xl text-rose-red mb-4"
                    : i === letterLines.length - 1
                    ? "font-vibes text-xl md:text-2xl text-rose-red text-right mt-6"
                    : "font-sans text-sm md:text-base text-gray-700"
                }`}
              >
                {line}
              </p>
            ))}
            {visibleLines < letterLines.length && (
              <span className="inline-block animate-pulse text-rose-red ml-1">
                ✏️
              </span>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
