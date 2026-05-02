"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import type { SpeakerType } from "@eomni/shared";

// Apple App Store Today 컨셉 — 풀스크린 모달, 풀블리드 히어로, essay 본문, CTA 카드.
// 카드와의 shared element transition은 framer-motion layoutId로 연결.

interface PersonaTone {
  emoji: string;
  name: string;
  sfx: string;
  color: string;
  accent: string;
}

const PERSONA: Record<SpeakerType, PersonaTone> = {
  son: { emoji: "👦", name: "아들", sfx: "이", color: "#7B2FBE", accent: "#C4406A" },
  daughter: { emoji: "👧", name: "딸", sfx: "이", color: "#C4406A", accent: "#7B2FBE" },
  son_in_law: { emoji: "🧑", name: "사위", sfx: "가", color: "#0F8060", accent: "#378ADD" },
  daughter_in_law: { emoji: "👩", name: "며느리", sfx: "가", color: "#1A60B0", accent: "#7B2FBE" },
};

export interface NewsStoryViewProps {
  /** 카드와 share할 layout id — framer-motion morph 연결용 */
  layoutId: string;
  onClose: () => void;
  speakerType: SpeakerType;
  /** 카드 풀필 색 — 카드와 동일한 hex */
  cardHex: string;
  /** 카드 dim 색 (보더·뱃지) */
  dimHex: string;
  /** 시그널 라벨 — "강세/상승/관망/하락/약세" */
  signalLabel: string;
  /** 카드 더미 이미지 URL — hero에 카드와 동일하게 표시 */
  imageUrl: string;
  /** 페르소나 mood emoji — 채팅 말풍선 좌측 아바타 */
  moodEmoji: string;
  /** 합성 헤드라인 — 메인 코멘트 아래 sub 자리 */
  headline: string;
  /** 상대시간 */
  publishedAt: string;
  /** 페르소나 메인 코멘트 — hero 큰 헤드라인 */
  personaIntro: string;
  bubbles: string[];
  life?: string;
  easy?: string[];
  deep?: string[];
  /** 수혜·피해 지도 — 시나리오 채팅 다음 단계 ("누가 이득 봐?" 응답) */
  winners?: { up: string; down: string; neutral?: string };
}

export function NewsStoryView({
  layoutId,
  onClose,
  speakerType,
  cardHex,
  dimHex,
  signalLabel,
  imageUrl,
  moodEmoji,
  headline,
  publishedAt,
  personaIntro,
  bubbles,
  life,
  easy,
  deep,
  winners,
}: NewsStoryViewProps) {
  const persona = PERSONA[speakerType];
  // 채팅형 소설 톤 — 엄마가 액션 누르면 우측 메시지 + typing → 응답 stagger.
  // 시나리오: 1단계 (더쉽게/더자세히 중 하나) → 2단계 (누가 이득 봐?) → 끝
  type ActionType = "easy" | "deep" | "winners";
  type ChatTurn = {
    id: string;
    type: ActionType;
    momText: string;
    replies: string[];
    status: "typing" | "shown";
  };
  const [chatTurns, setChatTurns] = useState<ChatTurn[]>([]);
  const [usedActions, setUsedActions] = useState<Set<ActionType>>(new Set());

  const triggerAction = (type: ActionType) => {
    if (usedActions.has(type)) return;
    let momText: string;
    let replies: string[];
    if (type === "easy") {
      momText = "더 쉽게 설명해줘";
      replies =
        easy && easy.length > 0
          ? easy
          : ["실제 환경에서는 API에서 더 쉬운 풀이를 받아옵니다."];
    } else if (type === "deep") {
      momText = "더 자세히 알려줘";
      replies =
        deep && deep.length > 0
          ? deep
          : ["실제 환경에서는 API에서 더 깊은 풀이를 받아옵니다."];
    } else {
      momText = "그래서 누가 이득 봐?";
      replies = winners
        ? [
            `📈 이득 보는 곳 — ${winners.up}`,
            `📉 피해 보는 곳 — ${winners.down}`,
            ...(winners.neutral ? [`❓ 지켜봐야 — ${winners.neutral}`] : []),
          ]
        : ["수혜·피해 분석이 여기 표시됩니다."];
    }
    const id = `turn-${Date.now()}`;
    // 1) 엄마 메시지 + typing 즉시 추가
    setChatTurns((prev) => [
      ...prev,
      { id, type, momText, replies, status: "typing" },
    ]);
    setUsedActions((prev) => new Set([...prev, type]));
    // 2) 1.2초 후 typing 끝 → 응답 stagger 등장 트리거
    window.setTimeout(() => {
      setChatTurns((prev) =>
        prev.map((t) => (t.id === id ? { ...t, status: "shown" } : t)),
      );
    }, 1200);
  };

  // 도입 흐름 — bubbles에 집중할 시간 후 엄마 typing → life + 액션 버튼.
  type IntroPhase = "intro" | "momTyping" | "ready";
  const [introPhase, setIntroPhase] = useState<IntroPhase>("intro");
  useEffect(() => {
    if (!life) {
      const t = setTimeout(() => setIntroPhase("ready"), 1800);
      return () => clearTimeout(t);
    }
    const t1 = setTimeout(() => setIntroPhase("momTyping"), 2500);
    const t2 = setTimeout(() => setIntroPhase("ready"), 2500 + 1300);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [life]);

  // 시나리오 흐름. typing 중에는 다음 액션 hide (자연스러운 대화 톤).
  // 도입 phase가 ready일 때만 액션 버튼 등장 (bubbles + life 다 보인 뒤).
  const hasFirstTurnShown = chatTurns.some(
    (t) => t.status === "shown" && (t.type === "easy" || t.type === "deep"),
  );
  const isAnyTyping = chatTurns.some((t) => t.status === "typing");
  const visibleActions: ActionType[] = (() => {
    if (introPhase !== "ready") return [];
    if (isAnyTyping) return [];
    if (!hasFirstTurnShown) {
      return (["deep", "easy"] as ActionType[]).filter(
        (a) => !usedActions.has(a),
      );
    }
    if (!usedActions.has("winners")) return ["winners"];
    return [];
  })();

  // TTS 하이라이트용 — 추후 Web Speech API onstart/onend로 갱신
  const [playingId, setPlayingId] = useState<string | null>(null);
  const togglePlaying = (id: string) =>
    setPlayingId((cur) => (cur === id ? null : id));

  // 자동 스크롤 — 채팅 새 메시지가 등장하면 본문 끝으로 부드럽게 스크롤
  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [chatTurns, introPhase]);

  // SSR-safe portal + body scroll lock
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // 앱 탑바 — hero 끝이 viewport 밖으로 나가면 등장 (스크롤 다운 시).
  const heroEndRef = useRef<HTMLDivElement>(null);
  const [showTopBar, setShowTopBar] = useState(false);
  useEffect(() => {
    if (!mounted) return;
    const sentinel = heroEndRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry) setShowTopBar(!entry.isIntersecting);
      },
      { threshold: 0 },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [mounted]);

  if (!mounted) return null;

  return createPortal(
    <>
      {/* backdrop — Apple Today 톤: 검은 dim이 아니라 뒷페이지를 backdrop-blur */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={onClose}
        className="fixed inset-0 z-40 bg-black/15 backdrop-blur-3xl"
      />

      {/* 모달 본체 — layoutId로 NewsCard와 morph.
          iOS 톤 cubic-bezier ease + borderRadius를 layout보다 늦게 풀어서
          "카드 형태 유지하며 확장 → 마지막에 풀스크린"의 두 단계 인지를 살림. */}
      <motion.div
        layoutId={layoutId}
        initial={{ borderRadius: 20 }}
        animate={{ borderRadius: 0 }}
        exit={{ borderRadius: 20 }}
        transition={{
          duration: 0.5,
          ease: [0.32, 0.72, 0, 1],
          // borderRadius는 layout 트랜지션보다 늦게 시작 + 더 천천히 풀어짐
          borderRadius: {
            duration: 0.4,
            delay: 0.18,
            ease: [0.32, 0.72, 0, 1],
          },
        }}
        className="fixed inset-0 z-50 mx-auto max-w-md overflow-y-auto overflow-x-hidden bg-white"
      >
        {/* 탑바 — 모달 본체 안 fixed top-0. 스크롤 다운 시점 등장 (hero 사라질 때).
            아바타와 X 버튼 뒤에 흰 frosted glass 배경으로 시야 확보. */}
        <AnimatePresence>
          {showTopBar && (
            <motion.div
              key="topbar"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-x-0 top-0 z-20 mx-auto h-[68px] max-w-md border-b border-black/5 bg-white/70 backdrop-blur-md"
              aria-hidden
            />
          )}
        </AnimatePresence>

        <CardHero
          cardHex={cardHex}
          dimHex={dimHex}
          signalLabel={signalLabel}
          imageUrl={imageUrl}
          publishedAt={publishedAt}
          mainComment={personaIntro}
          headline={headline}
        />
        {/* hero 끝 sentinel — 이 sentinel이 viewport 밖으로 나가면 앱 탑바 등장 (스크롤 다운 시) */}
        <div ref={heroEndRef} aria-hidden />

        {/* 페르소나 아바타 — hero/본문 경계 반반 걸침 + sticky top-3로 viewport 상단 고정. */}
        <div className="sticky top-3 z-30 -mt-7 mb-1 px-5">
          <div
            className="flex h-[52px] w-[52px] items-center justify-center rounded-full text-xl shadow-sm ring-2 ring-white"
            style={{ backgroundColor: cardHex }}
            aria-hidden
          >
            {moodEmoji}
          </div>
        </div>

        {/* 본문 — morph 거의 끝난 후에 slide-up + fade-in (Apple Today 톤) */}
        <motion.article
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ delay: 0.45, duration: 0.3 }}
          className="px-5 pt-2 pb-48"
        >
          {/* 채팅 메시지 — 첫 말풍선 위 화자 이름 작게 한 번 (iMessage 그룹 채팅 톤) */}
          <div className="mb-1.5 ml-1 text-caption text-gray-500">
            {persona.name}
          </div>
          <div className="flex flex-col items-start gap-2.5">
            {bubbles.map((b, i) => {
              const id = `b-${i}`;
              return (
                <ChatRow
                  key={id}
                  text={b}
                  cardHex={cardHex}
                  active={playingId === id}
                  onClick={() => togglePlaying(id)}
                />
              );
            })}
          </div>

          {/* life — 엄마 추측 메시지. introPhase에 따라 typing → shown 단계.
              "나" 라벨 + 우측 정렬 보낸 메시지 톤. */}
          {life && introPhase === "momTyping" && (
            <div className="mt-3.5 flex w-full flex-col items-end">
              <TypingBubble align="right" />
            </div>
          )}
          {life && introPhase === "ready" && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="mt-3.5 flex w-full flex-col items-end"
            >
              <div className="mb-1.5 mr-1 text-caption text-gray-500">나</div>
              <UserChatRow text={life} />
            </motion.div>
          )}

          {/* 엄마 ↔ 아들 채팅 흐름 — 액션 누른 순서대로 누적.
              typing 상태: 엄마 메시지 + ... 도트 / shown 상태: 응답 stagger 등장 */}
          {chatTurns.map((turn, ti) => {
            // 같은 화자 연속이면 라벨 생략 — 첫 chatTurn은 직전이 life(엄마)면 라벨 X.
            // 두 번째+ chatTurn은 직전이 아들 응답이라 라벨 ✓.
            const showMomLabel = ti === 0 ? !life : true;
            return (
            <div key={turn.id} className="mt-4 flex flex-col gap-2.5">
              <div className="flex w-full flex-col items-end">
                {showMomLabel && (
                  <div className="mb-1.5 mr-1 text-caption text-gray-500">나</div>
                )}
                <UserChatRow text={turn.momText} />
              </div>
              {turn.status === "typing" ? (
                <TypingBubble />
              ) : (
                <>
                  <div className="mt-1 mb-1.5 ml-1 text-caption text-gray-500">
                    {persona.name}
                  </div>
                  <motion.div
                    className="flex flex-col items-start gap-2.5"
                    initial="hidden"
                    animate="visible"
                    variants={{
                      hidden: {},
                      visible: { transition: { staggerChildren: 0.45 } },
                    }}
                  >
                    {turn.replies.map((r, ri) => {
                      const id = `${turn.id}-${ri}`;
                      return (
                        <motion.div
                          key={id}
                          variants={{
                            hidden: { opacity: 0, y: 8 },
                            visible: { opacity: 1, y: 0 },
                          }}
                          transition={{ duration: 0.3 }}
                        >
                          <ChatRow
                            text={r}
                            cardHex={cardHex}
                            active={playingId === id}
                            onClick={() => togglePlaying(id)}
                          />
                        </motion.div>
                      );
                    })}
                  </motion.div>
                </>
              )}
            </div>
            );
          })}

          {/* 인라인 액션 버튼 — 우측 정렬 (엄마가 누르는 메시지 톤). outline 스타일, 이모지 없음. */}
          <AnimatePresence mode="popLayout">
            {visibleActions.length > 0 && (
              <motion.div
                key="actions"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.3 }}
                className="mt-6 flex flex-wrap justify-end gap-2"
              >
                {visibleActions.map((type) => {
                  const label =
                    type === "easy"
                      ? "더 쉽게 설명해줘"
                      : type === "deep"
                        ? "더 자세히 알려줘"
                        : "누가 이득 봐?";
                  return (
                    <InlineActionButton
                      key={type}
                      label={label}
                      onClick={() => triggerAction(type)}
                    />
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>

        </motion.article>

        {/* 자동 스크롤 sentinel — article 밖에 위치. article의 pb 영역도 viewport 안에 들어오게.
            chatTurns / introPhase 변경 시 이 element가 viewport 끝에 위치 → 액션 버튼이 가운데 즈음. */}
        <div ref={bottomRef} aria-hidden />
      </motion.div>

      {/* 닫기 X — viewport 우상단 fixed. 진입 직후부터 항상 보임. morph 끝날 때 등장 */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ delay: 0.4, duration: 0.2 }}
        onClick={onClose}
        aria-label="닫기"
        className="fixed top-4 right-4 z-[60] flex h-9 w-9 items-center justify-center rounded-full bg-white/85 text-gray-900 shadow-md backdrop-blur"
      >
        <span className="text-base font-medium leading-none">✕</span>
      </motion.button>
    </>,
    document.body,
  );
}

/** 채팅 메시지 — iMessage 톤. 그레이 솔리드 + 좌하단 SVG 꼬리(둥근 잎 모양).
    활성 시 카드 색 톤으로 하이라이트 (TTS 재생 시그널). */
function ChatRow({
  text,
  cardHex,
  active,
  onClick,
}: {
  text: string;
  cardHex: string;
  active: boolean;
  onClick: () => void;
}) {
  const bgColor = active ? cardHex : "#E9E9EB";
  return (
    <button
      onClick={onClick}
      className={`relative w-fit max-w-[80%] rounded-[22px] px-4 py-3.5 text-body-lg leading-relaxed text-left transition-colors ${
        active ? "text-white" : "text-gray-900"
      }`}
      style={{ backgroundColor: bgColor }}
    >
      {text}
      {/* 좌측 sharp 꼬리 — 카카오 톤. 말풍선 좌측 가운데에서 외부로 sharp 끝점 */}
      <svg
        aria-hidden
        width="8"
        height="12"
        viewBox="0 0 8 12"
        className="pointer-events-none absolute top-3 -left-[6px]"
        style={{ fill: bgColor }}
      >
        <path d="M8 0 L0 6 L8 12 Z" />
      </svg>
    </button>
  );
}

/** 카드의 상단부(이미지 + 뱃지 + 텍스트)를 풀화면 사이즈로 확장한 hero.
    카드와 같은 다크 톤 — cardHex 풀필 + 이미지 mask fade out + 시그널 뱃지(dimHex). */
function CardHero({
  cardHex,
  dimHex,
  signalLabel,
  imageUrl,
  publishedAt,
  mainComment,
  headline,
}: {
  cardHex: string;
  dimHex: string;
  signalLabel: string;
  imageUrl: string;
  publishedAt: string;
  mainComment: string;
  headline: string;
}) {
  return (
    <div style={{ backgroundColor: cardHex }}>
      {/* 이미지 영역 — mask fade out으로 카드 색 자연스럽게 노출 */}
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
        {/* 좌상단 시그널 뱃지 */}
        <div
          className="absolute top-0 left-0 rounded-br-xl pl-4 pr-3.5 py-1.5 text-caption font-bold text-white"
          style={{ backgroundColor: dimHex }}
        >
          {signalLabel}
        </div>
      </div>
      {/* 텍스트 영역 — 카드 다크 톤 위 흰 글씨. 아바타 침범 위해 pb 넉넉. */}
      <div className="px-5 pt-5 pb-10 text-white">
        <div className="mb-2 text-caption font-medium text-white/75">
          {publishedAt}
        </div>
        <h1 className="mb-2.5 text-headline-card font-bold leading-snug tracking-tight text-white">
          {mainComment}
        </h1>
        <p className="text-body leading-snug text-white/85">{headline}</p>
      </div>
    </div>
  );
}

/** 엄마(독자) 메시지 — 우측 정렬, 파란 솔리드 + 흰 글씨 (iMessage 보낸 메시지 톤).
    꼬리는 우하단. */
function UserChatRow({ text }: { text: string }) {
  return (
    <div className="flex w-full justify-end">
      <div className="relative w-fit max-w-[80%] rounded-[22px] bg-[#0070F3] px-4 py-3.5 text-body-lg leading-relaxed text-white">
        {text}
        {/* 우측 sharp 꼬리 — 카카오 보낸 메시지 톤. 우측 가운데 sharp 끝점 */}
        <svg
          aria-hidden
          width="8"
          height="12"
          viewBox="0 0 8 12"
          className="pointer-events-none absolute top-3 -right-[6px]"
          style={{ fill: "#0070F3" }}
        >
          <path d="M0 0 L8 6 L0 12 Z" />
        </svg>
      </div>
    </div>
  );
}

/** 본문 인라인 액션 버튼 — outline 스타일.
    엄마(독자) 메시지 톤과 일관되게 iMessage 블루로 통일 (카드 색별 산만함 제거). */
function InlineActionButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="whitespace-nowrap rounded-full border-[1.5px] border-[#0070F3] bg-white px-4 py-2.5 text-body font-semibold text-[#0070F3] transition active:scale-[0.97]"
    >
      {label}
    </button>
  );
}

/** 응답 typing indicator — ... 도트 통통 애니메이션.
    align="left" = 받는 메시지 톤(좌측), align="right" = 엄마 본인 typing(우측). */
function TypingBubble({ align = "left" }: { align?: "left" | "right" }) {
  const isRight = align === "right";
  return (
    <div
      className={`relative flex items-center gap-1.5 rounded-[22px] bg-[#E9E9EB] px-4 py-3.5 ${
        isRight ? "self-end" : "self-start"
      }`}
    >
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          aria-hidden
          className="block h-2 w-2 rounded-full bg-gray-500"
          animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.2,
          }}
        />
      ))}
      {isRight ? (
        <svg
          aria-hidden
          width="8"
          height="12"
          viewBox="0 0 8 12"
          className="pointer-events-none absolute top-3 -right-[6px] fill-[#E9E9EB]"
        >
          <path d="M0 0 L8 6 L0 12 Z" />
        </svg>
      ) : (
        <svg
          aria-hidden
          width="8"
          height="12"
          viewBox="0 0 8 12"
          className="pointer-events-none absolute top-3 -left-[6px] fill-[#E9E9EB]"
        >
          <path d="M8 0 L0 6 L8 12 Z" />
        </svg>
      )}
    </div>
  );
}
