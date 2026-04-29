"use client";

import Link from "next/link";

interface FreeLimitCardProps {
  shownCount: number;
  freeLimit: number;
}

export function FreeLimitCard({ shownCount, freeLimit }: FreeLimitCardProps) {
  return (
    <section className="rounded-2xl bg-amber-50 border border-amber-300 p-4 flex items-center gap-3">
      <div className="w-9 h-9 rounded-full bg-amber-300 flex items-center justify-center flex-shrink-0">
        <svg
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          aria-hidden
        >
          <circle cx="9" cy="9" r="8" stroke="#92400E" strokeWidth="1.5" />
          <line
            x1="9"
            y1="5"
            x2="9"
            y2="9.5"
            stroke="#92400E"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <circle cx="9" cy="11.5" r="1" fill="#92400E" />
        </svg>
      </div>
      <div className="flex-1 leading-tight">
        <div className="text-sm font-semibold text-amber-900">
          오늘 무료 뉴스 {shownCount}개를 다 봤어요
        </div>
        <div className="text-xs text-amber-800 mt-0.5">
          내일 또 보거나, 구독하면 무제한이에요!
        </div>
      </div>
      <Link
        href="/subscribe"
        className="text-sm font-semibold rounded-full bg-orange-500 text-white px-4 py-2 flex-shrink-0"
      >
        구독하기
      </Link>
    </section>
  );
}
