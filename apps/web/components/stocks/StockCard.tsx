import type { Stock, StockBadge } from "@eomni/shared";
import { BADGE_LABELS } from "@eomni/shared";

const BADGE_STYLES: Record<StockBadge, string> = {
  cheap: "bg-emerald-100 text-emerald-700",
  expensive: "bg-purple-100 text-purple-700",
  hot: "bg-orange-100 text-orange-700",
  warning: "bg-red-100 text-red-700",
  newsy: "bg-blue-100 text-blue-700",
};

interface StockCardProps {
  stock: Stock;
}

export function StockCard({ stock }: StockCardProps) {
  return (
    <article className="rounded-2xl bg-white border border-gray-200 p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="text-sm text-gray-500">{stock.ticker}</div>
          <div className="text-xl font-bold">{stock.nameKo}</div>
          <div className="text-sm text-gray-500 mt-0.5">
            {stock.descriptionKo}
          </div>
        </div>
        {stock.badge && (
          <span
            className={`text-xs font-bold rounded-full px-3 py-1 ${BADGE_STYLES[stock.badge]}`}
          >
            {BADGE_LABELS[stock.badge]}
          </span>
        )}
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl font-bold">${stock.currentPrice}</span>
        <span
          className={`text-sm font-semibold ${
            stock.changePct >= 0 ? "text-red-600" : "text-blue-600"
          }`}
        >
          {stock.changePct >= 0 ? "▲" : "▼"} {Math.abs(stock.changePct).toFixed(1)}% 오늘
        </span>
      </div>
    </article>
  );
}
