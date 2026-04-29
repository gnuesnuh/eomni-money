import type { Metadata, Viewport } from "next";
import { Noto_Sans_KR, Gowun_Dodum } from "next/font/google";
import { LocaleProvider } from "@/lib/i18n";
import "./globals.css";

const notoKr = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-noto-kr",
  display: "swap",
});

// Gmarket Sans는 next/font 미지원이라 Gowun Dodum (둥근 한글 디스플레이체) 으로 대체.
const display = Gowun_Dodum({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "엄니머니 — 엄마의 첫 번째 머니 앱",
  description:
    "뉴스를 아들·딸·며느리·사위가 설명해주는 시니어 주식 입문 앱. 어려운 금융 용어 없이, 초등 3학년도 이해하는 수준으로.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#FBF9F6",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={`${notoKr.variable} ${display.variable}`}>
      <body className="min-h-screen bg-stone-50 text-gray-900 antialiased font-sans">
        <LocaleProvider>{children}</LocaleProvider>
      </body>
    </html>
  );
}
