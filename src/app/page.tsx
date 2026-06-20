"use client";

import { useChromaGame } from "../hooks/useChromaGame";
import React from "react";
import Background3D from "../components/Background3D";
import Image from "next/image";
import logoImg from "../../public/logo-mob-ft-2026.webp";

/**
 * Komponen Utama Chroma Core Alignment (Game Board UI Penpos)
 * Di sini kita menggunakan desain minimalis yang mencolok seperti neon synth-wave / dark aesthetics
 * yang terlihat modern dan responsif.
 */
export default function Home() {
  const {
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
  } = useChromaGame();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative z-10 w-full overflow-hidden">
      {/* Animasi Background 3D */}
      <Background3D />

      <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center space-y-12">
        {/* =========================================
            [ FASE 1: IDLE ] Tampilan Start Setup Awal 
            ========================================= */}
        {phase === "IDLE" && (
          <div className="flex flex-col items-center space-y-8 animate-scale-up w-full max-w-xl bg-black/80 backdrop-blur-md p-10 rounded-3xl border border-white/10">
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

            <h1 className="text-4xl md:text-5xl font-black text-white tracking-widest uppercase text-center drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]">
              <span className="inline-block animate-pixar-jump origin-bottom">
                C
              </span>
              HROMA CORE <br />
              ALIGNMENT
            </h1>

            {/* Input Nama Kelompok Pengunjung */}
            <div className="w-full space-y-3">
              <label
                htmlFor="groupName"
                className="block text-sm font-medium text-zinc-400 ml-1"
              >
                Nama Kelompok
              </label>
              <input
                id="groupName"
                type="text"
                placeholder="Masukkan kelompok..."
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="w-full px-5 py-4 bg-zinc-950 border border-zinc-800 rounded-xl text-white outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-zinc-600 text-lg"
              />
            </div>

            <button
              onClick={startGame}
              className="w-full relative group overflow-hidden rounded-xl bg-white text-black font-bold text-lg py-4 hover:bg-zinc-200 transition-colors"
            >
              <span className="relative z-10 uppercase tracking-widest">
                Mulai Permainan
              </span>
              <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover:-translate-x-full translate-x-[150%] transition-transform duration-700"></div>
            </button>
          </div>
        )}

        {/* =========================================
            [ FASE 2: PREP ] Hitung Mundur Persiapan (5s)
            ========================================= */}
        {phase === "PREP" && (
          <div className="flex flex-col items-center space-y-12 animate-scale-up">
            <h2 className="text-2xl font-medium text-zinc-400 tracking-widest uppercase">
              Bersiaplah
            </h2>

            {/* Menggunakan animasi 'pop' unik setiap angkanya berubah */}
            <div
              className="text-[12rem] font-black leading-none text-white countdown-pop"
              key={`prep-${countdown}`}
            >
              {countdown}
            </div>

            <button
              onClick={stopGame}
              className="px-8 py-3 rounded-full border border-red-500/50 text-red-400 hover:bg-red-500/10 hover:border-red-500 transition-colors uppercase tracking-widest text-sm font-bold"
            >
              Cancel
            </button>
          </div>
        )}

        {/* =========================================
            [ FASE 3: PLAY ] Peserta Berebut Box Warna
            ========================================= */}
        {phase === "PLAY" && (
          <div className="flex flex-col items-center justify-center animate-scale-up w-full h-full min-h-[60vh]">
            {/* Teks Pengecoh: Nama Kata ("MERAH") dengan Hex Color berlawanan ("#22C55E/hijau") */}
            <div className="animate-pulse-neon mb-12">
              <h1
                className="text-[12vw] font-black uppercase tracking-tighter"
                style={{ color: displayColor.hex }}
              >
                {targetWord.name}
              </h1>
            </div>

            {/* UI: Elemen Animasi Lingkaran Hitung Mundur (3s) */}
            <div className="mt-8 relative flex items-center justify-center">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="60"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="transparent"
                  className="text-zinc-800"
                />
                {/* Kalkulasi proporsional lingkaran terhadap 3 detik */}
                <circle
                  cx="64"
                  cy="64"
                  r="60"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="transparent"
                  className="text-white transition-all duration-1000 ease-linear"
                  strokeDasharray={377}
                  strokeDashoffset={377 - (377 * countdown) / 3}
                />
              </svg>
              <div
                className="absolute text-5xl font-bold text-white countdown-pop"
                key={`play-${countdown}`}
              >
                {countdown}
              </div>
            </div>
          </div>
        )}

        {/* =========================================
            [ FASE 4: CHECK ] Penpos Memisahkan Pemain
            ========================================= */}
        {phase === "CHECK" && (
          <div className="flex flex-col items-center justify-center space-y-16 animate-scale-up w-full max-w-3xl">
            <div className="text-center space-y-4">
              <h2 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-400 uppercase tracking-tight">
                WAKTUNYA CEK POSISI
              </h2>
              <p className="text-zinc-400 text-lg md:text-xl">
                Keluarkan peserta yang salah posisi atau berpindah setelah waktu
                habis.
              </p>
            </div>

            <div
              className="text-[10rem] md:text-[14rem] font-bold text-white leading-none tabular-nums countdown-pop"
              key={`check-${countdown}`}
            >
              {countdown}
            </div>

            {/* Menu Admin untuk navigasi cepat antar kontrol gamenya */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
              <button
                onClick={addCheckTime}
                className="py-4 px-6 rounded-xl border border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 font-bold transition-all focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                +10 Detik
              </button>

              <button
                onClick={stopGame}
                className="py-4 px-6 rounded-xl border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-500 font-bold transition-all focus:ring-2 focus:ring-red-500 focus:outline-none"
              >
                Hentikan Permainan
              </button>

              <button
                onClick={nextRound}
                className="py-4 px-6 rounded-xl border border-green-500/30 bg-green-500/10 hover:bg-green-500/20 text-green-400 font-bold transition-all focus:ring-2 focus:ring-green-500 focus:outline-none"
              >
                Next Round
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
