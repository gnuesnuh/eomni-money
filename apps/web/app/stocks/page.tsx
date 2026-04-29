"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Stock } from "@eomni/shared";
import { StockCard } from "@/components/stocks/StockCard";
import { PersonaHeader } from "@/components/PersonaHeader";
import { useProfile } from "@/lib/profile";

export default function StocksPage() {
  const { profile, loaded } = useProfile();
  const [stocks, setStocks] = useState<Stock[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";
    fetch(`${apiBase}/api/stocks`, { cache: "no-store" })
      .then((r) => {
        if (!r.ok) throw new Error(`API ${r.status}`);
        return r.json();
      })
      .then(setStocks)
      .catch((e) => setError((e as Error).message));
  }, []);

  if (!loaded) return <div className="p-8 text-gray-400">불러오는 중...</div>;

  return (
    <>
      {profile && <PersonaHeader profile={profile} />}
      <main className="px-4 py-6">
        <h1 className="text-2xl font-bold mb-4">종목 둘러보기</h1>
        {error && <div className="text-red-500">연결 실패: {error}</div>}
        {!stocks && !error && (
          <div className="text-gray-400 text-center py-12">불러오는 중...</div>
        )}
        {stocks && stocks.length === 0 && (
          <div className="text-gray-400 text-center py-12">
            <p>아직 등록된 종목이 없어요</p>
            <p className="text-xs mt-2">
              관리자: <code>POST /api/dev/seed</code>
            </p>
          </div>
        )}
        {stocks && stocks.length > 0 && (
          <div className="flex flex-col gap-3">
            {stocks.map((s) => (
              <Link key={s.id} href={`/stocks/${s.ticker}`}>
                <StockCard stock={s} />
              </Link>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
