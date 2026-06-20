"use client";

import { useEffect, useRef } from "react";

/**
 * 3D Pseudo-Particle Background
 * Merender titik-titik bintang/partikel yang terbang mendekat ke arah layar.
 * Diwarnai menggunakan paduan 4 warna tema game (Merah, Kuning, Biru, Hijau).
 */
export default function Background3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    // Kumpulan titik 3D
    const particles: { x: number; y: number; z: number; color: string }[] = [];
    const colors = ["#EF4444", "#EAB308", "#3B82F6", "#22C55E"];
    const numParticles = 250;

    // Inisialisasi posisi random
    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: (Math.random() - 0.5) * 2000,
        y: (Math.random() - 0.5) * 2000,
        z: Math.random() * 2000,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    let animationFrameId: number;

    const render = () => {
      // Hapus layer dengan alpha tipis untuk membuat efek ekor (trail)
      ctx.shadowBlur = 0; // PENTING: membersihkan efek glow partikel sebelumnya
      ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
      ctx.fillRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;

      for (let i = 0; i < numParticles; i++) {
        const p = particles[i];

        // Partikel maju mendekati kemera (nilai Z terus berkurang)
        p.z -= 4;

        if (p.z <= 1) {
          // Reset partikel jauh di belakang setelah melewati pandangan
          p.z = 2000;
          p.x = (Math.random() - 0.5) * 2000;
          p.y = (Math.random() - 0.5) * 2000;
        }

        // Proyeksi Pseudo-3D
        const focalLength = 300;
        const scale = focalLength / (focalLength + p.z);

        const x2d = cx + p.x * scale;
        const y2d = cy + p.y * scale;

        // Render jika di dalam batas layar
        if (x2d > 0 && x2d < w && y2d > 0 && y2d < h) {
          ctx.beginPath();
          // Ukuran bertambah besar jika semakin dekat
          const radius = Math.max(2.5 * scale, 0.5);
          ctx.arc(x2d, y2d, radius, 0, Math.PI * 2);

          // Glow neon premium
          ctx.fillStyle = p.color;
          ctx.shadowBlur = 10 * scale;
          ctx.shadowColor = p.color;
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    // Pastikan ukuran canvas reaktif
    const handleResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none -z-20 bg-black"
    />
  );
}
