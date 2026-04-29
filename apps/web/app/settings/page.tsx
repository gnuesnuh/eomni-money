"use client";

import { useRouter } from "next/navigation";
import { clearProfile, useProfile } from "@/lib/profile";
import { SPEAKER_LABELS, TARGET_LABELS, LEVEL_LABELS } from "@eomni/shared";
import { PersonaHeader } from "@/components/PersonaHeader";
import { useSubscription } from "@/lib/subscription";

export default function SettingsPage() {
  const router = useRouter();
  const { profile, loaded } = useProfile();
  const sub = useSubscription();

  if (!loaded) return <div className="p-8 text-gray-400">불러오는 중...</div>;

  return (
    <>
      {profile && <PersonaHeader profile={profile} />}
      <main className="px-4 py-6">
        <h1 className="text-2xl font-bold mb-4">설정</h1>

        {profile ? (
          <section className="rounded-2xl border border-gray-200 p-4 mb-4">
            <div className="text-sm text-gray-500 mb-1">현재 설정</div>
            <div className="text-lg font-semibold">
              {SPEAKER_LABELS[profile.speakerType]} →{" "}
              {profile.targetName} {TARGET_LABELS[profile.targetType]}
            </div>
            <div className="text-sm text-gray-600 mt-1">
              수준: {LEVEL_LABELS[profile.level]}
            </div>
          </section>
        ) : (
          <p className="text-gray-500">아직 설정 안 되어 있어요</p>
        )}

        {/* 구독 상태 (MVP: 결제 미연동, 토글로 시뮬레이션) */}
        <section className="rounded-2xl border border-gray-200 p-4 mb-4">
          <div className="flex items-center justify-between mb-1">
            <div className="text-sm text-gray-500">구독 상태</div>
            <span
              className={`text-xs font-semibold rounded-full px-2 py-0.5 ${
                sub.isSubscribed
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {sub.isSubscribed ? "구독 중" : "무료"}
            </span>
          </div>
          <div className="text-base font-semibold">
            {sub.isSubscribed ? "월 4,900원 무제한" : `오늘 본 뉴스 ${sub.viewCount}/${sub.freeLimit}개`}
          </div>
          <div className="mt-3">
            <button
              onClick={() => sub.setSubscribed(!sub.isSubscribed)}
              className={`text-sm rounded-full px-4 py-2 ${
                sub.isSubscribed
                  ? "border border-gray-300 text-gray-700"
                  : "bg-orange-500 text-white"
              }`}
            >
              {sub.isSubscribed ? "구독 해지 (시뮬레이션)" : "구독하기 (시뮬레이션)"}
            </button>
            <p className="text-xs text-gray-400 mt-2">
              MVP 테스트용 — 실제 결제는 Phase 2 (포트원) 연동 후
            </p>
          </div>
        </section>

        <button
          onClick={() => router.push("/onboarding")}
          className="w-full rounded-2xl border-2 border-orange-500 text-orange-600 px-5 py-4 text-lg font-semibold mb-3"
        >
          화자/수준 다시 설정
        </button>

        <button
          onClick={() => {
            if (confirm("설정을 초기화할까요?")) {
              clearProfile();
              router.push("/");
            }
          }}
          className="w-full rounded-2xl border-2 border-gray-200 text-gray-600 px-5 py-4 text-lg font-semibold"
        >
          초기화
        </button>
      </main>
    </>
  );
}
