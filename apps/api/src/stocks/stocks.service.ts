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

  async recentNews(
    ticker: string,
    opts: { speakerType?: string; level?: string } = {},
  ) {
    const t = ticker.toUpperCase();
    const stock = await this.prisma.stock.findUnique({ where: { ticker: t } });
    if (!stock) throw new NotFoundException(`stock ${t} not registered`);

    const speakerType = isSpeakerType(opts.speakerType)
      ? opts.speakerType
      : "son";
    const level = isLevelType(opts.level) ? opts.level : "beginner";

    // 요청한 화자/수준의 initial 말풍선
    let bubbles = await this.prisma.newsBubble.findMany({
      where: {
        stockId: stock.id,
        speakerType,
        level,
        mode: "initial",
      },
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      take: 10,
    });
    let fallback = false;

    // 매치 없으면 (son, beginner) 폴백 — 피드와 동일한 정책
    if (bubbles.length === 0) {
      bubbles = await this.prisma.newsBubble.findMany({
        where: {
          stockId: stock.id,
          speakerType: "son",
          level: "beginner",
          mode: "initial",
        },
        orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
        take: 10,
      });
      fallback = true;
    }

    return {
      ticker: t,
      stockNameKo: stock.nameKo,
      currentPrice: stock.currentPrice,
      changePct: stock.changePct,
      count: bubbles.length,
      fallback,
      news: bubbles.map((b) => ({
        id: b.id,
        source: b.source,
        headline: b.headlineKo ?? b.headlineEn,
        headlineKo: b.headlineKo,
        headlineEn: b.headlineEn,
        summaryKo: b.summaryKo,
        summaryEn: b.summaryEn,
        bubble: b.bubbleKo,
        speakerType: b.speakerType,
        publishedAt: relativeTimeKo(b.publishedAt ?? b.createdAt),
        publishedAtIso: (b.publishedAt ?? b.createdAt).toISOString(),
        tickers: [
          { ticker: stock.ticker, changePct: stock.changePct ?? 0 },
        ],
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

function isSpeakerType(
  s: string | undefined,
): s is "son" | "daughter" | "daughter_in_law" | "son_in_law" {
  return (
    s === "son" ||
    s === "daughter" ||
    s === "daughter_in_law" ||
    s === "son_in_law"
  );
}

function isLevelType(
  s: string | undefined,
): s is "beginner" | "intermediate" | "advanced" {
  return s === "beginner" || s === "intermediate" || s === "advanced";
}

function relativeTimeKo(d: Date): string {
  const ms = Date.now() - d.getTime();
  const min = Math.floor(ms / 60000);
  if (min < 1) return "방금 전";
  if (min < 60) return `${min}분 전`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}시간 전`;
  const day = Math.floor(hr / 24);
  if (day < 7) return `${day}일 전`;
  return d.toISOString().slice(0, 10);
}
