"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { NewsCardData } from "@eomni/shared";
import { NewsCard } from "@/components/news/NewsCard";
import { PersonaHeader } from "@/components/PersonaHeader";
import { useProfile } from "@/lib/profile";

interface FeedResponse {
  items: NewsCardData[];
  speakerType: string;
  level: string;
  fallback: boolean;
}

export default function FeedPage() {
  const { profile, loaded } = useProfile();
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
    if (loaded && profile) fetchFeed();
  }, [loaded, profile, fetchFeed]);

  if (!loaded) {
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

  return (
    <>
      <PersonaHeader profile={profile} onRegenerated={fetchFeed} />
      <main className="px-4 py-6">
        <header className="mb-4">
          <h1 className="text-2xl font-bold">오늘의 뉴스</h1>
          {feed?.fallback && (
            <p className="text-xs text-amber-600 mt-1 bg-amber-50 rounded-md px-2 py-1">
              아직 이 화자/수준으로는 변환이 안 되어 기본(아들·완전처음)으로
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

        {feed && feed.items.length > 0 && (
          <div className="flex flex-col gap-4">
            {feed.items.map((n) => (
              <NewsCard key={n.id} news={n} />
            ))}
          </div>
        )}
      </main>
    </>
  );
}
