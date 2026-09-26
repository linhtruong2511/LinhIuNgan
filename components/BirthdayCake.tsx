"use client";

import { useRef, useState, useCallback } from "react";
import confetti from "canvas-confetti";
import ScrollIndicator from "./ScrollIndicator";

export default function BirthdayCake() {
  const sectionRef = useRef<HTMLElement>(null);
  const knifeRef = useRef<HTMLDivElement>(null);
  const [isCut, setIsCut] = useState(false);
  const [knifeX, setKnifeX] = useState(0);
  const isDragging = useRef(false);
  const startX = useRef(0);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (isCut) return;
      isDragging.current = true;
      startX.current = e.clientX - knifeX;
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    [knifeX, isCut]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging.current || isCut) return;
      const newX = e.clientX - startX.current;
      setKnifeX(newX);

      // Check if knife crossed the center of the cake (threshold)
      if (Math.abs(newX) > 80) {
        setIsCut(true);
        isDragging.current = false;

        // Sparkle confetti
        confetti({
          particleCount: 60,
          spread: 50,
          origin: { x: 0.5, y: 0.6 },
          colors: ["#FFD93D", "#FF6B6B", "#4ECDC4"],
          scalar: 0.8,
        });
      }
    },
    [isCut]
  );

  const handlePointerUp = useCallback(() => {
    isDragging.current = false;
    if (!isCut) {
      setKnifeX(0); // Snap back
    }
  }, [isCut]);

  return (
    <section
      ref={sectionRef}
      id="section-cake"
      data-snap-section="true"
      className="snap-section relative flex flex-col items-center justify-center bg-transparent overflow-hidden px-6"
    >
      {/* Soft ambient warm candle glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,217,61,0.1)_0%,_rgba(230,57,70,0.05)_40%,_transparent_70%)] pointer-events-none z-[1]" />

      {/* Cake */}
      <div className="relative z-10">
        {/* Candles */}
        <div className="flex justify-center gap-4 mb-1 relative z-10">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex flex-col items-center">
              {/* Flame */}
              <div
                className={`w-2 h-4 bg-gradient-to-t from-candle-gold to-orange-400 rounded-full animate-flicker ${
                  isCut ? "opacity-0 transition-opacity duration-500" : ""
                }`}
                style={{ animationDelay: `${i * 0.1}s` }}
              />
              {/* Candle stick */}
              <div className="w-1.5 h-8 bg-gradient-to-b from-teal-accent to-teal-accent/70 rounded-sm" />
            </div>
          ))}
        </div>

        {/* Cake layers */}
        <div
          className={`flex transition-all duration-700 ${
            isCut ? "gap-4" : "gap-0"
          }`}
        >
          {/* Left half */}
          <div
            className={`transition-transform duration-700 ${
              isCut ? "-translate-x-2 -rotate-3" : ""
            }`}
          >
            {/* Top tier */}
            <div className="w-24 h-10 bg-gradient-to-r from-pink-300 to-rose-red rounded-l-xl border-2 border-r-0 border-pink-200/50">
              <div className="w-full h-2 bg-white/30 rounded-tl-xl" />
            </div>
            {/* Middle tier */}
            <div className="w-32 h-12 bg-gradient-to-r from-pink-400 to-rose-red -ml-4 rounded-l-xl border-2 border-r-0 border-pink-300/50">
              <div className="w-full h-2 bg-white/30 rounded-tl-xl" />
            </div>
            {/* Bottom tier */}
            <div className="w-40 h-14 bg-gradient-to-r from-pink-500 to-red-600 -ml-8 rounded-l-xl border-2 border-r-0 border-pink-400/50">
              <div className="w-full h-2 bg-white/30 rounded-tl-xl" />
            </div>
          </div>

          {/* Right half */}
          <div
            className={`transition-transform duration-700 ${
              isCut ? "translate-x-2 rotate-3" : ""
            }`}
          >
            {/* Top tier */}
            <div className="w-24 h-10 bg-gradient-to-l from-pink-300 to-rose-red rounded-r-xl border-2 border-l-0 border-pink-200/50">
              <div className="w-full h-2 bg-white/30 rounded-tr-xl" />
            </div>
            {/* Middle tier */}
            <div className="w-32 h-12 bg-gradient-to-l from-pink-400 to-rose-red -mr-4 rounded-r-xl border-2 border-l-0 border-pink-300/50">
              <div className="w-full h-2 bg-white/30 rounded-tr-xl" />
            </div>
            {/* Bottom tier */}
            <div className="w-40 h-14 bg-gradient-to-l from-pink-500 to-red-600 -mr-8 rounded-r-xl border-2 border-l-0 border-pink-400/50">
              <div className="w-full h-2 bg-white/30 rounded-tr-xl" />
            </div>
          </div>
        </div>

        {/* Plate */}
        <div className="w-52 md:w-60 h-3 bg-white/20 rounded-full mx-auto mt-1 border border-white/30" />

        {/* Knife drag track */}
        {!isCut && (
          <div className="relative mt-8 w-48 mx-auto" data-no-snap="true">
            {/* Track line */}
            <div className="h-1 bg-white/20 rounded-full" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xs text-white/40 pointer-events-none whitespace-nowrap">
              ◄ Kéo dao qua để cắt ►
            </div>

            {/* Knife handle */}
            <div
              ref={knifeRef}
              data-no-snap="true"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              className="absolute -top-4 left-1/2 cursor-grab active:cursor-grabbing touch-none select-none z-20"
              style={{
                transform: `translateX(calc(-50% + ${knifeX}px))`,
                transition: isDragging.current ? "none" : "transform 0.3s ease",
              }}
            >
              <div className="text-3xl filter drop-shadow-lg transform -rotate-45 hover:scale-110 transition-transform">
                🔪
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Prompt text */}
      <p
        className={`mt-6 text-xl md:text-2xl font-dancing transition-all duration-500 z-10 ${
          isCut
            ? "text-candle-gold text-glow"
            : "text-white/80 animate-pulse-glow"
        }`}
      >
        {isCut
          ? "Chúc em tuổi mới ngọt ngào như chiếc bánh này! 🎂✨"
          : "Kéo dao qua để cắt bánh nhé 🎂"}
      </p>

      {/* Next step indicator */}
      <div className="z-10">
        <ScrollIndicator
          text={isCut ? "Xem bức thư bí mật 💌" : "Cuộn tiếp nhé ↓"}
        />
      </div>
    </section>
  );
}
