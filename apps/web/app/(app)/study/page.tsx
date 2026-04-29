"use client";

import { PersonaHeader } from "@/components/PersonaHeader";
import { TabBar } from "@/components/TabBar";
import { useProfile } from "@/lib/profile";

export default function StudyPage() {
  const { profile, loaded } = useProfile();
  if (!loaded) return <div className="p-8 text-gray-400">불러오는 중...</div>;
  return (
    <>
      {profile && <PersonaHeader profile={profile} />}
      <TabBar />
      <main className="px-4 py-6">
        <h1 className="text-2xl font-bold mb-4">공부방</h1>
        <p className="text-gray-500 mb-6">한 단계씩 천천히 배워봐요</p>
        <div className="rounded-xl border border-dashed border-gray-300 p-6 text-center text-sm text-gray-400">
          5단계 커리큘럼 (Phase 2)
        </div>
      </main>
    </>
  );
}
