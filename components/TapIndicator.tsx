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
