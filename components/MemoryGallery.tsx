"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import confetti from "canvas-confetti";
import { BIRTHDAY_CONFIG } from "@/lib/constants";
import Lightbox from "./Lightbox";
import ScrollIndicator from "./ScrollIndicator";

gsap.registerPlugin(ScrollTrigger);

// Pre-computed scatter positions (angle-based, responsive via %)
const SCATTER_POSITIONS = [
  { x: "-28%", y: "-30%", rotate: -5 },
  { x: "28%", y: "-26%", rotate: 4 },
  { x: "-36%", y: "6%", rotate: -3 },
  { x: "32%", y: "12%", rotate: 6 },
  { x: "-22%", y: "36%", rotate: 3 },
  { x: "22%", y: "40%", rotate: -4 },
  { x: "-8%", y: "-38%", rotate: 2 },
  { x: "8%", y: "42%", rotate: -2 },
];

export default function MemoryGallery() {
  const galleryRef = useRef<HTMLElement>(null);
  const finaleRef = useRef<HTMLElement>(null);
  const framesRef = useRef<HTMLDivElement[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [failedImages, setFailedImages] = useState<Record<number, boolean>>({});
  const confettiFired = useRef(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Frames scatter outward on entering gallery
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
            duration: 1.2,
            ease: "back.out(1.4)",
            scrollTrigger: {
              trigger: galleryRef.current,
              start: "top 70%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });

      // Confetti burst on finale screen
      if (finaleRef.current) {
        ScrollTrigger.create({
          trigger: finaleRef.current,
          start: "top 60%",
          onEnter: () => {
            if (confettiFired.current) return;
            confettiFired.current = true;

            confetti({
              particleCount: 120,
              spread: 100,
              origin: { x: 0.5, y: 0.5 },
              colors: [
                "#E63946",
                "#FFD93D",
                "#4ECDC4",
                "#FF6B6B",
                "#FFF8E7",
                "#a855f7",
              ],
            });

            setTimeout(() => {
              confetti({
                particleCount: 80,
                angle: 60,
                spread: 70,
                origin: { x: 0.1, y: 0.6 },
              });
              confetti({
                particleCount: 80,
                angle: 120,
                spread: 70,
                origin: { x: 0.9, y: 0.6 },
              });
            }, 300);
          },
        });
      }
    });

    return () => ctx.revert();
  }, []);

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const memories = BIRTHDAY_CONFIG.memories;

  return (
    <>
      {/* 1. Memory Gallery Screen */}
      <section
        ref={galleryRef}
        id="section-gallery"
        data-snap-section="true"
        className="snap-section relative flex flex-col items-center justify-center bg-transparent overflow-hidden px-4"
      >
        {/* Soft ambient starlight glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(78,205,196,0.1)_0%,_transparent_70%)] pointer-events-none z-[1]" />

        <div className="relative z-10 text-center mb-2">
          <h3 className="text-2xl md:text-3xl font-dancing text-teal-accent text-glow">
            Khoảnh khắc của chúng mình ✨
          </h3>
          <p className="text-xs md:text-sm text-white/60 font-light mt-1">
            Chạm vào ảnh để xem chi tiết nhé
          </p>
        </div>

        {/* Gallery scatter area */}
        <div className="relative w-full max-w-lg h-[65vh] mx-auto flex items-center justify-center">
          {/* Center cake icon */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl md:text-6xl z-0 select-none animate-pulse-glow">
            🎂
          </div>

          {/* Scattered polaroid frames */}
          {memories.map((memory, i) => (
            <div
              key={i}
              ref={(el) => {
                if (el) framesRef.current[i] = el;
              }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                cursor-pointer z-10 transition-transform duration-200 hover:scale-115 hover:z-30"
              onClick={() => setLightboxIndex(i)}
            >
              {/* Polaroid frame */}
              <div className="bg-white p-1.5 pb-6 rounded shadow-xl w-24 h-24 md:w-32 md:h-32 border border-white/80">
                <div className="relative w-full h-full overflow-hidden rounded-sm bg-gray-200">
                  {memory.type === "image" ? (
                    !failedImages[i] ? (
                      <Image
                        src={memory.src}
                        alt={memory.caption}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 96px, 128px"
                        onError={() =>
                          setFailedImages((prev) => ({ ...prev, [i]: true }))
                        }
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-700 text-xl">
                        📷
                      </div>
                    )
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-800">
                      <span className="text-2xl">▶️</span>
                    </div>
                  )}
                </div>
                {/* Caption under polaroid */}
                <p className="absolute bottom-1 left-0 right-0 text-center text-[9px] md:text-[11px] font-vibes text-gray-700 px-1 truncate">
                  {memory.caption}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Scroll prompt to finale */}
        <div className="z-10">
          <ScrollIndicator text="Lời chúc cuối cùng ❤️" />
        </div>
      </section>

      {/* 2. Finale Screen */}
      <section
        ref={finaleRef}
        id="section-finale"
        data-snap-section="true"
        className="snap-section relative flex flex-col items-center justify-center bg-transparent overflow-hidden px-6 text-center"
      >
        {/* Soft ambient warm romantic glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(230,57,70,0.15)_0%,_rgba(255,217,61,0.1)_40%,_transparent_75%)] pointer-events-none z-[1]" />

        <div className="relative z-10 max-w-xl mx-auto space-y-6">
          <div className="text-6xl animate-bounce-slow select-none">
            💖
          </div>
          <h2 className="text-4xl md:text-6xl font-dancing text-white text-glow-warm">
            Happy Birthday, {BIRTHDAY_CONFIG.name}!
          </h2>
          <p className="text-lg md:text-2xl text-teal-accent font-dancing leading-relaxed text-glow">
            Chúc cho mọi ước mơ của em đều trở thành hiện thực ✨
          </p>
          <p className="text-base md:text-lg text-white/70 font-light">
            Yêu em mãi mãi ❤️
          </p>

          <button
            onClick={handleScrollToTop}
            className="mt-8 px-6 py-3 rounded-full bg-deep-night/70 border border-teal-accent/50 text-teal-accent hover:bg-teal-accent/20 hover:scale-105 active:scale-95 transition-all duration-300 font-sans text-sm tracking-wide shadow-lg inline-flex items-center gap-2"
          >
            <span>Quay lại từ đầu</span>
            <span>↺</span>
          </button>
        </div>
      </section>

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
    </>
  );
}
