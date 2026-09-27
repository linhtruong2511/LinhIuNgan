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
      className="fixed top-4 left-4 z-40 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-deep-night/60 border border-white/15 text-white/70 hover:text-white hover:bg-white/10 backdrop-blur-md text-xs font-light tracking-wide transition-all select-none cursor-pointer"
      title="Quay lại cảnh trước"
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path
          d="M19 12H5M12 19l-7-7 7-7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span>Quay lại</span>
    </motion.button>
  );
}
