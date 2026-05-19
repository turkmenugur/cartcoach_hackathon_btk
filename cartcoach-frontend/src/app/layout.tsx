import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "BUFF Store — Gemini AI Destekli Premium Tech Commerce",
  description:
    "Gemini AI destekli multi-agent mimarisiyle teknoloji sepeti riskini analiz eden, kararsizligi cozen ve marj korumali teklif ureten premium e-ticaret deneyimi. BTK & Google AI Hackathon 2026.",
  keywords: [
    "BUFF Store",
    "sepet kurtarma",
    "premium teknoloji",
    "e-ticaret",
    "yapay zeka",
    "Gemini AI",
    "LangGraph",
    "multi-agent",
  ],
  openGraph: {
    title: "BUFF Store — AI Destekli Premium Tech Commerce",
    description:
      "Teknoloji sepeti terk riskini otonom olarak analiz eden ve akilli ikna stratejileri ureten multi-agent sistem.",
    type: "website",
    locale: "tr_TR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-toast focus:rounded-lg focus:bg-primary-600 focus:px-4 focus:py-2 focus:text-white focus:shadow-lg"
        >
          Icerige atla
        </a>
        {children}
      </body>
    </html>
  );
}
