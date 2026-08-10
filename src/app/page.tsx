"use client";

import { useChromaGame } from "../hooks/useChromaGame";
import React, { useEffect, useRef, useState } from "react";
import Background3D from "../components/Background3D";
import Image from "next/image";
import logoImg from "../../public/logo-mob-ft-2026.webp";
import { getAssetPath } from "../utils/assetPath";

/**
 * Komponen Utama Chroma Core Alignment (Game Board UI Penpos)
 * Di sini kita menggunakan desain minimalis synth-wave / dark neon aesthetics
 * yang super responsif, berperforma tinggi, dan dilengkapi kontrol HCI khusus Penpos.
 */
export default function Home() {
  const {
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
  } = useChromaGame();

  const [showShortcuts, setShowShortcuts] = useState(false);

  const transitionAudioRef = useRef<HTMLAudioElement | null>(null);
  const heartbeatAudioRef = useRef<HTMLAudioElement | null>(null);

  // Inisialisasi audio lokal dengan basePath resolver
  useEffect(() => {
    const transitionSrc = getAssetPath(
      "/Audio/Cinematic Sci-fi Chime Transition FX HD.mp3"
    );
    const heartbeatSrc = getAssetPath("/Audio/Suspenseful Heartbeat.mp3");

    const transition = new Audio(transitionSrc);
    const heartbeat = new Audio(heartbeatSrc);

    transitionAudioRef.current = transition;
    heartbeatAudioRef.current = heartbeat;

    heartbeat.loop = true;

    return () => {
      heartbeat.pause();
      transition.pause();
      heartbeatAudioRef.current = null;
      transitionAudioRef.current = null;
    };
  }, []);

  // Sync Mute Status
  useEffect(() => {
    if (heartbeatAudioRef.current) {
      heartbeatAudioRef.current.muted = isMuted;
    }
    if (transitionAudioRef.current) {
      transitionAudioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  // Memutar audio "Chime" saat ronde baru muncul (Fase PLAY)
  useEffect(() => {
    if (phase === "PLAY" && transitionAudioRef.current && !isMuted) {
      transitionAudioRef.current.currentTime = 0;
      transitionAudioRef.current.play().catch(() => {});
    }
  }, [phase, isMuted]);

  // Memutar & mengatur tempo audio "Heartbeat" berdasarkan sisa waktu (countdown)
  useEffect(() => {
    if (!heartbeatAudioRef.current) return;

    if (phase !== "IDLE" && countdown > 0 && !isMuted) {
      let rate = 1.0;
      if (countdown <= 5) {
        rate = 1.0 + (5 - countdown) * 0.25;
      }
      heartbeatAudioRef.current.playbackRate = rate;

      if (heartbeatAudioRef.current.paused) {
        heartbeatAudioRef.current.play().catch(() => {});
      }
    } else {
      heartbeatAudioRef.current.pause();
    }
  }, [phase, countdown, isMuted]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-between p-4 relative z-10 w-full overflow-hidden select-none">
      {/* Background 3D GPU-Accelerated */}
      <Background3D />

      {/* Top Header Bar Penpos Controls */}
      <header className="w-full max-w-6xl mx-auto flex items-center justify-between py-2 px-4 bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 text-xs md:text-sm">
        <div className="flex items-center space-x-3">
          <div className="relative w-7 h-7">
            <Image
              src={logoImg}
              alt="Logo MOB FT 2026"
              width={28}
              height={28}
              priority
              className="object-contain"
            />
          </div>
          <span className="font-bold tracking-widest text-zinc-300 hidden sm:inline">
            MOB FT 2026 • GAME RALLY
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {/* Mute Toggle Button */}
          <button
            onClick={toggleMute}
            aria-label={isMuted ? "Unmute Audio" : "Mute Audio"}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 text-zinc-300 hover:text-white transition-all flex items-center space-x-1.5 focus:ring-2 focus:ring-white/30 focus:outline-none"
          >
            <span>{isMuted ? "🔇 Muted" : "🔊 Sound ON"}</span>
          </button>

          {/* Fullscreen Toggle Button */}
          <button
            onClick={toggleFullscreen}
            aria-label="Toggle Fullscreen Mode"
            className="p-2 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 text-zinc-300 hover:text-white transition-all flex items-center space-x-1.5 focus:ring-2 focus:ring-white/30 focus:outline-none"
          >
            <span>🖥️ Fullscreen</span>
          </button>

          {/* Shortcuts Info Toggle */}
          <button
            onClick={() => setShowShortcuts((prev) => !prev)}
            aria-label="Penpos Keyboard Shortcuts Info"
            className="p-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-400 font-medium transition-all focus:ring-2 focus:ring-blue-500/50 focus:outline-none"
          >
            <span>⌨️ Shortcuts</span>
          </button>
        </div>
      </header>

      {/* Keyboard Shortcuts Drawer Overlay */}
      {showShortcuts && (
        <div className="absolute top-16 right-4 z-50 w-72 bg-zinc-950/95 backdrop-blur-xl border border-zinc-800 rounded-2xl p-4 shadow-2xl text-xs space-y-2 animate-scale-up">
          <div className="flex justify-between items-center border-b border-zinc-800 pb-2 mb-2">
            <span className="font-bold text-white uppercase tracking-wider">
              Penpos Shortcuts
            </span>
            <button
              onClick={() => setShowShortcuts(false)}
              className="text-zinc-500 hover:text-white font-bold"
            >
              ✕
            </button>
          </div>
          <div className="grid grid-cols-2 gap-y-1.5 text-zinc-400">
            <span className="font-mono text-zinc-200 bg-zinc-900 px-1.5 py-0.5 rounded text-center">
              Space / Enter
            </span>
            <span>Mulai / Next Round</span>
            <span className="font-mono text-zinc-200 bg-zinc-900 px-1.5 py-0.5 rounded text-center">
              Esc
            </span>
            <span>Stop / Reset Game</span>
            <span className="font-mono text-zinc-200 bg-zinc-900 px-1.5 py-0.5 rounded text-center">
              A
            </span>
            <span>+10s Check Time</span>
            <span className="font-mono text-zinc-200 bg-zinc-900 px-1.5 py-0.5 rounded text-center">
              M
            </span>
            <span>Toggle Mute</span>
            <span className="font-mono text-zinc-200 bg-zinc-900 px-1.5 py-0.5 rounded text-center">
              F
            </span>
            <span>Toggle Fullscreen</span>
          </div>
        </div>
      )}

      {/* Main Interactive Stage Container */}
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center space-y-12 my-auto">
        {/* =========================================
            [ FASE 1: IDLE ] Start Game Screen
            ========================================= */}
        {phase === "IDLE" && (
          <div className="flex flex-col items-center space-y-8 animate-scale-up w-full max-w-xl bg-black/80 backdrop-blur-md p-8 md:p-10 rounded-3xl border border-white/10 shadow-2xl">
            {/* Logo MOB FT 2026 */}
            <div className="relative w-32 h-32 md:w-36 md:h-36 flex items-center justify-center animate-pulse-neon">
              <Image
                src={logoImg}
                alt="Logo MOB FT 2026"
                width={144}
                height={144}
                priority
                className="object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]"
              />
            </div>

            <h1 className="text-3xl md:text-5xl font-black text-white tracking-widest uppercase text-center drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]">
              <span className="inline-block animate-pixar-jump origin-bottom">
                C
              </span>
              HROMA CORE <br />
              ALIGNMENT
            </h1>

            <button
              onClick={startGame}
              aria-label="Mulai Permainan Chroma Core Alignment"
              className="w-full relative group overflow-hidden rounded-2xl bg-white text-black font-extrabold text-xl py-5 hover:bg-zinc-200 active:scale-95 transition-all shadow-[0_0_30px_rgba(255,255,255,0.3)] focus:ring-4 focus:ring-white/50 focus:outline-none"
            >
              <span className="relative z-10 uppercase tracking-widest">
                Mulai Permainan
              </span>
              <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-white/50 to-transparent group-hover:-translate-x-full translate-x-[150%] transition-transform duration-700"></div>
            </button>
          </div>
        )}

        {/* =========================================
            [ FASE 2: PREP ] Hitung Mundur Persiapan (3s)
            ========================================= */}
        {phase === "PREP" && (
          <div className="flex flex-col items-center space-y-12 animate-scale-up">
            <h2 className="text-2xl font-medium text-zinc-400 tracking-widest uppercase">
              Bersiaplah
            </h2>

            <div
              aria-live="polite"
              className="text-[12rem] font-black leading-none text-white countdown-pop select-none"
              key={`prep-${countdown}`}
            >
              {countdown}
            </div>

            <button
              onClick={stopGame}
              aria-label="Batal Permainan"
              className="px-8 py-3 rounded-full border border-red-500/50 text-red-400 hover:bg-red-500/10 hover:border-red-500 transition-colors uppercase tracking-widest text-sm font-bold active:scale-95 focus:ring-2 focus:ring-red-500 focus:outline-none"
            >
              Cancel
            </button>
          </div>
        )}

        {/* =========================================
            [ FASE 3: PLAY ] Tantangan Kata vs Warna Display
            ========================================= */}
        {phase === "PLAY" && (
          <div className="flex flex-col items-center justify-center animate-scale-up w-full min-h-[50vh]">
            {/* Teks Pengecoh */}
            <div className="animate-pulse-neon mb-12 text-center">
              <h1
                className="text-[14vw] md:text-[10rem] font-black uppercase tracking-tighter leading-none text-glow"
                style={{
                  color: displayColor.hex,
                }}
              >
                {targetWord.name}
              </h1>
            </div>

            {/* UI Lingkaran Hitung Mundur */}
            <div className="mt-4 relative flex items-center justify-center">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="60"
                  stroke="currentColor"
                  strokeWidth="6"
                  fill="transparent"
                  className="text-zinc-800"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="60"
                  stroke="currentColor"
                  strokeWidth="6"
                  fill="transparent"
                  className="text-white transition-all duration-1000 ease-linear"
                  strokeDasharray={377}
                  strokeDashoffset={377 - (377 * countdown) / 5}
                />
              </svg>
              <div
                aria-live="polite"
                className="absolute text-5xl font-extrabold text-white countdown-pop"
                key={`play-${countdown}`}
              >
                {countdown}
              </div>
            </div>
          </div>
        )}

        {/* =========================================
            [ FASE 4: CHECK ] Pengecekan Posisi Peserta
            ========================================= */}
        {phase === "CHECK" && (
          <div className="flex flex-col items-center justify-center space-y-12 animate-scale-up w-full max-w-3xl">
            <div className="text-center space-y-4">
              <h2 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-400 uppercase tracking-tight">
                WAKTUNYA CEK POSISI
              </h2>
              <p className="text-zinc-400 text-lg md:text-xl">
                Keluarkan peserta yang salah posisi atau berpindah setelah waktu
                habis.
              </p>
            </div>

            <div
              aria-live="polite"
              className="text-[10rem] md:text-[13rem] font-black text-white leading-none tabular-nums countdown-pop select-none"
              key={`check-${countdown}`}
            >
              {countdown}
            </div>

            {/* Menu Admin Penpos */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
              <button
                onClick={addCheckTime}
                aria-label="Tambah waktu check 10 detik"
                className="py-4 px-6 rounded-2xl border border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 font-bold transition-all active:scale-95 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                +10 Detik [A]
              </button>

              <button
                onClick={stopGame}
                aria-label="Hentikan Permainan"
                className="py-4 px-6 rounded-2xl border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-500 font-bold transition-all active:scale-95 focus:ring-2 focus:ring-red-500 focus:outline-none"
              >
                Hentikan Permainan [Esc]
              </button>

              <button
                onClick={nextRound}
                aria-label="Lanjut Ke Ronde Berikutnya"
                className="py-4 px-6 rounded-2xl border border-green-500/30 bg-green-500/10 hover:bg-green-500/20 text-green-400 font-bold transition-all active:scale-95 focus:ring-2 focus:ring-green-500 focus:outline-none"
              >
                Next Round [Space]
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <footer className="w-full text-center text-xs text-zinc-500 py-2">
        <span>Press <kbd className="px-1.5 py-0.5 bg-zinc-900 rounded border border-zinc-700 text-zinc-300">Space</kbd> / <kbd className="px-1.5 py-0.5 bg-zinc-900 rounded border border-zinc-700 text-zinc-300">Enter</kbd> to control game phases seamlessly</span>
      </footer>
    </main>
  );
}
