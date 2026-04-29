"use client";

import { useState } from "react";
import type { ExplainMoreMode, NewsCardData } from "@eomni/shared";
import { BubbleArea } from "./BubbleArea";

type Lang = "ko" | "en";

const TIME_FMT = new Intl.DateTimeFormat("ko-KR", {
  month: "long",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: "Asia/Seoul",
});

function formatAbsoluteTime(iso: string): string {
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return "";
    return TIME_FMT.format(d);
  } catch {
    return "";
  }
}

interface NewsCardProps {
  news: NewsCardData;
}

type Path = "simpler" | "deeper";
type ExplainState =
  | { kind: "idle" }
  | { kind: "loading"; path: Path }
  | { kind: "shown"; path: Path; bubble: string; cached: boolean }
  | { kind: "error"; path: Path; message: string };

type DoneState =
  | null // 진행 중
  | { kind: "easy" } // 더 쉽게에서 이해 → 시스템: "어려운 뉴스, 다음에 더 쉽게"
  | { kind: "deep" }; // 더 자세히에서 이해 → "잘 하셨어요"

export function NewsCard({ news }: NewsCardProps) {
  const [state, setState] = useState<ExplainState>({ kind: "idle" });
  const [done, setDone] = useState<DoneState>(null);
  const [lang, setLang] = useState<Lang>("ko");

  const hasKo = !!news.headlineKo;
  const showingKo = lang === "ko" && hasKo;
  const headline = showingKo
    ? (news.headlineKo as string)
    : news.headlineEn;
  const summary = showingKo
    ? news.summaryKo
    : news.summaryEn;
  const absoluteTime = formatAbsoluteTime(news.publishedAtIso);

  async function ask(path: Path) {
    setState({ kind: "loading", path });
    try {
      const apiBase =
        process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";
      const mode: ExplainMoreMode = path;
      const res = await fetch(`${apiBase}/api/news/${news.id}/explain`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode }),
      });
      const data = await res.json();
      if (!res.ok || !data.bubble) {
        throw new Error(data.message ?? "설명 생성 실패");
      }
      setState({
        kind: "shown",
        path,
        bubble: data.bubble,
        cached: !!data.cached,
      });
    } catch (err) {
      setState({ kind: "error", path, message: (err as Error).message });
    }
  }

  function complete(fromPath: Path) {
    setDone({ kind: fromPath === "simpler" ? "easy" : "deep" });
  }

  function reset() {
    setState({ kind: "idle" });
    setDone(null);
  }

  const showInitialButtons = state.kind === "idle" && done === null;
  const showFollowUp =
    (state.kind === "shown" || state.kind === "error") && done === null;
  const showInitialBubble = done === null; // 이해 완료 후 정리감 있게 숨김

  return (
    <article className="rounded-2xl bg-white border border-gray-200 shadow-sm overflow-hidden">
      {/* news meta + title */}
      <header className="flex items-center justify-between px-4 pt-4 pb-1.5">
        <span className="text-sm font-medium text-gray-500">{news.source}</span>
        <span className="text-xs text-gray-400">
          {news.publishedAt}
          {absoluteTime && (
            <span className="ml-1.5 text-gray-300">· {absoluteTime}</span>
          )}
        </span>
      </header>
      <h2 className="px-4 pb-2 text-lg font-bold leading-snug text-gray-900">
        {headline}
      </h2>
      {summary && (
        <p className="px-4 pb-2 text-sm text-gray-600 leading-relaxed line-clamp-3">
          {summary}
        </p>
      )}
      {hasKo && (
        <div className="px-4 pb-3">
          <button
            onClick={() => setLang(lang === "ko" ? "en" : "ko")}
            className="text-xs text-gray-500 underline"
          >
            {lang === "ko" ? "원문 보기" : "한국어로 보기"}
          </button>
        </div>
      )}

      {/* initial bubble (이해 완료 후 숨김) */}
      {showInitialBubble && (
        <BubbleArea
          speakerType={news.speakerType}
          text={news.bubble}
          variant="initial"
        />
      )}

      {/* 두 경로 버튼 (idle 상태) */}
      {showInitialButtons && (
        <div className="px-3 py-3 flex gap-2">
          <PathButton
            kind="simpler"
            onClick={() => ask("simpler")}
            selected={false}
          />
          <PathButton
            kind="deeper"
            onClick={() => ask("deeper")}
            selected={false}
          />
        </div>
      )}

      {/* 응답 영역: loading / shown / error */}
      {state.kind === "loading" && (
        <div
          className={`px-4 py-3 text-center text-sm ${
            state.path === "simpler"
              ? "bg-orange-50 text-orange-700"
              : "bg-purple-50 text-purple-700"
          }`}
        >
          {state.path === "simpler"
            ? "더 쉽게 설명 중..."
            : "더 자세히 설명 중..."}
        </div>
      )}
      {state.kind === "shown" && (
        <BubbleArea
          speakerType={news.speakerType}
          text={state.bubble}
          variant={state.path}
        />
      )}
      {state.kind === "error" && (
        <div className="px-4 py-3 text-sm text-red-600 bg-red-50">
          실패: {state.message}
          <button
            onClick={() => ask(state.path)}
            className="ml-2 underline"
          >
            다시
          </button>
        </div>
      )}

      {/* 후속 follow-up: 이해했어요 / 반대 경로 시도 */}
      {showFollowUp && state.kind === "shown" && (
        <>
          <div className="px-4 pt-3 pb-1 text-xs text-gray-500 font-medium">
            이제 어떠세요?
          </div>
          <div className="px-3 pb-3 flex gap-2">
            <FollowButton
              variant="success"
              label="😊 이해했어요"
              desc="다음 뉴스 보기"
              onClick={() => complete(state.path)}
            />
            {state.path === "simpler" ? (
              <FollowButton
                variant="more"
                label="🤔 더 알고 싶어요"
                desc="깊이 알아보기"
                onClick={() => ask("deeper")}
              />
            ) : (
              <FollowButton
                variant="hard"
                label="😅 그래도 어려워요"
                desc="더 쉽게 해줘"
                onClick={() => ask("simpler")}
              />
            )}
          </div>
        </>
      )}

      {/* 학습 완료 뱃지 */}
      {done?.kind === "deep" && (
        <div className="px-4 py-3">
          <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-2 text-sm text-emerald-800 flex items-center gap-2">
            <span>✓</span>
            <span>잘 하셨어요! 이 소식을 이해하셨네요.</span>
          </div>
        </div>
      )}
      {done?.kind === "easy" && (
        <div className="px-4 py-3">
          <div className="rounded-xl bg-amber-50 border border-amber-200 px-3 py-2 text-sm text-amber-800 flex items-center gap-2">
            <span>!</span>
            <span>어려운 뉴스였네요. 다음엔 더 쉽게 말해드릴게요!</span>
          </div>
        </div>
      )}

      {/* 종목 태그 */}
      {news.tickers.length > 0 && (
        <footer className="flex flex-wrap gap-2 border-t border-gray-100 px-4 py-3">
          {news.tickers.map((t) => (
            <span
              key={t.ticker}
              className={`text-sm font-semibold rounded-full px-3 py-1 ${
                t.changePct >= 0
                  ? "bg-red-50 text-red-600"
                  : "bg-blue-50 text-blue-600"
              }`}
            >
              {t.ticker} {t.changePct >= 0 ? "+" : ""}
              {t.changePct.toFixed(1)}%
            </span>
          ))}
        </footer>
      )}

      {/* 처음으로 되돌리기 (idle 외 어떤 상태든 표시) */}
      {(state.kind !== "idle" || done !== null) && (
        <div className="text-center pb-3">
          <button
            onClick={reset}
            className="text-xs text-gray-500 underline"
          >
            처음으로 되돌리기
          </button>
        </div>
      )}
    </article>
  );
}

function PathButton({
  kind,
  onClick,
  selected,
}: {
  kind: Path;
  onClick: () => void;
  selected: boolean;
}) {
  const isSimpler = kind === "simpler";
  return (
    <button
      onClick={onClick}
      className={`flex-1 rounded-xl border-2 px-3 py-3 text-center transition active:scale-[0.98] ${
        selected
          ? isSimpler
            ? "bg-orange-50 border-orange-300"
            : "bg-purple-50 border-purple-300"
          : "bg-white border-gray-200"
      }`}
    >
      <div className="text-2xl mb-1">{isSimpler ? "😅" : "🤔"}</div>
      <div className="text-sm font-semibold text-gray-900">
        {isSimpler ? "어려워요" : "더 알고 싶어요"}
      </div>
      <div className="text-xs text-gray-500 mt-0.5">
        {isSimpler ? "더 쉽게 말해줘" : "좀 더 자세히"}
      </div>
    </button>
  );
}

function FollowButton({
  variant,
  label,
  desc,
  onClick,
}: {
  variant: "success" | "hard" | "more";
  label: string;
  desc: string;
  onClick: () => void;
}) {
  const styles = {
    success: "bg-white border-emerald-200 hover:bg-emerald-50",
    hard: "bg-white border-orange-200 hover:bg-orange-50",
    more: "bg-white border-purple-200 hover:bg-purple-50",
  }[variant];
  return (
    <button
      onClick={onClick}
      className={`flex-1 rounded-xl border-2 px-3 py-2.5 text-center transition active:scale-[0.98] ${styles}`}
    >
      <div className="text-sm font-semibold text-gray-900">{label}</div>
      <div className="text-xs text-gray-500 mt-0.5">{desc}</div>
    </button>
  );
}
