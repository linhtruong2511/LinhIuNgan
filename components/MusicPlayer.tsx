"use client";

import { useState } from "react";
import Image from "next/image";
import { useMusicPlayer, Song } from "@/hooks/useMusicPlayer";

export default function MusicPlayer() {
  const {
    currentSong,
    currentIndex,
    playlist,
    isPlaying,
    hasError,
    isMuted,
    toggle,
    nextTrack,
    prevTrack,
    selectTrack,
    toggleMute,
  } = useMusicPlayer();

  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div
      className="fixed top-3 right-3 sm:top-4 sm:right-4 z-50 select-none max-w-[calc(100vw-1.5rem)]"
      aria-label="Trình phát nhạc sinh nhật"
    >
      {/* Floating music notes animation when playing */}
      {isPlaying && (
        <div className="absolute -top-4 left-6 pointer-events-none z-10">
          <span className="absolute animate-float-note-1 text-sm sm:text-base text-teal-accent opacity-0">
            ♪
          </span>
          <span className="absolute animate-float-note-2 text-xs sm:text-sm text-coral opacity-0">
            ♫
          </span>
          <span className="absolute animate-float-note-3 text-sm text-candle-gold opacity-0">
            💕
          </span>
        </div>
      )}

      {/* Main Player Container */}
      <div
        className="bg-deep-night/85 backdrop-blur-md border border-teal-accent/30
          rounded-2xl p-2 sm:p-2.5 shadow-[0_8px_32px_rgba(0,0,0,0.6)]
          flex items-center gap-2.5 sm:gap-3 transition-all duration-300
          hover:border-teal-accent/50"
      >
        {/* VINYL TURNTABLE SECTION */}
        <div className="relative flex-shrink-0 group">
          {/* Tonearm (kim quay đĩa) */}
          <div
            className="absolute -top-1.5 -right-1 z-20 pointer-events-none transition-transform duration-700 ease-out origin-top-right"
            style={{
              transform: isPlaying ? "rotate(22deg)" : "rotate(-18deg)",
            }}
          >
            {/* Pivot base */}
            <div className="w-3 h-3 rounded-full bg-gradient-to-br from-zinc-200 to-zinc-500 border border-zinc-400 shadow-sm" />
            {/* Tonearm rod */}
            <div className="w-[2px] h-7 bg-gradient-to-b from-zinc-300 via-zinc-400 to-zinc-500 ml-1 shadow-sm origin-top">
              {/* Needle head / Cartridge */}
              <div className="w-2 h-2.5 bg-gradient-to-br from-teal-accent to-emerald-600 rounded-sm -ml-0.5 mt-5 shadow-sm border border-white/20" />
            </div>
          </div>

          {/* Vinyl Disc (Đĩa than) */}
          <button
            onClick={toggle}
            disabled={hasError}
            className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full p-[3px]
              bg-gradient-to-br from-zinc-700 via-zinc-900 to-black
              shadow-[0_4px_16px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.2)]
              focus:outline-none focus:ring-2 focus:ring-teal-accent/50
              transition-transform duration-300 hover:scale-105 active:scale-95"
            title={isPlaying ? "Nhấn để tạm dừng" : "Nhấn để phát nhạc"}
            aria-label={isPlaying ? "Tạm dừng" : "Phát nhạc"}
          >
            {/* Spinning Vinyl Surface */}
            <div
              className={`w-full h-full rounded-full relative overflow-hidden animate-spin-vinyl`}
              style={{
                animationPlayState: isPlaying ? "running" : "paused",
                background:
                  "radial-gradient(circle at center, #27272a 0%, #18181b 30%, #27272a 32%, #09090b 34%, #1f1f23 54%, #09090b 56%, #27272a 76%, #09090b 78%, #18181b 92%, #09090b 100%)",
              }}
            >
              {/* Fine vinyl groove rings */}
              <div className="absolute inset-[15%] rounded-full border border-white/5 pointer-events-none" />
              <div className="absolute inset-[28%] rounded-full border border-white/10 pointer-events-none" />

              {/* Glossy sheen reflection */}
              <div
                className="absolute inset-0 rounded-full pointer-events-none opacity-25"
                style={{
                  background:
                    "conic-gradient(from 0deg, rgba(255,255,255,0.2) 0deg, transparent 45deg, rgba(255,255,255,0.2) 90deg, transparent 135deg, rgba(255,255,255,0.2) 180deg, transparent 225deg, rgba(255,255,255,0.2) 270deg, transparent 315deg, rgba(255,255,255,0.2) 360deg)",
                }}
              />

              {/* Center Record Label / Album Art */}
              <div className="absolute inset-[23%] rounded-full overflow-hidden border-2 border-zinc-900 shadow-inner flex items-center justify-center bg-zinc-800">
                {currentSong.coverImage ? (
                  <Image
                    src={currentSong.coverImage}
                    alt={currentSong.title}
                    fill
                    className="object-cover"
                    sizes="40px"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-tr from-coral to-teal-accent flex items-center justify-center">
                    <span className="text-[10px]">❤️</span>
                  </div>
                )}

                {/* Spindle hole */}
                <div className="absolute w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-zinc-950 border border-zinc-400 shadow-inner z-10" />
              </div>
            </div>

            {/* Play/Pause Hover/State Overlay */}
            <div
              className={`absolute inset-0 rounded-full flex items-center justify-center
                bg-black/40 backdrop-blur-[1px] transition-opacity duration-200
                ${isPlaying ? "opacity-0 group-hover:opacity-100" : "opacity-90"}`}
            >
              {isPlaying ? (
                <svg
                  className="w-4 h-4 text-white drop-shadow"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                </svg>
              ) : (
                <svg
                  className="w-4 h-4 text-teal-accent translate-x-0.5 drop-shadow"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </div>
          </button>
        </div>

        {/* SONG INFO & CONTROLS SECTION */}
        <div className="flex flex-col justify-center min-w-0 pr-1">
          {/* Top row: Track Title & Artist & Equalizer */}
          <div className="flex items-center gap-2 mb-1">
            <div className="min-w-0 max-w-[130px] sm:max-w-[170px]">
              <p className="text-xs sm:text-sm font-medium text-white truncate leading-tight flex items-center gap-1.5">
                <span className="text-teal-accent text-[11px] font-semibold">
                  #{currentIndex + 1}
                </span>
                <span className="truncate">{currentSong.shortName}</span>
              </p>
              <p className="text-[10px] sm:text-[11px] text-white/60 truncate leading-none mt-0.5">
                {currentSong.artist}
              </p>
            </div>

            {/* Sound Wave Equalizer Bars */}
            <div className="flex items-end gap-[2px] h-3.5 px-1 py-0.5 ml-auto flex-shrink-0">
              <span
                className={`w-[2.5px] rounded-full bg-teal-accent transition-all ${
                  isPlaying ? "animate-eq-1" : "h-[3px] opacity-40"
                }`}
              />
              <span
                className={`w-[2.5px] rounded-full bg-coral transition-all ${
                  isPlaying ? "animate-eq-2" : "h-[3px] opacity-40"
                }`}
              />
              <span
                className={`w-[2.5px] rounded-full bg-candle-gold transition-all ${
                  isPlaying ? "animate-eq-3" : "h-[3px] opacity-40"
                }`}
              />
              <span
                className={`w-[2.5px] rounded-full bg-teal-accent transition-all ${
                  isPlaying ? "animate-eq-4" : "h-[3px] opacity-40"
                }`}
              />
            </div>
          </div>

          {/* Bottom row: 2 Switch Functions & Track Badges */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* FUNCTION 1: Previous Track Button */}
            <button
              onClick={prevTrack}
              className="p-1 sm:p-1.5 rounded-lg bg-white/5 hover:bg-white/15 active:scale-90
                text-white/80 hover:text-white transition-all border border-white/5 hover:border-teal-accent/30"
              title="Bài trước (Chuyển bài)"
              aria-label="Bài trước"
            >
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
              </svg>
            </button>

            {/* Play/Pause Button */}
            <button
              onClick={toggle}
              className="p-1 sm:p-1.5 rounded-lg bg-teal-accent/20 hover:bg-teal-accent/30 active:scale-90
                text-teal-accent hover:text-white transition-all border border-teal-accent/40"
              title={isPlaying ? "Tạm dừng" : "Phát nhạc"}
              aria-label={isPlaying ? "Tạm dừng" : "Phát nhạc"}
            >
              {isPlaying ? (
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                </svg>
              ) : (
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>

            {/* FUNCTION 2: Next Track Button */}
            <button
              onClick={nextTrack}
              className="p-1 sm:p-1.5 rounded-lg bg-white/5 hover:bg-white/15 active:scale-90
                text-white/80 hover:text-white transition-all border border-white/5 hover:border-teal-accent/30"
              title="Bài kế tiếp (Chuyển bài)"
              aria-label="Bài kế tiếp"
            >
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
              </svg>
            </button>

            {/* DIRECT 2-SONG SELECTOR TABS */}
            <div className="flex items-center gap-1 ml-0.5 border-l border-white/10 pl-1.5">
              {playlist.map((song, idx) => {
                const isActive = idx === currentIndex;
                return (
                  <button
                    key={song.id}
                    onClick={() => selectTrack(idx)}
                    className={`px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-[11px] font-medium rounded-md
                      transition-all duration-200 whitespace-nowrap ${
                        isActive
                          ? "bg-gradient-to-r from-teal-accent to-emerald-500 text-deep-night font-bold shadow-[0_0_10px_rgba(78,205,196,0.4)]"
                          : "bg-white/5 text-white/60 hover:text-white hover:bg-white/10"
                      }`}
                    title={`Chuyển sang: ${song.title}`}
                  >
                    {song.badge}
                  </button>
                );
              })}

              {/* Mute/Unmute quick toggle */}
              <button
                onClick={toggleMute}
                className="p-1 rounded-md text-white/50 hover:text-white/90 hover:bg-white/5 transition-colors ml-0.5"
                title={isMuted ? "Bật âm thanh" : "Tắt âm thanh"}
                aria-label={isMuted ? "Bật tiếng" : "Tắt tiếng"}
              >
                {isMuted ? (
                  <svg className="w-3 h-3 text-coral" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                  </svg>
                ) : (
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
