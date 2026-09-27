"use client";

import { useState, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  animate,
  PanInfo,
} from "framer-motion";
import confetti from "canvas-confetti";
import { BIRTHDAY_CONFIG } from "@/lib/constants";

interface GiftAndCakeSceneProps {
  onComplete: () => void;
  setCanAdvance: (can: boolean) => void;
}

type Stage =
  | "box_closed"
  | "cake_emerge"
  | "cake_cut"
  | "box_return"
  | "letter_open";

export default function GiftAndCakeScene({
  onComplete,
  setCanAdvance,
}: GiftAndCakeSceneProps) {
  const [stage, setStage] = useState<Stage>("box_closed");
  const [isLidOpen, setIsLidOpen] = useState(false);
  const [visibleLines, setVisibleLines] = useState(0);

  // Stage 1 (Cake) Lid Drag & Peek MotionValues
  const lidY1 = useMotionValue(0);
  const lidRotate1 = useTransform(lidY1, [0, -120], [0, -4]);
  const lidOpacity1 = useTransform(lidY1, [-120, -220], [1, 0]);
  const cakePeekY = useTransform(lidY1, [0, -75], [48, 16]);
  const cakePeekOpacity = useTransform(lidY1, [0, -10, -50], [0, 0.7, 1]);

  // Stage 4 (Letter) Lid Drag & Peek MotionValues
  const lidY2 = useMotionValue(0);
  const lidRotate2 = useTransform(lidY2, [0, -120], [0, -4]);
  const lidOpacity2 = useTransform(lidY2, [-120, -220], [1, 0]);
  const letterPeekY = useTransform(lidY2, [0, -75], [44, 14]);
  const letterPeekOpacity = useTransform(lidY2, [0, -10, -50], [0, 0.7, 1]);

  const letterLines = BIRTHDAY_CONFIG.letterContent
    .split("\n")
    .filter((line) => line.trim() !== "");

  // Initially lock advance
  useEffect(() => {
    setCanAdvance(false);
  }, [setCanAdvance]);

  // Open Box 1: Cake emergence
  const handleOpenBox1 = () => {
    if (stage !== "box_closed" || isLidOpen) return;

    setIsLidOpen(true);
    animate(lidY1, -250, { duration: 0.65, ease: [0.16, 1, 0.3, 1] });

    confetti({
      particleCount: 90,
      spread: 75,
      origin: { x: 0.5, y: 0.55 },
      colors: ["#E63946", "#FFD93D", "#4ECDC4", "#FF6B6B", "#FFF8E7"],
    });

    // Cake begins to rise out smoothly and slowly
    setTimeout(() => {
      setStage("cake_emerge");
    }, 450);
  };

  const handleLid1DragEnd = (
    _e: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    if (isLidOpen || stage !== "box_closed") return;

    if (info.offset.y <= -60 || info.velocity.y <= -200) {
      handleOpenBox1();
    } else {
      animate(lidY1, 0, {
        type: "spring",
        stiffness: 450,
        damping: 26,
      });
    }
  };

  const handleLid1Click = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLidOpen || stage !== "box_closed") return;
    // Playful small bounce when clicked without dragging
    animate(lidY1, [-18, 0], {
      type: "spring",
      stiffness: 400,
      damping: 20,
    });
  };

  // Perform Cake Cut
  const performCut = () => {
    if (stage !== "cake_emerge") return;
    setStage("cake_cut");

    confetti({
      particleCount: 85,
      spread: 70,
      origin: { x: 0.5, y: 0.45 },
      colors: ["#FFD93D", "#FF6B6B", "#4ECDC4", "#FFF0F5"],
    });

    // After cake cutting celebration, bring back box for letter
    setTimeout(() => {
      lidY2.set(0);
      setIsLidOpen(false);
      setStage("box_return");
    }, 2800);
  };

  // Open Box 2: Letter emergence
  const handleOpenBox2 = () => {
    if (stage !== "box_return" || isLidOpen) return;

    setIsLidOpen(true);
    animate(lidY2, -250, { duration: 0.65, ease: [0.16, 1, 0.3, 1] });

    confetti({
      particleCount: 75,
      spread: 65,
      origin: { x: 0.5, y: 0.55 },
      colors: ["#FFD93D", "#E63946", "#FFF8E7", "#FF6B6B"],
    });

    setTimeout(() => {
      setStage("letter_open");

      // Typewriter effect after letter has expanded
      setTimeout(() => {
        let lineIdx = 0;
        const interval = setInterval(() => {
          lineIdx++;
          setVisibleLines(lineIdx);
          if (lineIdx >= letterLines.length) {
            clearInterval(interval);
            setCanAdvance(true); // Unlock advance to memories
          }
        }, 320);
      }, 700);
    }, 450);
  };

  const handleLid2DragEnd = (
    _e: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    if (isLidOpen || stage !== "box_return") return;

    if (info.offset.y <= -60 || info.velocity.y <= -200) {
      handleOpenBox2();
    } else {
      animate(lidY2, 0, {
        type: "spring",
        stiffness: 450,
        damping: 26,
      });
    }
  };

  const handleLid2Click = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLidOpen || stage !== "box_return") return;
    animate(lidY2, [-18, 0], {
      type: "spring",
      stiffness: 400,
      damping: 20,
    });
  };

  const handleLetterClick = () => {
    if (stage !== "letter_open") return;
    if (visibleLines < letterLines.length) {
      setVisibleLines(letterLines.length);
      setCanAdvance(true);
    } else {
      onComplete();
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center px-4 overflow-hidden select-none">
      {/* Ambient background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,217,61,0.12)_0%,_rgba(230,57,70,0.06)_50%,_transparent_70%)] pointer-events-none" />

      {/* ============================================================ */}
      {/* 1. STAGE: BOX CLOSED (FIRST OPENING FOR CAKE) */}
      {/* ============================================================ */}
      {stage === "box_closed" && (
        <motion.div
          initial={{ scale: 0.85, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-20 flex flex-col items-center select-none"
        >
          {/* GIFT BOX WITH REAL LID & PEEKING CAKE */}
          <div className="relative flex flex-col items-center">
            {/* Box Lid (Draggable) */}
            <motion.div
              drag="y"
              dragConstraints={{ top: -140, bottom: 0 }}
              dragElastic={{ top: 0.25, bottom: 0 }}
              style={{
                y: lidY1,
                rotate: lidRotate1,
                opacity: lidOpacity1,
              }}
              onDrag={(_e, info) => {
                lidY1.set(info.offset.y);
              }}
              onDragEnd={handleLid1DragEnd}
              onClick={handleLid1Click}
              whileHover={{ scale: 1.02 }}
              className="relative z-30 flex flex-col items-center cursor-grab active:cursor-grabbing touch-none select-none"
            >
              {/* Upward Drag Arrow Cue */}
              <motion.div
                animate={{ y: [-1, -5, -1], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                className="flex items-center gap-1 text-candle-gold text-xs font-medium pb-1 drop-shadow-[0_0_8px_rgba(255,217,61,0.8)] pointer-events-none"
              >
                <span className="text-[10px]">▲</span>
                <span className="font-dancing tracking-wider text-xs">Cầm nắp kéo lên</span>
                <span className="text-[10px]">▲</span>
              </motion.div>

              {/* Ribbon Bow on top */}
              <div className="relative -mb-1 flex items-center justify-center z-10">
                <div className="w-7 h-7 rounded-full border-[3px] border-amber-300 bg-candle-gold -rotate-45 shadow-md -mr-1.5" />
                <div className="w-7 h-7 rounded-full border-[3px] border-amber-300 bg-candle-gold rotate-45 shadow-md -ml-1.5" />
                <div className="absolute w-4 h-4 rounded-full bg-amber-400 border border-amber-200 shadow-inner z-10" />
              </div>

              {/* Lid Cap (Fitted width: 188px on mobile, 222px on desktop) */}
              <div className="w-[188px] h-[34px] md:w-[222px] md:h-[38px] bg-gradient-to-r from-red-600 via-rose-600 to-red-700 rounded-t-lg rounded-b-[2px] border-2 border-candle-gold/80 relative shadow-lg flex items-center justify-center">
                {/* Vertical Ribbon aligned with body */}
                <div className="w-8 h-full bg-gradient-to-r from-candle-gold via-amber-300 to-candle-gold shadow-sm" />
                {/* Gold rim at bottom */}
                <div className="absolute h-1 w-full bottom-0 bg-candle-gold/60" />
              </div>
            </motion.div>

            {/* Box Body Area with Centered Peeking Cake */}
            <div className="relative w-44 md:w-52 -mt-0.5">
              {/* Peeking Cake Container: centered horizontally across full box width */}
              <div className="absolute left-0 right-0 bottom-full flex justify-center pointer-events-none z-10">
                <motion.div
                  style={{
                    y: cakePeekY,
                    opacity: cakePeekOpacity,
                  }}
                  className="flex flex-col items-center"
                >
                  {/* Candles */}
                  <div className="flex gap-2.5 mb-0.5">
                    {[0, 1, 2, 3].map((i) => (
                      <div key={i} className="flex flex-col items-center">
                        <div
                          className="w-1.5 h-2.5 bg-gradient-to-t from-candle-gold to-orange-400 rounded-full animate-flicker"
                          style={{ animationDelay: `${i * 0.15}s` }}
                        />
                        <div className="w-1 h-3 bg-teal-accent rounded-xs shadow-xs" />
                      </div>
                    ))}
                  </div>
                  {/* Cake Top Tier Peek */}
                  <div className="w-28 md:w-32 h-6 bg-gradient-to-r from-pink-300 via-pink-400 to-rose-500 rounded-t-xl border border-pink-200/80 shadow-inner relative overflow-hidden flex items-center justify-center">
                    <div className="absolute top-0 w-full h-1 bg-white/50 rounded-t-xl" />
                    <div className="flex gap-2 mt-0.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-white/70" />
                      <div className="w-1.5 h-1.5 rounded-full bg-white/70" />
                      <div className="w-1.5 h-1.5 rounded-full bg-white/70" />
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Box Body (z-20 covers peeking cake when tucked down) */}
              <div className="relative z-20 w-full h-36 md:h-40 bg-gradient-to-b from-rose-700 via-red-800 to-red-950 rounded-b-2xl border-2 border-t-0 border-candle-gold/60 shadow-2xl flex items-center justify-center overflow-hidden">
                <div className="absolute w-8 h-full bg-gradient-to-r from-candle-gold via-amber-300 to-candle-gold shadow-md" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/25 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Prompt text (clickable as well) */}
          <div
            onClick={handleOpenBox1}
            className="cursor-pointer flex flex-col items-center mt-7 hover:scale-105 transition-transform"
          >
            <p className="text-xl md:text-2xl font-dancing text-candle-gold text-glow animate-pulse">
              Kéo nắp hộp lên nhé 🎁
            </p>
            <span className="text-[11px] text-white/60 font-light mt-1 tracking-wider">
              (Hoặc chạm vào đây để mở)
            </span>
          </div>
        </motion.div>
      )}

      {/* ============================================================ */}
      {/* 2 & 3. STAGE: CAKE EMERGE & CAKE CUT */}
      {/* ============================================================ */}
      {(stage === "cake_emerge" || stage === "cake_cut") && (
        <div className="relative z-20 flex flex-col items-center">
          {/* Cake Emerging and Scaling smoothly to Spotlight (Cinematic Slow Rise) */}
          <motion.div
            initial={{ scale: 0.35, y: 70, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-20 flex flex-col items-center"
          >
            {/* Candles Section (2 on left half, 2 on right half) */}
            <div className="w-40 md:w-48 flex justify-between px-3 mb-1 relative z-20">
              {/* Left Candles */}
              <div className="flex gap-4">
                {[0, 1].map((i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div
                      className={`w-2 h-3.5 bg-gradient-to-t from-candle-gold to-orange-400 rounded-full animate-flicker ${
                        stage === "cake_cut"
                          ? "opacity-0 scale-0 transition-all duration-500"
                          : ""
                      }`}
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                    <div className="w-1.5 h-7 bg-teal-accent rounded-sm shadow-sm" />
                  </div>
                ))}
              </div>

              {/* Right Candles */}
              <div className="flex gap-4">
                {[2, 3].map((i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div
                      className={`w-2 h-3.5 bg-gradient-to-t from-candle-gold to-orange-400 rounded-full animate-flicker ${
                        stage === "cake_cut"
                          ? "opacity-0 scale-0 transition-all duration-500"
                          : ""
                      }`}
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                    <div className="w-1.5 h-7 bg-teal-accent rounded-sm shadow-sm" />
                  </div>
                ))}
              </div>
            </div>

            {/* SEAMLESS CAKE TIERS */}
            <div
              className={`flex items-end justify-center transition-all duration-700 ${
                stage === "cake_cut" ? "gap-6" : "gap-0"
              }`}
            >
              {/* LEFT HALF (flush right at seam) */}
              <motion.div
                animate={
                  stage === "cake_cut"
                    ? { x: -26, rotate: -4 }
                    : { x: 0, rotate: 0 }
                }
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-end"
              >
                {/* Tier 1 (top left) */}
                <div className="w-20 md:w-24 h-10 bg-gradient-to-r from-pink-300 via-pink-400 to-rose-500 rounded-tl-2xl border-2 border-r-0 border-pink-200/70 relative overflow-hidden shadow-sm">
                  <div className="w-full h-2 bg-white/40 rounded-tl-2xl" />
                  <div className="flex gap-1 px-1 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-white/50" />
                    <div className="w-1.5 h-3 rounded-full bg-white/50" />
                  </div>
                </div>

                {/* Tier 2 (middle left) */}
                <div className="w-28 md:w-32 h-11 bg-gradient-to-r from-pink-400 via-rose-500 to-rose-600 rounded-tl-2xl border-2 border-r-0 border-pink-300/70 relative overflow-hidden shadow-sm">
                  <div className="w-full h-2.5 bg-white/40 rounded-tl-2xl" />
                  <div className="flex gap-1.5 px-2 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-white/50" />
                    <div className="w-2 h-3.5 rounded-full bg-white/50" />
                  </div>
                </div>

                {/* Tier 3 (bottom left) */}
                <div className="w-36 md:w-40 h-12 bg-gradient-to-r from-pink-500 via-rose-600 to-red-700 rounded-tl-2xl rounded-bl-xl border-2 border-r-0 border-pink-400/70 relative overflow-hidden shadow-md">
                  <div className="w-full h-2.5 bg-white/40 rounded-tl-2xl" />
                  <div className="flex gap-2 px-3 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-white/50" />
                    <div className="w-2.5 h-3 rounded-full bg-white/50" />
                    <div className="w-2 h-2 rounded-full bg-white/50" />
                  </div>
                </div>
              </motion.div>

              {/* RIGHT HALF (flush left at seam) */}
              <motion.div
                animate={
                  stage === "cake_cut"
                    ? { x: 26, rotate: 4 }
                    : { x: 0, rotate: 0 }
                }
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-start"
              >
                {/* Tier 1 (top right) */}
                <div className="w-20 md:w-24 h-10 bg-gradient-to-l from-pink-300 via-pink-400 to-rose-500 rounded-tr-2xl border-2 border-l-0 border-pink-200/70 relative overflow-hidden shadow-sm">
                  <div className="w-full h-2 bg-white/40 rounded-tr-2xl" />
                  <div className="flex justify-end gap-1 px-1 mt-0.5">
                    <div className="w-1.5 h-3 rounded-full bg-white/50" />
                    <div className="w-2 h-2 rounded-full bg-white/50" />
                  </div>
                </div>

                {/* Tier 2 (middle right) */}
                <div className="w-28 md:w-32 h-11 bg-gradient-to-l from-pink-400 via-rose-500 to-rose-600 rounded-tr-2xl border-2 border-l-0 border-pink-300/70 relative overflow-hidden shadow-sm">
                  <div className="w-full h-2.5 bg-white/40 rounded-tr-2xl" />
                  <div className="flex justify-end gap-1.5 px-2 mt-0.5">
                    <div className="w-2 h-3.5 rounded-full bg-white/50" />
                    <div className="w-2 h-2 rounded-full bg-white/50" />
                  </div>
                </div>

                {/* Tier 3 (bottom right) */}
                <div className="w-36 md:w-40 h-12 bg-gradient-to-l from-pink-500 via-rose-600 to-red-700 rounded-tr-2xl rounded-br-xl border-2 border-l-0 border-pink-400/70 relative overflow-hidden shadow-md">
                  <div className="w-full h-2.5 bg-white/40 rounded-tr-2xl" />
                  <div className="flex justify-end gap-2 px-3 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-white/50" />
                    <div className="w-2.5 h-3 rounded-full bg-white/50" />
                    <div className="w-2 h-2 rounded-full bg-white/50" />
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Cake Plate (wider than cake with elegant porcelain glow) */}
            <div className="w-80 md:w-96 h-3.5 bg-gradient-to-r from-white/40 via-white/80 to-white/40 rounded-full mx-auto mt-1 border border-white/60 shadow-[0_4px_16px_rgba(255,255,255,0.25)]" />
          </motion.div>

          {/* Prompt Text (generous margin, completely clear of knife) */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 text-xl md:text-2xl font-dancing text-candle-gold text-glow text-center max-w-xs md:max-w-sm px-2"
          >
            {stage === "cake_cut"
              ? "Chúc em tuổi mới ngọt ngào như chiếc bánh này! 🎂✨"
              : "Cầm dao đưa qua bánh để cắt nhé 🎂"}
          </motion.p>

          {/* GIFT BOX PUSHED GENTLY TO BACKGROUND */}
          <motion.div
            initial={{ scale: 1, y: 0, opacity: 1 }}
            animate={{ scale: 0.6, y: 35, opacity: 0.4 }}
            transition={{ duration: 2.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-0 mt-3 flex flex-col items-center pointer-events-none"
          >
            <div className="w-44 h-24 md:w-52 md:h-28 bg-gradient-to-b from-rose-700 via-red-800 to-red-950 rounded-b-2xl border-2 border-candle-gold/40 shadow-xl relative overflow-hidden flex items-center justify-center">
              <div className="absolute w-8 h-full bg-gradient-to-r from-candle-gold via-amber-300 to-candle-gold opacity-80" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent" />
            </div>
          </motion.div>

          {/* ======================================================== */}
          {/* DRAGGABLE KNIFE ON THE SIDE OF THE SCREEN (CAKE LEVEL) */}
          {/* ======================================================== */}
          {stage === "cake_emerge" && (
            <motion.div
              initial={{ x: 70, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 1.8, duration: 0.7, ease: "easeOut" }}
              className="fixed right-2 md:right-8 top-[32%] md:top-[35%] z-40 flex flex-col items-center"
            >
              {/* Tooltip hint above knife */}
              <div className="mb-1 px-2.5 py-0.5 rounded-full bg-deep-night/85 border border-candle-gold/70 text-candle-gold text-[11px] font-dancing whitespace-nowrap shadow-lg animate-pulse">
                👈 Kéo dao vào bánh
              </div>

              {/* Draggable Knife Item */}
              <motion.div
                drag
                dragConstraints={{ left: -340, right: 20, top: -100, bottom: 100 }}
                dragElastic={0.2}
                onDrag={(_e, info) => {
                  if (info.offset.x < -70 || info.point.x < window.innerWidth * 0.65) {
                    performCut();
                  }
                }}
                onClick={performCut}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.95 }}
                className="cursor-grab active:cursor-grabbing p-2.5 touch-none select-none drop-shadow-[0_0_15px_rgba(255,217,61,0.7)]"
              >
                <div className="text-4xl md:text-5xl -rotate-45 hover:rotate-[-60deg] transition-transform">
                  🔪
                </div>
              </motion.div>
            </motion.div>
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/* 4. STAGE: BOX RETURN (CLOSED BOX WAITING FOR LETTER OPENING) */}
      {/* ============================================================ */}
      {stage === "box_return" && (
        <motion.div
          initial={{ scale: 0.85, y: 30, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
          className="relative z-20 flex flex-col items-center select-none"
        >
          <div className="relative flex flex-col items-center">
            {/* Box Lid (Draggable) */}
            <motion.div
              drag="y"
              dragConstraints={{ top: -140, bottom: 0 }}
              dragElastic={{ top: 0.25, bottom: 0 }}
              style={{
                y: lidY2,
                rotate: lidRotate2,
                opacity: lidOpacity2,
              }}
              onDrag={(_e, info) => {
                lidY2.set(info.offset.y);
              }}
              onDragEnd={handleLid2DragEnd}
              onClick={handleLid2Click}
              whileHover={{ scale: 1.02 }}
              className="relative z-30 flex flex-col items-center cursor-grab active:cursor-grabbing touch-none select-none"
            >
              {/* Upward Drag Arrow Cue */}
              <motion.div
                animate={{ y: [-1, -5, -1], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                className="flex items-center gap-1 text-candle-gold text-xs font-medium pb-1 drop-shadow-[0_0_8px_rgba(255,217,61,0.8)] pointer-events-none"
              >
                <span className="text-[10px]">▲</span>
                <span className="font-dancing tracking-wider text-xs">Kéo nắp mở nốt nhé</span>
                <span className="text-[10px]">▲</span>
              </motion.div>

              {/* Ribbon Bow on top */}
              <div className="relative -mb-1 flex items-center justify-center z-10">
                <div className="w-7 h-7 rounded-full border-[3px] border-amber-300 bg-candle-gold -rotate-45 shadow-md -mr-1.5" />
                <div className="w-7 h-7 rounded-full border-[3px] border-amber-300 bg-candle-gold rotate-45 shadow-md -ml-1.5" />
                <div className="absolute w-4 h-4 rounded-full bg-amber-400 border border-amber-200 shadow-inner z-10" />
              </div>

              {/* Lid Cap (Fitted width: 188px on mobile, 222px on desktop) */}
              <div className="w-[188px] h-[34px] md:w-[222px] md:h-[38px] bg-gradient-to-r from-red-600 via-rose-600 to-red-700 rounded-t-lg rounded-b-[2px] border-2 border-candle-gold/80 relative shadow-lg flex items-center justify-center">
                <div className="w-8 h-full bg-gradient-to-r from-candle-gold via-amber-300 to-candle-gold shadow-sm" />
                <div className="absolute h-1 w-full bottom-0 bg-candle-gold/60" />
              </div>
            </motion.div>

            {/* Box Body Area with Centered Peeking Letter */}
            <div className="relative w-44 md:w-52 -mt-0.5">
              {/* Peeking Letter Container */}
              <div className="absolute left-0 right-0 bottom-full flex justify-center pointer-events-none z-10">
                <motion.div
                  style={{
                    y: letterPeekY,
                    opacity: letterPeekOpacity,
                  }}
                  className="flex flex-col items-center"
                >
                  <div className="w-24 md:w-28 h-8 bg-paper-cream/95 rounded-t-lg border-2 border-b-0 border-amber-300 shadow-md flex items-center justify-center px-1.5">
                    <span className="text-[11px] font-vibes text-rose-red font-semibold whitespace-nowrap">💌 Thư gửi em</span>
                  </div>
                </motion.div>
              </div>

              {/* Box Body */}
              <div className="relative z-20 w-full h-36 md:h-40 bg-gradient-to-b from-rose-700 via-red-800 to-red-950 rounded-b-2xl border-2 border-t-0 border-candle-gold/60 shadow-2xl flex items-center justify-center overflow-hidden">
                <div className="absolute w-8 h-full bg-gradient-to-r from-candle-gold via-amber-300 to-candle-gold shadow-md" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/25 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Prompt text */}
          <div
            onClick={handleOpenBox2}
            className="cursor-pointer flex flex-col items-center mt-7 hover:scale-105 transition-transform"
          >
            <p className="text-xl md:text-2xl font-dancing text-candle-gold text-glow animate-pulse">
              Vẫn còn một điều bất ngờ nữa trong hộp... 🎁
            </p>
            <span className="text-xs text-white/70 font-light mt-1.5 tracking-wider">
              Kéo nắp hoặc chạm để mở nốt nhé ✨
            </span>
          </div>
        </motion.div>
      )}

      {/* ============================================================ */}
      {/* 5. STAGE: LETTER OPEN (EMERGES SLOWLY FROM BOX TO SPOTLIGHT) */}
      {/* ============================================================ */}
      {stage === "letter_open" && (
        <div
          onClick={handleLetterClick}
          className="relative z-20 flex flex-col items-center w-full max-w-lg cursor-pointer"
        >
          {/* Letter emerging and expanding from gift box */}
          <motion.div
            initial={{ scale: 0.3, y: 70, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-20 w-full bg-paper-cream/95 text-gray-800 rounded-2xl p-6 md:p-8 shadow-2xl border border-amber-200/70 max-h-[72vh] overflow-y-auto"
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

          {/* GIFT BOX PUSHED GENTLY TO BACKGROUND */}
          <motion.div
            initial={{ scale: 1, y: 0, opacity: 1 }}
            animate={{ scale: 0.55, y: 30, opacity: 0.35 }}
            transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-0 mt-2 flex flex-col items-center pointer-events-none"
          >
            <div className="w-44 h-24 md:w-52 md:h-28 bg-gradient-to-b from-rose-700 via-red-800 to-red-950 rounded-b-2xl border-2 border-candle-gold/40 shadow-xl relative overflow-hidden flex items-center justify-center">
              <div className="absolute w-8 h-full bg-gradient-to-r from-candle-gold via-amber-300 to-candle-gold opacity-80" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent" />
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
