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
