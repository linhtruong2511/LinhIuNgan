"use client";

import { useMusicPlayer } from "@/hooks/useMusicPlayer";

export default function MusicPlayer() {
  const { isPlaying, hasError, toggle } = useMusicPlayer("/music/bgm.mp3");

  return (
    <button
      onClick={toggle}
      disabled={hasError}
      className="fixed top-4 right-4 z-50 w-12 h-12 rounded-full
        bg-deep-night/80 backdrop-blur-sm border border-teal-accent/30
        flex items-center justify-center
        transition-all duration-300 hover:scale-110
        disabled:opacity-30 disabled:cursor-not-allowed"
      aria-label={isPlaying ? "Tắt nhạc" : "Bật nhạc"}
      title={hasError ? "Không thể tải nhạc" : isPlaying ? "Tắt nhạc" : "Bật nhạc"}
    >
      <span className={`text-xl ${isPlaying ? "animate-pulse" : ""}`}>
        {isPlaying ? "🎵" : "🔇"}
      </span>
    </button>
  );
}
