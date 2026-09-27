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
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      className="fixed bottom-6 md:bottom-8 inset-x-0 mx-auto w-max max-w-[94vw] pointer-events-none select-none z-30 flex items-center justify-center"
    >
      <div className="flex items-center justify-center whitespace-nowrap px-4 py-2 rounded-full bg-deep-night/70 backdrop-blur-md border border-white/15 text-white/80 text-xs md:text-sm font-light tracking-wider shadow-lg animate-pulse">
        <span className="whitespace-nowrap text-center">{text}</span>
      </div>
    </motion.div>
  );
}
