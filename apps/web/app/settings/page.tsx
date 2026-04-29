"use client";

import { useRouter } from "next/navigation";
import { clearProfile, useProfile } from "@/lib/profile";
import { SPEAKER_LABELS, TARGET_LABELS, LEVEL_LABELS } from "@eomni/shared";
import { PersonaHeader } from "@/components/PersonaHeader";

export default function SettingsPage() {
  const router = useRouter();
  const { profile, loaded } = useProfile();

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
