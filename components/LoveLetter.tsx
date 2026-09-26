"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BIRTHDAY_CONFIG } from "@/lib/constants";

gsap.registerPlugin(ScrollTrigger);

type LetterState = "envelope" | "opening" | "reading";

export default function LoveLetter() {
  const sectionRef = useRef<HTMLElement>(null);
  const [state, setState] = useState<LetterState>("envelope");
  const [visibleLines, setVisibleLines] = useState(0);
  const pinRef = useRef<ScrollTrigger | null>(null);

  const letterLines = BIRTHDAY_CONFIG.letterContent
    .split("\n")
    .filter((line) => line.trim() !== "");

  useEffect(() => {
    const ctx = gsap.context(() => {
      pinRef.current = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "+=200%",
        pin: true,
        pinSpacing: true,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

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
    }, 400);

    return () => clearInterval(interval);
  }, [state, letterLines.length]);

  const handleOpenEnvelope = () => {
    if (state !== "envelope") return;
    setState("opening");

    // After envelope open animation, show letter
    setTimeout(() => {
      setState("reading");
    }, 1200);
  };

  const handleFinishReading = () => {
    pinRef.current?.kill();
    ScrollTrigger.refresh();
  };

  return (
    <section
      ref={sectionRef}
      className="h-screen flex flex-col items-center justify-center bg-gradient-to-b from-rose-red/10 via-deep-night to-ocean-blue/30 relative overflow-hidden px-6"
    >
      {/* Envelope */}
      {state !== "reading" && (
        <div
          className="relative cursor-pointer select-none"
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
        <div className="w-full max-w-lg mx-auto animate-fade-in">
          <div
            className="bg-paper-cream rounded-lg p-6 md:p-8 shadow-2xl max-h-[70vh] overflow-y-auto"
            style={{
              backgroundImage:
                "repeating-linear-gradient(transparent, transparent 27px, #e8d5b7 28px)",
            }}
          >
            {letterLines.map((line, i) => (
              <p
                key={i}
                className={`text-gray-700 font-vibes text-lg md:text-xl leading-[28px] mb-0 transition-opacity duration-500 ${
                  i < visibleLines ? "opacity-100" : "opacity-0"
                }`}
              >
                {line}
              </p>
            ))}
          </div>

          {/* Finish reading button */}
          {visibleLines >= letterLines.length && (
            <button
              onClick={handleFinishReading}
              className="mt-6 mx-auto block px-8 py-3 bg-rose-red text-white font-dancing text-xl
                rounded-full shadow-lg hover:bg-coral transition-colors duration-300
                animate-pulse-glow"
            >
              Đã đọc xong ❤️
            </button>
          )}
        </div>
      )}

      {/* Prompt text */}
      {state === "envelope" && (
        <p className="mt-6 text-xl md:text-2xl font-dancing text-white/80 animate-pulse-glow">
          Có thư cho bạn nè 💌
        </p>
      )}
    </section>
  );
}
