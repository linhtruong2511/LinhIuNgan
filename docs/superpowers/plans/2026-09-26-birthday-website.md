# Birthday Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a cinematic, scroll-driven single-page birthday website with interactive gift box, cake cutting, love letter, and memory gallery — optimized for mobile.

**Architecture:** Next.js 14 App Router SPA. All 6 sections are client components orchestrated in `page.tsx`. GSAP ScrollTrigger drives scroll animations and pins interactive sections. All personal content lives in `lib/constants.ts` for easy customization.

**Tech Stack:** Next.js 14, TypeScript, GSAP + ScrollTrigger, Framer Motion, Tailwind CSS, canvas-confetti, Vercel deploy.

## Global Constraints

- Next.js 14 with App Router (`app/` directory)
- TypeScript strict mode
- Tailwind CSS v3 with custom theme colors from spec
- All components are client components (`"use client"`) since they use browser APIs
- Mobile-first responsive design (min-width breakpoints)
- All personal content (name, texts, letter, media paths) in `lib/constants.ts`
- GSAP registered plugins: ScrollTrigger (no Draggable — use pointer events for cake cutting)
- Static export compatible (no server-side features needed)

---

### Task 1: Project Scaffolding & Configuration

**Files:**
- Create: `d:\LinhIuNgan\package.json`
- Create: `d:\LinhIuNgan\tsconfig.json`
- Create: `d:\LinhIuNgan\next.config.js`
- Create: `d:\LinhIuNgan\tailwind.config.ts`
- Create: `d:\LinhIuNgan\postcss.config.js`
- Create: `d:\LinhIuNgan\app\globals.css`
- Create: `d:\LinhIuNgan\app\layout.tsx`
- Create: `d:\LinhIuNgan\app\page.tsx` (placeholder)
- Create: `d:\LinhIuNgan\lib\constants.ts`
- Create: `d:\LinhIuNgan\public\images\.gitkeep`
- Create: `d:\LinhIuNgan\public\videos\.gitkeep`
- Create: `d:\LinhIuNgan\public\music\.gitkeep`
- Create: `d:\LinhIuNgan\public\textures\.gitkeep`

**Interfaces:**
- Produces: Next.js app shell running on `localhost:3000`, Tailwind with custom theme, `BIRTHDAY_CONFIG` object exported from `lib/constants.ts`

- [ ] **Step 1: Initialize Next.js project**

Run:
```powershell
cd d:\LinhIuNgan; npx create-next-app@14 . --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*" --use-npm
```

If the directory is not empty, answer "y" to proceed. Expected: project scaffolded with `package.json`, `tsconfig.json`, `app/` directory.

- [ ] **Step 2: Install dependencies**

Run:
```powershell
cd d:\LinhIuNgan; npm install gsap @gsap/react framer-motion canvas-confetti; npm install -D @types/canvas-confetti
```

Expected: packages added to `package.json` dependencies.

- [ ] **Step 3: Configure Tailwind theme with custom colors**

Replace the contents of `d:\LinhIuNgan\tailwind.config.ts` with:

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "deep-night": "#0A1628",
        "ocean-blue": "#1E3A5F",
        "teal-accent": "#4ECDC4",
        "rose-red": "#E63946",
        coral: "#FF6B6B",
        "candle-gold": "#FFD93D",
        "paper-cream": "#FFF8E7",
      },
      fontFamily: {
        dancing: ["Dancing Script", "cursive"],
        vibes: ["Great Vibes", "cursive"],
        sans: ["Inter", "sans-serif"],
      },
      animation: {
        "bounce-slow": "bounce 2s infinite",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
        flicker: "flicker 0.3s ease-in-out infinite alternate",
      },
      keyframes: {
        pulseGlow: {
          "0%, 100%": { opacity: "0.6", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.05)" },
        },
        flicker: {
          "0%": { opacity: "0.8", transform: "scaleY(1) scaleX(1)" },
          "100%": { opacity: "1", transform: "scaleY(1.1) scaleX(0.9)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
```

- [ ] **Step 4: Set up global CSS with custom styles**

Replace the contents of `d:\LinhIuNgan\app\globals.css` with:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@import url("https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&family=Great+Vibes&family=Inter:wght@300;400;500;600&display=swap");

@layer base {
  html {
    scroll-behavior: auto; /* GSAP handles smooth scroll */
  }

  body {
    @apply bg-deep-night text-white overflow-x-hidden;
    -webkit-tap-highlight-color: transparent;
  }

  /* Hide scrollbar for cleaner look */
  body::-webkit-scrollbar {
    display: none;
  }
  body {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
}

@layer utilities {
  .text-glow {
    text-shadow: 0 0 20px rgba(78, 205, 196, 0.5),
      0 0 40px rgba(78, 205, 196, 0.3);
  }

  .text-glow-warm {
    text-shadow: 0 0 20px rgba(230, 57, 70, 0.5),
      0 0 40px rgba(255, 107, 107, 0.3);
  }

  .golden-glow {
    box-shadow: 0 0 30px rgba(255, 217, 61, 0.4),
      0 0 60px rgba(255, 217, 61, 0.2);
  }
}
```

- [ ] **Step 5: Create constants file with all personal content**

Create `d:\LinhIuNgan\lib\constants.ts`:

```typescript
export interface MemoryItem {
  src: string;
  type: "image" | "video";
  caption: string;
}

export const BIRTHDAY_CONFIG = {
  name: "Linh",

  sweetWords: [
    "Có những ngày, chỉ cần nghĩ đến em thôi là đủ vui rồi...",
    "Em là điều tuyệt vời nhất mà anh từng có...",
    "Sinh nhật em, anh muốn tặng em cả thế giới...",
    "Nhưng trước hết, mở quà anh đã nào! 🎁",
  ],

  letterContent: `Gửi Linh yêu dấu,

Hôm nay là ngày đặc biệt nhất trong năm — ngày em được sinh ra trên đời này. Và anh thật may mắn vì được ở bên em, được yêu em, được cùng em đi qua bao nhiêu kỷ niệm đẹp.

Em biết không, mỗi ngày bên em đều là một ngày tuyệt vời. Nụ cười của em, giọng nói của em, cả những lúc em giận dỗi nữa — tất cả đều khiến anh yêu em nhiều hơn.

Anh không giỏi nói những lời hoa mỹ, nhưng anh muốn em biết rằng: em là người quan trọng nhất trong cuộc đời anh. Anh sẽ luôn ở đây, bên em, dù bất cứ điều gì xảy ra.

Chúc em sinh nhật thật vui, thật hạnh phúc. Mong em luôn khỏe mạnh, luôn xinh đẹp, và luôn là em — người mà anh yêu nhất.

Yêu em nhiều lắm ❤️`,

  memories: [
    { src: "/images/photo1.jpg", type: "image" as const, caption: "Lần đầu tiên chúng mình gặp nhau..." },
    { src: "/images/photo2.jpg", type: "image" as const, caption: "Chuyến đi đáng nhớ nhất của mình" },
    { src: "/images/photo3.jpg", type: "image" as const, caption: "Khoảnh khắc anh yêu nhất" },
    { src: "/videos/video1.mp4", type: "video" as const, caption: "Video kỷ niệm của chúng mình" },
    { src: "/images/photo4.jpg", type: "image" as const, caption: "Ngày sinh nhật năm ngoái" },
    { src: "/images/photo5.jpg", type: "image" as const, caption: "Em luôn đẹp nhất khi cười" },
    { src: "/images/photo6.jpg", type: "image" as const, caption: "Yêu em nhiều lắm ❤️" },
    { src: "/videos/video2.mp4", type: "video" as const, caption: "Những khoảnh khắc bên nhau" },
  ],
} as const;
```

- [ ] **Step 6: Set up root layout with fonts and metadata**

Replace the contents of `d:\LinhIuNgan\app\layout.tsx` with:

```tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Happy Birthday Linh ❤️",
  description: "Một điều bất ngờ dành riêng cho em",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
```

- [ ] **Step 7: Create placeholder page**

Replace the contents of `d:\LinhIuNgan\app\page.tsx` with:

```tsx
export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-deep-night">
      <h1 className="text-4xl font-dancing text-teal-accent text-glow">
        Happy Birthday ❤️
      </h1>
    </main>
  );
}
```

- [ ] **Step 8: Create public asset directories**

Run:
```powershell
cd d:\LinhIuNgan; New-Item -ItemType File -Path "public\images\.gitkeep" -Force; New-Item -ItemType File -Path "public\videos\.gitkeep" -Force; New-Item -ItemType File -Path "public\music\.gitkeep" -Force; New-Item -ItemType File -Path "public\textures\.gitkeep" -Force
```

- [ ] **Step 9: Verify dev server starts**

Run:
```powershell
cd d:\LinhIuNgan; npm run dev
```

Expected: Server starts at `http://localhost:3000`, page shows "Happy Birthday ❤️" with teal glow text on dark background. Kill the server after verification.

- [ ] **Step 10: Commit**

Run:
```powershell
cd d:\LinhIuNgan; git add -A; git commit -m "feat: scaffold Next.js project with Tailwind, GSAP, and config"
```

---

### Task 2: Particles Background & Music Player

**Files:**
- Create: `d:\LinhIuNgan\components\ParticlesBg.tsx`
- Create: `d:\LinhIuNgan\components\MusicPlayer.tsx`
- Create: `d:\LinhIuNgan\hooks\useMusicPlayer.ts`

**Interfaces:**
- Consumes: none
- Produces: `<ParticlesBg />` component (renders canvas particles, accepts `particleCount?: number`), `<MusicPlayer />` component (fixed-position toggle button)

- [ ] **Step 1: Create ParticlesBg component**

Create `d:\LinhIuNgan\components\ParticlesBg.tsx`:

```tsx
"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  opacitySpeed: number;
}

interface ParticlesBgProps {
  particleCount?: number;
  className?: string;
}

export default function ParticlesBg({
  particleCount,
  className = "",
}: ParticlesBgProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const isMobile = window.innerWidth < 768;
    const count = particleCount ?? (isMobile ? 50 : 150);

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const particles: Particle[] = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2 + 0.5,
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: (Math.random() - 0.5) * 0.5,
      opacity: Math.random(),
      opacitySpeed: Math.random() * 0.02 + 0.005,
    }));

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particles) {
        p.x += p.speedX;
        p.y += p.speedY;
        p.opacity += p.opacitySpeed;

        if (p.opacity >= 1 || p.opacity <= 0) p.opacitySpeed *= -1;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(78, 205, 196, ${p.opacity * 0.8})`;
        ctx.fill();

        // Glow effect
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(78, 205, 196, ${p.opacity * 0.1})`;
        ctx.fill();
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [particleCount]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-0 ${className}`}
    />
  );
}
```

- [ ] **Step 2: Create useMusicPlayer hook**

Create `d:\LinhIuNgan\hooks\useMusicPlayer.ts`:

```typescript
"use client";

import { useState, useRef, useCallback, useEffect } from "react";

export function useMusicPlayer(src: string) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const audio = new Audio(src);
    audio.loop = true;
    audio.preload = "auto";
    audio.volume = 0.5;

    audio.addEventListener("canplaythrough", () => setIsLoaded(true));
    audio.addEventListener("error", () => setHasError(true));

    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, [src]);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || hasError) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => setIsPlaying(true)).catch(() => {
        // Browser blocked autoplay — user needs to tap again
        setIsPlaying(false);
      });
    }
  }, [isPlaying, hasError]);

  return { isPlaying, isLoaded, hasError, toggle };
}
```

- [ ] **Step 3: Create MusicPlayer component**

Create `d:\LinhIuNgan\components\MusicPlayer.tsx`:

```tsx
"use client";

import { useMusicPlayer } from "@/hooks/useMusicPlayer";

export default function MusicPlayer() {
  const { isPlaying, hasError, toggle } = useMusicPlayer("/music/bgm.mp3");

  return (
    <button
      onClick={toggle}
      disabled={hasError}
      className="fixed top-4 right-4 z-50 w-12 h-12 rounded-full
        bg-deep-night/80 backdrop-blur-sm border border-teal-accent/30
        flex items-center justify-center
        transition-all duration-300 hover:scale-110
        disabled:opacity-30 disabled:cursor-not-allowed"
      aria-label={isPlaying ? "Tắt nhạc" : "Bật nhạc"}
      title={hasError ? "Không thể tải nhạc" : isPlaying ? "Tắt nhạc" : "Bật nhạc"}
    >
      <span className={`text-xl ${isPlaying ? "animate-pulse" : ""}`}>
        {isPlaying ? "🎵" : "🔇"}
      </span>
    </button>
  );
}
```

- [ ] **Step 4: Verify — add components to page and test**

Temporarily update `d:\LinhIuNgan\app\page.tsx`:

```tsx
import ParticlesBg from "@/components/ParticlesBg";
import MusicPlayer from "@/components/MusicPlayer";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-deep-night relative">
      <ParticlesBg />
      <MusicPlayer />
      <h1 className="text-4xl font-dancing text-teal-accent text-glow z-10 relative">
        Happy Birthday ❤️
      </h1>
    </main>
  );
}
```

Run `npm run dev`. Expected: particles floating on dark background, music button in top-right corner. Clicking music button should show 🔇/🎵 toggle (audio won't play without a real .mp3 file but button should respond).

- [ ] **Step 5: Commit**

```powershell
cd d:\LinhIuNgan; git add -A; git commit -m "feat: add ParticlesBg and MusicPlayer components"
```

---

### Task 3: Section 1 — Intro Splash

**Files:**
- Create: `d:\LinhIuNgan\components\IntroSplash.tsx`
- Create: `d:\LinhIuNgan\components\ScrollIndicator.tsx`

**Interfaces:**
- Consumes: `BIRTHDAY_CONFIG.name` from `lib/constants.ts`, `<ParticlesBg />` from Task 2
- Produces: `<IntroSplash />` component (full-viewport intro with auto-play animation sequence), `<ScrollIndicator />` component

- [ ] **Step 1: Create ScrollIndicator component**

Create `d:\LinhIuNgan\components\ScrollIndicator.tsx`:

```tsx
"use client";

export default function ScrollIndicator() {
  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce-slow">
      <span className="text-white/60 text-sm font-light tracking-wide">
        Cuộn xuống nhé
      </span>
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        className="text-teal-accent"
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
```

- [ ] **Step 2: Create IntroSplash component with auto-play animation**

Create `d:\LinhIuNgan\components\IntroSplash.tsx`:

```tsx
"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { BIRTHDAY_CONFIG } from "@/lib/constants";
import ScrollIndicator from "./ScrollIndicator";

export default function IntroSplash() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.5 });

    tl.fromTo(
      titleRef.current,
      { opacity: 0, scale: 0.5, y: 30 },
      { opacity: 1, scale: 1, y: 0, duration: 1.2, ease: "back.out(1.7)" }
    )
      .fromTo(
        nameRef.current,
        { opacity: 0, letterSpacing: "0.5em", y: 20 },
        {
          opacity: 1,
          letterSpacing: "0.15em",
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

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-deep-night via-deep-night to-ocean-blue z-[1]" />

      {/* Content */}
      <div className="relative z-10 text-center px-6">
        <h1
          ref={titleRef}
          className="text-5xl md:text-7xl font-dancing text-white text-glow opacity-0 mb-4"
        >
          Happy Birthday
        </h1>
        <h2
          ref={nameRef}
          className="text-4xl md:text-6xl font-dancing text-teal-accent text-glow opacity-0 mt-2"
        >
          {BIRTHDAY_CONFIG.name}
        </h2>
        <p
          ref={subtitleRef}
          className="text-base md:text-lg text-white/60 mt-8 font-light opacity-0"
        >
          Cuộn xuống để khám phá điều bất ngờ nhé ✨
        </p>
      </div>

      <div ref={indicatorRef} className="opacity-0 z-10">
        <ScrollIndicator />
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Wire IntroSplash into page**

Replace `d:\LinhIuNgan\app\page.tsx` with:

```tsx
import ParticlesBg from "@/components/ParticlesBg";
import MusicPlayer from "@/components/MusicPlayer";
import IntroSplash from "@/components/IntroSplash";

export default function Home() {
  return (
    <main className="relative">
      <ParticlesBg />
      <MusicPlayer />
      <IntroSplash />
      {/* Placeholder for remaining sections */}
      <div className="h-screen bg-ocean-blue flex items-center justify-center">
        <p className="text-white/30 text-xl">More sections coming...</p>
      </div>
    </main>
  );
}
```

- [ ] **Step 4: Verify**

Run `npm run dev`. Expected: Dark background with particles, "Happy Birthday" fades in with scale effect, name appears with letter-spacing animation, subtitle fades in, scroll indicator bounces at bottom.

- [ ] **Step 5: Commit**

```powershell
cd d:\LinhIuNgan; git add -A; git commit -m "feat: add IntroSplash and ScrollIndicator components"
```

---

### Task 4: Section 2 — Sweet Words (Scroll-driven)

**Files:**
- Create: `d:\LinhIuNgan\components\SweetWords.tsx`

**Interfaces:**
- Consumes: `BIRTHDAY_CONFIG.sweetWords` from `lib/constants.ts`, GSAP ScrollTrigger
- Produces: `<SweetWords />` component (scroll-driven text reveals with parallax background)

- [ ] **Step 1: Create SweetWords component**

Create `d:\LinhIuNgan\components\SweetWords.tsx`:

```tsx
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
      wordsRef.current.forEach((wordEl, i) => {
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
```

- [ ] **Step 2: Add SweetWords to page**

Update `d:\LinhIuNgan\app\page.tsx` — add `import SweetWords from "@/components/SweetWords";` and replace the placeholder div after `<IntroSplash />` with `<SweetWords />`:

```tsx
import ParticlesBg from "@/components/ParticlesBg";
import MusicPlayer from "@/components/MusicPlayer";
import IntroSplash from "@/components/IntroSplash";
import SweetWords from "@/components/SweetWords";

export default function Home() {
  return (
    <main className="relative">
      <ParticlesBg />
      <MusicPlayer />
      <IntroSplash />
      <SweetWords />
      {/* Placeholder for remaining sections */}
      <div className="h-screen bg-deep-night" />
    </main>
  );
}
```

- [ ] **Step 3: Verify**

Run `npm run dev`. Expected: After intro, scrolling reveals each sweet word one by one with fade-in and slide-up. Words fade out as you scroll past them. Background gradient subtly shifts.

- [ ] **Step 4: Commit**

```powershell
cd d:\LinhIuNgan; git add -A; git commit -m "feat: add SweetWords scroll-driven section"
```

---

### Task 5: Section 3 — Gift Box (Pin + Tap)

**Files:**
- Create: `d:\LinhIuNgan\components\GiftBox.tsx`

**Interfaces:**
- Consumes: GSAP ScrollTrigger (pin), canvas-confetti
- Produces: `<GiftBox />` component (pinned section with 3D gift box, tap to open, confetti burst, auto-unpin)

- [ ] **Step 1: Create GiftBox component**

Create `d:\LinhIuNgan\components\GiftBox.tsx`:

```tsx
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
```

- [ ] **Step 2: Add GiftBox to page**

Update `d:\LinhIuNgan\app\page.tsx`:

```tsx
import ParticlesBg from "@/components/ParticlesBg";
import MusicPlayer from "@/components/MusicPlayer";
import IntroSplash from "@/components/IntroSplash";
import SweetWords from "@/components/SweetWords";
import GiftBox from "@/components/GiftBox";

export default function Home() {
  return (
    <main className="relative">
      <ParticlesBg />
      <MusicPlayer />
      <IntroSplash />
      <SweetWords />
      <GiftBox />
      {/* Placeholder for remaining sections */}
      <div className="h-screen bg-deep-night" />
    </main>
  );
}
```

- [ ] **Step 3: Verify**

Run `npm run dev`. Expected: After sweet words, scroll pins the gift box section. Tapping the gift box opens the lid (3D flip up), confetti bursts, golden glow appears, text changes to "Surprise! 🎉". After 2s the pin releases and scroll continues.

- [ ] **Step 4: Commit**

```powershell
cd d:\LinhIuNgan; git add -A; git commit -m "feat: add GiftBox pinned section with tap-to-open and confetti"
```

---

### Task 6: Section 4 — Birthday Cake (Pin + Drag to Cut)

**Files:**
- Create: `d:\LinhIuNgan\components\BirthdayCake.tsx`

**Interfaces:**
- Consumes: GSAP ScrollTrigger (pin), canvas-confetti
- Produces: `<BirthdayCake />` component (pinned section with CSS cake, draggable knife, cut animation)

- [ ] **Step 1: Create BirthdayCake component**

Create `d:\LinhIuNgan\components\BirthdayCake.tsx`:

```tsx
"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import confetti from "canvas-confetti";

gsap.registerPlugin(ScrollTrigger);

export default function BirthdayCake() {
  const sectionRef = useRef<HTMLElement>(null);
  const knifeRef = useRef<HTMLDivElement>(null);
  const [isCut, setIsCut] = useState(false);
  const [knifeX, setKnifeX] = useState(0);
  const isDragging = useRef(false);
  const startX = useRef(0);
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

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (isCut) return;
      isDragging.current = true;
      startX.current = e.clientX - knifeX;
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    [knifeX, isCut]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging.current || isCut) return;
      const newX = e.clientX - startX.current;
      setKnifeX(newX);

      // Check if knife crossed the center of the cake (threshold)
      if (Math.abs(newX) > 80) {
        setIsCut(true);
        isDragging.current = false;

        // Sparkle confetti
        confetti({
          particleCount: 60,
          spread: 50,
          origin: { x: 0.5, y: 0.6 },
          colors: ["#FFD93D", "#FF6B6B", "#4ECDC4"],
          scalar: 0.8,
        });

        // Auto-unpin after celebration
        setTimeout(() => {
          pinRef.current?.kill();
          ScrollTrigger.refresh();
        }, 1800);
      }
    },
    [isCut]
  );

  const handlePointerUp = useCallback(() => {
    isDragging.current = false;
    if (!isCut) {
      setKnifeX(0); // Snap back
    }
  }, [isCut]);

  return (
    <section
      ref={sectionRef}
      className="h-screen flex flex-col items-center justify-center bg-gradient-to-b from-deep-night to-rose-red/10 relative overflow-hidden"
    >
      {/* Cake */}
      <div className="relative">
        {/* Candles */}
        <div className="flex justify-center gap-4 mb-1 relative z-10">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex flex-col items-center">
              {/* Flame */}
              <div
                className={`w-2 h-4 bg-gradient-to-t from-candle-gold to-orange-400 rounded-full animate-flicker ${
                  isCut ? "opacity-0 transition-opacity duration-500" : ""
                }`}
                style={{ animationDelay: `${i * 0.1}s` }}
              />
              {/* Candle stick */}
              <div className="w-1.5 h-8 bg-gradient-to-b from-teal-accent to-teal-accent/70 rounded-sm" />
            </div>
          ))}
        </div>

        {/* Cake layers */}
        <div
          className={`flex transition-all duration-700 ${
            isCut ? "gap-4" : "gap-0"
          }`}
        >
          {/* Left half */}
          <div
            className={`transition-transform duration-700 ${
              isCut ? "-translate-x-2 -rotate-3" : ""
            }`}
          >
            {/* Top tier */}
            <div className="w-24 h-10 bg-gradient-to-r from-pink-300 to-rose-red rounded-l-xl border-2 border-r-0 border-pink-200/50">
              <div className="w-full h-2 bg-white/30 rounded-tl-xl" />
            </div>
            {/* Middle tier */}
            <div className="w-32 h-12 bg-gradient-to-r from-pink-400 to-rose-red -ml-4 rounded-l-xl border-2 border-r-0 border-pink-300/50">
              <div className="w-full h-2 bg-white/30 rounded-tl-xl" />
            </div>
            {/* Bottom tier */}
            <div className="w-40 h-14 bg-gradient-to-r from-pink-500 to-red-600 -ml-8 rounded-l-xl border-2 border-r-0 border-pink-400/50">
              <div className="w-full h-2 bg-white/30 rounded-tl-xl" />
            </div>
          </div>

          {/* Right half */}
          <div
            className={`transition-transform duration-700 ${
              isCut ? "translate-x-2 rotate-3" : ""
            }`}
          >
            {/* Top tier */}
            <div className="w-24 h-10 bg-gradient-to-l from-pink-300 to-rose-red rounded-r-xl border-2 border-l-0 border-pink-200/50">
              <div className="w-full h-2 bg-white/30 rounded-tr-xl" />
            </div>
            {/* Middle tier */}
            <div className="w-32 h-12 bg-gradient-to-l from-pink-400 to-rose-red -mr-4 rounded-r-xl border-2 border-l-0 border-pink-300/50">
              <div className="w-full h-2 bg-white/30 rounded-tr-xl" />
            </div>
            {/* Bottom tier */}
            <div className="w-40 h-14 bg-gradient-to-l from-pink-500 to-red-600 -mr-8 rounded-r-xl border-2 border-l-0 border-pink-400/50">
              <div className="w-full h-2 bg-white/30 rounded-tr-xl" />
            </div>
          </div>
        </div>

        {/* Cake plate */}
        <div className="w-80 h-4 bg-gradient-to-b from-gray-200 to-gray-400 rounded-full mx-auto -mt-1 shadow-lg" />
      </div>

      {/* Knife (draggable) */}
      {!isCut && (
        <div
          ref={knifeRef}
          className="mt-8 cursor-grab active:cursor-grabbing touch-none select-none"
          style={{ transform: `translateX(${knifeX}px)` }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        >
          {/* Knife SVG */}
          <svg width="120" height="40" viewBox="0 0 120 40">
            {/* Blade */}
            <path
              d="M0 20 L80 5 L80 35 Z"
              fill="url(#blade)"
              stroke="#ccc"
              strokeWidth="0.5"
            />
            {/* Handle */}
            <rect
              x="78"
              y="8"
              width="40"
              height="24"
              rx="4"
              fill="#8B4513"
              stroke="#654321"
              strokeWidth="1"
            />
            <defs>
              <linearGradient id="blade" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#E8E8E8" />
                <stop offset="50%" stopColor="#D0D0D0" />
                <stop offset="100%" stopColor="#B0B0B0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      )}

      {/* Text */}
      <p
        className={`mt-6 text-xl md:text-2xl font-dancing transition-all duration-500 ${
          isCut ? "text-candle-gold text-glow-warm" : "text-white/80"
        }`}
      >
        {isCut ? "Tuyệt vời! 🎂✨" : "Kéo dao để cắt bánh nào! 🔪"}
      </p>
    </section>
  );
}
```

- [ ] **Step 2: Add BirthdayCake to page**

Update `d:\LinhIuNgan\app\page.tsx`:

```tsx
import ParticlesBg from "@/components/ParticlesBg";
import MusicPlayer from "@/components/MusicPlayer";
import IntroSplash from "@/components/IntroSplash";
import SweetWords from "@/components/SweetWords";
import GiftBox from "@/components/GiftBox";
import BirthdayCake from "@/components/BirthdayCake";

export default function Home() {
  return (
    <main className="relative">
      <ParticlesBg />
      <MusicPlayer />
      <IntroSplash />
      <SweetWords />
      <GiftBox />
      <BirthdayCake />
      {/* Placeholder for remaining sections */}
      <div className="h-screen bg-deep-night" />
    </main>
  );
}
```

- [ ] **Step 3: Verify**

Run `npm run dev`. Expected: After gift box, scroll pins the cake section. A 3-tier cake with candle flames appears. Dragging the knife horizontally past the threshold triggers the cut animation (cake splits in two halves), sparkle confetti fires, candles go out, text changes. After 1.8s the pin releases.

- [ ] **Step 4: Commit**

```powershell
cd d:\LinhIuNgan; git add -A; git commit -m "feat: add BirthdayCake pinned section with drag-to-cut interaction"
```

---

### Task 7: Section 5 — Love Letter (Pin + Tap)

**Files:**
- Create: `d:\LinhIuNgan\components\LoveLetter.tsx`

**Interfaces:**
- Consumes: `BIRTHDAY_CONFIG.name`, `BIRTHDAY_CONFIG.letterContent` from `lib/constants.ts`, GSAP ScrollTrigger (pin)
- Produces: `<LoveLetter />` component (pinned section with envelope, tap to open, letter reveal with typewriter text)

- [ ] **Step 1: Create LoveLetter component**

Create `d:\LinhIuNgan\components\LoveLetter.tsx`:

```tsx
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
```

- [ ] **Step 2: Add a fade-in utility to globals.css**

Append to `d:\LinhIuNgan\app\globals.css`:

```css
@layer utilities {
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .animate-fade-in {
    animation: fadeIn 0.8s ease-out forwards;
  }

  /* Envelope flap 3D rotation helper */
  .rotate-x-180 {
    transform: rotateX(180deg);
  }
}
```

- [ ] **Step 3: Add LoveLetter to page**

Update `d:\LinhIuNgan\app\page.tsx`:

```tsx
import ParticlesBg from "@/components/ParticlesBg";
import MusicPlayer from "@/components/MusicPlayer";
import IntroSplash from "@/components/IntroSplash";
import SweetWords from "@/components/SweetWords";
import GiftBox from "@/components/GiftBox";
import BirthdayCake from "@/components/BirthdayCake";
import LoveLetter from "@/components/LoveLetter";

export default function Home() {
  return (
    <main className="relative">
      <ParticlesBg />
      <MusicPlayer />
      <IntroSplash />
      <SweetWords />
      <GiftBox />
      <BirthdayCake />
      <LoveLetter />
      {/* Placeholder for remaining section */}
      <div className="h-screen bg-deep-night" />
    </main>
  );
}
```

- [ ] **Step 4: Verify**

Run `npm run dev`. Expected: After cake, scroll pins the letter section. An envelope with "Gửi Linh ❤️" appears. Tapping it opens the flap (3D rotation). After 1.2s the letter appears with lined paper background, text reveals line by line (typewriter). After all lines shown, "Đã đọc xong ❤️" button appears. Clicking it unpins and allows scrolling.

- [ ] **Step 5: Commit**

```powershell
cd d:\LinhIuNgan; git add -A; git commit -m "feat: add LoveLetter pinned section with envelope open and typewriter text"
```

---

### Task 8: Section 6 — Memory Gallery + Lightbox

**Files:**
- Create: `d:\LinhIuNgan\components\Lightbox.tsx`
- Create: `d:\LinhIuNgan\components\MemoryGallery.tsx`

**Interfaces:**
- Consumes: `BIRTHDAY_CONFIG.memories`, `BIRTHDAY_CONFIG.name` from `lib/constants.ts`, GSAP ScrollTrigger, canvas-confetti
- Produces: `<MemoryGallery />` component (scroll-driven gallery with polaroid frames scattered around, lightbox overlay)

- [ ] **Step 1: Create Lightbox component**

Create `d:\LinhIuNgan\components\Lightbox.tsx`:

```tsx
"use client";

import { useEffect, useCallback } from "react";
import Image from "next/image";
import { MemoryItem } from "@/lib/constants";

interface LightboxProps {
  item: MemoryItem;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
}

export default function Lightbox({
  item,
  onClose,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
}: LightboxProps) {
  // Close on Escape key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && hasPrev) onPrev();
      if (e.key === "ArrowRight" && hasNext) onNext();
    },
    [onClose, onPrev, onNext, hasPrev, hasNext]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [handleKeyDown]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative max-w-[90vw] max-h-[85vh] flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-white/80 hover:text-white text-3xl z-10"
          aria-label="Đóng"
        >
          ✕
        </button>

        {/* Media */}
        {item.type === "image" ? (
          <div className="relative w-[85vw] h-[60vh] md:w-[70vw] md:h-[65vh]">
            <Image
              src={item.src}
              alt={item.caption}
              fill
              className="object-contain rounded-lg"
              sizes="85vw"
            />
          </div>
        ) : (
          <video
            src={item.src}
            controls
            autoPlay
            className="max-w-[85vw] max-h-[65vh] rounded-lg"
          />
        )}

        {/* Caption */}
        <p className="mt-4 text-white font-dancing text-xl md:text-2xl text-center">
          {item.caption}
        </p>

        {/* Navigation arrows */}
        <div className="flex gap-8 mt-4">
          {hasPrev && (
            <button
              onClick={onPrev}
              className="text-white/60 hover:text-white text-2xl px-4 py-2"
            >
              ← Trước
            </button>
          )}
          {hasNext && (
            <button
              onClick={onNext}
              className="text-white/60 hover:text-white text-2xl px-4 py-2"
            >
              Tiếp →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create MemoryGallery component**

Create `d:\LinhIuNgan\components\MemoryGallery.tsx`:

```tsx
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
                    <Image
                      src={memory.src}
                      alt={memory.caption}
                      fill
                      className="object-cover"
                      sizes="144px"
                    />
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
```

- [ ] **Step 3: Add MemoryGallery to page (final page.tsx)**

Replace `d:\LinhIuNgan\app\page.tsx` with:

```tsx
import ParticlesBg from "@/components/ParticlesBg";
import MusicPlayer from "@/components/MusicPlayer";
import IntroSplash from "@/components/IntroSplash";
import SweetWords from "@/components/SweetWords";
import GiftBox from "@/components/GiftBox";
import BirthdayCake from "@/components/BirthdayCake";
import LoveLetter from "@/components/LoveLetter";
import MemoryGallery from "@/components/MemoryGallery";

export default function Home() {
  return (
    <main className="relative">
      <ParticlesBg />
      <MusicPlayer />
      <IntroSplash />
      <SweetWords />
      <GiftBox />
      <BirthdayCake />
      <LoveLetter />
      <MemoryGallery />
    </main>
  );
}
```

- [ ] **Step 4: Verify**

Run `npm run dev`. Expected: After the letter, scrolling into the gallery section shows a cake emoji at center with polaroid frames scattering outward. Tapping a frame opens the lightbox (image/video + caption, arrow navigation). Scrolling to the end triggers finale confetti burst and "Happy Birthday, Linh ❤️" text.

Note: Images/videos won't load yet (user hasn't added them), but the layout, animations, and lightbox should work with gray placeholders.

- [ ] **Step 5: Commit**

```powershell
cd d:\LinhIuNgan; git add -A; git commit -m "feat: add MemoryGallery with scattered polaroids and Lightbox"
```

---

### Task 9: Final Polish — Next.js Config, Performance, & Error Handling

**Files:**
- Modify: `d:\LinhIuNgan\next.config.js`
- Modify: `d:\LinhIuNgan\app\layout.tsx` (viewport export)
- Modify: `d:\LinhIuNgan\components\MemoryGallery.tsx` (image error handling)

**Interfaces:**
- Consumes: All components from Tasks 1–8
- Produces: Production-ready configuration, image error fallbacks, proper Next.js image config

- [ ] **Step 1: Configure next.config.js for images and videos**

Replace `d:\LinhIuNgan\next.config.js` with:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: false,
    formats: ["image/avif", "image/webp"],
  },
  // Allow video files in public/
  webpack(config) {
    config.module.rules.push({
      test: /\.(mp4|webm)$/,
      type: "asset/resource",
    });
    return config;
  },
};

module.exports = nextConfig;
```

- [ ] **Step 2: Fix viewport metadata export (Next.js 14 requires separate export)**

Update `d:\LinhIuNgan\app\layout.tsx` — the viewport should be a separate export in Next.js 14:

```tsx
import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Happy Birthday Linh ❤️",
  description: "Một điều bất ngờ dành riêng cho em",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
```

- [ ] **Step 3: Add image error fallback to MemoryGallery**

In `d:\LinhIuNgan\components\MemoryGallery.tsx`, update the Image component inside the polaroid frame to handle errors. Find the Image component and wrap it:

Replace the `<Image>` inside the polaroid:
```tsx
<Image
  src={memory.src}
  alt={memory.caption}
  fill
  className="object-cover"
  sizes="144px"
  onError={(e) => {
    const target = e.target as HTMLImageElement;
    target.style.display = "none";
    target.parentElement!.innerHTML =
      '<div class="w-full h-full flex items-center justify-center bg-gray-700 text-2xl">📷</div>';
  }}
/>
```

Similarly update the Image in `Lightbox.tsx`:
```tsx
<Image
  src={item.src}
  alt={item.caption}
  fill
  className="object-contain rounded-lg"
  sizes="85vw"
  onError={(e) => {
    const target = e.target as HTMLImageElement;
    target.style.display = "none";
    target.parentElement!.innerHTML =
      '<div class="w-full h-full flex items-center justify-center bg-gray-800 text-4xl rounded-lg">📷 Ảnh chưa có</div>';
  }}
/>
```

- [ ] **Step 4: Build and verify production build**

Run:
```powershell
cd d:\LinhIuNgan; npm run build
```

Expected: Build succeeds without errors. Check for any TypeScript or ESLint issues and fix them.

- [ ] **Step 5: Commit final polish**

```powershell
cd d:\LinhIuNgan; git add -A; git commit -m "feat: final polish — next config, viewport, image error handling"
```

- [ ] **Step 6: Verify full flow end-to-end**

Run `npm run dev` and walk through the entire flow on Chrome DevTools mobile mode (iPhone 12/14 viewport):

1. ✅ Intro: particles + "Happy Birthday Linh" auto-animation
2. ✅ Sweet Words: 4 texts fade-in/out on scroll
3. ✅ Gift Box: pins, tap opens lid + confetti, unpins
4. ✅ Birthday Cake: pins, drag knife to cut, cake splits + sparkle, unpins
5. ✅ Love Letter: pins, tap envelope → opens → letter typewriter, "Đã đọc xong" → unpins
6. ✅ Memory Gallery: frames scatter outward, tap → lightbox, finale confetti
7. ✅ Music toggle works in top-right corner
8. ✅ No console errors

- [ ] **Step 7: Final commit**

```powershell
cd d:\LinhIuNgan; git add -A; git commit -m "chore: verify full flow end-to-end"
```
