import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  output: "export",
  // Gunakan basePath hanya saat build production untuk GitHub Pages
  basePath: isProd ? "/MOBFT26-GameRally" : "",
  images: {
    unoptimized: true, // Export static tidak mendukung optimasi gambar server
  },
};

export default nextConfig;
