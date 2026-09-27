"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollIndicator from "./ScrollIndicator";

export default function IntroSplash() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.2 });

      tl.fromTo(
        titleRef.current,
        { opacity: 0, scale: 0.5, y: 30 },
        { opacity: 1, scale: 1, y: 0, duration: 1.2, ease: "back.out(1.7)" }
      )
        .fromTo(
          nameRef.current,
          { opacity: 0, scale: 0.9, y: 20 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 1,
            ease: "power2.out",
          },
          "-=0.3"
        )
        .fromTo(
          subtitleRef.current,
          { opacity: 0, y: 20 },
          { opacity: 0.7, y: 0, duration: 0.8, ease: "power2.out" },
          "-=0.3"
        )
        .fromTo(
          indicatorRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.5 },
          "-=0.2"
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="section-intro"
      data-snap-section="true"
      className="snap-section relative flex flex-col items-center justify-center overflow-hidden bg-transparent"
    >
      {/* Soft ambient radial glow - seamless with dark sky, starry particles shine through */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(30,58,95,0.45)_0%,_transparent_70%)] pointer-events-none z-[1]" />

      {/* Content */}
      <div className="relative z-10 text-center px-6">
        <h1
          ref={titleRef}
          className="text-4xl sm:text-5xl md:text-7xl font-dancing text-white text-glow opacity-0 mb-4"
        >
          Hellu
        </h1>
        <h2
          ref={nameRef}
          className="text-2xl sm:text-4xl md:text-6xl font-dancing text-teal-accent text-glow opacity-0 mt-2"
        >
          bạn nhỏ iu dấu của anh ❤️
        </h2>
        <p
          ref={subtitleRef}
          className="text-base md:text-lg text-white/70 mt-8 font-light opacity-0"
        >
          Cuộn xuống để khám phá điều bất ngờ nhé ✨
        </p>
      </div>

      <div ref={indicatorRef} className="opacity-0 z-10">
        <ScrollIndicator text="Cuộn xuống nhé" />
      </div>
    </section>
  );
}
