"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { BADGE_LABELS, type StockBadge } from "@eomni/shared";
import { BubbleArea } from "@/components/news/BubbleArea";
import { PersonaHeader } from "@/components/PersonaHeader";
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

interface NewsItem {
  id: string;
  source: string;
  headline: string;
  bubble: string;
  publishedAt: string;
}

const BADGE_BG: Record<StockBadge, string> = {
  cheap: "bg-emerald-100 text-emerald-700",
  expensive: "bg-purple-100 text-purple-700",
  hot: "bg-orange-100 text-orange-700",
  warning: "bg-red-100 text-red-700",
  newsy: "bg-blue-100 text-blue-700",
};

export default function StockDetailPage() {
  const { profile } = useProfile();
  const params = useParams<{ ticker: string }>();
  const ticker = (params.ticker ?? "").toUpperCase();

  const [stock, setStock] = useState<StockDetail | null>(null);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ticker) return;
    const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";
    Promise.all([
      fetch(`${apiBase}/api/stocks/${ticker}`).then((r) =>
        r.ok ? r.json() : Promise.reject(`stock ${r.status}`),
      ),
      fetch(`${apiBase}/api/stocks/${ticker}/news`).then((r) =>
        r.ok ? r.json() : Promise.reject(`news ${r.status}`),
      ),
    ])
      .then(([s, n]) => {
        setStock(s);
        setNews(n.news ?? []);
      })
      .catch((e) => setError(String(e)));
  }, [ticker]);

  return (
    <>
      {profile && <PersonaHeader profile={profile} />}
      <main className="px-4 py-6">
        <Link href="/stocks" className="text-gray-500 text-sm">
          ← 종목 목록
        </Link>

        {error && (
          <div className="mt-4 text-red-500 text-center">실패: {error}</div>
        )}

        {!stock && !error && (
          <div className="text-gray-400 text-center py-12">불러오는 중...</div>
        )}

        {stock && (
          <>
            <header className="mt-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm text-gray-500">{stock.ticker}</div>
                  <h1 className="text-3xl font-bold">{stock.nameKo}</h1>
                  <p className="text-base text-gray-500 mt-1">
                    {stock.descriptionKo}
                  </p>
                </div>
                {stock.badge && (
                  <span
                    className={`text-xs font-bold rounded-full px-3 py-1 self-start ${BADGE_BG[stock.badge]}`}
                  >
                    {BADGE_LABELS[stock.badge]}
                  </span>
                )}
              </div>

              <div className="mt-4 flex items-baseline gap-3">
                <span className="text-4xl font-bold">
                  ${stock.currentPrice.toFixed(2)}
                </span>
                <span
                  className={`text-lg font-semibold ${
                    stock.changePct >= 0 ? "text-red-600" : "text-blue-600"
                  }`}
                >
                  {stock.changePct >= 0 ? "▲" : "▼"}{" "}
                  {Math.abs(stock.changePct).toFixed(2)}%
                </span>
              </div>

              <div className="mt-3 text-sm text-gray-500">
                52주 최고 ${stock.week52High.toFixed(2)} · 최저 $
                {stock.week52Low.toFixed(2)}
              </div>
            </header>

            <section className="mt-8">
              <h2 className="text-xl font-bold mb-3">
                {stock.changePct >= 0
                  ? `왜 ${stock.nameKo}이(가) 올랐어?`
                  : `왜 ${stock.nameKo}이(가) 내렸어?`}
              </h2>

              {news.length === 0 && (
                <p className="text-gray-500 text-sm">
                  아직 이 종목 관련 뉴스가 없어요
                </p>
              )}
              {news.map((n) => (
                <article
                  key={n.id}
                  className="rounded-2xl border border-gray-200 bg-white p-4 mb-3"
                >
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                    <span>{n.source}</span>
                    <span>{n.publishedAt.slice(0, 10)}</span>
                  </div>
                  <h3 className="text-base font-bold mb-3 leading-snug">
                    {n.headline}
                  </h3>
                  {profile && (
                    <BubbleArea
                      speakerType={profile.speakerType}
                      text={n.bubble}
                    />
                  )}
                </article>
              ))}
            </section>

            <button className="mt-6 w-full rounded-2xl border-2 border-orange-500 text-orange-600 px-5 py-4 text-lg font-semibold">
              + 찜하기
            </button>
          </>
        )}
      </main>
    </>
  );
}
