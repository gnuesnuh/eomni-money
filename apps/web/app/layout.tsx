import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "엄니머니 - 엄마를 위한 주식 입문",
  description: "뉴스를 아들·딸·며느리·사위가 설명해주는 시니어 주식 입문 앱",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-white text-gray-900 antialiased">
        <div className="mx-auto max-w-md min-h-screen bg-white shadow-sm">
          {children}
        </div>
      </body>
    </html>
  );
}
