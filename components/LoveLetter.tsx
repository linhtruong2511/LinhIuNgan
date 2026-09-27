"use client";

import { useEffect, useRef, useState } from "react";
import { BIRTHDAY_CONFIG } from "@/lib/constants";
import ScrollIndicator from "./ScrollIndicator";

type LetterState = "envelope" | "opening" | "reading";

export default function LoveLetter() {
  const sectionRef = useRef<HTMLElement>(null);
  const [state, setState] = useState<LetterState>("envelope");
  const [visibleLines, setVisibleLines] = useState(0);

  const letterLines = BIRTHDAY_CONFIG.letterContent
    .split("\n")
    .filter((line) => line.trim() !== "");

  useEffect(() => {
    if (state !== "reading") return;

    // Typewriter effect — reveal lines one by one
    let lineIndex = 0;
    const interval = setInterval(() => {
      lineIndex++;
      setVisibleLines(lineIndex);
      if (lineIndex >= letterLines.length) {
        clearInterval(interval);
      }
    }, 350);

    return () => clearInterval(interval);
  }, [state, letterLines.length]);

  const handleOpenEnvelope = () => {
    if (state !== "envelope") return;
    setState("opening");

    // After envelope open animation, show letter
    setTimeout(() => {
      setState("reading");
    }, 1000);
  };

  return (
    <section
      ref={sectionRef}
      id="section-letter"
      data-snap-section="true"
      className="snap-section relative flex flex-col items-center justify-center bg-transparent overflow-hidden px-6"
    >
      {/* Soft ambient romantic rose glow - completely seamless */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(230,57,70,0.12)_0%,_transparent_70%)] pointer-events-none z-[1]" />

      {/* Envelope */}
      {state !== "reading" && (
        <div
          className="relative cursor-pointer select-none z-10"
          onClick={handleOpenEnvelope}
        >
          {/* Envelope body */}
          <div className="relative w-72 h-48 md:w-80 md:h-52 bg-paper-cream rounded-lg shadow-2xl overflow-hidden">
            {/* Inner shadow / paper texture */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-amber-100/50" />

            {/* Heart stamp */}
            <div className="absolute top-3 right-3 w-8 h-8 bg-rose-red rounded-sm flex items-center justify-center">
              <span className="text-white text-sm">❤️</span>
            </div>

            {/* Name on envelope */}
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-xl md:text-2xl font-vibes text-gray-700">
                Gửi {BIRTHDAY_CONFIG.name} ❤️
              </p>
            </div>
          </div>

          {/* Envelope flap */}
          <div
            className={`absolute -top-0.5 left-0 w-full transition-transform duration-700 ease-in-out origin-top ${
              state === "opening" ? "rotate-x-180" : ""
            }`}
            style={{ transformStyle: "preserve-3d" }}
          >
            <div
              className="w-0 h-0 mx-auto"
              style={{
                borderLeft: "144px solid transparent",
                borderRight: "144px solid transparent",
                borderTop: "100px solid #FFF8E7",
                filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
              }}
            />
          </div>
        </div>
      )}

      {/* Letter content */}
      {state === "reading" && (
        <div className="relative z-10 w-full max-w-lg bg-paper-cream/95 text-gray-800 rounded-xl p-6 md:p-8 shadow-2xl backdrop-blur-sm border border-amber-200/50 animate-fade-in max-h-[68vh] overflow-y-auto">
          {/* Paper texture overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-amber-100/30 rounded-xl pointer-events-none" />

          {/* Heart watermark */}
          <div className="absolute top-4 right-4 text-rose-red/20 text-4xl select-none">
            ❤️
          </div>

          <div className="relative z-10 space-y-4">
            {letterLines.slice(0, visibleLines).map((line, i) => (
              <p
                key={i}
                className={`leading-relaxed transition-opacity duration-300 ${
                  i === 0
                    ? "font-vibes text-2xl md:text-3xl text-rose-red mb-4"
                    : i === letterLines.length - 1
                    ? "font-vibes text-xl md:text-2xl text-rose-red text-right mt-6"
                    : "font-sans text-sm md:text-base text-gray-700 font-light"
                }`}
              >
                {line}
              </p>
            ))}
          </div>

          {/* Blinking quill indicator while writing */}
          {visibleLines < letterLines.length && (
            <span className="inline-block animate-pulse text-rose-red ml-1">
              ✏️
            </span>
          )}
        </div>
      )}

      {/* Prompt */}
      {state === "envelope" && (
        <p className="mt-8 text-xl font-dancing text-white/80 animate-pulse-glow z-10">
          Chạm để mở thư nhé 💌
        </p>
      )}

      {/* Next step indicator */}
      <div className="z-10">
        <ScrollIndicator
          text={
            state === "reading" && visibleLines >= letterLines.length
              ? "Xem lại kỷ niệm của chúng mình 📸"
              : "Cuộn tiếp nhé ↓"
          }
        />
      </div>
    </section>
  );
}
