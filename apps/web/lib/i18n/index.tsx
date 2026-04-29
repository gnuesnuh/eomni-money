"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  MESSAGES,
  type Locale,
  type Messages,
} from "./messages";

const KEY = "eomni:locale";

interface LocaleContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: Messages;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

function detectInitial(): Locale {
  if (typeof window === "undefined") return "ko";
  const stored = window.localStorage.getItem(KEY) as Locale | null;
  if (stored === "ko" || stored === "ja") return stored;
  // 브라우저 언어로 첫 진입 자동 감지
  const lang = navigator.language?.toLowerCase() ?? "";
  if (lang.startsWith("ja")) return "ja";
  return "ko";
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("ko");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setLocaleState(detectInitial());
    setHydrated(true);
  }, []);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(KEY, l);
    }
  }, []);

  const t = MESSAGES[locale];

  // 첫 hydration 전엔 ko 로 일관 (mismatch 방지)
  const value = { locale: hydrated ? locale : "ko", setLocale, t: hydrated ? t : MESSAGES.ko };

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useT(): Messages {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    // Provider 밖에서 호출되면 ko 폴백 — 컴포넌트 단위 테스트 시 안전망
    return MESSAGES.ko;
  }
  return ctx.t;
}

export function useLocale(): { locale: Locale; setLocale: (l: Locale) => void } {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    return { locale: "ko", setLocale: () => undefined };
  }
  return { locale: ctx.locale, setLocale: ctx.setLocale };
}

export type { Locale, Messages } from "./messages";
