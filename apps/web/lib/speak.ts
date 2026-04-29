"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { SpeakerType } from "@eomni/shared";

// 동시에 여러 말풍선이 동시 재생되지 않도록 하는 전역 controller
const globalState = {
  currentUtterance: null as SpeechSynthesisUtterance | null,
  currentOwner: null as string | null,
  listeners: new Set<() => void>(),
};

function notify() {
  globalState.listeners.forEach((fn) => fn());
}

function isSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

// OS/브라우저별 사용 가능 한국어 보이스에서 화자 페르소나에 가까운 것을 선택.
// male / female 키워드 휴리스틱이라 완벽하진 않지만 iOS/macOS Safari, Chrome 모두에서 동작.
function pickVoice(speakerType: SpeakerType): SpeechSynthesisVoice | null {
  if (!isSupported()) return null;
  const voices = window.speechSynthesis.getVoices();
  const koVoices = voices.filter((v) => v.lang?.startsWith("ko"));
  if (koVoices.length === 0) return null;

  const preferMale = speakerType === "son" || speakerType === "son_in_law";
  const maleHints = ["male", "joon", "minjun", "kyuhyun", "vdaeun"];
  const femaleHints = ["female", "yuna", "sora", "vara", "nara", "seoyeon"];

  const lower = (s: string) => (s ?? "").toLowerCase();
  const score = (v: SpeechSynthesisVoice): number => {
    const text = lower(v.name) + " " + lower(v.voiceURI ?? "");
    if (preferMale) {
      if (maleHints.some((h) => text.includes(h))) return 2;
      if (femaleHints.some((h) => text.includes(h))) return 0;
      return 1;
    } else {
      if (femaleHints.some((h) => text.includes(h))) return 2;
      if (maleHints.some((h) => text.includes(h))) return 0;
      return 1;
    }
  };
  const sorted = koVoices.slice().sort((a, b) => score(b) - score(a));
  return sorted[0] ?? null;
}

export function useSpeak(ownerId: string) {
  const [speaking, setSpeaking] = useState(false);
  const [supported, setSupported] = useState(false);
  const subscribed = useRef(false);

  useEffect(() => {
    setSupported(isSupported());
    if (!isSupported()) return;

    // 보이스 목록은 일부 브라우저에서 비동기 로드됨
    const handle = () => {
      // pre-warm voices list
      window.speechSynthesis.getVoices();
    };
    window.speechSynthesis.addEventListener?.("voiceschanged", handle);

    if (!subscribed.current) {
      subscribed.current = true;
      const fn = () => {
        setSpeaking(globalState.currentOwner === ownerId);
      };
      globalState.listeners.add(fn);
      return () => {
        globalState.listeners.delete(fn);
        window.speechSynthesis.removeEventListener?.("voiceschanged", handle);
      };
    }
    return () => {
      window.speechSynthesis.removeEventListener?.("voiceschanged", handle);
    };
  }, [ownerId]);

  const speak = useCallback(
    (text: string, speakerType: SpeakerType) => {
      if (!isSupported()) return;
      // 이전 발화 중지
      window.speechSynthesis.cancel();

      const u = new SpeechSynthesisUtterance(text);
      const v = pickVoice(speakerType);
      if (v) u.voice = v;
      u.lang = v?.lang ?? "ko-KR";
      u.rate = 0.9; // 시니어용 살짝 느리게
      u.pitch = 1.0;
      u.volume = 1.0;

      u.onend = () => {
        if (globalState.currentOwner === ownerId) {
          globalState.currentOwner = null;
          globalState.currentUtterance = null;
          notify();
        }
      };
      u.onerror = u.onend;

      globalState.currentUtterance = u;
      globalState.currentOwner = ownerId;
      notify();
      window.speechSynthesis.speak(u);
    },
    [ownerId],
  );

  const stop = useCallback(() => {
    if (!isSupported()) return;
    window.speechSynthesis.cancel();
    globalState.currentOwner = null;
    globalState.currentUtterance = null;
    notify();
  }, []);

  return { speak, stop, speaking, supported };
}
