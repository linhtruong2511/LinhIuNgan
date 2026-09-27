"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { BIRTHDAY_CONFIG } from "@/lib/constants";

interface FinaleFlowerSceneProps {
  onRestart: () => void;
}

export default function FinaleFlowerScene({ onRestart }: FinaleFlowerSceneProps) {
  const [isBloomed, setIsBloomed] = useState(false);
  const confettiFired = useRef(false);

  useEffect(() => {
    // Flower blooms over 3.5 seconds, then reveals wishes and triggers celebration
    const timer = setTimeout(() => {
      setIsBloomed(true);
      if (!confettiFired.current) {
        confettiFired.current = true;
        // Grand celebration confetti
        confetti({
          particleCount: 90,
          spread: 85,
          origin: { x: 0.5, y: 0.4 },
          colors: ["#FF758F", "#FF4D6D", "#FFD93D", "#4ECDC4", "#FFF8E7"],
        });
        setTimeout(() => {
          confetti({
            particleCount: 50,
            angle: 60,
            spread: 60,
            origin: { x: 0.15, y: 0.45 },
          });
          confetti({
            particleCount: 50,
            angle: 120,
            spread: 60,
            origin: { x: 0.85, y: 0.45 },
          });
        }, 350);
      }
    }, 3600);

    return () => clearTimeout(timer);
  }, []);

  const { badge, title, subtitle, closing } = BIRTHDAY_CONFIG.finaleFlower;

  // Outer petals: 10 petals (36 deg apart)
  const outerPetals = Array.from({ length: 10 }, (_, i) => i * 36);
  // Inner petals: 8 petals (45 deg apart, offset by 22.5 deg)
  const innerPetals = Array.from({ length: 8 }, (_, i) => i * 45 + 22.5);
  // Center small core petals: 6 petals (60 deg apart)
  const corePetals = Array.from({ length: 6 }, (_, i) => i * 60 + 15);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center text-center px-4 overflow-hidden select-none bg-[#050B14]">
      {/* Dim, intimate romantic atmosphere */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,107,107,0.12)_0%,_rgba(10,22,40,0.85)_50%,_#050B14_100%)] pointer-events-none" />

      {/* Subtle floating glow particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[
          { top: "20%", left: "15%", size: 4, delay: 0 },
          { top: "25%", left: "80%", size: 5, delay: 1 },
          { top: "70%", left: "20%", size: 3, delay: 2 },
          { top: "65%", left: "85%", size: 4, delay: 1.5 },
          { top: "40%", left: "10%", size: 3, delay: 2.5 },
          { top: "45%", left: "90%", size: 5, delay: 0.5 },
        ].map((pt, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-candle-gold/40 blur-[1px]"
            style={{
              top: pt.top,
              left: pt.left,
              width: pt.size,
              height: pt.size,
            }}
            animate={{
              y: [-10, 10, -10],
              opacity: [0.2, 0.7, 0.2],
            }}
            transition={{
              duration: 3 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: pt.delay,
            }}
          />
        ))}
      </div>

      {/* BLOOMING FLOWER CONTAINER */}
      <div className="relative z-10 flex flex-col items-center mb-4">
        <div className="relative w-40 h-40 md:w-52 md:h-52 flex items-center justify-center">
          {/* Ambient blooming aura */}
          <motion.div
            initial={{ scale: 0.2, opacity: 0 }}
            animate={{
              scale: isBloomed ? [1.2, 1.35, 1.25] : 1.1,
              opacity: isBloomed ? [0.4, 0.65, 0.45] : 0.35,
            }}
            transition={{
              duration: isBloomed ? 3 : 2.5,
              repeat: isBloomed ? Infinity : 0,
              ease: "easeInOut",
            }}
            className="absolute w-32 h-32 md:w-44 md:h-44 rounded-full bg-gradient-to-r from-rose-500/30 via-pink-400/20 to-amber-300/30 blur-2xl pointer-events-none"
          />

          {/* LAYER 1: OUTER PETALS */}
          {outerPetals.map((angle, idx) => (
            <motion.div
              key={`outer-${idx}`}
              className="absolute w-12 h-20 md:w-16 md:h-28 flex items-center justify-center pointer-events-none"
              style={{
                transformOrigin: "bottom center",
                bottom: "50%",
                left: "calc(50% - 24px)",
              }}
              initial={{
                rotate: angle,
                scale: 0.05,
                opacity: 0,
              }}
              animate={{
                rotate: angle,
                scale: 1,
                opacity: 0.95,
              }}
              transition={{
                duration: 2.8,
                delay: 0.2 + idx * 0.06,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <svg viewBox="0 0 60 100" className="w-full h-full drop-shadow-[0_4px_10px_rgba(230,57,70,0.35)]">
                <defs>
                  <linearGradient id={`outerGrad-${idx}`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFA6C1" />
                    <stop offset="45%" stopColor="#FF4D6D" />
                    <stop offset="100%" stopColor="#C9184A" />
                  </linearGradient>
                </defs>
                <path
                  d="M 30,100 C 10,85 0,55 0,38 C 0,16 16,0 30,0 C 44,0 60,16 60,38 C 60,55 50,85 30,100 Z"
                  fill={`url(#outerGrad-${idx})`}
                />
                <path
                  d="M 30,12 C 30,35 30,60 30,85"
                  stroke="rgba(255,255,255,0.35)"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
              </svg>
            </motion.div>
          ))}

          {/* LAYER 2: INNER PETALS */}
          {innerPetals.map((angle, idx) => (
            <motion.div
              key={`inner-${idx}`}
              className="absolute w-10 h-16 md:w-14 md:h-24 flex items-center justify-center pointer-events-none"
              style={{
                transformOrigin: "bottom center",
                bottom: "50%",
                left: "calc(50% - 20px)",
              }}
              initial={{
                rotate: angle,
                scale: 0.05,
                opacity: 0,
              }}
              animate={{
                rotate: angle,
                scale: 1,
                opacity: 0.98,
              }}
              transition={{
                duration: 2.6,
                delay: 0.8 + idx * 0.07,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <svg viewBox="0 0 60 100" className="w-full h-full drop-shadow-[0_2px_8px_rgba(255,107,107,0.4)]">
                <defs>
                  <linearGradient id={`innerGrad-${idx}`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFF0F3" />
                    <stop offset="40%" stopColor="#FF758F" />
                    <stop offset="100%" stopColor="#E63946" />
                  </linearGradient>
                </defs>
                <path
                  d="M 30,100 C 12,85 2,55 2,38 C 2,16 16,0 30,0 C 44,0 58,16 58,38 C 58,55 48,85 30,100 Z"
                  fill={`url(#innerGrad-${idx})`}
                />
                <path
                  d="M 30,15 C 30,35 30,60 30,80"
                  stroke="rgba(255,255,255,0.45)"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
              </svg>
            </motion.div>
          ))}

          {/* LAYER 3: CORE PETALS (Tucked closest to pistil) */}
          {corePetals.map((angle, idx) => (
            <motion.div
              key={`core-${idx}`}
              className="absolute w-7 h-12 md:w-10 md:h-18 flex items-center justify-center pointer-events-none"
              style={{
                transformOrigin: "bottom center",
                bottom: "50%",
                left: "calc(50% - 14px)",
              }}
              initial={{
                rotate: angle,
                scale: 0.05,
                opacity: 0,
              }}
              animate={{
                rotate: angle,
                scale: 1,
                opacity: 1,
              }}
              transition={{
                duration: 2.2,
                delay: 1.4 + idx * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <svg viewBox="0 0 60 100" className="w-full h-full">
                <defs>
                  <linearGradient id={`coreGrad-${idx}`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFF8E7" />
                    <stop offset="50%" stopColor="#FFC6FF" />
                    <stop offset="100%" stopColor="#FF4D6D" />
                  </linearGradient>
                </defs>
                <path
                  d="M 30,100 C 14,85 6,55 6,38 C 6,18 18,2 30,2 C 42,2 54,18 54,38 C 54,55 46,85 30,100 Z"
                  fill={`url(#coreGrad-${idx})`}
                />
              </svg>
            </motion.div>
          ))}

          {/* PISTIL / CENTER CORE */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.6, delay: 1.8, ease: "easeOut" }}
            className="absolute z-20 w-8 h-8 md:w-11 md:h-11 rounded-full bg-gradient-to-tr from-amber-400 via-yellow-200 to-white shadow-[0_0_20px_#FFD93D] flex items-center justify-center"
          >
            <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-amber-500/70 blur-[1px]" />
          </motion.div>
        </div>
      </div>

      {/* FINAL BIRTHDAY MESSAGE: ONLY DISPLAYED AFTER FLOWER BLOOMS */}
      <div className="relative z-20 max-w-lg mx-auto flex flex-col items-center min-h-[190px]">
        <AnimatePresence>
          {isBloomed && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="space-y-2 md:space-y-3"
            >
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 0.8, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-xs uppercase tracking-widest text-teal-accent"
              >
                {badge}
              </motion.p>

              <motion.h2
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.4 }}
                className="text-2xl md:text-4xl font-dancing text-white text-glow-warm leading-tight"
              >
                {title}
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.7 }}
                className="text-base md:text-xl text-teal-accent font-dancing leading-relaxed text-glow px-2"
              >
                {subtitle}
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 0.85, y: 0 }}
                transition={{ duration: 0.8, delay: 1 }}
                className="text-xs md:text-sm text-white/80 font-light"
              >
                {closing}
              </motion.p>

              {/* Restart Button */}
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 1.3 }}
                className="pt-3"
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRestart();
                  }}
                  className="px-6 py-2 rounded-full bg-deep-night/80 border border-teal-accent/50 text-teal-accent hover:bg-teal-accent/20 hover:scale-105 active:scale-95 transition-all text-xs md:text-sm tracking-wide shadow-lg inline-flex items-center gap-2 cursor-pointer"
                >
                  <span>Quay lại từ đầu</span>
                  <span>↺</span>
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
