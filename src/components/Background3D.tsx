"use client";

import { useEffect, useRef } from "react";

const THEME_COLORS = ["#EF4444", "#EAB308", "#3B82F6", "#22C55E"];
const NUM_PARTICLES = 250;

/**
 * Pre-renders glowing particle textures onto offscreen canvases.
 * This completely avoids expensive CPU `ctx.shadowBlur` calculations every frame.
 */
function createParticleSprites(): Map<string, HTMLCanvasElement> {
  const spriteMap = new Map<string, HTMLCanvasElement>();

  if (typeof window === "undefined") return spriteMap;

  const spriteSize = 64;
  const center = spriteSize / 2;

  for (const color of THEME_COLORS) {
    const canvas = document.createElement("canvas");
    canvas.width = spriteSize;
    canvas.height = spriteSize;
    const ctx = canvas.getContext("2d");

    if (ctx) {
      const gradient = ctx.createRadialGradient(
        center,
        center,
        0,
        center,
        center,
        center
      );
      gradient.addColorStop(0, "#FFFFFF");
      gradient.addColorStop(0.2, color);
      gradient.addColorStop(0.6, `${color}66`); // 40% alpha glow
      gradient.addColorStop(1, "transparent");

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(center, center, center, 0, Math.PI * 2);
      ctx.fill();
    }

    spriteMap.set(color, canvas);
  }

  return spriteMap;
}

/**
 * 3D Pseudo-Particle Background
 * Merender titik-titik bintang/partikel yang terbang mendekat ke arah layar.
 * Dioptimasi dengan GPU-accelerated sprite caching, Retina High-DPI scaling,
 * dan Tab Visibility API listener untuk efisiensi daya 60 FPS.
 */
export default function Background3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const sprites = createParticleSprites();

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = window.innerWidth;
    let h = window.innerHeight;

    const setupCanvasSize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.scale(dpr, dpr);
    };

    setupCanvasSize();

    // Kumpulan titik 3D
    const particles = Array.from({ length: NUM_PARTICLES }, () => ({
      x: (Math.random() - 0.5) * 2000,
      y: (Math.random() - 0.5) * 2000,
      z: Math.random() * 2000,
      color: THEME_COLORS[Math.floor(Math.random() * THEME_COLORS.length)],
    }));

    let animationFrameId: number;
    let isVisible = true;

    const render = () => {
      if (!isVisible) return;

      // Hapus layer dengan alpha tipis untuk membuat efek ekor (trail)
      ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
      ctx.fillRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;
      const focalLength = 300;

      for (let i = 0; i < NUM_PARTICLES; i++) {
        const p = particles[i];

        // Partikel maju mendekati kamera (nilai Z berkurang)
        p.z -= 4;

        if (p.z <= 1) {
          p.z = 2000;
          p.x = (Math.random() - 0.5) * 2000;
          p.y = (Math.random() - 0.5) * 2000;
        }

        // Proyeksi Pseudo-3D
        const scale = focalLength / (focalLength + p.z);
        const x2d = cx + p.x * scale;
        const y2d = cy + p.y * scale;

        // Render jika di dalam batas layar
        if (x2d > -50 && x2d < w + 50 && y2d > -50 && y2d < h + 50) {
          const sprite = sprites.get(p.color);
          const size = Math.max(16 * scale, 3);
          const halfSize = size / 2;

          if (sprite) {
            ctx.drawImage(
              sprite,
              x2d - halfSize,
              y2d - halfSize,
              size,
              size
            );
          } else {
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(x2d, y2d, Math.max(2 * scale, 0.5), 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    // Responsive resize handler with throttling
    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(setupCanvasSize, 100);
    };

    // Tab visibility handling to pause animation when inactive
    const handleVisibilityChange = () => {
      if (document.hidden) {
        isVisible = false;
        cancelAnimationFrame(animationFrameId);
      } else {
        if (!isVisible) {
          isVisible = true;
          render();
        }
      }
    };

    window.addEventListener("resize", handleResize, { passive: true });
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      clearTimeout(resizeTimeout);
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
