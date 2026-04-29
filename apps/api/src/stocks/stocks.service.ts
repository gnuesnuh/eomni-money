import { Injectable, Logger } from "@nestjs/common";
import { calculateBadge, type Stock } from "@eomni/shared";
import { PrismaService } from "../prisma/prisma.service";
import { FinnhubService } from "../integrations/finnhub/finnhub.service";

@Injectable()
export class StocksService {
  private readonly logger = new Logger(StocksService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly finnhub: FinnhubService,
  ) {}

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
    const t = ticker.toUpperCase();
    try {
      const quote = await this.finnhub.getQuote(t);
      return {
        ticker: t,
        currentPrice: quote.c,
        changePct: quote.dp,
        change: quote.d,
        high: quote.h,
        low: quote.l,
        open: quote.o,
        previousClose: quote.pc,
        timestamp: new Date(quote.t * 1000).toISOString(),
      };
    } catch (err) {
      this.logger.error(`findOne(${t}) failed: ${(err as Error).message}`);
      throw err;
    }
  }

  async recentNews(ticker: string) {
    const t = ticker.toUpperCase();
    const news = await this.finnhub.getCompanyNews(t, { days: 7 });
    return {
      ticker: t,
      count: news.length,
      news: news.slice(0, 10).map((n) => ({
        id: n.id,
        source: n.source,
        headline: n.headline,
        summary: n.summary,
        url: n.url,
        publishedAt: new Date(n.datetime * 1000).toISOString(),
        image: n.image || null,
      })),
    };
  }

  async explainPrice(ticker: string, direction?: "up" | "down") {
    // TODO: Claude bubble (다음 단계)
    return {
      ticker: ticker.toUpperCase(),
      direction: direction ?? "down",
      bubble: "TODO: 왜 싸졌는지 / 비싸졌는지 말풍선 (Claude 연동 후)",
    };
  }

  async addToWatchlist(ticker: string) {
    // TODO: prisma.watchlist.create (free 3개 제한)
    return { ticker: ticker.toUpperCase(), watched: true };
  }
}
