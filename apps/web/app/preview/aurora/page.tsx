"use client";

import dynamic from "next/dynamic";
import Link from "next/link";

// docs/design/eomni_aurora.jsx — 동료가 만든 화자별 말풍선/바텀시트 시안.
// 인라인 스타일 위주의 독립 데모라 그대로 임베드한다.
// SSR 회피: 시안 데모는 클라이언트 전용으로만 렌더.
const AuroraDemo = dynamic(
  () => import("../../../../../docs/design/eomni_aurora").then((m) => m.default),
  { ssr: false, loading: () => <div className="p-8 text-center text-gray-400">시안 불러오는 중…</div> },
);

export default function AuroraPreviewPage() {
  return (
    <main className="mx-auto max-w-md px-4 py-6">
      <header className="mb-5">
        <h1 className="text-2xl font-bold">aurora 시안</h1>
        <p className="mt-1 text-sm text-gray-500">
          동료(seunghun)의 화자별 말풍선·바텀시트 시안.
          <br />
          <code className="text-xs">docs/design/eomni_aurora.jsx</code>
        </p>
        <p className="mt-2 text-xs">
          <Link href="/preview/news-card" className="text-orange-600 underline">
            ← NewsCard 와이어프레임 보기
          </Link>
        </p>
      </header>

      <AuroraDemo />
    </main>
  );
}
