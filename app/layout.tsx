import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Noto_Sans_KR, Sora } from "next/font/google";
import "./globals.css";

const bodyFont = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "700", "800", "900"],
  variable: "--font-body",
  display: "swap"
});

const displayFont = Sora({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-display",
  display: "swap"
});

export const metadata: Metadata = {
  title: "R-FORCE",
  applicationName: "R-FORCE",
  description: "AI 기반 근력운동 기록 및 추천 플랫폼"
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ko" data-theme="dark" suppressHydrationWarning>
      <body className={`${bodyFont.variable} ${displayFont.variable}`}>{children}</body>
    </html>
  );
}
