"use client";

import type { NewsCardData } from "@eomni/shared";
import { BubbleArea } from "./BubbleArea";
import { ExplainMore, useExplainState } from "./ExplainMore";

interface NewsCardProps {
  news: NewsCardData;
}

export function NewsCard({ news }: NewsCardProps) {
  const { state, ask, reset } = useExplainState();

  const displayBubble = state.bubble ?? news.bubble;
  const showOriginal = state.mode === null || state.bubble === null;

  return (
    <article className="rounded-2xl bg-white border border-gray-200 shadow-sm overflow-hidden">
      <header className="flex items-center justify-between px-4 pt-4 pb-2">
        <span className="text-sm font-medium text-gray-500">{news.source}</span>
        <span className="text-sm text-gray-400">{news.publishedAt}</span>
      </header>
      <h2 className="px-4 pb-3 text-lg font-bold leading-snug text-gray-900">
        {news.headline}
      </h2>

      <div className="px-4">
        {state.loading ? (
          <div className="rounded-2xl bg-gray-50 p-4 text-center text-sm text-gray-500">
            {state.mode === "simpler"
              ? "더 쉽게 다시 설명 중..."
              : "더 자세히 설명 중..."}
          </div>
        ) : (
          <BubbleArea
            speakerType={news.speakerType}
            text={displayBubble}
            badge={
              !showOriginal
                ? state.mode === "simpler"
                  ? "더 쉽게"
                  : "더 자세히"
                : undefined
            }
          />
        )}
        {state.error && (
          <p className="mt-2 text-xs text-red-500">{state.error}</p>
        )}
      </div>

      <div className="px-4 pt-3">
        <ExplainMore
          newsId={news.id}
          activeMode={state.mode}
          loading={state.loading}
          onAsk={(mode) => ask(news.id, mode)}
          onReset={reset}
        />
      </div>

      {news.tickers.length > 0 && (
        <footer className="mt-3 flex flex-wrap gap-2 border-t border-gray-100 px-4 py-3">
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
    </article>
  );
}
