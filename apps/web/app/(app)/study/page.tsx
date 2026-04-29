"use client";

import Link from "next/link";
import { PersonaHeader } from "@/components/PersonaHeader";
import { TabBar } from "@/components/TabBar";
import { ALL_LESSONS } from "@/lib/lessons";
import { useProfile } from "@/lib/profile";
import { useStudy } from "@/lib/study";
import { useSubscription } from "@/lib/subscription";

export default function StudyPage() {
  const { profile, loaded: profileLoaded } = useProfile();
  const study = useStudy();
  const sub = useSubscription();

  if (!profileLoaded || !study.loaded) {
    return <div className="p-8 text-gray-400">불러오는 중...</div>;
  }

  return (
    <>
      {profile && <PersonaHeader profile={profile} />}
      <TabBar />
      <main className="px-4 py-6">
        <header className="mb-4">
          <h1 className="text-2xl font-bold mb-1">공부방</h1>
          <p className="text-sm text-gray-500">
            한 단계씩 천천히 배워봐요. 듀올링고처럼!
          </p>
        </header>

        {/* 점수/스트릭 요약 */}
        <section className="rounded-2xl bg-purple-50 border border-purple-200 px-4 py-3 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <span>🔥</span>
            <span className="text-purple-700 font-semibold">
              {study.state.streakDays || 0}일 연속
            </span>
          </div>
          <div className="text-sm text-purple-700 font-semibold">
            총 {study.state.totalScore}점
          </div>
          {study.state.badges.length > 0 && (
            <div className="text-sm">🏅 {study.state.badges.length}</div>
          )}
        </section>

        {/* 레슨 목록 */}
        <div className="flex flex-col gap-3">
          {ALL_LESSONS.map((lesson) => {
            const isCompleted = study.state.completed.includes(lesson.id);
            const isCurrent =
              !isCompleted &&
              lesson.id === study.state.completed.length + 1 &&
              !(lesson.premium && !sub.isSubscribed);
            const isLocked = lesson.premium && !sub.isSubscribed;
            return (
              <LessonCard
                key={lesson.id}
                id={lesson.id}
                title={lesson.title}
                premium={lesson.premium}
                isCompleted={isCompleted}
                isCurrent={isCurrent}
                isLocked={isLocked}
              />
            );
          })}
        </div>

        {/* 유료 안내 */}
        {!sub.isSubscribed && (
          <div className="mt-6 rounded-2xl border-[1.5px] border-purple-300 bg-white p-4">
            <div className="text-sm font-semibold text-purple-800 mb-1">
              3단계부터 구독 필요해요
            </div>
            <p className="text-xs text-gray-600 mb-3 leading-relaxed">
              2단계까지 무료로 보셨다면 더 깊이 공부할 시점이에요.
            </p>
            <Link
              href="/subscribe"
              className="block text-center rounded-xl bg-purple-700 text-white text-sm font-semibold py-3"
            >
              월 4,900원으로 시작하기
            </Link>
          </div>
        )}
      </main>
    </>
  );
}

function LessonCard({
  id,
  title,
  premium,
  isCompleted,
  isCurrent,
  isLocked,
}: {
  id: number;
  title: string;
  premium: boolean;
  isCompleted: boolean;
  isCurrent: boolean;
  isLocked: boolean;
}) {
  const num = (
    <div
      className={`w-10 h-10 rounded-full flex items-center justify-center text-base font-semibold flex-shrink-0 ${
        isCompleted
          ? "bg-emerald-100 text-emerald-700"
          : isCurrent
            ? "bg-purple-100 text-purple-700"
            : isLocked
              ? "bg-gray-100 text-gray-400"
              : "bg-gray-100 text-gray-500"
      }`}
    >
      {isLocked ? (
        <svg width="14" height="16" viewBox="0 0 14 16" fill="none">
          <rect
            x="2"
            y="7"
            width="10"
            height="8"
            rx="1.5"
            stroke="currentColor"
            strokeWidth="1.4"
          />
          <path
            d="M4 7V5a3 3 0 016 0v2"
            stroke="currentColor"
            strokeWidth="1.4"
          />
        </svg>
      ) : (
        id
      )}
    </div>
  );

  const inner = (
    <div className="flex items-center gap-3">
      {num}
      <div className="flex-1 leading-tight">
        <div className="text-base font-semibold">{title}</div>
        <div className="text-xs text-gray-500 mt-0.5">
          {isCompleted
            ? "완료했어요!"
            : isCurrent
              ? "지금 공부할 차례!"
              : isLocked
                ? "구독하면 열려요"
                : "시작 전"}
        </div>
      </div>
      {isCompleted && (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <circle cx="9" cy="9" r="8" stroke="#1D9E75" strokeWidth="1.4" />
          <polyline
            points="5,9 7.5,11.5 13,6"
            stroke="#1D9E75"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
      {premium && !isCompleted && (
        <span className="text-[10px] rounded-full bg-amber-50 border border-amber-200 text-amber-700 px-2 py-0.5">
          유료
        </span>
      )}
    </div>
  );

  const cls =
    "block rounded-2xl border bg-white px-4 py-3.5 transition " +
    (isLocked
      ? "border-gray-200 opacity-70"
      : "border-gray-200 hover:border-purple-300 active:scale-[0.99]");

  if (isLocked) {
    return (
      <Link href="/subscribe" className={cls}>
        {inner}
      </Link>
    );
  }
  return (
    <Link href={`/study/${id}`} className={cls}>
      {inner}
    </Link>
  );
}
