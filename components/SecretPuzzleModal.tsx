"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { BIRTHDAY_CONFIG } from "@/lib/constants";

interface SecretPuzzleModalProps {
  isOpen?: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function SecretPuzzleModal({
  isOpen,
  onClose,
  onSuccess,
}: SecretPuzzleModalProps) {
  const [step, setStep] = useState<"match_heart" | "enter_pin">("match_heart");
  const [isLeftMatched, setIsLeftMatched] = useState(false);
  const [isRightMatched, setIsRightMatched] = useState(false);
  const [pin, setPin] = useState("");
  const [isError, setIsError] = useState(false);
  const [showHint, setShowHint] = useState(false);

  if (!isOpen) return null;

  const isBothMatched = isLeftMatched && isRightMatched;

  const handleMatchCheck = (left: boolean, right: boolean) => {
    if (left && right) {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { x: 0.5, y: 0.45 },
        colors: ["#FF6B6B", "#FFD93D", "#4ECDC4", "#FF758F"],
      });

      setTimeout(() => {
        setStep("enter_pin");
      }, 1000);
    }
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
        // Error: Show hint and shake
        setTimeout(() => {
          setIsError(true);
          setShowHint(true);
          setPin("");
        }, 250);
      }
    }
  };

  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1));
    setIsError(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md px-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 10 }}
        transition={{ duration: 0.25 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-sm bg-deep-night/95 border border-white/20 rounded-2xl p-6 shadow-2xl flex flex-col items-center text-center select-none"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-white/50 hover:text-white text-lg p-1 cursor-pointer"
        >
          ✕
        </button>

        {/* STEP 1: MATCH 2 HEART HALVES VIA DRAG & DROP */}
        {step === "match_heart" && (
          <div className="flex flex-col items-center py-3">
            <h3 className="text-xl font-dancing text-teal-accent text-glow mb-1">
              Thử Thách Tình Yêu ✨
            </h3>
            <p className="text-xs text-white/70 mb-5 max-w-xs font-light">
              {BIRTHDAY_CONFIG.puzzleInstruction}
            </p>

            <div className="relative w-64 h-44 flex items-center justify-center select-none touch-none">
              {/* Silhouette Drop Target in Center */}
              <div className="absolute w-36 h-36 flex items-center justify-center pointer-events-none opacity-30">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <path
                    d="M 50,24 C 50,10 32,2 16,12 C 0,22 0,48 14,66 C 26,80 44,86 50,90 C 56,86 74,80 86,66 C 100,48 100,22 84,12 C 68,2 50,10 50,24 Z"
                    fill="none"
                    stroke="#FF758F"
                    strokeWidth="1.8"
                    strokeDasharray="4 4"
                  />
                  <line
                    x1="50"
                    y1="24"
                    x2="50"
                    y2="90"
                    stroke="#FF758F"
                    strokeWidth="1.2"
                    strokeDasharray="3 3"
                  />
                </svg>
              </div>

              {/* Left Half of Heart */}
              <motion.div
                drag={!isLeftMatched}
                dragSnapToOrigin={!isLeftMatched}
                dragElastic={0.25}
                dragMomentum={false}
                onDragEnd={(_, info) => {
                  if (isLeftMatched) return;
                  if (info.offset.x >= 25 && Math.abs(info.offset.y) <= 50) {
                    setIsLeftMatched(true);
                    handleMatchCheck(true, isRightMatched);
                  }
                }}
                animate={{
                  x: isLeftMatched ? 0 : -52,
                  rotate: isLeftMatched ? 0 : -8,
                  scale: isBothMatched ? [1, 1.12, 1] : isLeftMatched ? 1.05 : 1,
                }}
                transition={{
                  scale: isBothMatched
                    ? { repeat: Infinity, duration: 1.2, ease: "easeInOut" }
                    : { duration: 0.3 },
                  x: { duration: 0.35, type: "spring", stiffness: 280, damping: 22 },
                  rotate: { duration: 0.35 },
                }}
                whileDrag={{ scale: 1.12, zIndex: 30, cursor: "grabbing" }}
                className={`absolute w-36 h-36 flex items-center justify-center drop-shadow-[0_8px_16px_rgba(230,57,70,0.45)] transition-shadow ${
                  !isLeftMatched
                    ? "cursor-grab active:cursor-grabbing hover:scale-105"
                    : "pointer-events-none"
                }`}
              >
                <svg viewBox="0 0 100 100" className="w-full h-full pointer-events-none">
                  <defs>
                    <linearGradient id="heartGradLeft" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FF758F" />
                      <stop offset="50%" stopColor="#FF4D6D" />
                      <stop offset="100%" stopColor="#E63946" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 50,24 C 50,10 32,2 16,12 C 0,22 0,48 14,66 C 26,80 44,86 50,90 L 50,24 Z"
                    fill="url(#heartGradLeft)"
                    stroke="#FFF0F3"
                    strokeWidth="1.2"
                  />
                  <path
                    d="M 44,22 C 34,12 24,14 18,22 C 12,30 14,46 22,58"
                    fill="none"
                    stroke="rgba(255,255,255,0.45)"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </motion.div>

              {/* Right Half of Heart */}
              <motion.div
                drag={!isRightMatched}
                dragSnapToOrigin={!isRightMatched}
                dragElastic={0.25}
                dragMomentum={false}
                onDragEnd={(_, info) => {
                  if (isRightMatched) return;
                  if (info.offset.x <= -25 && Math.abs(info.offset.y) <= 50) {
                    setIsRightMatched(true);
                    handleMatchCheck(isLeftMatched, true);
                  }
                }}
                animate={{
                  x: isRightMatched ? 0 : 52,
                  rotate: isRightMatched ? 0 : 8,
                  scale: isBothMatched ? [1, 1.12, 1] : isRightMatched ? 1.05 : 1,
                }}
                transition={{
                  scale: isBothMatched
                    ? { repeat: Infinity, duration: 1.2, ease: "easeInOut" }
                    : { duration: 0.3 },
                  x: { duration: 0.35, type: "spring", stiffness: 280, damping: 22 },
                  rotate: { duration: 0.35 },
                }}
                whileDrag={{ scale: 1.12, zIndex: 30, cursor: "grabbing" }}
                className={`absolute w-36 h-36 flex items-center justify-center drop-shadow-[0_8px_16px_rgba(230,57,70,0.45)] transition-shadow ${
                  !isRightMatched
                    ? "cursor-grab active:cursor-grabbing hover:scale-105"
                    : "pointer-events-none"
                }`}
              >
                <svg viewBox="0 0 100 100" className="w-full h-full pointer-events-none">
                  <defs>
                    <linearGradient id="heartGradRight" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FF4D6D" />
                      <stop offset="50%" stopColor="#E63946" />
                      <stop offset="100%" stopColor="#C9184A" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 50,24 L 50,90 C 56,86 74,80 86,66 C 100,48 100,22 84,12 C 68,2 50,10 50,24 Z"
                    fill="url(#heartGradRight)"
                    stroke="#FFF0F3"
                    strokeWidth="1.2"
                  />
                </svg>
              </motion.div>
            </div>

            <p className="mt-5 text-xs text-white/70 animate-pulse font-light min-h-[18px]">
              {isBothMatched
                ? "Trái tim đã hòa làm một ❤️"
                : isLeftMatched || isRightMatched
                ? "Đã khớp 1 mảnh! Kéo nốt mảnh còn lại nhé ✨"
                : "Kéo từng mảnh ghép vào đúng vị trí"}
            </p>
          </div>
        )}

        {/* STEP 2: ENTER PIN */}
        {step === "enter_pin" && (
          <div className="flex flex-col items-center py-2 w-full">
            <h3 className="text-xl font-dancing text-candle-gold text-glow mb-1">
              Mã Khóa Trái Tim 🔐
            </h3>

            {/* Dynamic Hint: Initially hidden, only shown after wrong attempt */}
            <div className="min-h-[22px] flex items-center justify-center mb-4">
              {showHint && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-rose-300 font-medium"
                >
                  {BIRTHDAY_CONFIG.secretPinHint}
                </motion.p>
              )}
            </div>

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
                        className="h-12 rounded-xl bg-white/5 hover:bg-white/10 active:scale-95 text-xs text-white/70 flex items-center justify-center transition-all cursor-pointer"
                      >
                        Xóa
                      </button>
                    );
                  }
                  return (
                    <button
                      key={i}
                      onClick={() => handleKeyPress(btn)}
                      className="h-12 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-lg font-light text-white flex items-center justify-center transition-all border border-white/10 cursor-pointer"
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
    </motion.div>
  );
}
