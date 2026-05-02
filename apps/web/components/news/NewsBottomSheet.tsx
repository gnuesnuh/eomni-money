"use client";

import { useState } from "react";
import type { SpeakerType } from "@eomni/shared";

interface PersonaTone {
  emoji: string;
  name: string;
  sfx: string;
  color: string;
}

// NewsCard와 같은 매핑 — 추후 한 곳에 모을지 결정
const PERSONA: Record<SpeakerType, PersonaTone> = {
  son: { emoji: "👦", name: "아들", sfx: "이", color: "#7B2FBE" },
  daughter: { emoji: "👧", name: "딸", sfx: "이", color: "#C4406A" },
  son_in_law: { emoji: "🧑", name: "사위", sfx: "가", color: "#0F8060" },
  daughter_in_law: { emoji: "👩", name: "며느리", sfx: "가", color: "#1A60B0" },
};

export interface NewsBottomSheetProps {
  onClose: () => void;
  speakerType: SpeakerType;
  /** 헤더 메타 — "한국경제 · 1시간 전" */
  source: string;
  /** 페르소나 풀이 헤드라인 한 줄 */
  personaIntro: string;
  /** 본문 시작 말풍선들 (initial) */
  bubbles: string[];
  /** 일상 비유 메모 (좌측 그라데이션 보더) */
  life?: string;
  /** "더 쉽게" 토글 시 보일 풀이 — 없으면 placeholder */
  easy?: string[];
  /** "더 자세히" 토글 시 보일 풀이 — 없으면 placeholder */
  deep?: string[];
}

type Mode = "easy" | "deep" | null;

export function NewsBottomSheet({
  onClose,
  speakerType,
  source,
  personaIntro,
  bubbles,
  life,
  easy,
  deep,
}: NewsBottomSheetProps) {
  const [mode, setMode] = useState<Mode>(null);
  const persona = PERSONA[speakerType];

  const toggleMode = (m: "easy" | "deep") => {
    setMode((cur) => (cur === m ? null : m));
  };

  return (
    <>
      {/* backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-40 bg-[#0A0519]/55"
        aria-hidden
      />

      {/* sheet */}
      <div
        role="dialog"
        aria-modal="true"
        className="fixed inset-x-0 bottom-0 z-50 mx-auto flex max-h-[80vh] max-w-md flex-col overflow-hidden rounded-t-[22px] border-t border-[#A25CDE]/15 bg-white/95 backdrop-blur-md"
      >
        {/* drag handle (그라데이션) */}
        <button
          onClick={onClose}
          aria-label="닫기"
          className="flex shrink-0 justify-center pt-2.5 pb-1"
        >
          <span className="block h-1 w-9 rounded-full bg-gradient-to-r from-[#7B2FBE] via-[#C4406A] to-[#1D9E75] opacity-50" />
        </button>

        {/* header */}
        <div className="shrink-0 border-b border-[#A25CDE]/10 px-4 pb-3">
          <div className="mb-2 flex items-center gap-2">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-full border text-base"
              style={{
                backgroundColor: `${persona.color}26`,
                borderColor: `${persona.color}30`,
              }}
            >
              {persona.emoji}
            </div>
            <div className="flex-1">
              <span className="mr-1 text-xs font-bold" style={{ color: persona.color }}>
                {persona.name}
              </span>
              <span className="text-xs text-[#B0A0CC]">
                {persona.sfx} 설명해줘요
              </span>
              <div className="text-[10px] text-[#C4A8E0]">{source}</div>
            </div>
          </div>
          <div className="text-sm font-bold leading-snug text-[#1A0A2E]">
            {personaIntro}
          </div>
        </div>

        {/* scroll body */}
        <div className="flex-1 overflow-y-auto px-4 pt-3.5 pb-6">
          {bubbles.map((b, i) => (
            <Bubble key={i} text={b} alt={i > 0} />
          ))}

          {life && (
            <div
              className="my-3 border-l-2 px-3 py-2 text-xs leading-relaxed text-[#8B6AAC]"
              style={{
                borderImageSource:
                  "linear-gradient(to bottom, #7B2FBE, #C4406A)",
                borderImageSlice: 1,
              }}
            >
              {life}
            </div>
          )}

          {/* 토글 */}
          <div className="mt-3 flex gap-1.5">
            <button
              onClick={() => toggleMode("easy")}
              className={`flex-1 rounded-[10px] border px-1.5 py-2.5 text-xs font-semibold text-[#7B2FBE] transition active:scale-[0.98] ${
                mode === "easy"
                  ? "border-[#7B2FBE] bg-[#A25CDE]/10"
                  : "border-[#A25CDE]/25 bg-white"
              }`}
            >
              😅 어려워요
            </button>
            <button
              onClick={() => toggleMode("deep")}
              className={`flex-1 rounded-[10px] px-1.5 py-2.5 text-xs font-semibold text-white transition active:scale-[0.98] ${
                mode === "deep"
                  ? "bg-gradient-to-br from-[#3C0A5E] to-[#1A2060]"
                  : "bg-gradient-to-br from-[#7B2FBE] to-[#4060D0]"
              }`}
            >
              🤔 더 알고 싶어요
            </button>
          </div>

          {mode === "easy" && (
            <div className="mt-2.5">
              <div className="mb-1.5 text-[10px] font-semibold tracking-wider text-[#B09FCC]">
                더 쉽게 설명할게
              </div>
              {easy && easy.length > 0 ? (
                easy.map((t, i) => <WmBubble key={i} text={t} />)
              ) : (
                <Placeholder text="실제 환경에서는 API에서 더 쉬운 풀이를 받아옵니다" />
              )}
            </div>
          )}

          {mode === "deep" && (
            <div className="mt-2.5">
              <div className="mb-1.5 text-[10px] font-semibold tracking-wider text-[#B09FCC]">
                조금 더 깊이
              </div>
              {deep && deep.length > 0 ? (
                deep.map((t, i) => <DkBubble key={i} text={t} />)
              ) : (
                <Placeholder text="실제 환경에서는 API에서 더 깊은 풀이를 받아옵니다" />
              )}
            </div>
          )}

          {/* 3차에서 "📊 누가 이득 봐?" 버튼 + 수혜·피해 지도가 여기 추가됨 */}
        </div>
      </div>
    </>
  );
}

function Bubble({ text, alt }: { text: string; alt: boolean }) {
  return (
    <div
      className={`mb-1.5 border px-3.5 py-2.5 text-[13px] leading-relaxed ${
        alt
          ? "rounded-[14px] border-[#DCD2F0]/50 bg-white/60 text-[#3A2856]"
          : "rounded-[4px_14px_14px_14px] border-[#A25CDE]/20 bg-[#A25CDE]/10 text-[#2A1040]"
      }`}
    >
      {text}
    </div>
  );
}

function WmBubble({ text }: { text: string }) {
  return (
    <div className="mb-1 rounded-[4px_14px_14px_14px] border border-[#FAC864]/40 bg-[#FFF5C8]/70 px-3.5 py-2.5 text-xs leading-relaxed text-[#3D2800]">
      {text}
    </div>
  );
}

function DkBubble({ text }: { text: string }) {
  return (
    <div className="mb-1 rounded-[4px_14px_14px_14px] border border-[#A25CDE]/20 bg-[#2A1040]/90 px-3.5 py-2.5 text-xs leading-relaxed text-[#E8D8FF]">
      {text}
    </div>
  );
}

function Placeholder({ text }: { text: string }) {
  return (
    <div className="rounded-xl border border-dashed border-[#A25CDE]/30 bg-[#F8F4FF]/70 px-3.5 py-2.5 text-xs text-[#9B7CC0]">
      {text}
    </div>
  );
}
