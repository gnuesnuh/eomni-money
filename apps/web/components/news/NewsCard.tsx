import type { NewsCardData } from "@eomni/shared";
import { BubbleArea } from "./BubbleArea";
import { ExplainMore } from "./ExplainMore";

interface NewsCardProps {
  news: NewsCardData;
}

export function NewsCard({ news }: NewsCardProps) {
  return (
    <article className="rounded-2xl bg-white border border-gray-200 shadow-sm overflow-hidden">
      <header className="flex items-center justify-between px-4 pt-4 pb-2">
        <span className="text-sm font-medium text-gray-500">{news.source}</span>
        <span className="text-sm text-gray-400">{news.publishedAt}</span>
      </header>
      <h2 className="px-4 pb-3 text-lg font-bold leading-snug text-gray-900">
        {news.headline}
      </h2>

      <div className="px-4">
        <BubbleArea speakerType={news.speakerType} text={news.bubble} />
      </div>

      <div className="px-4 pt-3">
        <ExplainMore newsId={news.id} />
      </div>

      {news.tickers.length > 0 && (
        <footer className="mt-3 flex flex-wrap gap-2 border-t border-gray-100 px-4 py-3">
          {news.tickers.map((t) => (
            <span
              key={t.ticker}
              className={`text-sm font-semibold rounded-full px-3 py-1 ${
                t.changePct >= 0
                  ? "bg-red-50 text-red-600"
                  : "bg-blue-50 text-blue-600"
              }`}
            >
              {t.ticker} {t.changePct >= 0 ? "+" : ""}
              {t.changePct.toFixed(1)}%
            </span>
          ))}
        </footer>
      )}
    </article>
  );
}
