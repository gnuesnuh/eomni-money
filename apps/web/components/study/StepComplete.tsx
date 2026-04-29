"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Lesson } from "@/lib/lessons";

interface Props {
  lesson: Lesson;
  totalScore: number;
  correctCount: number;
  perfect: boolean;
  onShareReward: (days: number) => void;
}

export function StepComplete({
  lesson,
  totalScore,
  correctCount,
  perfect,
  onShareReward,
}: Props) {
  const router = useRouter();
  const [shared, setShared] = useState(false);

  const badgeIcon = perfect
    ? lesson.badge.perfectEmoji
    : lesson.badge.emoji;
  const title = perfect
    ? lesson.completeTitle.perfect
    : lesson.completeTitle.normal;
  const sub = perfect ? lesson.completeSub.perfect : lesson.completeSub.normal;
  const shareBody = perfect
    ? lesson.shareCard.perfectBody
    : lesson.shareCard.normalBody;
  const shareBadgeText = perfect
    ? lesson.shareCard.badgeText.perfect
    : lesson.shareCard.badgeText.normal;

  function handleShareToChild() {
    onShareReward(3);
    setShared(true);
  }

  if (shared) {
    return (
      <div className="px-4 py-5">
        <div className="text-center mb-4">
          <div className="w-20 h-20 rounded-full bg-purple-100 border-[3px] border-purple-700 flex items-center justify-center text-3xl mx-auto mb-2">
            {badgeIcon}
          </div>
        </div>
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-4 text-center mb-3">
          <div className="text-3xl mb-1">📨</div>
          <div className="text-base font-semibold text-emerald-800 mb-1">
            자녀한테 카톡 보냈어!
          </div>
          <p className="text-sm text-emerald-700 leading-relaxed">
            자녀가 확인하면 구독 3일이 바로 늘어나.
            <br />
            엄마가 공부하는 거 보면 자녀도 뿌듯하겠지 ㅎㅎ
          </p>
          <div className="mt-3 rounded-lg bg-purple-50 px-3 py-2 flex items-center justify-between text-sm">
            <span className="text-purple-700 font-semibold">
              대기 중인 리워드
            </span>
            <span className="text-purple-700 font-bold">구독 +3일 🎁</span>
          </div>
        </div>
        <button
          onClick={() => router.push("/study")}
          className="w-full rounded-xl bg-purple-700 text-white py-3.5 text-sm font-semibold"
        >
          {lesson.nextLessonLabel} →
        </button>
      </div>
    );
  }

  return (
    <div className="px-4 py-5">
      {/* Badge */}
      <div className="text-center mb-4">
        <div className="w-20 h-20 rounded-full bg-purple-100 border-[3px] border-purple-700 flex items-center justify-center text-3xl mx-auto mb-2">
          {badgeIcon}
        </div>
        <div className="text-lg font-semibold mb-1">{title}</div>
        <p className="text-sm text-gray-500 leading-relaxed whitespace-pre-line">
          {sub}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <Stat val={`${totalScore}`} lbl="획득 점수" />
        <Stat val={`${correctCount}/3`} lbl="정답" />
        <Stat val={badgeIcon} lbl="배지" />
      </div>

      {/* Connect card (레슨에 따라) */}
      {lesson.connectCard && (
        <Link
          href={lesson.connectCard.linkHref}
          className="block rounded-xl bg-blue-50 border border-blue-300 px-4 py-3 mb-3"
        >
          <div className="text-sm font-semibold text-blue-900 mb-1">
            {lesson.connectCard.title}
          </div>
          <p className="text-xs text-blue-800 leading-relaxed whitespace-pre-line mb-1.5">
            {lesson.connectCard.text}
          </p>
          <span className="text-xs text-purple-700 font-semibold">
            {lesson.connectCard.linkLabel}
          </span>
        </Link>
      )}

      {/* Share card */}
      <div className="text-xs text-gray-500 font-medium mb-2">자랑하기</div>
      <div className="bg-gray-900 text-white rounded-2xl p-3.5 mb-3">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-md bg-purple-700 flex items-center justify-center text-[11px] font-semibold">
            엄
          </div>
          <span className="text-[11px] text-white/50">엄니머니 · 공부방</span>
        </div>
        <div className="text-sm font-semibold mb-1.5">
          {lesson.shareCard.title}
        </div>
        <p className="text-xs text-white/80 leading-relaxed mb-2.5 whitespace-pre-line">
          {shareBody}
        </p>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-purple-100 text-purple-800 text-[11px] px-2.5 py-0.5 font-medium">
            {shareBadgeText}
          </span>
          <span className="text-[11px] text-yellow-300 font-medium">
            {totalScore}점 획득
          </span>
        </div>
      </div>

      {/* Reward banner */}
      <div className="bg-yellow-50 border border-yellow-300 rounded-xl px-4 py-3 mb-3 flex items-start gap-2.5">
        <div className="text-xl flex-shrink-0">🎁</div>
        <div>
          <div className="text-sm font-semibold text-amber-900 mb-0.5">
            자녀한테 보내면 리워드!
          </div>
          <p className="text-xs text-amber-800 leading-relaxed">
            자녀가 카톡 확인하면 구독 기간 3일 연장돼!
          </p>
          <span className="inline-block mt-1.5 rounded-full bg-yellow-300 text-amber-900 text-[11px] font-bold px-3 py-0.5">
            구독 +3일 무료
          </span>
        </div>
      </div>

      <button
        onClick={handleShareToChild}
        className="w-full rounded-xl bg-yellow-300 text-amber-900 py-3.5 text-sm font-bold mb-2"
      >
        자녀한테 자랑하기 (리워드 받기)
      </button>
      <button
        onClick={() => alert("친구한테 자랑은 준비 중이에요!")}
        className="w-full rounded-xl bg-white border-[1.5px] border-purple-700 text-purple-700 py-3 text-sm font-semibold mb-2"
      >
        친구들한테 자랑하기
      </button>
      <button
        onClick={() => router.push("/study")}
        className="w-full rounded-xl bg-transparent border border-gray-200 text-gray-500 py-2.5 text-sm"
      >
        {lesson.nextLessonLabel}
      </button>
    </div>
  );
}

function Stat({ val, lbl }: { val: string; lbl: string }) {
  return (
    <div className="bg-stone-100 rounded-xl py-2.5 text-center">
      <div className="text-lg font-semibold text-purple-700">{val}</div>
      <div className="text-[10px] text-gray-500 mt-0.5">{lbl}</div>
    </div>
  );
}
