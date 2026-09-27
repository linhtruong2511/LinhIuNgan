"use client";

import { useState } from "react";
import { motion } from "framer-motion";
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
        }, 300);
      }
    }
  };

  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1));
    setIsError(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md px-4"
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
          className="absolute top-3 right-3 text-white/50 hover:text-white text-lg p-1 cursor-pointer"
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
              className="relative w-56 h-36 flex items-center justify-center cursor-pointer group"
              onClick={handleSnapHearts}
            >
              {/* Left Half */}
              <motion.div
                animate={{
                  x: isHeartMatched ? 0 : -35,
                  rotate: isHeartMatched ? 0 : -10,
                }}
                transition={{ duration: 0.6, type: "spring" }}
                className="w-16 h-24 bg-gradient-to-br from-pink-500 to-rose-red rounded-tl-full rounded-bl-full shadow-lg group-hover:scale-105 transition-transform"
              />

              {/* Right Half */}
              <motion.div
                animate={{
                  x: isHeartMatched ? 0 : 35,
                  rotate: isHeartMatched ? 0 : 10,
                }}
                transition={{ duration: 0.6, type: "spring" }}
                className="w-16 h-24 bg-gradient-to-bl from-rose-red to-red-700 rounded-tr-full rounded-br-full shadow-lg group-hover:scale-105 transition-transform"
              />
            </div>

            <p className="mt-8 text-xs text-white/60 animate-pulse font-light">
              {isHeartMatched
                ? "Trái tim đã hòa làm một ❤️"
                : "Chạm để gắn kết 2 mảnh tim"}
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
    </div>
  );
}
