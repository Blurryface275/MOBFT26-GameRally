import { useState, useEffect, useCallback, useRef } from "react";

export type GamePhase = "IDLE" | "PREP" | "PLAY" | "CHECK";

export interface GameColor {
  name: string;
  hex: string;
}

export const COLORS: GameColor[] = [
  { name: "MERAH", hex: "#EF4444" }, // Red-500
  { name: "KUNING", hex: "#EAB308" }, // Yellow-500
  { name: "BIRU", hex: "#3B82F6" }, // Blue-500
  { name: "HIJAU", hex: "#22C55E" }, // Green-500
];

export function useChromaGame() {
  const [phase, setPhase] = useState<GamePhase>("IDLE");
  const [countdown, setCountdown] = useState<number>(0);
  const [groupName, setGroupName] = useState<string>("");

  const [targetWord, setTargetWord] = useState<GameColor>(COLORS[0]);
  const [displayColor, setDisplayColor] = useState<GameColor>(COLORS[0]);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const randomizeColors = useCallback(() => {
    const randomWordIdx = Math.floor(Math.random() * COLORS.length);
    let randomColorIdx = Math.floor(Math.random() * COLORS.length);
    // Pastikan warna tidak sama dengan tulisan agar tantangan selalu ada
    while (randomColorIdx === randomWordIdx) {
      randomColorIdx = Math.floor(Math.random() * COLORS.length);
    }

    setTargetWord(COLORS[randomWordIdx]);
    setDisplayColor(COLORS[randomColorIdx]);
  }, []);

  const startGame = useCallback(() => {
    setPhase("PREP");
    setCountdown(5);
  }, []);

  const stopGame = useCallback(() => {
    setPhase("IDLE");
    setCountdown(0);
  }, []);

  const nextRound = useCallback(() => {
    randomizeColors();
    setPhase("PLAY");
    setCountdown(3);
  }, [randomizeColors]);

  const addCheckTime = useCallback(() => {
    if (phase === "CHECK") {
      setCountdown((prev) => prev + 10);
    }
  }, [phase]);

  useEffect(() => {
    if (phase === "IDLE") return;

    let timeoutDelay = 1000;
    if (countdown <= 0) {
      timeoutDelay = 0; // Segera transisi phase tanpa delay
    }

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
    }, timeoutDelay);

    return () => clearTimeout(timerRef.current as NodeJS.Timeout);
  }, [phase, countdown, nextRound]);

  return {
    phase,
    countdown,
    groupName,
    setGroupName,
    targetWord,
    displayColor,
    startGame,
    stopGame,
    nextRound,
    addCheckTime,
  };
}
