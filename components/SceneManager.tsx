"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSceneNavigation } from "@/hooks/useSceneNavigation";
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
    goToFinale,
    restartToBeginning,
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
    goToFinale();
  };

  const getTapIndicatorText = () => {
    if (currentScene === "intro") return "Chạm vào màn hình để bắt đầu ✨";
    if (currentScene === "sweet_words") {
      return subStep === 3
        ? "Mở hộp quà nhé 🎁"
        : "Chạm vào màn hình để tiếp tục ✨";
    }
    if (currentScene === "gift_and_cake" && canAdvance) {
      return "Chạm để ngắm kỷ niệm của chúng mình 📸";
    }
    return "Chạm vào màn hình để tiếp tục ✨";
  };

  return (
    <div
      className="relative w-full h-[100dvh] overflow-hidden select-none cursor-pointer"
      onClick={nextScene}
    >
      {/* Tap Indicator (bottom) */}
      <TapIndicator
        text={getTapIndicatorText()}
        visible={
          canAdvance &&
          !isPuzzleOpen &&
          !isLightboxOpen &&
          currentScene !== "finale_flower" &&
          currentScene !== "floating_memories"
        }
      />

      {/* Main Scene Transitions */}
      <AnimatePresence initial={false}>
        <motion.div
          key={`${currentScene}-${currentScene === "sweet_words" ? subStep : ""}`}
          initial={{ opacity: 0, x: 100, filter: "blur(3px)" }}
          animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, x: -100, filter: "blur(3px)", pointerEvents: "none" }}
          transition={{ duration: 2.4, ease: [0.25, 0.1, 0.25, 1] }}
          className="absolute inset-0 w-full h-full"
        >
          {currentScene === "intro" && <IntroScene />}
          {currentScene === "sweet_words" && (
            <SweetWordsScene subStep={subStep} />
          )}
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
      {isPuzzleOpen && (
        <SecretPuzzleModal
          isOpen={isPuzzleOpen}
          onClose={() => setIsPuzzleOpen(false)}
          onSuccess={handlePuzzleSuccess}
        />
      )}

      {/* Lightbox for Memories */}
      {lightboxIndex !== null && (
        <Lightbox
          item={BIRTHDAY_CONFIG.memories[lightboxIndex]}
          onClose={handleCloseLightbox}
          onPrev={() =>
            setLightboxIndex((prev) =>
              prev !== null && prev > 0 ? prev - 1 : prev
            )
          }
          onNext={() =>
            setLightboxIndex((prev) =>
              prev !== null && prev < BIRTHDAY_CONFIG.memories.length - 1
                ? prev + 1
                : prev
            )
          }
          hasPrev={lightboxIndex > 0}
          hasNext={lightboxIndex < BIRTHDAY_CONFIG.memories.length - 1}
        />
      )}
    </div>
  );
}
