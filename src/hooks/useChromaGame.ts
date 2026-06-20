import { useState, useEffect, useCallback, useRef } from "react";

// Tipe untuk fase permainan, membantu state machine mengontrol tampilan dan aksi pengguna
export type GamePhase = "IDLE" | "PREP" | "PLAY" | "CHECK";

// Interface standar untuk mendefinisikan objek warna dan nilai Hexadecimal-nya
export interface GameColor {
  name: string;
  hex: string;
}

// Koleksi warna yang tersedia di permainan
export const COLORS: GameColor[] = [
  { name: "MERAH", hex: "#EF4444" }, // Red-500 dari Tailwind
  { name: "KUNING", hex: "#EAB308" }, // Yellow-500
  { name: "BIRU", hex: "#3B82F6" }, // Blue-500
  { name: "HIJAU", hex: "#22C55E" }, // Green-500
];

/**
 * Custom Hook: `useChromaGame`
 * Bertanggung jawab menangani semua logikan bisnis ("game state", timer, pengatur rintangan warna).
 * Dengan memisahkannya, komponen UI (page.tsx) akan tetap rapi dan bersih.
 */
export function useChromaGame() {
  // State dasar game
  const [phase, setPhase] = useState<GamePhase>("IDLE");
  const [countdown, setCountdown] = useState<number>(0);
  const [groupName, setGroupName] = useState<string>("");

  // State untuk tantangan (warna vs tulisan)
  const [targetWord, setTargetWord] = useState<GameColor>(COLORS[0]);
  const [displayColor, setDisplayColor] = useState<GameColor>(COLORS[0]);

  // Digunakan untuk melacak interval timeout agar bisa dibersihkan secara presisi
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Fungsi untuk mendapatkan kata acak dan warna acak yang DIJAMIN BERBEDA,
   * Agar tantangan "menelepon petak yang mana" ada jebakannya (misal Kata Kuning, Font Hijau).
   */
  const randomizeColors = useCallback(() => {
    const randomWordIdx = Math.floor(Math.random() * COLORS.length);
    let randomColorIdx = Math.floor(Math.random() * COLORS.length);

    // Looping hingga warna font dan nama kata berbeda
    while (randomColorIdx === randomWordIdx) {
      randomColorIdx = Math.floor(Math.random() * COLORS.length);
    }

    setTargetWord(COLORS[randomWordIdx]);
    setDisplayColor(COLORS[randomColorIdx]);
  }, []);

  /**
   * Mulai inisiasi permainan dengan memindah ke fase PREP (hitung mundur awalan)
   */
  const startGame = useCallback(() => {
    setPhase("PREP");
    setCountdown(5); // Angka 5 detik pertama untuk bersiap
  }, []);

  /**
   * Menghentikan atau nge-reset ulang game dengan paksa
   */
  const stopGame = useCallback(() => {
    setPhase("IDLE");
    setCountdown(0);
  }, []);

  /**
   * Mereset teka-teki logika game dan memindahkan ke mode bermain aktif
   */
  const nextRound = useCallback(() => {
    randomizeColors();
    setPhase("PLAY");
    setCountdown(3); // Pemain punya waktu 3 detik bereaksi
  }, [randomizeColors]);

  /**
   * Admin-Only: memperlama masa tunggu pemeriksaan peserta
   */
  const addCheckTime = useCallback(() => {
    if (phase === "CHECK") {
      setCountdown((prev) => prev + 10);
    }
  }, [phase]);

  /**
   * SISTEM LOOP PERMAINAN SEAMLESS
   * Memakai satu useEffect untuk menangkap transisi tanpa memanggil render yang bocor.
   */
  useEffect(() => {
    if (phase === "IDLE") return; // Timer tidak jalan bila idle

    let timeoutDelay = 1000; // Timer jalan tiap detik

    // Apabila hitungan habis (<=0), jangan lakukan jeda ekstra sedetik lagi, langsung eksekusi logika.
    if (countdown <= 0) {
      timeoutDelay = 0; // Transisi state secara asinkron super-cepat
    }

    timerRef.current = setTimeout(() => {
      // Cabang Logika (State Machine Transisi) saat timer nol:
      if (countdown <= 0) {
        if (phase === "PREP") {
          nextRound(); // Persiapan selesai -> Mulai Rounde-nya
        } else if (phase === "PLAY") {
          // Fase main selesai -> Cek posisi penjaga (kasih 15 detik)
          setPhase("CHECK");
          setCountdown(15);
        } else if (phase === "CHECK") {
          // Waktu pengecekan selesai -> Gulir lagi otomatis ke ronde baru
          nextRound();
        }
      } else {
        // Apabila waktu blm habis, kurangi waktu dengan aman via callback functional
        setCountdown((c) => c - 1);
      }
    }, timeoutDelay);

    // Garbage-Collection: Bersihkan timeout usang setiap efekk dire-evaluasi
    return () => clearTimeout(timerRef.current as NodeJS.Timeout);
  }, [phase, countdown, nextRound]);

  // Expose Data & Method keluar ke UI
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
