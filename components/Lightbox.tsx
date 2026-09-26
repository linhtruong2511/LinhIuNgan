"use client";

import { useEffect, useCallback, useState } from "react";
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
  const [imgError, setImgError] = useState(false);

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
    setImgError(false);
  }, [item.src]);

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
      data-modal-open="true"
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
            {!imgError ? (
              <Image
                src={item.src}
                alt={item.caption}
                fill
                className="object-contain rounded-lg"
                sizes="85vw"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-800 text-2xl text-white/80 rounded-lg">
                📷 Ảnh kỷ niệm
              </div>
            )}
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
