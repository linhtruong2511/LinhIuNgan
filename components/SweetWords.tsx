"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BIRTHDAY_CONFIG } from "@/lib/constants";

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
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: wordEl,
              start: "top 80%",
              end: "top 30%",
              scrub: 1,
            },
          }
        );

        // Fade out as user scrolls past
        gsap.to(wordEl, {
          opacity: 0,
          y: -30,
          scrollTrigger: {
            trigger: wordEl,
            start: "bottom 40%",
            end: "bottom 10%",
            scrub: 1,
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Background gradient shifts from blue to blue-red
  const gradients = [
    "from-ocean-blue to-deep-night",
    "from-deep-night to-ocean-blue",
    "from-ocean-blue via-deep-night to-rose-red/20",
    "from-rose-red/20 via-deep-night to-ocean-blue",
  ];

  return (
    <section ref={sectionRef} className="relative">
      {BIRTHDAY_CONFIG.sweetWords.map((word, i) => (
        <div
          key={i}
          ref={(el) => {
            if (el) wordsRef.current[i] = el;
          }}
          className={`h-[70vh] flex items-center justify-center px-8 md:px-16
            bg-gradient-to-b ${gradients[i % gradients.length]}`}
        >
          <p className="text-2xl md:text-4xl lg:text-5xl font-dancing text-white text-center max-w-3xl leading-relaxed text-glow">
            {word}
          </p>
        </div>
      ))}
    </section>
  );
}
