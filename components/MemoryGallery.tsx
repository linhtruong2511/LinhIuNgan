"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import confetti from "canvas-confetti";
import { BIRTHDAY_CONFIG } from "@/lib/constants";
import Lightbox from "./Lightbox";

gsap.registerPlugin(ScrollTrigger);

// Pre-computed scatter positions (angle-based, responsive via %)
const SCATTER_POSITIONS = [
  { x: "-30%", y: "-35%", rotate: -5 },
  { x: "30%", y: "-30%", rotate: 4 },
  { x: "-40%", y: "5%", rotate: -3 },
  { x: "35%", y: "10%", rotate: 6 },
  { x: "-25%", y: "40%", rotate: 3 },
  { x: "25%", y: "45%", rotate: -4 },
  { x: "-10%", y: "-45%", rotate: 2 },
  { x: "10%", y: "50%", rotate: -2 },
];

export default function MemoryGallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const framesRef = useRef<HTMLDivElement[]>([]);
  const endRef = useRef<HTMLDivElement>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [failedImages, setFailedImages] = useState<Record<number, boolean>>({});
  const confettiFired = useRef(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Frames scatter outward on scroll
      framesRef.current.forEach((frame, i) => {
        if (!frame) return;
        const pos = SCATTER_POSITIONS[i % SCATTER_POSITIONS.length];

        gsap.fromTo(
          frame,
          {
            x: 0,
            y: 0,
            rotation: 0,
            scale: 0.3,
            opacity: 0,
          },
          {
            x: pos.x,
            y: pos.y,
            rotation: pos.rotate,
            scale: 1,
            opacity: 1,
            duration: 1,
            ease: "back.out(1.2)",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 60%",
              end: "top 10%",
              scrub: 1,
            },
          }
        );
      });

      // Finale text + confetti
      if (endRef.current) {
        ScrollTrigger.create({
          trigger: endRef.current,
          start: "top 80%",
          onEnter: () => {
            if (confettiFired.current) return;
            confettiFired.current = true;

            // Grand finale confetti
            const duration = 2000;
            const end = Date.now() + duration;
            const interval = setInterval(() => {
              confetti({
                particleCount: 30,
                spread: 60,
                origin: {
                  x: Math.random(),
                  y: Math.random() * 0.3,
                },
                colors: ["#E63946", "#FFD93D", "#4ECDC4", "#FF6B6B"],
              });
              if (Date.now() > end) clearInterval(interval);
            }, 150);
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const memories = BIRTHDAY_CONFIG.memories;

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[150vh] bg-gradient-to-b from-ocean-blue/30 via-deep-night to-deep-night pt-20"
    >
      {/* Gallery scatter area */}
      <div className="sticky top-0 h-screen flex items-center justify-center">
        <div className="relative w-full max-w-2xl h-[80vh] mx-auto">
          {/* Center cake icon */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-6xl z-0">
            🎂
          </div>

          {/* Scattered frames */}
          {memories.map((memory, i) => (
            <div
              key={i}
              ref={(el) => {
                if (el) framesRef.current[i] = el;
              }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                cursor-pointer z-10 transition-transform duration-200 hover:scale-110"
              onClick={() => setLightboxIndex(i)}
            >
              {/* Polaroid frame */}
              <div className="bg-white p-1.5 pb-8 rounded shadow-lg w-28 h-28 md:w-36 md:h-36">
                <div className="relative w-full h-full overflow-hidden rounded-sm bg-gray-200">
                  {memory.type === "image" ? (
                    !failedImages[i] ? (
                      <Image
                        src={memory.src}
                        alt={memory.caption}
                        fill
                        className="object-cover"
                        sizes="144px"
                        onError={() =>
                          setFailedImages((prev) => ({ ...prev, [i]: true }))
                        }
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-700 text-2xl">
                        📷
                      </div>
                    )
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-800">
                      <span className="text-3xl">▶️</span>
                    </div>
                  )}
                </div>
                {/* Caption under polaroid */}
                <p className="absolute bottom-1 left-0 right-0 text-center text-[10px] md:text-xs font-vibes text-gray-600 px-1 truncate">
                  {memory.caption}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Finale text */}
      <div
        ref={endRef}
        className="relative z-10 py-20 flex flex-col items-center justify-center"
      >
        <h2 className="text-4xl md:text-6xl font-dancing text-white text-glow-warm text-center">
          Happy Birthday, {BIRTHDAY_CONFIG.name} ❤️
        </h2>
        <p className="mt-4 text-lg text-white/50 font-light">
          Yêu em mãi mãi ✨
        </p>
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          item={memories[lightboxIndex]}
          onClose={() => setLightboxIndex(null)}
          onPrev={() =>
            setLightboxIndex((prev) =>
              prev !== null && prev > 0 ? prev - 1 : prev
            )
          }
          onNext={() =>
            setLightboxIndex((prev) =>
              prev !== null && prev < memories.length - 1 ? prev + 1 : prev
            )
          }
          hasPrev={lightboxIndex > 0}
          hasNext={lightboxIndex < memories.length - 1}
        />
      )}
    </section>
  );
}
