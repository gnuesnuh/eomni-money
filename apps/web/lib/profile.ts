"use client";

import { useEffect, useState } from "react";
import type { LearningLevel, SpeakerType, TargetType } from "@eomni/shared";

export interface Profile {
  speakerType: SpeakerType;
  targetType: TargetType;
  targetName: string;
  level: LearningLevel;
}

const KEY = "eomni:profile";

export function readProfile(): Profile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Profile;
  } catch {
    return null;
  }
}

export function writeProfile(p: Profile) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(p));
}

export function clearProfile() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
}

// 클라이언트 컴포넌트에서 hydration mismatch 없이 프로필 사용
export function useProfile(): { profile: Profile | null; loaded: boolean } {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    setProfile(readProfile());
    setLoaded(true);
  }, []);
  return { profile, loaded };
}
