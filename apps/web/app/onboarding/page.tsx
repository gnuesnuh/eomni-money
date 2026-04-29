"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type {
  LearningLevel,
  SpeakerType,
  TargetType,
} from "@eomni/shared";
import { writeProfile } from "@/lib/profile";

type Step = 1 | 2 | 3 | 4;

const SPEAKER_OPTIONS: Array<{
  value: SpeakerType;
  emoji: string;
  label: string;
}> = [
  { value: "son", emoji: "👦", label: "아들" },
  { value: "daughter", emoji: "👧", label: "딸" },
  { value: "daughter_in_law", emoji: "👩", label: "며느리" },
  { value: "son_in_law", emoji: "👨", label: "사위" },
];

const TARGET_OPTIONS: Array<{
  value: TargetType;
  emoji: string;
  label: string;
}> = [
  { value: "mother", emoji: "👩‍🦳", label: "어머니" },
  { value: "father", emoji: "👨‍🦳", label: "아버지" },
];

const LEVEL_OPTIONS: Array<{
  value: LearningLevel;
  label: string;
  desc: string;
}> = [
  {
    value: "beginner",
    label: "완전 처음이에요",
    desc: "주식이 뭔지부터 차근차근",
  },
  {
    value: "intermediate",
    label: "조금 알아요",
    desc: "기본 용어는 들어봤어요",
  },
  {
    value: "advanced",
    label: "어느 정도 해봤어요",
    desc: "직접 매매도 해본 적 있어요",
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [speaker, setSpeaker] = useState<SpeakerType | null>(null);
  const [target, setTarget] = useState<TargetType | null>(null);
  const [name, setName] = useState("");
  const [level, setLevel] = useState<LearningLevel | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function next() {
    if (step < 4) setStep((s) => (s + 1) as Step);
  }
  function prev() {
    if (step > 1) setStep((s) => (s - 1) as Step);
  }

  async function complete() {
    if (!speaker || !target || !name.trim() || !level) return;
    setSubmitting(true);
    const profile = {
      speakerType: speaker,
      targetType: target,
      targetName: name.trim(),
      level,
    };
    writeProfile(profile);

    // 서버에도 알림 (인증 붙기 전엔 stub 응답이지만 흐름 확인용)
    try {
      const apiBase =
        process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";
      await fetch(`${apiBase}/api/users/onboarding`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
    } catch {
      // 서버 응답 실패해도 로컬 진행 (프로필은 localStorage에 저장됨)
    }
    router.push("/feed");
  }

  return (
    <main className="min-h-screen px-6 py-8 flex flex-col">
      {/* progress */}
      <div className="flex gap-2 mb-8">
        {[1, 2, 3, 4].map((s) => (
          <div
            key={s}
            className={`h-2 flex-1 rounded-full ${
              s <= step ? "bg-orange-500" : "bg-gray-200"
            }`}
          />
        ))}
      </div>

      {step === 1 && (
        <Step1
          value={speaker}
          onChange={(v) => {
            setSpeaker(v);
            setTimeout(next, 150);
          }}
        />
      )}
      {step === 2 && (
        <Step2
          value={target}
          onChange={(v) => {
            setTarget(v);
            setTimeout(next, 150);
          }}
        />
      )}
      {step === 3 && (
        <Step3
          target={target}
          value={name}
          onChange={setName}
          onSubmit={() => name.trim().length >= 1 && next()}
        />
      )}
      {step === 4 && (
        <Step4
          value={level}
          onChange={(v) => setLevel(v)}
          onSubmit={complete}
          submitting={submitting}
        />
      )}

      {/* back */}
      {step > 1 && !submitting && (
        <button
          onClick={prev}
          className="mt-auto self-start text-gray-500 px-4 py-3"
        >
          ← 이전
        </button>
      )}
    </main>
  );
}

function Step1({
  value,
  onChange,
}: {
  value: SpeakerType | null;
  onChange: (v: SpeakerType) => void;
}) {
  return (
    <section>
      <h1 className="text-3xl font-bold mb-2">반가워요!</h1>
      <p className="text-lg text-gray-600 mb-8">당신은 누구인가요?</p>
      <div className="grid grid-cols-2 gap-3">
        {SPEAKER_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`rounded-2xl border-2 px-4 py-6 flex flex-col items-center gap-2 active:scale-[0.98] transition ${
              value === opt.value
                ? "border-orange-500 bg-orange-50"
                : "border-gray-200 bg-white"
            }`}
          >
            <span className="text-4xl">{opt.emoji}</span>
            <span className="text-xl font-semibold">{opt.label}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

function Step2({
  value,
  onChange,
}: {
  value: TargetType | null;
  onChange: (v: TargetType) => void;
}) {
  return (
    <section>
      <h1 className="text-3xl font-bold mb-2">누구에게 알려드리실 건가요?</h1>
      <p className="text-lg text-gray-600 mb-8">설명할 대상을 골라주세요</p>
      <div className="grid grid-cols-2 gap-3">
        {TARGET_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`rounded-2xl border-2 px-4 py-6 flex flex-col items-center gap-2 active:scale-[0.98] transition ${
              value === opt.value
                ? "border-orange-500 bg-orange-50"
                : "border-gray-200 bg-white"
            }`}
          >
            <span className="text-4xl">{opt.emoji}</span>
            <span className="text-xl font-semibold">{opt.label}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

function Step3({
  target,
  value,
  onChange,
  onSubmit,
}: {
  target: TargetType | null;
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
}) {
  const targetLabel = target === "father" ? "아버지" : "어머니";
  return (
    <section>
      <h1 className="text-3xl font-bold mb-2">{targetLabel} 성함이 어떻게 되세요?</h1>
      <p className="text-lg text-gray-600 mb-8">
        호칭에 사용할게요 (예: 박순자 {targetLabel})
      </p>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onSubmit()}
        placeholder="이름을 입력하세요"
        className="w-full rounded-2xl border-2 border-gray-200 px-5 py-4 text-xl focus:border-orange-500 focus:outline-none"
        autoFocus
      />
      <button
        onClick={onSubmit}
        disabled={value.trim().length < 1}
        className="mt-6 w-full rounded-2xl bg-orange-500 px-6 py-4 text-xl font-semibold text-white disabled:bg-gray-300 active:scale-[0.98] transition"
      >
        다음
      </button>
    </section>
  );
}

function Step4({
  value,
  onChange,
  onSubmit,
  submitting,
}: {
  value: LearningLevel | null;
  onChange: (v: LearningLevel) => void;
  onSubmit: () => void;
  submitting: boolean;
}) {
  return (
    <section>
      <h1 className="text-3xl font-bold mb-2">어디까지 알고 계세요?</h1>
      <p className="text-lg text-gray-600 mb-8">설명 수준을 맞춰드릴게요</p>
      <div className="flex flex-col gap-3">
        {LEVEL_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`rounded-2xl border-2 px-5 py-4 text-left active:scale-[0.99] transition ${
              value === opt.value
                ? "border-orange-500 bg-orange-50"
                : "border-gray-200 bg-white"
            }`}
          >
            <div className="text-xl font-semibold mb-1">{opt.label}</div>
            <div className="text-sm text-gray-500">{opt.desc}</div>
          </button>
        ))}
      </div>
      <button
        onClick={onSubmit}
        disabled={!value || submitting}
        className="mt-8 w-full rounded-2xl bg-orange-500 px-6 py-4 text-xl font-semibold text-white disabled:bg-gray-300 active:scale-[0.98] transition"
      >
        {submitting ? "준비 중..." : "시작하기"}
      </button>
    </section>
  );
}
