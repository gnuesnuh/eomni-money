"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { NewsCardData } from "@eomni/shared";
import { NewsCard } from "@/components/news/NewsCard";
import { NativeAdCard } from "@/components/news/NativeAdCard";
import { FreeLimitCard } from "@/components/news/FreeLimitCard";
import { PersonaHeader } from "@/components/PersonaHeader";
import { TabBar } from "@/components/TabBar";
import { useProfile } from "@/lib/profile";
import { pickAd } from "@/lib/ads";
import { useSubscription } from "@/lib/subscription";

interface FeedResponse {
  items: NewsCardData[];
  speakerType: string;
  level: string;
  fallback: boolean;
}

const AD_INTERVAL = 3; // 매 3개 뉴스마다 광고 1개

export default function FeedPage() {
  const { profile, loaded: profileLoaded } = useProfile();
  const sub = useSubscription();
  const [feed, setFeed] = useState<FeedResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFeed = useCallback(async () => {
    if (!profile) return;
    setLoading(true);
    setError(null);
    try {
      const apiBase =
        process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";
      const res = await fetch(
        `${apiBase}/api/news?speaker=${profile.speakerType}&level=${profile.level}`,
        { cache: "no-store" },
      );
      if (!res.ok) throw new Error(`API ${res.status}`);
      setFeed(await res.json());
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [profile]);

  useEffect(() => {
    if (profileLoaded && profile) fetchFeed();
  }, [profileLoaded, profile, fetchFeed]);

  // 화면에 노출된 뉴스 개수를 일일 카운트로 기록 (자정 자동 리셋)
  useEffect(() => {
    if (!feed || !sub.loaded) return;
    if (sub.isSubscribed) return;
    const visible = Math.min(feed.items.length, sub.freeLimit);
    sub.recordViews(visible);
    // recordViews는 useCallback 안정 — eslint exhaustive 무시
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [feed, sub.loaded, sub.isSubscribed, sub.freeLimit]);

  if (!profileLoaded) {
    return <div className="p-8 text-center text-gray-400">불러오는 중...</div>;
  }

  if (!profile) {
    return (
      <main className="px-6 py-12 text-center">
        <p className="text-lg text-gray-600 mb-6">
          처음 사용하시는군요. 잠깐 설정만 해드릴게요.
        </p>
        <Link
          href="/onboarding"
          className="inline-block rounded-2xl bg-orange-500 px-6 py-4 text-xl font-semibold text-white"
        >
          시작하기
        </Link>
      </main>
    );
  }

  // 무료 사용자: 5개로 제한, 그 다음에 한도 카드
  const visibleItems = feed
    ? sub.isSubscribed
      ? feed.items
      : feed.items.slice(0, sub.freeLimit)
    : [];
  const hiddenCount = feed
    ? Math.max(0, feed.items.length - visibleItems.length)
    : 0;
  const showLimitCard =
    feed != null && !sub.isSubscribed && visibleItems.length >= sub.freeLimit;
  // 6번째 카드를 살짝 보여주는 paywall teaser
  const teaserItem =
    feed && !sub.isSubscribed && hiddenCount > 0
      ? feed.items[sub.freeLimit]
      : null;

  return (
    <>
      <PersonaHeader profile={profile} onRegenerated={fetchFeed} />
      <TabBar />
      <main className="px-4 py-5">
        <header className="mb-3">
          <h1 className="text-2xl font-bold">오늘의 뉴스</h1>
          {feed?.fallback && (
            <p className="text-xs text-amber-600 mt-1 bg-amber-50 rounded-md px-2 py-1">
              아직 이 화자/수준으로 변환된 뉴스가 없어 기본(아들·완전처음)으로
              보여드려요. 위 “내 스타일로 다시 변환” 누르면 바꿔드립니다.
            </p>
          )}
        </header>

        {loading && (
          <div className="text-center text-gray-400 py-12">불러오는 중...</div>
        )}
        {error && (
          <div className="text-center text-red-500 py-12">
            연결 실패: {error}
            <button
              onClick={fetchFeed}
              className="block mx-auto mt-4 text-orange-500 underline"
            >
              다시 시도
            </button>
          </div>
        )}

        {feed && feed.items.length === 0 && !loading && (
          <div className="text-center text-gray-400 py-12">
            <p>아직 뉴스가 없어요</p>
            <p className="text-xs mt-2">
              관리자: <code>POST /api/dev/seed</code> 한번 돌려주세요
            </p>
          </div>
        )}

        {feed && visibleItems.length > 0 && (
          <div className="flex flex-col gap-4">
            {visibleItems.map((n, idx) => (
              <NewsItemWithAd
                key={n.id}
                news={n}
                index={idx}
                hideAds={sub.isSubscribed}
              />
            ))}
            {showLimitCard && (
              <FreeLimitCard
                shownCount={visibleItems.length}
                freeLimit={sub.freeLimit}
              />
            )}
            {teaserItem && (
              <div className="relative">
                {/* 블러된 6번째 카드 — 클릭 막음 */}
                <div
                  className="pointer-events-none select-none blur-sm opacity-60"
                  aria-hidden
                >
                  <NewsCard news={teaserItem} />
                </div>
                {/* 하단 페이드 + 구독 CTA */}
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-b from-transparent to-white pointer-events-none rounded-b-2xl" />
                <Link
                  href="/subscribe"
                  className="absolute inset-x-0 bottom-3 mx-auto w-fit text-sm font-semibold text-orange-600 bg-white/95 border border-orange-200 rounded-full px-4 py-2 shadow-sm"
                >
                  구독하면 +{hiddenCount}개 더 보여드려요
                </Link>
              </div>
            )}
          </div>
        )}
      </main>
    </>
  );
}

function NewsItemWithAd({
  news,
  index,
  hideAds,
}: {
  news: NewsCardData;
  index: number;
  hideAds: boolean;
}) {
  const showAdAfter = !hideAds && (index + 1) % AD_INTERVAL === 0;
  return (
    <>
      <NewsCard news={news} />
      {showAdAfter && <NativeAdCard ad={pickAd(Math.floor(index / AD_INTERVAL))} />}
    </>
  );
}
