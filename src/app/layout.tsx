import type { Metadata, Viewport } from "next";
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
const siteUrl = "https://blurryface275.github.io/MOBFT26-GameRally";

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Chroma Core Alignment MOB FT 2026 | Fakultas Teknik UBAYA",
    template: "%s | MOB FT 2026",
  },
  description:
    "Web Game Interaktif Chroma Core Alignment untuk MOB FT 2026. Permainan logika visual.",
  keywords: [
    "MOB FT 2026",
    "Game Rally MOB FT 2026",
    "Chroma Core Alignment",
    "Stroop Effect Game",
    "Game Logika Warna",
    "Fakultas Teknik 2026",
    "Game Pos Penpos",
  ],
  authors: [{ name: "Panitia MOB FT 2026" }],
  creator: "Panitia MOB FT 2026",
  publisher: "MOB FT 2026",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
  icons: {
    icon: `${basePath}/logo-mob-ft-2026.webp`,
    apple: `${basePath}/logo-mob-ft-2026.webp`,
    shortcut: `${basePath}/logo-mob-ft-2026.webp`,
  },
  openGraph: {
    title: {
      default: "MOB FT 2026 | Chroma Core Alignment",
      template: "%s | MOB FT 2026",
    },
    description:
      "Web Game Interaktif Chroma Core Alignment untuk Pos Game Rally MOB FT 2026.",
    url: siteUrl,
    siteName: "MOB FT 2026 - Chroma Core Alignment",
    locale: "id_ID",
    type: "website",
    images: [
      {
        url: `${basePath}/logo-mob-ft-2026.webp`,
        width: 512,
        height: 512,
        alt: "Logo MOB FT 2026",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: {
      default: "MOB FT 2026 | Chroma Core Alignment",
      template: "%s | MOB FT 2026",
    },
    description:
      "Web Game Interaktif Chroma Core Alignment untuk Pos Game Rally MOB FT 2026.",
    images: [`${basePath}/logo-mob-ft-2026.webp`],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Chroma Core Alignment",
  applicationCategory: "GameApplication",
  operatingSystem: "Any",
  url: siteUrl,
  description:
    "Web Game Interaktif Chroma Core Alignment untuk Pos Game Rally MOB FT 2026.",
  author: {
    "@type": "Organization",
    name: "MOB FT 2026",
  },
  image: `${siteUrl}/logo-mob-ft-2026.webp`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased bg-black`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-black text-white selection:bg-white selection:text-black">
        {children}
      </body>
    </html>
  );
}
