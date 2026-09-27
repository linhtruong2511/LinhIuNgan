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
            hidden: { opacity: 0, x: 50, filter: "blur(6px)" },
            visible: {
              opacity: 1,
              x: 0,
              filter: "blur(0px)",
              transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] },
            },
          }}
          className="text-4xl sm:text-6xl md:text-7xl font-dancing text-white text-glow"
        >
          Chin chào 
        </motion.h1>

        <motion.h2
          variants={{
            hidden: { opacity: 0, x: 50, filter: "blur(6px)" },
            visible: {
              opacity: 1,
              x: 0,
              filter: "blur(0px)",
              transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] },
            },
          }}
          className="text-2xl sm:text-4xl md:text-6xl font-dancing text-teal-accent text-glow"
        >
          {BIRTHDAY_CONFIG.name} iu dấu của anh he ❤️
        </motion.h2>

        <motion.p
          variants={{
            hidden: { opacity: 0, x: 30 },
            visible: {
              opacity: 0.8,
              x: 0,
              transition: { duration: 1.0, ease: "easeOut" },
            },
          }}
          className="text-sm md:text-base text-white/70 font-light pt-4"
        >
          Hôm nay anh có 1 điều bất ngờ dành cho em nè... ✨
        </motion.p>
      </motion.div>
    </div>
  );
}
