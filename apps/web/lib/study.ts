"use client";

import { useCallback, useEffect, useState } from "react";

const KEY = "eomni:study";

export type BadgeKind =
  | "sprout" // 🌱 레슨 1 완료
  | "trophy" // 🏆 레슨 1 만점
  | "growth" // 📈 레슨 2 완료
  | "explorer" // 🔍 레슨 3 완료
  | "master"; // 👑 전체 완료

export interface StudyState {
  totalScore: number;
  streakDays: number;
  lastStudyDate: string | null; // YYYY-MM-DD
  completed: number[]; // 완료한 레슨 id
  perfectLessons: number[]; // 만점 레슨 id
  badges: BadgeKind[];
  shareRewardDays: number; // 자랑하기 리워드로 적립된 누적 구독일
}

const DEFAULT_STATE: StudyState = {
  totalScore: 0,
  streakDays: 0,
  lastStudyDate: null,
  completed: [],
  perfectLessons: [],
  badges: [],
  shareRewardDays: 0,
};

function todayKey(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function dayDiff(from: string, to: string): number {
  return Math.round(
    (new Date(to).getTime() - new Date(from).getTime()) / 86400000,
  );
}

function read(): StudyState {
  if (typeof window === "undefined") return DEFAULT_STATE;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return DEFAULT_STATE;
    return { ...DEFAULT_STATE, ...JSON.parse(raw) } as StudyState;
  } catch {
    return DEFAULT_STATE;
  }
}

function write(s: StudyState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(s));
}

export function useStudy() {
  const [state, setState] = useState<StudyState>(DEFAULT_STATE);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setState(read());
    setLoaded(true);
  }, []);

  // 오늘 처음 학습 기록 → streak 갱신
  const touchStreak = useCallback(() => {
    setState((prev) => {
      const today = todayKey();
      if (prev.lastStudyDate === today) return prev; // 오늘 이미 카운트됨
      let streak = 1;
      if (prev.lastStudyDate) {
        const diff = dayDiff(prev.lastStudyDate, today);
        if (diff === 1) streak = prev.streakDays + 1;
        else if (diff === 0) streak = prev.streakDays;
      }
      const next = { ...prev, lastStudyDate: today, streakDays: streak };
      write(next);
      return next;
    });
  }, []);

  const addScore = useCallback((delta: number) => {
    setState((prev) => {
      const next = { ...prev, totalScore: prev.totalScore + delta };
      write(next);
      return next;
    });
  }, []);

  const completeLesson = useCallback(
    (lessonId: number, perfect: boolean, badge: BadgeKind) => {
      setState((prev) => {
        const completed = prev.completed.includes(lessonId)
          ? prev.completed
          : [...prev.completed, lessonId];
        const perfectLessons =
          perfect && !prev.perfectLessons.includes(lessonId)
            ? [...prev.perfectLessons, lessonId]
            : prev.perfectLessons;
        const badges = prev.badges.includes(badge)
          ? prev.badges
          : [...prev.badges, badge];
        const next = {
          ...prev,
          completed,
          perfectLessons,
          badges,
          totalScore: prev.totalScore + 20 + (perfect ? 30 : 0), // 완료 +20, 만점 보너스 +30
        };
        write(next);
        return next;
      });
    },
    [],
  );

  const recordShareReward = useCallback((days: number) => {
    setState((prev) => {
      const next = { ...prev, shareRewardDays: prev.shareRewardDays + days };
      write(next);
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    write(DEFAULT_STATE);
    setState(DEFAULT_STATE);
  }, []);

  return {
    loaded,
    state,
    touchStreak,
    addScore,
    completeLesson,
    recordShareReward,
    reset,
  };
}
