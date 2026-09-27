# Tap Scene Transition & Secret Puzzle Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Chuyển đổi toàn bộ website từ dạng cuộn trang sang dạng chuyển cảnh bằng chạm màn hình (Tap to Advance) với hiệu ứng điện ảnh chuyển động mượt mà (Cinematic Fade & Gentle Float), tích hợp cốt truyện chiếc hộp quà ma thuật (bánh kem nhô lên, cắt bánh, thư tay, ảnh kỷ niệm bay ra lần lượt), mini-game bí mật (Ghép 2 nửa tim + Nhập mã PIN), và cảnh kết thúc bông hoa nở từ từ.

**Architecture:** Xây dựng `SceneManager` điều phối state machine tập trung (`useSceneNavigation`), bọc các cảnh trong `<AnimatePresence mode="wait">` của Framer Motion. Khóa hoàn toàn thuộc tính cuộn (Zero-scroll). Mỗi cảnh độc lập điều khiển trạng thái mở khóa chạm (`canAdvance`), hỗ trợ nút Lùi lại (Back) tinh tế ở góc trên và kết nối với các hiệu ứng tương tác (dao cắt bánh, ghép tim, nhập PIN).

**Tech Stack:** Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Framer Motion, GSAP (nếu cần bổ trợ), Canvas-Confetti.

## Global Constraints

- **Platform**: Next.js 14 App Router, React 18 client components ("use client")
- **Viewport**: 100dvh tràn viền, cố định không cuộn (`overflow: hidden`)
- **Animations**: Sử dụng hardware-accelerated transforms (`transform`, `opacity`, `filter`) của Framer Motion
- **Sound & Ambient**: `MusicPlayer` và `ParticlesBg` nằm ở tầng cố định ngoài `SceneManager`, không bị reset khi chuyển cảnh
- **Configuration**: Mọi văn bản, mã PIN, danh sách kỷ niệm được cấu hình tập trung tại `lib/constants.ts`

---

### Task 1: Cấu hình dữ liệu và CSS khóa cuộn tuyệt đối

**Files:**
- Modify: `lib/constants.ts`
- Modify: `app/globals.css`

**Interfaces:**
- Produces: `BIRTHDAY_CONFIG.secretPin`, `BIRTHDAY_CONFIG.secretPinHint`, `BIRTHDAY_CONFIG.puzzleInstruction`, `BIRTHDAY_CONFIG.finaleFlower`

- [ ] **Step 1: Cập nhật `lib/constants.ts` với cấu hình mã PIN, câu đố và hoa nở**

Bổ sung các trường cấu hình mới vào `BIRTHDAY_CONFIG`:
```ts
export const BIRTHDAY_CONFIG = {
  name: "Bạn nhỏ",

  sweetWords: [
    "Có những ngày, chỉ cần nghĩ đến em thôi là đủ vui rồi...",
    "Em là điều tuyệt vời nhất mà anh từng có...",
    "Sinh nhật em, anh muốn tặng em cả thế giới...",
    "Nhưng trước hết, mở quà anh đã nào! 🎁",
  ],

  letterContent: `Gửi Bạn nhỏ yêu dấu,

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

  // Secret Puzzle & Finale Config
  secretPin: "2002",
  secretPinHint: "Gợi ý: Năm sinh của bạn nhỏ ❤️",
  puzzleInstruction: "Chạm hoặc kéo để ghép 2 nửa trái tim lại với nhau nhé ✨",
  finaleFlower: {
    badge: "Special Birthday Wish",
    title: "Happy Birthday, Bạn nhỏ của anh! 💖",
    subtitle: "Chúc cho mọi ước mơ của em đều nở rộ rực rỡ như đóa hoa này ✨",
    closing: "Yêu em nhiều hơn mỗi ngày ❤️",
  },
} as const;
```

- [ ] **Step 2: Cập nhật `app/globals.css` để khóa triệt để cuộn trang**

Cập nhật quy tắc `html, body` sang `overflow: hidden !important`, `height: 100dvh`, cố định chống kéo nảy trên mobile và thêm animation lắc rung (shake) khi nhập sai PIN:
```css
@layer base {
  html {
    overflow: hidden !important;
    height: 100%;
    height: 100dvh;
    width: 100vw;
  }

  body {
    @apply bg-deep-night text-white;
    overflow: hidden !important;
    height: 100%;
    height: 100dvh;
    width: 100vw;
    position: fixed;
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;
    user-select: none;
    -webkit-user-select: none;
  }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-8px); }
  40%, 80% { transform: translateX(8px); }
}

.animate-shake {
  animation: shake 0.4s ease-in-out;
}
```

- [ ] **Step 3: Kiểm tra biên dịch TypeScript**

Run: `npm run build` hoặc `npx tsc --noEmit`
Expected: Không có lỗi type.

- [ ] **Step 4: Commit thay đổi**

```bash
git add lib/constants.ts app/globals.css
git commit -m "feat: configure secret pin constants and zero-scroll global styles"
```

---

### Task 2: Xây dựng Hook điều hướng cảnh (`useSceneNavigation`) và các nút điều khiển (`BackButton`, `TapIndicator`)

**Files:**
- Create: `hooks/useSceneNavigation.ts`
- Create: `components/BackButton.tsx`
- Create: `components/TapIndicator.tsx`

**Interfaces:**
- Produces: `useSceneNavigation()` returning `{ currentScene, subStep, canAdvance, isPuzzleOpen, isLightboxOpen, nextScene, prevScene, setCanAdvance, openPuzzle, closePuzzle, openLightbox, closeLightbox, restartToBeginning }`
- Produces: `<BackButton />`
- Produces: `<TapIndicator text={...} visible={...} />`

- [ ] **Step 1: Tạo hook `hooks/useSceneNavigation.ts`**

Hook quản lý danh sách cảnh: `intro` -> `sweet_words` -> `gift_and_cake` -> `floating_memories` -> `finale_flower`, kiểm soát `canAdvance` và chặn mọi sự kiện cuộn/bánh xe:
```ts
"use client";

import { useState, useEffect, useCallback, useRef } from "react";

export type SceneId =
  | "intro"
  | "sweet_words"
  | "gift_and_cake"
  | "floating_memories"
  | "finale_flower";

export const SCENE_ORDER: SceneId[] = [
  "intro",
  "sweet_words",
  "gift_and_cake",
  "floating_memories",
  "finale_flower",
];

export function useSceneNavigation() {
  const [currentScene, setCurrentScene] = useState<SceneId>("intro");
  const [subStep, setSubStep] = useState(0);
  const [canAdvance, setCanAdvance] = useState(true);
  const [isPuzzleOpen, setIsPuzzleOpen] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const historyRef = useRef<{ scene: SceneId; subStep: number }[]>([]);

  // Push history before navigating
  const pushHistory = useCallback((scene: SceneId, step: number) => {
    historyRef.current.push({ scene, step });
  }, []);

  const nextScene = useCallback(() => {
    if (!canAdvance || isPuzzleOpen || isLightboxOpen) return;

    if (currentScene === "intro") {
      pushHistory("intro", 0);
      setCurrentScene("sweet_words");
      setSubStep(0);
    } else if (currentScene === "sweet_words") {
      if (subStep < 3) {
        pushHistory("sweet_words", subStep);
        setSubStep((prev) => prev + 1);
      } else {
        pushHistory("sweet_words", subStep);
        setCurrentScene("gift_and_cake");
        setSubStep(0);
        setCanAdvance(false); // Gift requires user interaction first
      }
    } else if (currentScene === "gift_and_cake") {
      pushHistory("gift_and_cake", subStep);
      setCurrentScene("floating_memories");
      setSubStep(0);
    }
  }, [canAdvance, isPuzzleOpen, isLightboxOpen, currentScene, subStep, pushHistory]);

  const prevScene = useCallback(() => {
    if (isPuzzleOpen || isLightboxOpen) return;
    const prev = historyRef.current.pop();
    if (prev) {
      setCurrentScene(prev.scene);
      setSubStep(prev.step);
      setCanAdvance(true);
    }
  }, [isPuzzleOpen, isLightboxOpen]);

  const restartToBeginning = useCallback(() => {
    historyRef.current = [];
    setCurrentScene("intro");
    setSubStep(0);
    setCanAdvance(true);
    setIsPuzzleOpen(false);
    setIsLightboxOpen(false);
  }, []);

  // Intercept wheel, touchmove, key navigation to prevent any window scrolling
  useEffect(() => {
    const preventDefault = (e: Event) => {
      // Don't prevent if inside an element with explicit allow-scroll class
      if (e.target instanceof HTMLElement && e.target.closest("[data-allow-scroll='true']")) {
        return;
      }
      e.preventDefault();
    };

    window.addEventListener("wheel", preventDefault, { passive: false });
    window.addEventListener("touchmove", preventDefault, { passive: false });

    return () => {
      window.removeEventListener("wheel", preventDefault);
      window.removeEventListener("touchmove", preventDefault);
    };
  }, []);

  return {
    currentScene,
    subStep,
    setSubStep,
    canAdvance,
    setCanAdvance,
    isPuzzleOpen,
    setIsPuzzleOpen,
    isLightboxOpen,
    setIsLightboxOpen,
    nextScene,
    prevScene,
    restartToBeginning,
    hasHistory: historyRef.current.length > 0 || currentScene !== "intro",
  };
}
```

- [ ] **Step 2: Tạo component `components/BackButton.tsx`**

Nút quay lại cảnh trước ở góc trên bên trái, chỉ hiển thị từ Cảnh 2 trở đi:
```tsx
"use client";

import { motion } from "framer-motion";

interface BackButtonProps {
  visible: boolean;
  onClick: () => void;
}

export default function BackButton({ visible, onClick }: BackButtonProps) {
  if (!visible) return null;

  return (
    <motion.button
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className="fixed top-4 left-4 z-40 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-deep-night/60 border border-white/15 text-white/70 hover:text-white hover:bg-white/10 backdrop-blur-md text-xs font-light tracking-wide transition-all select-none"
      title="Quay lại cảnh trước"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span>Quay lại</span>
    </motion.button>
  );
}
```

- [ ] **Step 3: Tạo component `components/TapIndicator.tsx`**

Dòng nhắc nhở chạm nhấp nháy êm dịu thay thế cho ScrollIndicator cũ:
```tsx
"use client";

import { motion } from "framer-motion";

interface TapIndicatorProps {
  text?: string;
  visible?: boolean;
}

export default function TapIndicator({
  text = "Chạm vào màn hình để tiếp tục ✨",
  visible = true,
}: TapIndicatorProps) {
  if (!visible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 pointer-events-none select-none z-30"
    >
      <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-deep-night/40 backdrop-blur-sm border border-white/10 text-white/70 text-xs md:text-sm font-light tracking-wider animate-pulse">
        <span>{text}</span>
      </div>
    </motion.div>
  );
}
```

- [ ] **Step 4: Kiểm tra TypeScript và commit**

Run: `npx tsc --noEmit`
Expected: Không có lỗi.

```bash
git add hooks/useSceneNavigation.ts components/BackButton.tsx components/TapIndicator.tsx
git commit -m "feat: add scene navigation hook and back & tap indicator components"
```

---

### Task 3: Xây dựng Cảnh Mở Đầu & Chuỗi Câu Nói Ngọt Ngào (`IntroScene`, `SweetWordsScene`)

**Files:**
- Create: `components/IntroScene.tsx`
- Create: `components/SweetWordsScene.tsx`

**Interfaces:**
- Produces: `<IntroScene />`
- Produces: `<SweetWordsScene subStep={subStep} />`

- [ ] **Step 1: Tạo `components/IntroScene.tsx`**

Hiển thị lời chào mở đầu với hiệu ứng Framer Motion mờ dần (`opacity`) và lướt êm (`y: 20 -> 0`):
```tsx
"use client";

import { motion } from "framer-motion";
import { BIRTHDAY_CONFIG } from "@/lib/constants";

export default function IntroScene() {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center text-center px-6">
      {/* Soft ambient radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(30,58,95,0.5)_0%,_transparent_70%)] pointer-events-none" />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.25, delayChildren: 0.1 },
          },
        }}
        className="relative z-10 space-y-4 max-w-2xl"
      >
        <motion.h1
          variants={{
            hidden: { opacity: 0, y: 25, filter: "blur(6px)" },
            visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 1, ease: "easeOut" } },
          }}
          className="text-4xl sm:text-6xl md:text-7xl font-dancing text-white text-glow"
        >
          Xin chào
        </motion.h1>

        <motion.h2
          variants={{
            hidden: { opacity: 0, y: 25, filter: "blur(6px)" },
            visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 1, ease: "easeOut" } },
          }}
          className="text-2xl sm:text-4xl md:text-6xl font-dancing text-teal-accent text-glow"
        >
          {BIRTHDAY_CONFIG.name} iu dấu của anh ❤️
        </motion.h2>

        <motion.p
          variants={{
            hidden: { opacity: 0, y: 15 },
            visible: { opacity: 0.8, y: 0, transition: { duration: 0.8 } },
          }}
          className="text-sm md:text-base text-white/70 font-light pt-4"
        >
          Một điều bất ngờ dành riêng cho em trong ngày hôm nay... ✨
        </motion.p>
      </motion.div>
    </div>
  );
}
```

- [ ] **Step 2: Tạo `components/SweetWordsScene.tsx`**

Hiển thị 4 câu chữ ngọt ngào, mỗi câu trôi vào mờ ảo rồi rõ nét:
```tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
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

      <AnimatePresence mode="wait">
        <motion.div
          key={subStep}
          initial={{ opacity: 0, y: 30, scale: 0.95, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -20, scale: 1.03, filter: "blur(6px)" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 max-w-3xl px-4"
        >
          <p className="text-2xl md:text-4xl lg:text-5xl font-dancing text-white leading-relaxed text-glow">
            {currentWord}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
```

- [ ] **Step 3: Kiểm tra TypeScript và commit**

```bash
git add components/IntroScene.tsx components/SweetWordsScene.tsx
git commit -m "feat: implement IntroScene and SweetWordsScene with Framer Motion"
```

---

### Task 4: Xây dựng Cảnh Hợp Nhất Hộp Quà Ma Thuật, Bánh Kem & Thư Tình (`GiftAndCakeScene`)

**Files:**
- Create: `components/GiftAndCakeScene.tsx`

**Interfaces:**
- Produces: `<GiftAndCakeScene onComplete={() => void} setCanAdvance={(can: boolean) => void} />`

- [ ] **Step 1: Tạo `components/GiftAndCakeScene.tsx`**

Cảnh này bao gồm 4 giai đoạn con:
1. `box_closed`: Hộp quà ở giữa. Chạm vào mở nắp ➔ Pháo hoa nổ.
2. `cake_ascend`: Bánh kem từ trong hộp trồi lên (`y: 100 -> 0`), hộp quà thu nhỏ xuống dưới làm bệ đỡ. Người dùng kéo dao cắt bánh ➔ Bánh tách đôi, pháo hoa lấp lánh.
3. `box_reappear`: Bánh mờ biến mất, hộp quà đẩy trở lại trung tâm với hint "Vẫn còn một món quà nữa... 🎁".
4. `letter_reveal`: Chạm hộp quà ➔ Phong bì thư bay ra, mở nắp và dòng thư tay viết ra. Viết xong mở khóa chuyển cảnh tiếp theo:
```tsx
"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { BIRTHDAY_CONFIG } from "@/lib/constants";

interface GiftAndCakeSceneProps {
  onComplete: () => void;
  setCanAdvance: (can: boolean) => void;
}

type Stage = "box_closed" | "cake_ascend" | "cake_cut" | "box_return" | "letter_open";

export default function GiftAndCakeScene({ onComplete, setCanAdvance }: GiftAndCakeSceneProps) {
  const [stage, setStage] = useState<Stage>("box_closed");
  const [knifeX, setKnifeX] = useState(0);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const [visibleLines, setVisibleLines] = useState(0);

  const letterLines = BIRTHDAY_CONFIG.letterContent
    .split("\n")
    .filter((line) => line.trim() !== "");

  // Initially lock advance
  useEffect(() => {
    setCanAdvance(false);
  }, [setCanAdvance]);

  // Handle Box Open 1 (Cake emergence)
  const handleOpenBox1 = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (stage !== "box_closed") return;

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { x: 0.5, y: 0.6 },
      colors: ["#E63946", "#FFD93D", "#4ECDC4", "#FF6B6B"],
    });

    setStage("cake_ascend");
  };

  // Handle Knife Drag
  const handlePointerDown = (e: React.PointerEvent) => {
    if (stage !== "cake_ascend") return;
    isDragging.current = true;
    startX.current = e.clientX - knifeX;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current || stage !== "cake_ascend") return;
    const newX = e.clientX - startX.current;
    setKnifeX(newX);

    if (Math.abs(newX) > 70) {
      isDragging.current = false;
      setStage("cake_cut");

      confetti({
        particleCount: 70,
        spread: 60,
        origin: { x: 0.5, y: 0.5 },
        colors: ["#FFD93D", "#FF6B6B", "#4ECDC4"],
      });

      // Transition to box return after cake cut
      setTimeout(() => {
        setStage("box_return");
      }, 2000);
    }
  };

  const handlePointerUp = () => {
    isDragging.current = false;
    if (stage === "cake_ascend") {
      setKnifeX(0);
    }
  };

  // Handle Box Open 2 (Letter emergence)
  const handleOpenBox2 = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (stage !== "box_return") return;

    setStage("letter_open");

    // Typewriter effect
    let lineIdx = 0;
    const interval = setInterval(() => {
      lineIdx++;
      setVisibleLines(lineIdx);
      if (lineIdx >= letterLines.length) {
        clearInterval(interval);
        setCanAdvance(true); // Unlock advance to memories!
      }
    }, 350);
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center px-4 overflow-hidden select-none">
      {/* Ambient background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,217,61,0.12)_0%,_rgba(230,57,70,0.06)_50%,_transparent_70%)] pointer-events-none" />

      {/* 1. STAGE: BOX CLOSED */}
      {stage === "box_closed" && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative z-10 flex flex-col items-center cursor-pointer"
          onClick={handleOpenBox1}
        >
          <div className="w-48 h-40 md:w-56 md:h-48 bg-gradient-to-b from-rose-red to-red-800 rounded-b-xl border-2 border-candle-gold/60 relative shadow-2xl flex items-center justify-center">
            {/* Ribbon */}
            <div className="absolute w-8 h-full bg-candle-gold/70" />
            <div className="absolute h-8 w-full bg-candle-gold/70" />
            <div className="w-12 h-12 bg-candle-gold rounded-full border-2 border-amber-300 z-10 shadow-lg" />
          </div>
          <p className="mt-6 text-xl md:text-2xl font-dancing text-white/90 animate-pulse">
            Chạm để mở hộp quà nhé 🎁
          </p>
        </motion.div>
      )}

      {/* 2 & 3. STAGE: CAKE ASCEND & CAKE CUT */}
      {(stage === "cake_ascend" || stage === "cake_cut") && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 flex flex-col items-center"
        >
          {/* Candles */}
          <div className="flex justify-center gap-4 mb-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex flex-col items-center">
                <div
                  className={`w-2 h-4 bg-gradient-to-t from-candle-gold to-orange-400 rounded-full animate-flicker ${
                    stage === "cake_cut" ? "opacity-0 transition-opacity duration-500" : ""
                  }`}
                />
                <div className="w-1.5 h-7 bg-teal-accent rounded-sm" />
              </div>
            ))}
          </div>

          {/* Cake Layers */}
          <div className={`flex transition-all duration-700 ${stage === "cake_cut" ? "gap-4" : "gap-0"}`}>
            {/* Left */}
            <div className={stage === "cake_cut" ? "-translate-x-2 -rotate-3 transition-transform" : ""}>
              <div className="w-24 h-10 bg-gradient-to-r from-pink-300 to-rose-red rounded-l-xl border-2 border-r-0 border-pink-200" />
              <div className="w-32 h-12 bg-gradient-to-r from-pink-400 to-rose-red -ml-4 rounded-l-xl border-2 border-r-0 border-pink-300" />
              <div className="w-40 h-14 bg-gradient-to-r from-pink-500 to-red-600 -ml-8 rounded-l-xl border-2 border-r-0 border-pink-400" />
            </div>
            {/* Right */}
            <div className={stage === "cake_cut" ? "translate-x-2 rotate-3 transition-transform" : ""}>
              <div className="w-24 h-10 bg-gradient-to-l from-pink-300 to-rose-red rounded-r-xl border-2 border-l-0 border-pink-200" />
              <div className="w-32 h-12 bg-gradient-to-l from-pink-400 to-rose-red -mr-4 rounded-r-xl border-2 border-l-0 border-pink-300" />
              <div className="w-40 h-14 bg-gradient-to-l from-pink-500 to-red-600 -mr-8 rounded-r-xl border-2 border-l-0 border-pink-400" />
            </div>
          </div>

          <div className="w-52 md:w-60 h-3 bg-white/20 rounded-full mx-auto mt-1" />

          {/* Knife Drag Track */}
          {stage === "cake_ascend" && (
            <div className="relative mt-8 w-48 mx-auto">
              <div className="h-1 bg-white/20 rounded-full" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xs text-white/50 pointer-events-none whitespace-nowrap">
                ◄ Kéo dao qua để cắt bánh ►
              </div>
              <div
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                className="absolute -top-4 left-1/2 cursor-grab active:cursor-grabbing touch-none select-none z-20"
                style={{ transform: `translateX(calc(-50% + ${knifeX}px))` }}
              >
                <span className="text-3xl filter drop-shadow">🔪</span>
              </div>
            </div>
          )}

          <p className="mt-6 text-xl md:text-2xl font-dancing text-candle-gold text-glow">
            {stage === "cake_cut"
              ? "Chúc em tuổi mới ngọt ngào như chiếc bánh này! 🎂✨"
              : "Kéo dao qua để cắt bánh nhé 🎂"}
          </p>

          {/* Scaled-down box as base underneath */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6, scale: 0.65 }}
            className="w-40 h-24 bg-red-900/60 rounded-b-xl border border-candle-gold/40 mt-4"
          />
        </motion.div>
      )}

      {/* 4. STAGE: BOX RETURN */}
      {stage === "box_return" && (
        <motion.div
          initial={{ scale: 0.7, y: 50, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 180, damping: 14 }}
          className="relative z-10 flex flex-col items-center cursor-pointer"
          onClick={handleOpenBox2}
        >
          <div className="w-48 h-40 md:w-56 md:h-48 bg-gradient-to-b from-rose-red to-red-800 rounded-b-xl border-2 border-candle-gold/60 relative shadow-2xl flex items-center justify-center">
            <div className="absolute w-8 h-full bg-candle-gold/70" />
            <div className="absolute h-8 w-full bg-candle-gold/70" />
            <div className="w-12 h-12 bg-candle-gold rounded-full border-2 border-amber-300 z-10 shadow-lg" />
          </div>
          <p className="mt-6 text-xl md:text-2xl font-dancing text-candle-gold text-glow animate-pulse">
            Vẫn còn một điều bất ngờ nữa trong hộp... 🎁
          </p>
          <span className="text-xs text-white/60 font-light mt-1">Chạm để mở nốt nhé</span>
        </motion.div>
      )}

      {/* 5. STAGE: LETTER OPEN */}
      {stage === "letter_open" && (
        <motion.div
          initial={{ scale: 0.85, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 w-full max-w-lg bg-paper-cream/95 text-gray-800 rounded-xl p-6 md:p-8 shadow-2xl border border-amber-200/60 max-h-[70vh] overflow-y-auto"
          data-allow-scroll="true"
        >
          <div className="space-y-4 font-light">
            {letterLines.slice(0, visibleLines).map((line, i) => (
              <p
                key={i}
                className={`leading-relaxed ${
                  i === 0
                    ? "font-vibes text-2xl md:text-3xl text-rose-red mb-4"
                    : i === letterLines.length - 1
                    ? "font-vibes text-xl md:text-2xl text-rose-red text-right mt-6"
                    : "font-sans text-sm md:text-base text-gray-700"
                }`}
              >
                {line}
              </p>
            ))}
            {visibleLines < letterLines.length && (
              <span className="inline-block animate-pulse text-rose-red ml-1">✏️</span>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Kiểm tra TypeScript và commit**

```bash
git add components/GiftAndCakeScene.tsx
git commit -m "feat: implement unified GiftAndCakeScene with ascending cake, cutting and love letter"
```

---

### Task 5: Xây dựng Cảnh Ảnh Kỷ Niệm Bay Ra Từ Hộp Quà & Khám Phá Ẩn (`FloatingMemoriesScene`)

**Files:**
- Create: `components/FloatingMemoriesScene.tsx`

**Interfaces:**
- Produces: `<FloatingMemoriesScene onOpenLightbox={(index: number) => void} onOpenPuzzle={() => void} />`

- [ ] **Step 1: Tạo `components/FloatingMemoriesScene.tsx`**

Các ảnh polaroid bay ra tuần tự từ tâm hộp quà, sau đó trôi nổi tự nhiên. Ở giữa có điểm khám phá ẩn nhấp nháy:
```tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { BIRTHDAY_CONFIG } from "@/lib/constants";

interface FloatingMemoriesSceneProps {
  onOpenLightbox: (index: number) => void;
  onOpenPuzzle: () => void;
}

// 8 responsive scatter positions around the screen
const SCATTER_DESTINATIONS = [
  { x: "-28vw", y: "-24vh", rotate: -6 },
  { x: "28vw", y: "-22vh", rotate: 5 },
  { x: "-32vw", y: "6vh", rotate: -4 },
  { x: "32vw", y: "8vh", rotate: 6 },
  { x: "-20vw", y: "30vh", rotate: 4 },
  { x: "20vw", y: "32vh", rotate: -5 },
  { x: "-8vw", y: "-30vh", rotate: 3 },
  { x: "8vw", y: "32vh", rotate: -2 },
];

export default function FloatingMemoriesScene({
  onOpenLightbox,
  onOpenPuzzle,
}: FloatingMemoriesSceneProps) {
  const [failedImages, setFailedImages] = useState<Record<number, boolean>>({});
  const memories = BIRTHDAY_CONFIG.memories;

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(78,205,196,0.12)_0%,_transparent_70%)] pointer-events-none" />

      {/* Center Gift Box Base from which photos emerged */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 0.75, opacity: 0.7 }}
        className="absolute w-36 h-28 bg-gradient-to-b from-rose-red to-red-900 rounded-b-xl border border-candle-gold/40 flex items-center justify-center shadow-xl select-none"
      >
        <span className="text-3xl animate-bounce-slow">🎁</span>
      </motion.div>

      {/* Secret Crystal Orb (Easter Egg) Floating near center */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.8, 1, 0.8],
          boxShadow: [
            "0 0 15px rgba(255,217,61,0.5)",
            "0 0 30px rgba(255,107,107,0.8)",
            "0 0 15px rgba(255,217,61,0.5)",
          ],
        }}
        transition={{
          delay: 3.5,
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        onClick={(e) => {
          e.stopPropagation();
          onOpenPuzzle();
        }}
        className="absolute z-30 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-rose-red to-amber-500 border border-white/60 text-white text-xs font-medium tracking-wide flex items-center gap-1.5 shadow-2xl cursor-pointer hover:scale-110 active:scale-95 transition-transform"
      >
        <span>💖</span>
        <span>Mở điều bí mật</span>
      </motion.button>

      {/* Floating Polaroids flying out one by one */}
      {memories.map((memory, i) => {
        const dest = SCATTER_DESTINATIONS[i % SCATTER_DESTINATIONS.length];

        return (
          <motion.div
            key={i}
            initial={{ x: 0, y: 0, scale: 0.1, opacity: 0, rotate: 0 }}
            animate={{
              x: dest.x,
              y: [dest.y, `calc(${dest.y} + 8px)`, dest.y],
              scale: 1,
              opacity: 1,
              rotate: dest.rotate,
            }}
            transition={{
              x: { duration: 1.2, delay: 0.3 * i, ease: [0.22, 1, 0.36, 1] },
              scale: { duration: 1.2, delay: 0.3 * i, ease: [0.22, 1, 0.36, 1] },
              opacity: { duration: 0.8, delay: 0.3 * i },
              rotate: { duration: 1.2, delay: 0.3 * i },
              y: {
                duration: 3 + (i % 3),
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1.2 + 0.3 * i,
              },
            }}
            whileHover={{ scale: 1.15, zIndex: 40 }}
            className="absolute z-20 cursor-pointer select-none"
            onClick={(e) => {
              e.stopPropagation();
              onOpenLightbox(i);
            }}
          >
            <div className="bg-white p-1.5 pb-5 rounded shadow-2xl w-24 h-24 md:w-32 md:h-32 border border-white/80">
              <div className="relative w-full h-full overflow-hidden rounded-sm bg-gray-800">
                {memory.type === "image" ? (
                  !failedImages[i] ? (
                    <Image
                      src={memory.src}
                      alt={memory.caption}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 96px, 128px"
                      onError={() => setFailedImages((prev) => ({ ...prev, [i]: true }))}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-700 text-lg">
                      📷
                    </div>
                  )
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-900">
                    <span className="text-xl">▶️</span>
                  </div>
                )}
              </div>
              <p className="absolute bottom-1 left-0 right-0 text-center text-[9px] md:text-[11px] font-vibes text-gray-700 px-1 truncate">
                {memory.caption}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 2: Kiểm tra TypeScript và commit**

```bash
git add components/FloatingMemoriesScene.tsx
git commit -m "feat: implement FloatingMemoriesScene with staggered emergence from box and secret orb"
```

---

### Task 6: Xây dựng Modal Thử Thách Bí Mật - Ghép Tim & Nhập Mã PIN (`SecretPuzzleModal`)

**Files:**
- Create: `components/SecretPuzzleModal.tsx`

**Interfaces:**
- Produces: `<SecretPuzzleModal isOpen={boolean} onClose={() => void} onSuccess={() => void} />`

- [ ] **Step 1: Tạo `components/SecretPuzzleModal.tsx`**

Thực hiện 2 giai đoạn:
1. Ghép 2 nửa trái tim (kéo hoặc chạm để hai mảnh tim trượt vào nhau khớp khít).
2. Khi ghép xong, mở bàn phím số nhập 4 số PIN. Nhập sai rung lắc (`animate-shake`); nhập đúng gọi `onSuccess()`:
```tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { BIRTHDAY_CONFIG } from "@/lib/constants";

interface SecretPuzzleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function SecretPuzzleModal({
  isOpen,
  onClose,
  onSuccess,
}: SecretPuzzleModalProps) {
  const [step, setStep] = useState<"match_heart" | "enter_pin">("match_heart");
  const [isHeartMatched, setIsHeartMatched] = useState(false);
  const [pin, setPin] = useState("");
  const [isError, setIsError] = useState(false);

  if (!isOpen) return null;

  // Handle Heart Match
  const handleSnapHearts = () => {
    if (isHeartMatched) return;
    setIsHeartMatched(true);

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { x: 0.5, y: 0.45 },
      colors: ["#FF6B6B", "#FFD93D", "#4ECDC4"],
    });

    setTimeout(() => {
      setStep("enter_pin");
    }, 900);
  };

  // Handle PIN Keypad
  const handleKeyPress = (digit: string) => {
    if (pin.length >= 4) return;
    const nextPin = pin + digit;
    setPin(nextPin);
    setIsError(false);

    if (nextPin.length === 4) {
      if (nextPin === BIRTHDAY_CONFIG.secretPin) {
        // Success!
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { x: 0.5, y: 0.5 },
          colors: ["#E63946", "#FFD93D", "#4ECDC4", "#FFF8E7"],
        });
        setTimeout(() => {
          onSuccess();
        }, 800);
      } else {
        // Error
        setTimeout(() => {
          setIsError(true);
          setPin("");
        }, 200);
      }
    }
  };

  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1));
    setIsError(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md px-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-sm bg-deep-night/95 border border-white/20 rounded-2xl p-6 shadow-2xl flex flex-col items-center text-center select-none"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-white/50 hover:text-white text-lg p-1"
        >
          ✕
        </button>

        {/* STEP 1: MATCH 2 HEART HALVES */}
        {step === "match_heart" && (
          <div className="flex flex-col items-center py-4">
            <h3 className="text-xl font-dancing text-teal-accent text-glow mb-2">
              Thử Thách Tình Yêu ✨
            </h3>
            <p className="text-xs text-white/70 mb-8 max-w-xs font-light">
              {BIRTHDAY_CONFIG.puzzleInstruction}
            </p>

            <div
              className="relative w-48 h-32 flex items-center justify-center cursor-pointer"
              onClick={handleSnapHearts}
            >
              {/* Left Half */}
              <motion.div
                animate={{
                  x: isHeartMatched ? 0 : -35,
                  rotate: isHeartMatched ? 0 : -10,
                }}
                transition={{ duration: 0.6, type: "spring" }}
                className="w-16 h-24 bg-gradient-to-br from-pink-500 to-rose-red rounded-tl-full rounded-bl-full shadow-lg"
              />

              {/* Right Half */}
              <motion.div
                animate={{
                  x: isHeartMatched ? 0 : 35,
                  rotate: isHeartMatched ? 0 : 10,
                }}
                transition={{ duration: 0.6, type: "spring" }}
                className="w-16 h-24 bg-gradient-to-bl from-rose-red to-red-700 rounded-tr-full rounded-br-full shadow-lg"
              />
            </div>

            <p className="mt-8 text-xs text-white/50 animate-pulse font-light">
              {isHeartMatched ? "Trái tim đã hòa làm một ❤️" : "Chạm để gắn kết 2 mảnh tim"}
            </p>
          </div>
        )}

        {/* STEP 2: ENTER PIN */}
        {step === "enter_pin" && (
          <div className="flex flex-col items-center py-2 w-full">
            <h3 className="text-xl font-dancing text-candle-gold text-glow mb-1">
              Mã Khóa Trái Tim 🔐
            </h3>
            <p className="text-xs text-teal-accent/90 mb-6 font-light">
              {BIRTHDAY_CONFIG.secretPinHint}
            </p>

            {/* 4 PIN Dots */}
            <div
              className={`flex justify-center gap-4 mb-6 ${
                isError ? "animate-shake text-rose-red" : ""
              }`}
            >
              {[0, 1, 2, 3].map((idx) => (
                <div
                  key={idx}
                  className={`w-3.5 h-3.5 rounded-full border border-white/40 transition-all ${
                    pin.length > idx
                      ? isError
                        ? "bg-rose-red border-rose-red scale-110"
                        : "bg-candle-gold border-candle-gold scale-110 shadow-[0_0_10px_#FFD93D]"
                      : "bg-transparent"
                  }`}
                />
              ))}
            </div>

            {/* Numeric Keypad */}
            <div className="grid grid-cols-3 gap-3 w-full max-w-xs">
              {["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "del"].map(
                (btn, i) => {
                  if (btn === "") return <div key={i} />;
                  if (btn === "del") {
                    return (
                      <button
                        key={i}
                        onClick={handleDelete}
                        className="h-12 rounded-xl bg-white/5 hover:bg-white/10 active:scale-95 text-xs text-white/70 flex items-center justify-center transition-all"
                      >
                        Xóa
                      </button>
                    );
                  }
                  return (
                    <button
                      key={i}
                      onClick={() => handleKeyPress(btn)}
                      className="h-12 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-lg font-light text-white flex items-center justify-center transition-all border border-white/10"
                    >
                      {btn}
                    </button>
                  );
                }
              )}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
```

- [ ] **Step 2: Kiểm tra TypeScript và commit**

```bash
git add components/SecretPuzzleModal.tsx
git commit -m "feat: implement SecretPuzzleModal with heart match and numeric PIN keypad"
```

---

### Task 7: Xây dựng Cảnh Kết Thúc - Bông Hoa Nở & Lời Chúc Cuối (`FinaleFlowerScene`)

**Files:**
- Create: `components/FinaleFlowerScene.tsx`

**Interfaces:**
- Produces: `<FinaleFlowerScene onRestart={() => void} />`

- [ ] **Step 1: Tạo `components/FinaleFlowerScene.tsx`**

Bông hoa SVG hữu cơ nhiều tầng cánh hoa nở bung dần theo thời gian thực (duration 3.5s), phát sáng nhụy vàng, kèm chữ chúc thiêng liêng và pháo hoa:
```tsx
"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { BIRTHDAY_CONFIG } from "@/lib/constants";

interface FinaleFlowerSceneProps {
  onRestart: () => void;
}

export default function FinaleFlowerScene({ onRestart }: FinaleFlowerSceneProps) {
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;

    // Grand confetti salute
    confetti({
      particleCount: 120,
      spread: 100,
      origin: { x: 0.5, y: 0.4 },
      colors: ["#E63946", "#FFD93D", "#4ECDC4", "#FF6B6B", "#FFF8E7", "#A855F7"],
    });

    setTimeout(() => {
      confetti({
        particleCount: 80,
        angle: 60,
        spread: 70,
        origin: { x: 0.1, y: 0.5 },
      });
      confetti({
        particleCount: 80,
        angle: 120,
        spread: 70,
        origin: { x: 0.9, y: 0.5 },
      });
    }, 400);
  }, []);

  const { badge, title, subtitle, closing } = BIRTHDAY_CONFIG.finaleFlower;

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center text-center px-6 overflow-hidden select-none">
      {/* Soft warm romantic bloom background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(230,57,70,0.18)_0%,_rgba(255,217,61,0.1)_40%,_transparent_75%)] pointer-events-none" />

      {/* SVG ORGANIC BLOOMING FLOWER */}
      <div className="relative w-44 h-44 md:w-56 md:h-56 mb-4 flex items-center justify-center">
        {/* Glowing aura */}
        <motion.div
          initial={{ scale: 0.2, opacity: 0 }}
          animate={{ scale: 1.5, opacity: 0.5 }}
          transition={{ duration: 3.5, ease: "easeOut" }}
          className="absolute inset-0 bg-candle-gold/20 rounded-full blur-2xl pointer-events-none"
        />

        <svg viewBox="0 0 200 200" className="w-full h-full filter drop-shadow-xl">
          <defs>
            <radialGradient id="flowerCenter" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFF8E7" />
              <stop offset="60%" stopColor="#FFD93D" />
              <stop offset="100%" stopColor="#F59E0B" />
            </radialGradient>
            <linearGradient id="petalGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FDA4AF" />
              <stop offset="100%" stopColor="#E11D48" />
            </linearGradient>
            <linearGradient id="petalGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F472B6" />
              <stop offset="100%" stopColor="#BE185D" />
            </linearGradient>
          </defs>

          {/* Layer 1: Outer Petals (8 petals) */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, idx) => (
            <motion.path
              key={`outer-${idx}`}
              d="M100,100 C80,40 120,40 100,15 C80,40 120,40 100,100 Z"
              fill="url(#petalGrad1)"
              opacity="0.9"
              transform={`rotate(${angle} 100 100)`}
              initial={{ scale: 0.1, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.9 }}
              transition={{ duration: 3, delay: 0.1 * idx, ease: "easeOut" }}
              style={{ transformOrigin: "100px 100px" }}
            />
          ))}

          {/* Layer 2: Inner Petals (8 petals offset by 22.5 deg) */}
          {[22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map((angle, idx) => (
            <motion.path
              key={`inner-${idx}`}
              d="M100,100 C85,50 115,50 100,28 C85,50 115,50 100,100 Z"
              fill="url(#petalGrad2)"
              opacity="0.95"
              transform={`rotate(${angle} 100 100)`}
              initial={{ scale: 0.1, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.95 }}
              transition={{ duration: 2.8, delay: 0.5 + 0.08 * idx, ease: "easeOut" }}
              style={{ transformOrigin: "100px 100px" }}
            />
          ))}

          {/* Glowing Center Pistil */}
          <motion.circle
            cx="100"
            cy="100"
            r="16"
            fill="url(#flowerCenter)"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 2, delay: 1 }}
            style={{ transformOrigin: "100px 100px" }}
          />
        </svg>
      </div>

      {/* Grand Birthday Message */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.3, delayChildren: 1.5 },
          },
        }}
        className="relative z-10 max-w-xl mx-auto space-y-3"
      >
        <motion.p
          variants={{
            hidden: { opacity: 0, y: 15 },
            visible: { opacity: 0.7, y: 0 },
          }}
          className="text-xs uppercase tracking-widest text-teal-accent"
        >
          {badge}
        </motion.p>

        <motion.h2
          variants={{
            hidden: { opacity: 0, y: 20, filter: "blur(6px)" },
            visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 1 } },
          }}
          className="text-3xl md:text-5xl font-dancing text-white text-glow-warm"
        >
          {title}
        </motion.h2>

        <motion.p
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 1 } },
          }}
          className="text-lg md:text-2xl text-teal-accent font-dancing leading-relaxed text-glow"
        >
          {subtitle}
        </motion.p>

        <motion.p
          variants={{
            hidden: { opacity: 0, y: 15 },
            visible: { opacity: 0.8, y: 0 },
          }}
          className="text-sm md:text-base text-white/70 font-light"
        >
          {closing}
        </motion.p>

        {/* Restart Button */}
        <motion.div
          variants={{
            hidden: { opacity: 0, scale: 0.8 },
            visible: { opacity: 1, scale: 1 },
          }}
          className="pt-4"
        >
          <button
            onClick={onRestart}
            className="px-6 py-2.5 rounded-full bg-deep-night/70 border border-teal-accent/50 text-teal-accent hover:bg-teal-accent/20 hover:scale-105 active:scale-95 transition-all text-xs md:text-sm tracking-wide shadow-lg inline-flex items-center gap-2 cursor-pointer"
          >
            <span>Quay lại từ đầu</span>
            <span>↺</span>
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
```

- [ ] **Step 2: Kiểm tra TypeScript và commit**

```bash
git add components/FinaleFlowerScene.tsx
git commit -m "feat: implement FinaleFlowerScene with organic SVG blooming flower and heartfelt wishes"
```

---

### Task 8: Tích hợp `SceneManager`, thay thế `app/page.tsx` và dọn dẹp

**Files:**
- Create: `components/SceneManager.tsx`
- Modify: `app/page.tsx`

**Interfaces:**
- Produces: `<SceneManager />` coordinating all scenes, Lightbox, SecretPuzzleModal, BackButton, and TapIndicator

- [ ] **Step 1: Tạo `components/SceneManager.tsx`**

Điều phối toàn bộ ứng dụng bằng `AnimatePresence mode="wait"`:
```tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSceneNavigation } from "@/hooks/useSceneNavigation";
import BackButton from "./BackButton";
import TapIndicator from "./TapIndicator";
import IntroScene from "./IntroScene";
import SweetWordsScene from "./SweetWordsScene";
import GiftAndCakeScene from "./GiftAndCakeScene";
import FloatingMemoriesScene from "./FloatingMemoriesScene";
import FinaleFlowerScene from "./FinaleFlowerScene";
import SecretPuzzleModal from "./SecretPuzzleModal";
import Lightbox from "./Lightbox";
import { BIRTHDAY_CONFIG } from "@/lib/constants";

export default function SceneManager() {
  const {
    currentScene,
    subStep,
    canAdvance,
    setCanAdvance,
    isPuzzleOpen,
    setIsPuzzleOpen,
    isLightboxOpen,
    setIsLightboxOpen,
    nextScene,
    prevScene,
    restartToBeginning,
    hasHistory,
  } = useSceneNavigation();

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const handleOpenLightbox = (index: number) => {
    setLightboxIndex(index);
    setIsLightboxOpen(true);
  };

  const handleCloseLightbox = () => {
    setLightboxIndex(null);
    setIsLightboxOpen(false);
  };

  const handlePuzzleSuccess = () => {
    setIsPuzzleOpen(false);
    // Transition straight to finale flower!
    // We achieve this by dispatching to finale_flower
    setCanAdvance(true);
    // Directly advance to finale
    window.dispatchEvent(new CustomEvent("go-to-finale"));
  };

  return (
    <div
      className="relative w-full h-[100dvh] overflow-hidden select-none cursor-pointer"
      onClick={nextScene}
    >
      {/* Back Button (top-left) */}
      <BackButton visible={hasHistory && currentScene !== "finale_flower"} onClick={prevScene} />

      {/* Tap Indicator (bottom) */}
      <TapIndicator
        visible={
          canAdvance &&
          !isPuzzleOpen &&
          !isLightboxOpen &&
          currentScene !== "finale_flower"
        }
      />

      {/* Main Scene Transitions */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${currentScene}-${currentScene === "sweet_words" ? subStep : ""}`}
          initial={{ opacity: 0, scale: 0.97, filter: "blur(6px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, scale: 1.03, filter: "blur(6px)" }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="w-full h-full"
        >
          {currentScene === "intro" && <IntroScene />}
          {currentScene === "sweet_words" && <SweetWordsScene subStep={subStep} />}
          {currentScene === "gift_and_cake" && (
            <GiftAndCakeScene
              onComplete={nextScene}
              setCanAdvance={setCanAdvance}
            />
          )}
          {currentScene === "floating_memories" && (
            <FloatingMemoriesScene
              onOpenLightbox={handleOpenLightbox}
              onOpenPuzzle={() => setIsPuzzleOpen(true)}
            />
          )}
          {currentScene === "finale_flower" && (
            <FinaleFlowerScene onRestart={restartToBeginning} />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Secret Puzzle Modal */}
      <AnimatePresence>
        {isPuzzleOpen && (
          <SecretPuzzleModal
            isOpen={isPuzzleOpen}
            onClose={() => setIsPuzzleOpen(false)}
            onSuccess={handlePuzzleSuccess}
          />
        )}
      </AnimatePresence>

      {/* Lightbox for Memories */}
      {lightboxIndex !== null && (
        <Lightbox
          item={BIRTHDAY_CONFIG.memories[lightboxIndex]}
          onClose={handleCloseLightbox}
          onPrev={() =>
            setLightboxIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : prev))
          }
          onNext={() =>
            setLightboxIndex((prev) =>
              prev !== null && prev < BIRTHDAY_CONFIG.memories.length - 1 ? prev + 1 : prev
            )
          }
          hasPrev={lightboxIndex > 0}
          hasNext={lightboxIndex < BIRTHDAY_CONFIG.memories.length - 1}
        />
      )}
    </div>
  );
}
```

- [ ] **Step 2: Cập nhật `app/page.tsx`**

Thay thế danh sách section dài bằng `SceneManager`:
```tsx
import ParticlesBg from "@/components/ParticlesBg";
import MusicPlayer from "@/components/MusicPlayer";
import SceneManager from "@/components/SceneManager";

export default function Home() {
  return (
    <main className="relative w-full h-[100dvh] overflow-hidden bg-deep-night">
      <ParticlesBg />
      <MusicPlayer />
      <SceneManager />
    </main>
  );
}
```

- [ ] **Step 3: Kiểm tra Build dự án**

Run: `npm run build`
Expected: Output build thành công (exit code 0), không lỗi Type hoặc Linter.

- [ ] **Step 4: Commit thay đổi hoàn thiện**

```bash
git add components/SceneManager.tsx app/page.tsx
git commit -m "feat: integrate SceneManager and switch app to zero-scroll tap flow"
```
