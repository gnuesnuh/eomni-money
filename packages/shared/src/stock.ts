export type StockBadge =
  | "cheap" //  지금 저렴해요
  | "expensive" //  지금 비싼 편
  | "hot" //  요즘 뜨는 중
  | "warning" //  조심할 때
  | "newsy"; //  뉴스 많아요

export const BADGE_LABELS: Record<StockBadge, string> = {
  cheap: "지금 저렴해요",
  expensive: "지금 비싼 편",
  hot: "요즘 뜨는 중",
  warning: "조심할 때",
  newsy: "뉴스 많아요",
};

export interface Stock {
  id: string;
  ticker: string;
  nameKo: string;
  nameEn: string;
  descriptionKo: string;
  logoUrl: string | null;
  exchange: string;
  week52High: number;
  week52Low: number;
  currentPrice: number;
  changePct: number;
  badge: StockBadge | null;
  updatedAt: string;
}

export interface BadgeInputs {
  currentPrice: number;
  week52High: number;
  week52Low: number;
  changePct: number;
  newsCount: number;
}

export function calculateBadge(inputs: BadgeInputs): StockBadge | null {
  const { currentPrice, week52High, week52Low, changePct, newsCount } = inputs;

  if (changePct < -5) return "warning";
  if (changePct > 5) return "hot";

  const range = week52High - week52Low;
  if (range > 0) {
    const position = (currentPrice - week52Low) / range;
    if (position < 0.3) return "cheap";
    if (position > 0.7) return "expensive";
  }

  if (newsCount >= 5) return "newsy";

  return null;
}
