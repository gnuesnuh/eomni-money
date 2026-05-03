"use client";

import { useState } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { Icon } from "@iconify/react";
import type { NewsCardData, SpeakerType } from "@eomni/shared";
import { NewsStoryView } from "./NewsStoryView";

// 시안 단계 추가 필드. 클러스터 컨셉 + 채팅형 상세.
type DraftFields = {
  headline?: string;
  category?: string;
  companyName?: string;
  mainComment?: string;
  subComment?: string;
  imageUrl?: string;
  bubbles?: string[];
  life?: string;
  easy?: string[];
  deep?: string[];
  winners?: { up: string; down: string; neutral?: string };
};

export type NewsCardChatDraft = NewsCardData & DraftFields;

// ─────────────────────────────────────────────────────────
// 페르소나 + Mood emoji (등락 평균 기반)
// ─────────────────────────────────────────────────────────

interface PersonaTone {
  name: string;
  sfx: string;
}

const PERSONA: Record<SpeakerType, PersonaTone> = {
  son: { name: "아들", sfx: "이" },
  daughter: { name: "딸", sfx: "이" },
  son_in_law: { name: "사위", sfx: "가" },
  daughter_in_law: { name: "며느리", sfx: "가" },
};

type Mood = "joy" | "smile" | "neutral" | "worried" | "anxious";

const MOOD_EMOJI: Record<Mood, string> = {
  joy: "🥳",
  smile: "😀",
  neutral: "😐",
  worried: "😟",
  anxious: "😨",
};

function computeMood(avg: number | null): Mood {
  if (avg === null) return "neutral";
  if (avg >= 5) return "joy";
  if (avg >= 0.3) return "smile";
  if (avg > -0.3) return "neutral";
  if (avg > -5) return "worried";
  return "anxious";
}

// ─────────────────────────────────────────────────────────
// 시그널 — 등락 평균 기반. 카드 풀필은 톤다운(흰 배경)이라 시그널 색은 좌상단 뱃지·채팅 활성에만 사용.
// ─────────────────────────────────────────────────────────

type Signal = "upStrong" | "up" | "neutral" | "down" | "downStrong";

interface SignalStyle {
  /** 좌상단 시그널 뱃지 배경 (어두운 톤) */
  badgeBg: string;
  /** 채팅 활성 강조 / aux 액센트 (밝은 톤) */
  accentBg: string;
  label: string;
}

const SIGNAL_STYLES: Record<Signal, SignalStyle> = {
  upStrong: { badgeBg: "#054A37", accentBg: "#0F8060", label: "강세" },
  up: { badgeBg: "#0F5C44", accentBg: "#1D9E75", label: "상승" },
  neutral: { badgeBg: "#3D454C", accentBg: "#5B6770", label: "관망" },
  down: { badgeBg: "#6E1717", accentBg: "#A32D2D", label: "하락" },
  downStrong: { badgeBg: "#3D0000", accentBg: "#6E1717", label: "약세" },
};

function computeSignal(avg: number | null): Signal {
  if (avg === null) return "neutral";
  if (avg >= 5) return "upStrong";
  if (avg >= 0.3) return "up";
  if (avg > -0.3) return "neutral";
  if (avg > -5) return "down";
  return "downStrong";
}

// 카드 풀필 톤 — 자연스러운 검정 (iOS 다크 모드 톤). 차별화는 이미지 + 시그널 뱃지 + 페르소나 그라데이션.
const CARD_BG = "#1A1A1A";
// 페르소나 영역에 깔리는 오로라 그라데이션 (aurora 시안 보라/핑크/녹 톤). 그 위에 글래스 콘텐츠.
const PERSONA_AURORA =
  "radial-gradient(circle at 18% 60%, rgba(123, 47, 190, 0.55) 0%, transparent 60%)," +
  "radial-gradient(circle at 80% 70%, rgba(196, 64, 106, 0.4) 0%, transparent 55%)," +
  "radial-gradient(circle at 55% 15%, rgba(29, 158, 117, 0.3) 0%, transparent 55%)";

// ─────────────────────────────────────────────────────────
// NewsCard — 톤다운: 흰 배경 + 풀블리드 이미지 + 다크 그라데이션 위 흰 텍스트.
// 시그널 의미는 좌상단 컬러 뱃지로만 살림 (카드 풀필 컬러 X).
// ─────────────────────────────────────────────────────────

interface NewsCardChatProps {
  news: NewsCardData;
  onOpenChange?: (open: boolean) => void;
}

export function NewsCardChat({ news, onOpenChange }: NewsCardChatProps) {
  const [open, setOpenState] = useState(false);
  const setOpen = (next: boolean | ((prev: boolean) => boolean)) => {
    setOpenState((prev) => {
      const resolved = typeof next === "function" ? next(prev) : next;
      onOpenChange?.(resolved);
      return resolved;
    });
  };
  const persona = PERSONA[news.speakerType];
  const draft = news as NewsCardChatDraft;

  const headline = draft.headline ?? news.headlineKo ?? news.headlineEn;
  const mainComment = draft.mainComment ?? news.bubble;
  const subComment = draft.subComment;
  const companyName = draft.companyName;
  const category = draft.category;
  const externalTitle = [companyName, category].filter(Boolean).join(" · ");

  const avgChange =
    news.tickers.length > 0
      ? news.tickers.reduce((s, t) => s + t.changePct, 0) / news.tickers.length
      : null;
  const signal = computeSignal(avgChange);
  const sig = SIGNAL_STYLES[signal];
  const mood = computeMood(avgChange);
  const moodEmoji = MOOD_EMOJI[mood];

  const imageUrl =
    draft.imageUrl ?? `https://picsum.photos/seed/${news.id}/800/500`;

  const layoutId = `news-${news.id}`;

  return (
    <LayoutGroup id={layoutId}>
      <div>
        {externalTitle && (
          <div className="mb-4 px-1 text-base font-bold leading-tight text-[#1A0A2E]">
            {externalTitle}
          </div>
        )}
        <motion.article
          layoutId={layoutId}
          onClick={() => setOpen(true)}
          animate={{ opacity: open ? 0 : 1, borderRadius: 24 }}
          transition={{ duration: 0.15 }}
          style={{ backgroundColor: CARD_BG }}
          className="cursor-pointer overflow-hidden leading-none shadow-md shadow-black/15"
        >
          {/* 이미지 영역 — mask fade out으로 카드 색이 자연스럽게 노출 */}
          <div className="relative">
            <img
              src={imageUrl}
              alt=""
              className="block w-full align-bottom"
              style={{
                display: "block",
                maskImage:
                  "linear-gradient(to bottom, #000 calc(100% - 90px), rgba(0,0,0,0.85) calc(100% - 65px), rgba(0,0,0,0.5) calc(100% - 35px), rgba(0,0,0,0.15) calc(100% - 12px), transparent 100%)",
                WebkitMaskImage:
                  "linear-gradient(to bottom, #000 calc(100% - 90px), rgba(0,0,0,0.85) calc(100% - 65px), rgba(0,0,0,0.5) calc(100% - 35px), rgba(0,0,0,0.15) calc(100% - 12px), transparent 100%)",
              }}
            />
            {/* 좌상단 시그널 뱃지 — 의미 신호 (등락 따라 색) */}
            <div
              className="absolute top-0 left-0 rounded-tl-[24px] rounded-br-xl pl-4 pr-3.5 py-1.5 text-caption font-bold text-white"
              style={{ backgroundColor: sig.badgeBg }}
            >
              {sig.label}
            </div>
          </div>

          {/* 메인 텍스트 영역 — 카드 다크 위 흰 글씨 */}
          <div className="px-5 pt-5 pb-4 text-white">
            <div className="mb-2 text-caption font-medium text-white/75">
              {news.publishedAt}
            </div>
            <h3 className="mb-2 text-headline-card font-bold leading-snug tracking-tight text-white">
              {mainComment}
            </h3>
            <p className="text-body leading-snug text-white/85">{headline}</p>
          </div>

          {/* 페르소나 영역 — 오로라 그라데이션 배경 + 반투명 흰 보더(top)로 글래스 표면 효과.
              마이리얼트립 톤의 글래스 카드 — 검정 카드 위 컬러 그라데이션 + 위 콘텐츠 흰 글씨. */}
          <div
            className="relative flex items-center gap-3.5 overflow-hidden border-t border-white/10 px-5 py-4"
            style={{ background: `${PERSONA_AURORA}, ${CARD_BG}` }}
          >
            <div className="relative shrink-0">
              <div
                className="flex h-14 w-14 items-center justify-center rounded-full bg-white/15 text-2xl backdrop-blur-md"
                aria-hidden
              >
                {moodEmoji}
              </div>
              {/* 우상단 말풍선 — Solar chat-round-dots-bold + pulse 애니메이션 */}
              <motion.div
                className="absolute -top-2 -right-2 drop-shadow-md"
                animate={{ opacity: [1, 0.55, 1], scale: [1, 1.06, 1] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                aria-hidden
              >
                <Icon
                  icon="solar:chat-round-call-bold"
                  width={28}
                  height={28}
                  color="white"
                />
              </motion.div>
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-body font-bold text-white">
                {persona.name}
                {persona.sfx} 설명해줘요
              </div>
              {subComment && (
                <div className="text-sub text-white/75">{subComment}</div>
              )}
            </div>
          </div>
        </motion.article>
      </div>

      <AnimatePresence>
        {open && (
          <NewsStoryView
            key={layoutId}
            layoutId={layoutId}
            onClose={() => setOpen(false)}
            speakerType={news.speakerType}
            cardHex={CARD_BG}
            dimHex={sig.badgeBg}
            signalLabel={sig.label}
            imageUrl={imageUrl}
            moodEmoji={moodEmoji}
            headline={headline}
            publishedAt={news.publishedAt}
            personaIntro={mainComment}
            bubbles={draft.bubbles ?? [news.bubble]}
            life={draft.life}
            easy={draft.easy}
            deep={draft.deep}
            winners={draft.winners}
          />
        )}
      </AnimatePresence>
    </LayoutGroup>
  );
}
