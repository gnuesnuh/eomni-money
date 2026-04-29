import { Injectable } from "@nestjs/common";
import { calculateBadge, type Stock } from "@eomni/shared";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class StocksService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(_badge?: string): Promise<Stock[]> {
    // TODO: prisma.stock.findMany({ where: badge ? { badge } : {} })
    //       + Redis 캐시(quote)와 병합
    const sample: Stock = {
      id: "stock-1",
      ticker: "AAPL",
      nameKo: "애플",
      nameEn: "Apple Inc.",
      descriptionKo: "아이폰 만드는 회사",
      logoUrl: null,
      exchange: "NASDAQ",
      week52High: 210,
      week52Low: 165,
      currentPrice: 189,
      changePct: 1.2,
      badge: calculateBadge({
        currentPrice: 189,
        week52High: 210,
        week52Low: 165,
        changePct: 1.2,
        newsCount: 2,
      }),
      updatedAt: new Date().toISOString(),
    };
    return [sample];
  }

  async findOne(ticker: string) {
    // TODO: 단일 종목 조회
    return { ticker: ticker.toUpperCase(), stub: true };
  }

  async recentNews(ticker: string) {
    // TODO: 종목 관련 최근 뉴스 (Finnhub company_news + bubble cache)
    return { ticker: ticker.toUpperCase(), news: [] };
  }

  async explainPrice(ticker: string, direction?: "up" | "down") {
    // TODO: 가격 변동 원인 → Claude bubble
    return {
      ticker: ticker.toUpperCase(),
      direction: direction ?? "down",
      bubble: "TODO: 왜 싸졌는지 / 비싸졌는지 말풍선",
    };
  }

  async addToWatchlist(ticker: string) {
    // TODO: watchlist 테이블 insert (free 3개 제한)
    return { ticker: ticker.toUpperCase(), watched: true };
  }
}
