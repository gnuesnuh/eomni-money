"use client";

import { PersonaHeader } from "@/components/PersonaHeader";
import { TabBar } from "@/components/TabBar";
import { useProfile } from "@/lib/profile";

export default function WatchlistPage() {
  const { profile, loaded } = useProfile();
  if (!loaded) return <div className="p-8 text-gray-400">불러오는 중...</div>;
  return (
    <>
      {profile && <PersonaHeader profile={profile} />}
      <TabBar />
      <main className="px-4 py-6">
        <h1 className="text-2xl font-bold mb-4">찜한 회사</h1>
        <div className="rounded-xl border border-dashed border-gray-300 p-6 text-center text-sm text-gray-400">
          아직 찜한 회사가 없어요. 종목 상세에서 ‘+ 찜하기’를 눌러보세요.
          <br />
          <span className="text-xs">
            (Phase 2: 인증 + 찜 저장 — 무료 3개 / 구독 무제한)
          </span>
        </div>
      </main>
    </>
  );
}
