import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/MOBFT26-GameRally",
  images: {
    unoptimized: true, // Export static tidak mendukung optimasi gambar server
  },
};

export default nextConfig;
