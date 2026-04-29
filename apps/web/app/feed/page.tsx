import { NewsCard } from "@/components/news/NewsCard";

const SAMPLE_FEED = [
  {
    id: "1",
    source: "Reuters",
    headline: "Fed, 기준금리 동결 결정",
    bubble:
      "엄마~ 나라에서 이자 안 올렸대. 은행 이자가 그대로야. 주식 입장에선 좋은 소식이야!",
    speakerType: "son" as const,
    publishedAt: "2시간 전",
    tickers: [
      { ticker: "AAPL", changePct: 1.2 },
      { ticker: "NVDA", changePct: 2.4 },
    ],
  },
];

export default function FeedPage() {
  return (
    <main className="px-4 py-6">
      <header className="mb-4">
        <h1 className="text-2xl font-bold">오늘의 뉴스</h1>
        <p className="text-gray-500 text-sm mt-1">
          엄마가 알아야 할 시장 소식이에요
        </p>
      </header>
      <div className="flex flex-col gap-4">
        {SAMPLE_FEED.map((n) => (
          <NewsCard key={n.id} news={n} />
        ))}
      </div>
    </main>
  );
}
