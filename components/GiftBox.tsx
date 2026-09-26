"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import confetti from "canvas-confetti";

gsap.registerPlugin(ScrollTrigger);

export default function GiftBox() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isOpened, setIsOpened] = useState(false);
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

  const handleOpen = () => {
    if (isOpened) return;
    setIsOpened(true);

    // Confetti burst from center
    const rect = sectionRef.current?.getBoundingClientRect();
    if (rect) {
      const x = 0.5;
      const y = (rect.top + rect.height / 2) / window.innerHeight;

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { x, y },
        colors: ["#E63946", "#FFD93D", "#4ECDC4", "#FF6B6B", "#FFF8E7"],
      });

      // Second burst
      setTimeout(() => {
        confetti({
          particleCount: 50,
          spread: 100,
          origin: { x, y: y - 0.1 },
          colors: ["#E63946", "#FFD93D", "#4ECDC4"],
        });
      }, 300);
    }

    // Auto-unpin after animation
    setTimeout(() => {
      pinRef.current?.kill();
      ScrollTrigger.refresh();
    }, 2000);
  };

  return (
    <section
      ref={sectionRef}
      className="h-screen flex flex-col items-center justify-center bg-gradient-to-b from-ocean-blue to-deep-night relative overflow-hidden"
    >
      {/* Golden glow behind box */}
      <div
        className={`absolute w-64 h-64 rounded-full transition-opacity duration-1000 ${
          isOpened
            ? "opacity-100 bg-candle-gold/20 blur-3xl scale-150"
            : "opacity-0"
        }`}
      />

      {/* Gift box */}
      <div
        className="relative cursor-pointer select-none"
        onClick={handleOpen}
        style={{ perspective: "800px" }}
      >
        {/* Box lid */}
        <div
          className={`relative z-10 w-48 h-12 md:w-56 md:h-14 mx-auto
            bg-gradient-to-b from-rose-red to-red-700
            border-2 border-candle-gold/50 rounded-t-lg
            transition-transform duration-700 ease-in-out
            ${isOpened ? "-translate-y-16 -rotate-x-180 opacity-0" : ""}`}
          style={{
            transformOrigin: "top center",
            transformStyle: "preserve-3d",
          }}
        >
          {/* Ribbon on lid */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-full bg-candle-gold/60" />
          </div>
        </div>

        {/* Box body */}
        <div
          className="relative w-48 h-40 md:w-56 md:h-48 mx-auto -mt-1
          bg-gradient-to-b from-rose-red to-red-800
          border-2 border-t-0 border-candle-gold/50 rounded-b-lg"
        >
          {/* Vertical ribbon */}
          <div className="absolute left-1/2 -translate-x-1/2 w-8 h-full bg-candle-gold/60" />
          {/* Horizontal ribbon */}
          <div className="absolute top-1/2 -translate-y-1/2 w-full h-8 bg-candle-gold/60" />
          {/* Bow center */}
          <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-candle-gold rounded-full border-2 border-candle-gold/80 z-20" />
        </div>
      </div>

      {/* Text prompt */}
      <p
        className={`mt-8 text-xl md:text-2xl font-dancing transition-all duration-500 ${
          isOpened
            ? "text-candle-gold text-glow-warm"
            : "text-white/80 animate-pulse-glow"
        }`}
      >
        {isOpened ? "Surprise! 🎉" : "Nhấn để mở quà nhé 🎁"}
      </p>
    </section>
  );
}
