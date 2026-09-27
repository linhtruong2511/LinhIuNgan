"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { BIRTHDAY_CONFIG } from "@/lib/constants";

interface FloatingMemoriesSceneProps {
  onOpenLightbox: (index: number) => void;
  onOpenPuzzle: () => void;
}

// 8 responsive scatter positions around the screen
const SCATTER_DESTINATIONS = [
  { x: "-28vw", y: "-24vh", rotate: -6 },
  { x: "28vw", y: "-22vh", rotate: 5 },
  { x: "-32vw", y: "6vh", rotate: -4 },
  { x: "32vw", y: "8vh", rotate: 6 },
  { x: "-20vw", y: "30vh", rotate: 4 },
  { x: "20vw", y: "32vh", rotate: -5 },
  { x: "-8vw", y: "-30vh", rotate: 3 },
  { x: "8vw", y: "32vh", rotate: -2 },
];

export default function FloatingMemoriesScene({
  onOpenLightbox,
  onOpenPuzzle,
}: FloatingMemoriesSceneProps) {
  const [failedImages, setFailedImages] = useState<Record<number, boolean>>({});
  const memories = BIRTHDAY_CONFIG.memories;

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(78,205,196,0.12)_0%,_transparent_70%)] pointer-events-none" />

      {/* Center Gift Box Base from which photos emerged */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 0.75, opacity: 0.8 }}
        className="absolute w-36 h-28 bg-gradient-to-b from-rose-red to-red-900 rounded-b-xl border border-candle-gold/50 flex flex-col items-center justify-center shadow-xl select-none z-10"
      >
        <span className="text-3xl animate-bounce-slow">🎁</span>
        <span className="text-[10px] text-white/60 font-light mt-1">Hộp kỷ niệm</span>
      </motion.div>

      {/* Secret Crystal Orb (Easter Egg) Floating near center */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{
          scale: [1, 1.12, 1],
          opacity: [0.85, 1, 0.85],
          boxShadow: [
            "0 0 15px rgba(255,217,61,0.5)",
            "0 0 30px rgba(255,107,107,0.8)",
            "0 0 15px rgba(255,217,61,0.5)",
          ],
        }}
        transition={{
          delay: 3,
          duration: 2.4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        onClick={(e) => {
          e.stopPropagation();
          onOpenPuzzle();
        }}
        className="absolute z-30 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-rose-red to-amber-500 border border-white/60 text-white text-xs font-medium tracking-wide flex items-center gap-1.5 shadow-2xl cursor-pointer hover:scale-110 active:scale-95 transition-transform"
        style={{ transform: "translateY(55px)" }}
      >
        <span>💖</span>
        <span>Mở điều bí mật</span>
      </motion.button>

      {/* Floating Polaroids flying out one by one */}
      {memories.map((memory, i) => {
        const dest = SCATTER_DESTINATIONS[i % SCATTER_DESTINATIONS.length];

        return (
          <motion.div
            key={i}
            initial={{ x: 0, y: 0, scale: 0.1, opacity: 0, rotate: 0 }}
            animate={{
              x: dest.x,
              y: [dest.y, `calc(${dest.y} + 8px)`, dest.y],
              scale: 1,
              opacity: 1,
              rotate: dest.rotate,
            }}
            transition={{
              x: { duration: 1.2, delay: 0.28 * i, ease: [0.22, 1, 0.36, 1] },
              scale: { duration: 1.2, delay: 0.28 * i, ease: [0.22, 1, 0.36, 1] },
              opacity: { duration: 0.8, delay: 0.28 * i },
              rotate: { duration: 1.2, delay: 0.28 * i },
              y: {
                duration: 3 + (i % 3),
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1.2 + 0.28 * i,
              },
            }}
            whileHover={{ scale: 1.15, zIndex: 40 }}
            className="absolute z-20 cursor-pointer select-none"
            onClick={(e) => {
              e.stopPropagation();
              onOpenLightbox(i);
            }}
          >
            <div className="bg-white p-1.5 pb-5 rounded shadow-2xl w-24 h-24 md:w-32 md:h-32 border border-white/80">
              <div className="relative w-full h-full overflow-hidden rounded-sm bg-gray-800">
                {memory.type === "image" ? (
                  !failedImages[i] ? (
                    <Image
                      src={memory.src}
                      alt={memory.caption}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 96px, 128px"
                      onError={() => setFailedImages((prev) => ({ ...prev, [i]: true }))}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-700 text-lg">
                      📷
                    </div>
                  )
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-900">
                    <span className="text-xl">▶️</span>
                  </div>
                )}
              </div>
              <p className="absolute bottom-1 left-0 right-0 text-center text-[9px] md:text-[11px] font-vibes text-gray-700 px-1 truncate">
                {memory.caption}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
