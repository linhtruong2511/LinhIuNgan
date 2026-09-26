"use client";

import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollToPlugin);

interface ScrollIndicatorProps {
  text?: string;
  onClick?: () => void;
  className?: string;
}

export default function ScrollIndicator({
  text = "Cuộn xuống nhé",
  onClick,
  className = "",
}: ScrollIndicatorProps) {
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (onClick) {
      onClick();
      return;
    }

    const currentSection = e.currentTarget.closest<HTMLElement>(
      "[data-snap-section='true']"
    );
    if (currentSection) {
      const allSections = Array.from(
        document.querySelectorAll<HTMLElement>("[data-snap-section='true']")
      );
      const currentIndex = allSections.indexOf(currentSection);
      if (currentIndex !== -1 && currentIndex < allSections.length - 1) {
        const target = allSections[currentIndex + 1];
        gsap.to(window, {
          scrollTo: { y: target.offsetTop, autoKill: false },
          duration: 0.7,
          ease: "power2.out",
        });
        return;
      }
    }

    window.scrollBy({ top: window.innerHeight, behavior: "smooth" });
  };

  return (
    <div
      onClick={handleClick}
      className={`absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 animate-bounce-slow cursor-pointer select-none group z-20 ${className}`}
    >
      <span className="text-white/60 text-xs md:text-sm font-light tracking-wide group-hover:text-teal-accent transition-colors">
        {text}
      </span>
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        className="text-teal-accent group-hover:scale-110 transition-transform"
      >
        <path
          d="M12 4v16m0 0l-6-6m6 6l6-6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
