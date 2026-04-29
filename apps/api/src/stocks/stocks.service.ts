import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { calculateBadge, type Stock, type StockBadge } from "@eomni/shared";
import { PrismaService } from "../prisma/prisma.service";
import { FinnhubService } from "../integrations/finnhub/finnhub.service";

@Injectable()
export class StocksService {
  private readonly logger = new Logger(StocksService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly finnhub: FinnhubService,
  ) {}

  async findAll(badge?: string): Promise<Stock[]> {
    const where = badge && isStockBadge(badge) ? { badge } : {};
    const rows = await this.prisma.stock.findMany({
      where,
      orderBy: { ticker: "asc" },
    });
    return rows.map((r) => ({
      id: r.id,
      ticker: r.ticker,
      nameKo: r.nameKo,
      nameEn: r.nameEn,
      descriptionKo: r.descriptionKo,
      logoUrl: r.logoUrl,
      exchange: r.exchange,
      week52High: r.week52High,
      week52Low: r.week52Low,
      currentPrice: r.currentPrice ?? 0,
      changePct: r.changePct ?? 0,
      badge: r.badge,
      updatedAt: r.updatedAt.toISOString(),
    }));
  }

  async findOne(ticker: string) {
    const t = ticker.toUpperCase();
    const stock = await this.prisma.stock.findUnique({ where: { ticker: t } });
    if (!stock) throw new NotFoundException(`stock ${t} not registered`);

    // 실시간 가격 + 배지 재계산 (캐시는 Phase 1에선 생략)
    let liveQuote = null;
    try {
      const q = await this.finnhub.getQuote(t);
      liveQuote = {
        currentPrice: q.c,
        changePct: q.dp,
      };
    } catch (err) {
      this.logger.warn(
        `Finnhub quote(${t}) failed, falling back to DB cache: ${(err as Error).message}`,
      );
    }

    const currentPrice = liveQuote?.currentPrice ?? stock.currentPrice ?? 0;
    const changePct = liveQuote?.changePct ?? stock.changePct ?? 0;

    const badge = calculateBadge({
      currentPrice,
      week52High: stock.week52High,
      week52Low: stock.week52Low,
      changePct,
      newsCount: 0, // TODO: 최근 24시간 newsBubble 카운트
    });

    return {
      id: stock.id,
      ticker: stock.ticker,
      nameKo: stock.nameKo,
      nameEn: stock.nameEn,
      descriptionKo: stock.descriptionKo,
      currentPrice,
      changePct,
      week52High: stock.week52High,
      week52Low: stock.week52Low,
      badge,
      updatedAt: new Date().toISOString(),
    };
  }

  async recentNews(ticker: string) {
    const t = ticker.toUpperCase();
    const stock = await this.prisma.stock.findUnique({ where: { ticker: t } });
    if (!stock) throw new NotFoundException(`stock ${t} not registered`);

    // DB의 말풍선 캐시(아들/beginner 우선)
    const bubbles = await this.prisma.newsBubble.findMany({
      where: { stockId: stock.id, speakerType: "son", level: "beginner" },
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      take: 10,
    });

    return {
      ticker: t,
      count: bubbles.length,
      news: bubbles.map((b) => ({
        id: b.id,
        source: b.source,
        headline: b.headlineEn,
        bubble: b.bubbleKo,
        publishedAt: (b.publishedAt ?? b.createdAt).toISOString(),
      })),
    };
  }

  async explainPrice(ticker: string, direction?: "up" | "down") {
    // TODO: 가장 최근 뉴스 1건 → Claude bubble (현재 NewsService.explain 활용)
    return {
      ticker: ticker.toUpperCase(),
      direction: direction ?? "down",
      bubble: "TODO: 가장 영향 큰 최근 뉴스 1건 기반 설명",
    };
  }

  async addToWatchlist(ticker: string) {
    // TODO: 인증 붙이고 prisma.watchlist.create (free 3개 제한)
    return { ticker: ticker.toUpperCase(), watched: true };
  }
}

function isStockBadge(s: string): s is StockBadge {
  return ["cheap", "expensive", "hot", "warning", "newsy"].includes(s);
}
