"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BIRTHDAY_CONFIG } from "@/lib/constants";
import ScrollIndicator from "./ScrollIndicator";

gsap.registerPlugin(ScrollTrigger);

export default function SweetWords() {
  const sectionRef = useRef<HTMLElement>(null);
  const wordsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      wordsRef.current.forEach((wordEl) => {
        if (!wordEl) return;

        gsap.fromTo(
          wordEl,
          { opacity: 0, scale: 0.9, y: 30 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: wordEl,
              start: "top 80%",
              end: "bottom 70%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={sectionRef as any} className="relative">
      {BIRTHDAY_CONFIG.sweetWords.map((word, i) => (
        <section
          key={i}
          id={`section-word-${i}`}
          data-snap-section="true"
          className="snap-section relative flex flex-col items-center justify-center px-8 md:px-16 bg-transparent overflow-hidden"
        >
          {/* Soft ambient radial glow - completely seamless with starry night */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(78,205,196,0.08)_0%,_transparent_70%)] pointer-events-none z-[1]" />

          {/* Word content with animation ref */}
          <div
            ref={(el) => {
              if (el) wordsRef.current[i] = el;
            }}
            className="relative z-10 max-w-3xl text-center px-4"
          >
            <p className="text-2xl md:text-4xl lg:text-5xl font-dancing text-white text-center leading-relaxed text-glow">
              {word}
            </p>
          </div>

          <div className="z-10">
            <ScrollIndicator
              text={
                i === BIRTHDAY_CONFIG.sweetWords.length - 1
                  ? "Mở hộp quà nhé 🎁"
                  : "Cuộn tiếp nhé ✨"
              }
            />
          </div>
        </section>
      ))}
    </div>
  );
}
