"use client";

import { useCallback, useEffect, useState } from "react";

const SUB_KEY = "eomni:subscription";
const VIEW_KEY = "eomni:newsView";

const FREE_DAILY_LIMIT = 5; // 스펙 §2-5: 무료 하루 5개

interface ViewState {
  date: string; // YYYY-MM-DD (사용자 로컬)
  count: number;
}

function todayKey(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function readSub(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(SUB_KEY) === "true";
}

function readViews(): ViewState {
  if (typeof window === "undefined") return { date: todayKey(), count: 0 };
  try {
    const raw = window.localStorage.getItem(VIEW_KEY);
    if (!raw) return { date: todayKey(), count: 0 };
    const parsed = JSON.parse(raw) as ViewState;
    if (parsed.date !== todayKey()) {
      // 자정 지나면 카운트 리셋
      return { date: todayKey(), count: 0 };
    }
    return parsed;
  } catch {
    return { date: todayKey(), count: 0 };
  }
}

function writeViews(v: ViewState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(VIEW_KEY, JSON.stringify(v));
}

export const FREE_LIMIT = FREE_DAILY_LIMIT;

export function useSubscription() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [views, setViews] = useState<ViewState>({
    date: todayKey(),
    count: 0,
  });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setIsSubscribed(readSub());
    setViews(readViews());
    setLoaded(true);
  }, []);

  const setSubscribed = useCallback((sub: boolean) => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(SUB_KEY, String(sub));
    setIsSubscribed(sub);
  }, []);

  const recordViews = useCallback((shownCount: number) => {
    // 페이지 진입 시 N건이 화면에 노출됐다는 사실을 기록.
    // 같은 날 더 큰 수가 들어오면 갱신, 작은 수면 무시 (이미 본 카운트 안 깎이게)
    const cur = readViews();
    const next: ViewState = {
      date: todayKey(),
      count: Math.max(cur.count, shownCount),
    };
    writeViews(next);
    setViews(next);
  }, []);

  const remaining = Math.max(0, FREE_DAILY_LIMIT - views.count);
  const limitReached = !isSubscribed && views.count >= FREE_DAILY_LIMIT;

  return {
    loaded,
    isSubscribed,
    setSubscribed,
    viewCount: views.count,
    remaining,
    limitReached,
    recordViews,
    freeLimit: FREE_DAILY_LIMIT,
  };
}
