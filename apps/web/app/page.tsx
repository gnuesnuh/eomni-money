import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 py-10 text-center">
      <div className="text-5xl font-bold mb-4">엄니머니</div>
      <p className="text-lg text-gray-600 mb-8">
        엄마도 쉽게 보는 오늘의 주식 뉴스
      </p>
      <div className="flex flex-col gap-3 w-full max-w-xs">
        <Link
          href="/onboarding"
          className="block w-full rounded-2xl bg-orange-500 px-6 py-4 text-xl font-semibold text-white shadow-md active:scale-[0.98] transition"
        >
          시작하기
        </Link>
        <Link
          href="/feed"
          className="block w-full rounded-2xl border-2 border-gray-200 px-6 py-4 text-xl font-semibold text-gray-700 active:scale-[0.98] transition"
        >
          뉴스 둘러보기
        </Link>
      </div>
      <p className="mt-10 text-sm text-gray-400">v0.1 · Phase 1 MVP</p>
    </main>
  );
}
