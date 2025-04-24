import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Todo App - 할 일 관리를 더 쉽고 편리하게",
  description: "캘린더와 게시판으로 당신의 일정을 효율적으로 관리하세요. 직관적인 인터페이스로 쉽게 사용할 수 있습니다.",
  keywords: ["todo", "할일관리", "캘린더", "게시판", "일정관리"],
  authors: [{ name: "Todo App Team" }],
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
