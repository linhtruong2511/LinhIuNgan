"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { BIRTHDAY_CONFIG } from "@/lib/constants";

interface FinaleFlowerSceneProps {
  onRestart: () => void;
}

export default function FinaleFlowerScene({ onRestart }: FinaleFlowerSceneProps) {
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;

    // Grand confetti salute
    confetti({
      particleCount: 120,
      spread: 100,
      origin: { x: 0.5, y: 0.4 },
      colors: ["#E63946", "#FFD93D", "#4ECDC4", "#FF6B6B", "#FFF8E7", "#A855F7"],
    });

    setTimeout(() => {
      confetti({
        particleCount: 80,
        angle: 60,
        spread: 70,
        origin: { x: 0.1, y: 0.5 },
      });
      confetti({
        particleCount: 80,
        angle: 120,
        spread: 70,
        origin: { x: 0.9, y: 0.5 },
      });
    }, 400);
  }, []);

  const { badge, title, subtitle, closing } = BIRTHDAY_CONFIG.finaleFlower;

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center text-center px-6 overflow-hidden select-none">
      {/* Soft warm romantic bloom background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(230,57,70,0.18)_0%,_rgba(255,217,61,0.1)_40%,_transparent_75%)] pointer-events-none" />

      {/* SVG ORGANIC BLOOMING FLOWER */}
      <div className="relative w-44 h-44 md:w-56 md:h-56 mb-4 flex items-center justify-center">
        {/* Glowing aura */}
        <motion.div
          initial={{ scale: 0.2, opacity: 0 }}
          animate={{ scale: 1.5, opacity: 0.5 }}
          transition={{ duration: 3.5, ease: "easeOut" }}
          className="absolute inset-0 bg-candle-gold/20 rounded-full blur-2xl pointer-events-none"
        />

        <svg viewBox="0 0 200 200" className="w-full h-full filter drop-shadow-xl">
          <defs>
            <radialGradient id="flowerCenter" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFF8E7" />
              <stop offset="60%" stopColor="#FFD93D" />
              <stop offset="100%" stopColor="#F59E0B" />
            </radialGradient>
            <linearGradient id="petalGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FDA4AF" />
              <stop offset="100%" stopColor="#E11D48" />
            </linearGradient>
            <linearGradient id="petalGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F472B6" />
              <stop offset="100%" stopColor="#BE185D" />
            </linearGradient>
          </defs>

          {/* Layer 1: Outer Petals (8 petals) */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, idx) => (
            <motion.path
              key={`outer-${idx}`}
              d="M100,100 C80,40 120,40 100,15 C80,40 120,40 100,100 Z"
              fill="url(#petalGrad1)"
              opacity="0.9"
              transform={`rotate(${angle} 100 100)`}
              initial={{ scale: 0.1, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.9 }}
              transition={{ duration: 3, delay: 0.1 * idx, ease: "easeOut" }}
              style={{ transformOrigin: "100px 100px" }}
            />
          ))}

          {/* Layer 2: Inner Petals (8 petals offset by 22.5 deg) */}
          {[22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map((angle, idx) => (
            <motion.path
              key={`inner-${idx}`}
              d="M100,100 C85,50 115,50 100,28 C85,50 115,50 100,100 Z"
              fill="url(#petalGrad2)"
              opacity="0.95"
              transform={`rotate(${angle} 100 100)`}
              initial={{ scale: 0.1, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.95 }}
              transition={{
                duration: 2.8,
                delay: 0.5 + 0.08 * idx,
                ease: "easeOut",
              }}
              style={{ transformOrigin: "100px 100px" }}
            />
          ))}

          {/* Glowing Center Pistil */}
          <motion.circle
            cx="100"
            cy="100"
            r="16"
            fill="url(#flowerCenter)"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 2, delay: 1 }}
            style={{ transformOrigin: "100px 100px" }}
          />
        </svg>
      </div>

      {/* Grand Birthday Message */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.3, delayChildren: 1.5 },
          },
        }}
        className="relative z-10 max-w-xl mx-auto space-y-3"
      >
        <motion.p
          variants={{
            hidden: { opacity: 0, y: 15 },
            visible: { opacity: 0.7, y: 0 },
          }}
          className="text-xs uppercase tracking-widest text-teal-accent"
        >
          {badge}
        </motion.p>

        <motion.h2
          variants={{
            hidden: { opacity: 0, y: 20, filter: "blur(6px)" },
            visible: {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              transition: { duration: 1 },
            },
          }}
          className="text-3xl md:text-5xl font-dancing text-white text-glow-warm"
        >
          {title}
        </motion.h2>

        <motion.p
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 1 } },
          }}
          className="text-lg md:text-2xl text-teal-accent font-dancing leading-relaxed text-glow"
        >
          {subtitle}
        </motion.p>

        <motion.p
          variants={{
            hidden: { opacity: 0, y: 15 },
            visible: { opacity: 0.8, y: 0 },
          }}
          className="text-sm md:text-base text-white/70 font-light"
        >
          {closing}
        </motion.p>

        {/* Restart Button */}
        <motion.div
          variants={{
            hidden: { opacity: 0, scale: 0.8 },
            visible: { opacity: 1, scale: 1 },
          }}
          className="pt-4"
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRestart();
            }}
            className="px-6 py-2.5 rounded-full bg-deep-night/70 border border-teal-accent/50 text-teal-accent hover:bg-teal-accent/20 hover:scale-105 active:scale-95 transition-all text-xs md:text-sm tracking-wide shadow-lg inline-flex items-center gap-2 cursor-pointer"
          >
            <span>Quay lại từ đầu</span>
            <span>↺</span>
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
