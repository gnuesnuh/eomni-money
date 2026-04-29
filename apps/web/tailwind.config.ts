import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-noto-kr)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-noto-kr)", "system-ui", "sans-serif"],
      },
      fontSize: {
        // 시니어 가독성: 기본 18px 부터
        base: ["18px", { lineHeight: "1.7" }],
        lg: ["20px", { lineHeight: "1.7" }],
        xl: ["24px", { lineHeight: "1.6" }],
        "2xl": ["28px", { lineHeight: "1.5" }],
        "3xl": ["34px", { lineHeight: "1.4" }],
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
