"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  BADGE_LABELS,
  type NewsCardData,
  type StockBadge,
} from "@eomni/shared";
import { CompactNewsItem, type WhyKind } from "@/components/news/CompactNewsItem";
import { useProfile } from "@/lib/profile";

interface StockDetail {
  id: string;
  ticker: string;
  nameKo: string;
  nameEn: string;
  descriptionKo: string;
  currentPrice: number;
  changePct: number;
  week52High: number;
  week52Low: number;
  badge: StockBadge | null;
}

interface NewsResponse {
  ticker: string;
  count: number;
  fallback: boolean;
  news: NewsCardData[];
}

const BADGE_BG: Record<StockBadge, string> = {
  cheap: "bg-red-50 text-red-700 border border-red-200",
  expensive: "bg-purple-50 text-purple-700 border border-purple-200",
  hot: "bg-orange-50 text-orange-700 border border-orange-200",
  warning: "bg-red-100 text-red-800 border border-red-300",
  newsy: "bg-blue-50 text-blue-700 border border-blue-200",
};

interface WhyOption {
  kind: WhyKind;
  icon: string;
  label: string;
  sub: string;
}

function whyOptionsFor(stock: StockDetail | null): WhyOption[] {
  if (!stock) return [];
  const opts: WhyOption[] = [];
  // 가격 변동에 따라 적절한 why 1개 + 항상 "요즘 무슨 일?"
  if (stock.changePct < -1) {
    opts.push({
      kind: "cheap",
      icon: "🤔",
      label: "왜 싸졌어?",
      sub: "이유 알고 싶어",
    });
  } else if (stock.changePct > 1) {
    opts.push({
      kind: "exp",
      icon: "😮",
      label: "왜 비싸졌어?",
      sub: "이유 알고 싶어",
    });
  }
  if (stock.badge === "hot") {
    opts.push({
      kind: "hot",
      icon: "🔥",
      label: "왜 인기야?",
      sub: "이유 알고 싶어",
    });
  }
  opts.push({
    kind: "now",
    icon: "📰",
    label: "요즘 무슨 일?",
    sub: "최신 소식 보기",
  });
  return opts;
}

const ANSWER_HEADER: Record<WhyKind, { text: string; badge: string }> = {
  cheap: { text: "싸진 이유", badge: "bg-red-50 text-red-700 border-red-200" },
  exp: {
    text: "비싸진 이유",
    badge: "bg-purple-50 text-purple-700 border-purple-200",
  },
  hot: {
    text: "뜨는 이유",
    badge: "bg-orange-50 text-orange-700 border-orange-200",
  },
  now: {
    text: "최신 소식",
    badge: "bg-amber-50 text-amber-700 border-amber-200",
  },
};

export default function StockDetailPage() {
  const router = useRouter();
  const { profile } = useProfile();
  const params = useParams<{ ticker: string }>();
  const ticker = (params.ticker ?? "").toUpperCase();

  const [stock, setStock] = useState<StockDetail | null>(null);
  const [newsResp, setNewsResp] = useState<NewsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeWhy, setActiveWhy] = useState<WhyKind | null>(null);

  useEffect(() => {
    if (!ticker) return;
    const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";
    const speaker = profile?.speakerType ?? "son";
    const level = profile?.level ?? "beginner";
    Promise.all([
      fetch(`${apiBase}/api/stocks/${ticker}`).then((r) =>
        r.ok ? r.json() : Promise.reject(`stock ${r.status}`),
      ),
      fetch(
        `${apiBase}/api/stocks/${ticker}/news?speaker=${speaker}&level=${level}`,
      ).then((r) => (r.ok ? r.json() : Promise.reject(`news ${r.status}`))),
    ])
      .then(([s, n]: [StockDetail, NewsResponse]) => {
        setStock(s);
        setNewsResp(n);
      })
      .catch((e) => setError(String(e)));
  }, [ticker, profile?.speakerType, profile?.level]);

  const whyOpts = whyOptionsFor(stock);
  const newsForWhy = newsResp?.news ?? [];

  return (
    <main className="min-h-screen bg-stone-50">
      {/* Top bar */}
      <header className="flex items-center gap-3 bg-white px-4 py-3 border-b border-gray-100 sticky top-0 z-10">
        <button
          onClick={() => router.back()}
          className="text-2xl text-orange-600 leading-none"
          aria-label="뒤로"
        >
          ←
        </button>
        <div className="flex-1 leading-tight">
          <div className="text-base font-semibold">
            {stock?.nameKo ?? ticker}{" "}
            <span className="text-sm font-normal text-gray-400">
              ({ticker})
            </span>
          </div>
          {stock?.descriptionKo && (
            <div className="text-xs text-gray-500">{stock.descriptionKo}</div>
          )}
        </div>
      </header>

      {error && (
        <div className="px-4 py-6 text-red-500 text-center">실패: {error}</div>
      )}
      {!stock && !error && (
        <div className="px-4 py-12 text-gray-400 text-center">
          불러오는 중...
        </div>
      )}

      {stock && (
        <>
          {/* Hero */}
          <section className="bg-white px-4 py-4 border-b border-gray-100">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div>
                <div className="text-3xl font-bold">
                  ${stock.currentPrice.toFixed(2)}
                </div>
                <div
                  className={`text-sm font-semibold mt-1 ${
                    stock.changePct >= 0 ? "text-emerald-700" : "text-red-700"
                  }`}
                >
                  {stock.changePct >= 0 ? "▲" : "▼"}{" "}
                  {Math.abs(stock.changePct).toFixed(2)}% 오늘
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  52주 ${stock.week52Low.toFixed(0)} ~ $
                  {stock.week52High.toFixed(0)}
                </div>
              </div>
              {stock.badge && (
                <span
                  className={`text-xs font-semibold rounded-full px-3 py-1 ${BADGE_BG[stock.badge]}`}
                >
                  {BADGE_LABELS[stock.badge]}
                </span>
              )}
            </div>

            {/* Why buttons */}
            <div className="grid grid-cols-2 gap-2 mt-3">
              {whyOpts.map((opt) => {
                const active = activeWhy === opt.kind;
                const activeStyle = {
                  cheap: "bg-red-50 border-red-300",
                  exp: "bg-purple-50 border-purple-300",
                  hot: "bg-orange-50 border-orange-300",
                  now: "bg-amber-50 border-amber-300",
                }[opt.kind];
                return (
                  <button
                    key={opt.kind}
                    onClick={() =>
                      setActiveWhy(activeWhy === opt.kind ? null : opt.kind)
                    }
                    className={`rounded-xl border px-3 py-2.5 text-center transition active:scale-[0.98] ${
                      active
                        ? activeStyle
                        : "bg-white border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="text-lg mb-0.5">{opt.icon}</div>
                    <div className="text-sm font-semibold text-gray-900">
                      {opt.label}
                    </div>
                    <div className="text-[10px] text-gray-500 mt-0.5">
                      {opt.sub}
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Answer area */}
          {activeWhy && (
            <section className="bg-white">
              <div className="flex items-center gap-2 px-4 pt-3 pb-1">
                <span className="text-sm font-semibold">
                  {ANSWER_HEADER[activeWhy].text}
                </span>
                <span
                  className={`text-xs rounded-full border px-2 py-0.5 ${ANSWER_HEADER[activeWhy].badge}`}
                >
                  뉴스 {newsForWhy.length}개
                </span>
              </div>
              {newsResp?.fallback && (
                <p className="mx-4 mt-1 text-xs text-amber-700 bg-amber-50 rounded px-2 py-1">
                  본인 화자/수준으로 변환된 뉴스가 없어 기본(아들·완전처음)으로
                  보여드려요.
                </p>
              )}
              {newsForWhy.length === 0 ? (
                <p className="px-4 py-6 text-sm text-gray-500 text-center">
                  관련 뉴스가 없어요
                </p>
              ) : (
                <div>
                  {newsForWhy.map((n, idx) => (
                    <CompactNewsItem
                      key={n.id}
                      news={n}
                      index={idx}
                      why={activeWhy}
                    />
                  ))}
                </div>
              )}

              {/* Add row */}
              <div className="flex gap-2 px-4 py-3 border-t border-gray-100">
                <button className="flex-1 rounded-xl bg-orange-500 text-white text-sm font-semibold py-2.5">
                  + 관심 목록에 담기
                </button>
                <button
                  onClick={() => router.push("/stocks")}
                  className="flex-1 rounded-xl bg-gray-100 text-gray-600 text-sm font-semibold py-2.5"
                >
                  넘어가기
                </button>
              </div>
            </section>
          )}

          {!activeWhy && (
            <p className="px-6 py-8 text-sm text-gray-500 text-center">
              위 버튼을 눌러 관련 뉴스를 보세요
            </p>
          )}
        </>
      )}
    </main>
  );
}
