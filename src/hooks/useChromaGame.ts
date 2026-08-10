import { useState, useEffect, useCallback, useRef } from "react";

export type GamePhase = "IDLE" | "PREP" | "PLAY" | "CHECK";

export interface GameColor {
  name: string;
  hex: string;
}

export const COLORS: GameColor[] = [
  { name: "MERAH", hex: "#EF4444" },
  { name: "KUNING", hex: "#EAB308" },
  { name: "BIRU", hex: "#3B82F6" },
  { name: "HIJAU", hex: "#22C55E" },
  { name: "ORANYE", hex: "#F97316" },
  { name: "UNGU", hex: "#A855F7" },
  { name: "PUTIH", hex: "#FFFFFF" },
  { name: "ABU-ABU", hex: "#9CA3AF" },
  { name: "COKELAT", hex: "#8B4513" },
  { name: "EMAS", hex: "#FFD700" },
  { name: "SILVER", hex: "#C0C0C0" },
  { name: "TOSCA", hex: "#14B8A6" },
  { name: "MAROON", hex: "#800000" },
];

/**
 * Custom Hook: `useChromaGame`
 * Bertanggung jawab menangani state machine game, timer presisi,
 * pengacakan O(1), kontrol suara, dan shortcut keyboard untuk Penpos.
 */
export function useChromaGame() {
  const [phase, setPhase] = useState<GamePhase>("IDLE");
  const [countdown, setCountdown] = useState<number>(0);
  const [targetWord, setTargetWord] = useState<GameColor>(COLORS[0]);
  const [displayColor, setDisplayColor] = useState<GameColor>(COLORS[1]);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Mengacak kata target & warna display secara deterministik O(1)
   * tanpa loop acak berulang.
   */
  const randomizeColors = useCallback(() => {
    const wordIdx = Math.floor(Math.random() * COLORS.length);
    const selectedWord = COLORS[wordIdx];

    const availableColors = COLORS.filter((_, idx) => idx !== wordIdx);
    const selectedColor =
      availableColors[Math.floor(Math.random() * availableColors.length)];

    setTargetWord(selectedWord);
    setDisplayColor(selectedColor);
  }, []);

  const startGame = useCallback(() => {
    setPhase("PREP");
    setCountdown(3);
  }, []);

  const stopGame = useCallback(() => {
    setPhase("IDLE");
    setCountdown(0);
  }, []);

  const nextRound = useCallback(() => {
    randomizeColors();
    setPhase("PLAY");
    setCountdown(5);
  }, [randomizeColors]);

  const addCheckTime = useCallback(() => {
    if (phase === "CHECK") {
      setCountdown((prev) => prev + 10);
    }
  }, [phase]);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else if (document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    }
  }, []);

  /**
   * Precision Timer Engine
   */
  useEffect(() => {
    if (phase === "IDLE") return;

    timerRef.current = setTimeout(() => {
      if (countdown <= 0) {
        if (phase === "PREP") {
          nextRound();
        } else if (phase === "PLAY") {
          setPhase("CHECK");
          setCountdown(15);
        } else if (phase === "CHECK") {
          nextRound();
        }
      } else {
        setCountdown((c) => c - 1);
      }
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [phase, countdown, nextRound]);

  /**
   * Penpos Keyboard Shortcuts Listener
   */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.code) {
        case "Space":
        case "Enter":
          e.preventDefault();
          if (phase === "IDLE") startGame();
          else if (phase === "CHECK") nextRound();
          break;
        case "Escape":
          e.preventDefault();
          stopGame();
          break;
        case "KeyA":
          if (phase === "CHECK") addCheckTime();
          break;
        case "KeyM":
          toggleMute();
          break;
        case "KeyF":
          toggleFullscreen();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [phase, startGame, stopGame, nextRound, addCheckTime, toggleMute, toggleFullscreen]);

  return {
    phase,
    countdown,
    targetWord,
    displayColor,
    isMuted,
    startGame,
    stopGame,
    nextRound,
    addCheckTime,
    toggleMute,
    toggleFullscreen,
  };
}
