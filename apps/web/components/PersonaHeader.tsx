"use client";

import Link from "next/link";
import { useState } from "react";
import type { Profile } from "@/lib/profile";
import { SPEAKER_LABELS, TARGET_LABELS, LEVEL_LABELS } from "@eomni/shared";

interface PersonaHeaderProps {
  profile: Profile;
  onRegenerated?: () => void;
}

const SPEAKER_EMOJI: Record<Profile["speakerType"], string> = {
  son: "👦",
  daughter: "👧",
  daughter_in_law: "👩",
  son_in_law: "👨",
};

export function PersonaHeader({ profile, onRegenerated }: PersonaHeaderProps) {
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function regenerate() {
    setBusy(true);
    setMsg(null);
    try {
      const apiBase =
        process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";
      const res = await fetch(
        `${apiBase}/api/dev/expand-bubbles?speaker=${profile.speakerType}&level=${profile.level}`,
        { method: "POST" },
      );
      const data = await res.json();
      if (!res.ok) {
        setMsg(`실패: ${data.message ?? "오류"}`);
      } else {
        setMsg(
          `${data.created}건 새로 변환 (건너뛴 것 ${data.skipped})`,
        );
        onRegenerated?.();
      }
    } catch (err) {
      setMsg(`연결 실패: ${(err as Error).message}`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <header className="border-b border-gray-100 bg-white px-4 py-3 sticky top-0 z-10">
      <div className="flex items-center justify-between gap-3">
        <Link href="/feed" className="flex items-center gap-2">
          <span className="text-2xl">{SPEAKER_EMOJI[profile.speakerType]}</span>
          <div className="leading-tight">
            <div className="text-xs text-gray-500">
              {SPEAKER_LABELS[profile.speakerType]} →{" "}
              {TARGET_LABELS[profile.targetType]}
            </div>
            <div className="text-sm font-semibold">
              {profile.targetName} {TARGET_LABELS[profile.targetType]}
            </div>
          </div>
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-xs rounded-full bg-gray-100 px-2 py-1 text-gray-600">
            {LEVEL_LABELS[profile.level]}
          </span>
          <Link
            href="/settings"
            className="text-sm text-gray-500 px-2 py-1"
            aria-label="설정"
          >
            ⚙️
          </Link>
        </div>
      </div>
      <div className="flex items-center gap-2 mt-2">
        <button
          onClick={regenerate}
          disabled={busy}
          className="text-xs rounded-full bg-orange-50 text-orange-700 border border-orange-200 px-3 py-1 disabled:opacity-50"
        >
          {busy ? "변환 중..." : `내 스타일로 다시 변환`}
        </button>
        {msg && <span className="text-xs text-gray-500">{msg}</span>}
      </div>
    </header>
  );
}
