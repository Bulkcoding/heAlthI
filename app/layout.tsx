import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "REPFORGE",
  description: "AI 기반 근력운동 기록 및 추천 플랫폼"
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ko" data-theme="dark" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
