"use client";

import { BIRTHDAY_CONFIG } from "@/lib/constants";

interface SweetWordsSceneProps {
  subStep: number;
}

export default function SweetWordsScene({ subStep }: SweetWordsSceneProps) {
  const currentWord = BIRTHDAY_CONFIG.sweetWords[subStep] || "";

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center text-center px-8 md:px-16 overflow-hidden">
      {/* Ambient starlight glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(78,205,196,0.12)_0%,_transparent_70%)] pointer-events-none" />

      <div className="relative z-10 max-w-3xl px-6">
        <p className="text-2xl md:text-4xl lg:text-5xl font-dancing text-white leading-relaxed text-glow">
          {currentWord}
        </p>
      </div>
    </div>
  );
}
