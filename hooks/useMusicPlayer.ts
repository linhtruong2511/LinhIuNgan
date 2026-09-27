"use client";

import { useState, useRef, useCallback, useEffect } from "react";

export interface Song {
  id: string;
  title: string;
  artist: string;
  src: string;
  coverImage: string;
  badge: string;
  shortName: string;
}

export const PLAYLIST: Song[] = [
  {
    id: "anh-nang-cua-anh",
    title: "Ánh Nắng Của Anh",
    artist: "Đức Phúc",
    src: "/music/anh-nang-cua-anh.mp3",
    coverImage: "/images/photo1.jpg",
    badge: "Bài 1",
    shortName: "Ánh Nắng Của Anh",
  },
  {
    id: "yeu-duoc-khong",
    title: "Yêu Được Không",
    artist: "Đức Phúc ft. ViruSs",
    src: "/music/yeu-duoc-khong.mp3",
    coverImage: "/images/photo2.jpg",
    badge: "Bài 2",
    shortName: "Yêu Được Không",
  },
];

export function useMusicPlayer(playlist: Song[] = PLAYLIST) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isPlayingRef = useRef(false);
  isPlayingRef.current = isPlaying;
  const userExplicitPauseRef = useRef(false);
  const isFirstMount = useRef(true);

  // Initialize audio element once on mount
  useEffect(() => {
    const audio = new Audio();
    audio.preload = "auto";
    audio.volume = 0.6;
    audioRef.current = audio;

    const initialSong = playlist[0];
    if (initialSong) {
      audio.src = initialSong.src;
    }

    const handleCanPlay = () => {
      setIsLoaded(true);
      setHasError(false);
    };

    const handleError = () => {
      setHasError(true);
      setIsPlaying(false);
    };

    const handleEnded = () => {
      // Auto switch to next track when one ends
      userExplicitPauseRef.current = false;
      setCurrentIndex((prev) => (prev + 1) % playlist.length);
    };

    const handlePlay = () => {
      setIsPlaying(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    audio.addEventListener("canplay", handleCanPlay);
    audio.addEventListener("error", handleError);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);

    return () => {
      audio.removeEventListener("canplay", handleCanPlay);
      audio.removeEventListener("error", handleError);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.pause();
      audio.src = "";
    };
  }, [playlist]);

  // Handle switching tracks
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }

    const audio = audioRef.current;
    if (!audio) return;

    const currentSong = playlist[currentIndex];
    if (currentSong) {
      setIsLoaded(false);
      setHasError(false);
      audio.src = currentSong.src;
      audio.load();

      // Automatically play when user switched track or was playing
      if (!userExplicitPauseRef.current) {
        audio
          .play()
          .then(() => {
            setIsPlaying(true);
          })
          .catch(() => {
            setIsPlaying(false);
          });
      }
    }
  }, [currentIndex, playlist]);

  // Autoplay on first user interaction anywhere on the page (mobile & desktop friendly)
  useEffect(() => {
    const handleFirstUserInteraction = () => {
      if (!userExplicitPauseRef.current && !isPlayingRef.current && audioRef.current) {
        audioRef.current
          .play()
          .then(() => {
            setIsPlaying(true);
          })
          .catch(() => {
            // Autoplay blocked by browser policy until direct button click
          });
      }
      window.removeEventListener("click", handleFirstUserInteraction);
      window.removeEventListener("touchstart", handleFirstUserInteraction);
    };

    window.addEventListener("click", handleFirstUserInteraction, { once: true });
    window.addEventListener("touchstart", handleFirstUserInteraction, { once: true });

    return () => {
      window.removeEventListener("click", handleFirstUserInteraction);
      window.removeEventListener("touchstart", handleFirstUserInteraction);
    };
  }, []);

  const play = useCallback(() => {
    userExplicitPauseRef.current = false;
    const audio = audioRef.current;
    if (!audio) return;
    audio
      .play()
      .then(() => {
        setIsPlaying(true);
      })
      .catch(() => {
        setIsPlaying(false);
      });
  }, []);

  const pause = useCallback(() => {
    userExplicitPauseRef.current = true;
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    setIsPlaying(false);
  }, []);

  const toggle = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);

  const nextTrack = useCallback(() => {
    userExplicitPauseRef.current = false;
    setCurrentIndex((prev) => (prev + 1) % playlist.length);
  }, [playlist.length]);

  const prevTrack = useCallback(() => {
    userExplicitPauseRef.current = false;
    setCurrentIndex((prev) => (prev - 1 + playlist.length) % playlist.length);
  }, [playlist.length]);

  const selectTrack = useCallback(
    (index: number) => {
      if (index >= 0 && index < playlist.length) {
        userExplicitPauseRef.current = false;
        setCurrentIndex(index);
      }
    },
    [playlist.length]
  );

  const toggleMute = useCallback(() => {
    if (audioRef.current) {
      const nextMuted = !isMuted;
      setIsMuted(nextMuted);
      audioRef.current.muted = nextMuted;
    }
  }, [isMuted]);

  return {
    currentSong: playlist[currentIndex] || playlist[0],
    currentIndex,
    playlist,
    isPlaying,
    isLoaded,
    hasError,
    isMuted,
    toggle,
    play,
    pause,
    nextTrack,
    prevTrack,
    selectTrack,
    toggleMute,
  };
}
