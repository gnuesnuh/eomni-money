"use client";

import { useState } from "react";
import type {
  ExplainMoreMode,
  NewsCardData,
  SpeakerType,
} from "@eomni/shared";
import { useSpeak } from "@/lib/speak";

export type WhyKind = "cheap" | "exp" | "hot" | "now";

const TONE: Record<
  WhyKind,
  {
    bubbleBg: string;
    bubbleBorder: string;
    whoText: string;
    whoLabel: (idx: number) => string;
  }
> = {
  cheap: {
    bubbleBg: "bg-red-50",
    bubbleBorder: "border-red-200",
    whoText: "text-red-700",
    whoLabel: (i) => `싸진 이유 ${i}`,
  },
  exp: {
    bubbleBg: "bg-purple-50",
    bubbleBorder: "border-purple-200",
    whoText: "text-purple-700",
    whoLabel: (i) => `비싸진 이유 ${i}`,
  },
  hot: {
    bubbleBg: "bg-orange-50",
    bubbleBorder: "border-orange-200",
    whoText: "text-orange-700",
    whoLabel: (i) => `뜨는 이유 ${i}`,
  },
  now: {
    bubbleBg: "bg-yellow-50",
    bubbleBorder: "border-yellow-200",
    whoText: "text-amber-700",
    whoLabel: () => "오늘 소식",
  },
};

const SPEAKER_EMOJI: Record<SpeakerType, string> = {
  son: "👦",
  daughter: "👧",
  daughter_in_law: "👩",
  son_in_law: "👨",
};

interface Props {
  news: NewsCardData;
  index: number;
  why: WhyKind;
  langDefault?: "ko" | "en";
}

type MiniState =
  | { kind: "idle" }
  | { kind: "loading"; mode: ExplainMoreMode }
  | { kind: "shown"; mode: ExplainMoreMode; bubble: string };

export function CompactNewsItem({
  news,
  index,
  why,
  langDefault = "ko",
}: Props) {
  const tone = TONE[why];
  const ownerId = `compact-${news.id}`;
  const { speak, stop, speaking, supported } = useSpeak(ownerId);
  const [lang, setLang] = useState<"ko" | "en">(langDefault);
  const [mini, setMini] = useState<MiniState>({ kind: "idle" });

  const showingKo = lang === "ko" && !!news.headlineKo;
  const headline = showingKo
    ? (news.headlineKo as string)
    : news.headlineEn;
  const summary = showingKo ? news.summaryKo : news.summaryEn;

  async function ask(mode: ExplainMoreMode) {
    // 동일 모드 토글: 이미 보이는 같은 모드면 닫기
    if (mini.kind === "shown" && mini.mode === mode) {
      setMini({ kind: "idle" });
      return;
    }
    setMini({ kind: "loading", mode });
    try {
      const apiBase =
        process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";
      const res = await fetch(`${apiBase}/api/news/${news.id}/explain`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode }),
      });
      const data = await res.json();
      if (!res.ok || !data.bubble) throw new Error(data.message ?? "실패");
      setMini({ kind: "shown", mode, bubble: data.bubble });
    } catch {
      setMini({ kind: "idle" });
    }
  }

  return (
    <article className="border-b border-gray-100 px-4 py-3 last:border-b-0">
      {/* meta */}
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-gray-500">{news.source}</span>
        <span className="text-xs text-gray-400">{news.publishedAt}</span>
      </div>

      {/* headline */}
      <h3 className="text-base font-semibold leading-snug text-gray-900 mb-1.5">
        {headline}
      </h3>

      {/* short summary */}
      {summary && (
        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-2">
          {summary}
        </p>
      )}

      {/* 카테고리 톤 말풍선 */}
      <div
        className={`rounded-lg border px-3 py-2 ${tone.bubbleBg} ${tone.bubbleBorder}`}
      >
        <div className={`flex items-center gap-1.5 text-xs font-semibold mb-1 ${tone.whoText}`}>
          <span>{SPEAKER_EMOJI[news.speakerType]}</span>
          <span>{tone.whoLabel(index + 1)}</span>
          {supported && (
            <button
              onClick={() =>
                speaking ? stop() : speak(news.bubble, news.speakerType)
              }
              className="ml-auto rounded-full w-7 h-7 flex items-center justify-center bg-white/70 hover:bg-white"
              aria-label={speaking ? "읽기 중지" : "음성으로 읽기"}
            >
              <span className="text-sm">{speaking ? "⏸" : "🔊"}</span>
            </button>
          )}
        </div>
        <p className="text-sm leading-relaxed text-gray-800 whitespace-pre-line">
          {news.bubble}
        </p>
      </div>

      {/* micro buttons + 한국어/원문 토글 */}
      <div className="flex items-center gap-1.5 mt-2 flex-wrap">
        <button
          onClick={() => ask("simpler")}
          disabled={mini.kind === "loading"}
          className={`text-xs rounded-full border px-3 py-1 transition disabled:opacity-50 ${
            mini.kind === "shown" && mini.mode === "simpler"
              ? "bg-orange-50 border-orange-300 text-orange-700"
              : "border-gray-200 bg-white text-gray-700"
          }`}
        >
          😅 어려워요
        </button>
        <button
          onClick={() => ask("deeper")}
          disabled={mini.kind === "loading"}
          className={`text-xs rounded-full border px-3 py-1 transition disabled:opacity-50 ${
            mini.kind === "shown" && mini.mode === "deeper"
              ? "bg-purple-50 border-purple-300 text-purple-700"
              : "border-gray-200 bg-white text-gray-700"
          }`}
        >
          🤔 더 알고싶어
        </button>
        {news.headlineKo && (
          <button
            onClick={() => setLang(lang === "ko" ? "en" : "ko")}
            className="ml-auto text-xs text-gray-500 underline"
          >
            {lang === "ko" ? "원문" : "한국어"}
          </button>
        )}
      </div>

      {/* mini answer */}
      {mini.kind === "loading" && (
        <div className="mt-2 rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-500 text-center">
          {mini.mode === "simpler"
            ? "더 쉽게 설명 중..."
            : "더 자세히 설명 중..."}
        </div>
      )}
      {mini.kind === "shown" && (
        <div
          className={`mt-2 rounded-lg px-3 py-2 ${
            mini.mode === "simpler"
              ? "bg-orange-50 border border-orange-200"
              : "bg-purple-50 border border-purple-200"
          }`}
        >
          <div
            className={`text-xs font-semibold mb-1 ${
              mini.mode === "simpler" ? "text-orange-700" : "text-purple-700"
            }`}
          >
            {SPEAKER_EMOJI[news.speakerType]}{" "}
            {mini.mode === "simpler" ? "더 쉽게!" : "더 자세히!"}
          </div>
          <p className="text-sm leading-relaxed text-gray-800 whitespace-pre-line">
            {mini.bubble}
          </p>
        </div>
      )}
    </article>
  );
}
