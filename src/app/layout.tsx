import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const isProd = process.env.NODE_ENV === "production";
const basePath = isProd ? "/MOBFT26-GameRally" : "";

export const metadata: Metadata = {
  title: "Chroma Core Alignment",
  description: "Web Interaktif untuk bermain tebak logika warna vs teks",
  icons: {
    icon: `${basePath}/logo-mob-ft-2026.webp`,
    apple: `${basePath}/logo-mob-ft-2026.webp`,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased bg-black`}
    >
      <body className="min-h-full flex flex-col bg-black text-white">
        {children}
      </body>
    </html>
  );
}
