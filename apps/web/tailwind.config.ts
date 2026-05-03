import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Pretendard 우선 + 시스템 폰트 fallback chain (queenit 스택 참고)
        sans: [
          '"Pretendard Variable"',
          "Pretendard",
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          '"Apple SD Gothic Neo"',
          '"Malgun Gothic"',
          '"Noto Sans KR"',
          "sans-serif",
        ],
        // 디스플레이 — 랜딩 페이지의 큰 헤드라인용 (Gowun Dodum)
        display: [
          "var(--font-display)",
          '"Pretendard Variable"',
          "Pretendard",
          "system-ui",
          "sans-serif",
        ],
        // 숫자 전용 — 등폭 숫자가 필요한 가격·등락률 표시 위치에 사용 (font-numeric 클래스)
        numeric: [
          '"Pretendard Variable"',
          "Pretendard",
          "Tahoma",
          "Verdana",
          "system-ui",
          "sans-serif",
        ],
      },
      fontSize: {
        // 기존 size scale (랜딩 페이지 등에서 사용 중) — 시니어 가독성 기본 18px
        base: ["18px", { lineHeight: "1.7" }],
        lg: ["20px", { lineHeight: "1.7" }],
        xl: ["24px", { lineHeight: "1.6" }],
        "2xl": ["28px", { lineHeight: "1.5" }],
        "3xl": ["34px", { lineHeight: "1.4" }],

        // 시맨틱 위계 토큰 — 시작값. 디자이너 결정 후 조정.
        // 사용: text-display / text-title / text-heading / text-body-lg / text-body / text-sub / text-caption
        // weight는 토큰에 묶지 않음 — 사용처에서 font-medium / font-semibold / font-bold로 명시.
        display: ["32px", { lineHeight: "1.2", letterSpacing: "-0.02em" }],
        // 카드 메인 헤드라인 — App Store Today 톤. display와 title 사이.
        "headline-card": ["28px", { lineHeight: "1.2", letterSpacing: "-0.015em" }],
        title: ["24px", { lineHeight: "1.35", letterSpacing: "-0.01em" }],
        heading: ["19px", { lineHeight: "1.4", letterSpacing: "-0.005em" }],
        "body-lg": ["18px", { lineHeight: "1.6" }],
        body: ["16px", { lineHeight: "1.6" }],
        sub: ["14px", { lineHeight: "1.5" }],
        caption: ["13px", { lineHeight: "1.45" }],
      },
      colors: {
        bubble: {
          son: "#E0F2FE",
          daughter: "#FCE7F3",
          dil: "#F3E8FF",
          sil: "#E0E7FF",
        },
        badge: {
          cheap: "#10B981",
          expensive: "#8B5CF6",
          hot: "#F97316",
          warning: "#EF4444",
          newsy: "#3B82F6",
        },
      },
    },
  },
  plugins: [],
};

export default config;
