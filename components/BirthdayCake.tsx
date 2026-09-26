"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import confetti from "canvas-confetti";

gsap.registerPlugin(ScrollTrigger);

export default function BirthdayCake() {
  const sectionRef = useRef<HTMLElement>(null);
  const knifeRef = useRef<HTMLDivElement>(null);
  const [isCut, setIsCut] = useState(false);
  const [knifeX, setKnifeX] = useState(0);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const pinRef = useRef<ScrollTrigger | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      pinRef.current = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "+=100%",
        pin: true,
        pinSpacing: true,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

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

        // Auto-unpin after celebration
        setTimeout(() => {
          pinRef.current?.kill();
          ScrollTrigger.refresh();
        }, 1800);
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
      className="h-screen flex flex-col items-center justify-center bg-gradient-to-b from-deep-night to-rose-red/10 relative overflow-hidden"
    >
      {/* Cake */}
      <div className="relative">
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

        {/* Cake plate */}
        <div className="w-80 h-4 bg-gradient-to-b from-gray-200 to-gray-400 rounded-full mx-auto -mt-1 shadow-lg" />
      </div>

      {/* Knife (draggable) */}
      {!isCut && (
        <div
          ref={knifeRef}
          className="mt-8 cursor-grab active:cursor-grabbing touch-none select-none"
          style={{ transform: `translateX(${knifeX}px)` }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        >
          {/* Knife SVG */}
          <svg width="120" height="40" viewBox="0 0 120 40">
            {/* Blade */}
            <path
              d="M0 20 L80 5 L80 35 Z"
              fill="url(#blade)"
              stroke="#ccc"
              strokeWidth="0.5"
            />
            {/* Handle */}
            <rect
              x="78"
              y="8"
              width="40"
              height="24"
              rx="4"
              fill="#8B4513"
              stroke="#654321"
              strokeWidth="1"
            />
            <defs>
              <linearGradient id="blade" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#E8E8E8" />
                <stop offset="50%" stopColor="#D0D0D0" />
                <stop offset="100%" stopColor="#B0B0B0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      )}

      {/* Text */}
      <p
        className={`mt-6 text-xl md:text-2xl font-dancing transition-all duration-500 ${
          isCut ? "text-candle-gold text-glow-warm" : "text-white/80"
        }`}
      >
        {isCut ? "Tuyệt vời! 🎂✨" : "Kéo dao để cắt bánh nào! 🔪"}
      </p>
    </section>
  );
}
