"use client";

import { motion, AnimatePresence } from "framer-motion";
import { BIRTHDAY_CONFIG } from "@/lib/constants";

interface SweetWordsSceneProps {
  subStep: number;
}

export default function SweetWordsScene({ subStep }: SweetWordsSceneProps) {
  const currentWord = BIRTHDAY_CONFIG.sweetWords[subStep] || "";

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center text-center px-8 md:px-16 overflow-hidden">
      {/* Ambient starlight glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(78,205,196,0.12)_0%,_transparent_70%)] pointer-events-none" />

      <AnimatePresence mode="wait">
        <motion.div
          key={subStep}
          initial={{ opacity: 0, y: 30, scale: 0.95, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -20, scale: 1.03, filter: "blur(6px)" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 max-w-3xl px-4"
        >
          <p className="text-2xl md:text-4xl lg:text-5xl font-dancing text-white leading-relaxed text-glow">
            {currentWord}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
