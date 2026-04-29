import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Query,
} from "@nestjs/common";
import { IsIn, IsOptional, IsString, MinLength } from "class-validator";
import type { LearningLevel, SpeakerType } from "@eomni/shared";
import { ClaudeService } from "../integrations/claude/claude.service";
import { FinnhubService } from "../integrations/finnhub/finnhub.service";
import { NewsService } from "../news/news.service";
import { PrismaService } from "../prisma/prisma.service";

class BubbleDto {
  @IsString() @MinLength(3)
  headline!: string;

  @IsOptional() @IsString()
  summary?: string;

  @IsIn(["son", "daughter", "daughter_in_law", "son_in_law"])
  speakerType!: SpeakerType;

  @IsIn(["beginner", "intermediate", "advanced"])
  level!: LearningLevel;

  @IsOptional() @IsString()
  ticker?: string;

  @IsOptional() @IsString()
  companyKo?: string;

  @IsOptional() @IsIn(["initial", "simpler", "deeper"])
  mode?: "initial" | "simpler" | "deeper";
}

// 시드용 종목 카탈로그 — 한국 시니어가 알 만한 미국 대표 종목
const SEED_STOCKS: Array<{
  ticker: string;
  nameKo: string;
  nameEn: string;
  descriptionKo: string;
  exchange: string;
}> = [
  { ticker: "AAPL", nameKo: "애플", nameEn: "Apple Inc.", descriptionKo: "아이폰 만드는 회사", exchange: "NASDAQ" },
  { ticker: "NVDA", nameKo: "엔비디아", nameEn: "NVIDIA Corp.", descriptionKo: "AI 칩 만드는 회사", exchange: "NASDAQ" },
  { ticker: "TSLA", nameKo: "테슬라", nameEn: "Tesla Inc.", descriptionKo: "전기차 만드는 회사", exchange: "NASDAQ" },
  { ticker: "MSFT", nameKo: "마이크로소프트", nameEn: "Microsoft Corp.", descriptionKo: "윈도우 만드는 회사", exchange: "NASDAQ" },
  { ticker: "AMZN", nameKo: "아마존", nameEn: "Amazon.com", descriptionKo: "쿠팡같은 미국 회사", exchange: "NASDAQ" },
];

@Controller("dev")
export class DevController {
  private readonly logger = new Logger(DevController.name);

  constructor(
    private readonly claude: ClaudeService,
    private readonly finnhub: FinnhubService,
    private readonly prisma: PrismaService,
    private readonly news: NewsService,
  ) {}

  // (speakerType, level) 조합으로 변환된 말풍선이 없는 기존 뉴스를 일괄 변환
  // 사용 예: POST /api/dev/expand-bubbles?speaker=son_in_law&level=advanced
  @Post("expand-bubbles")
  async expand(
    @Query("speaker") speakerType: SpeakerType,
    @Query("level") level: LearningLevel,
  ) {
    if (!speakerType || !level) {
      return { error: "speaker and level query params required" };
    }
    return this.news.expandForCombo(speakerType, level);
  }

  // 한국어 번역(headlineKo, summaryKo)이 빠진 initial 말풍선들에 채워넣기
  // 같은 (stockId, headlineEn) 은 같은 번역을 공유 → Claude 호출 1회로 다 채움
  @Post("backfill-translations")
  async backfillTranslations() {
    const initialMissing = await this.prisma.newsBubble.findMany({
      where: { mode: "initial", headlineKo: null },
      select: {
        id: true,
        stockId: true,
        headlineEn: true,
        summaryEn: true,
      },
    });

    // (stockId, headlineEn) 유니크 묶음 → 1회 번역으로 모든 row 갱신
    const grouped = new Map<
      string,
      { ids: string[]; headlineEn: string; summaryEn: string }
    >();
    for (const row of initialMissing) {
      const key = `${row.stockId ?? "_"}::${row.headlineEn}`;
      const cur = grouped.get(key);
      if (cur) cur.ids.push(row.id);
      else
        grouped.set(key, {
          ids: [row.id],
          headlineEn: row.headlineEn,
          summaryEn: row.summaryEn,
        });
    }

    let translated = 0;
    let updated = 0;
    const usage = { input: 0, output: 0 };

    for (const g of grouped.values()) {
      try {
        const tr = await this.claude.translateNews({
          headlineEn: g.headlineEn,
          summaryEn: g.summaryEn,
        });
        const r = await this.prisma.newsBubble.updateMany({
          where: { id: { in: g.ids } },
          data: { headlineKo: tr.headlineKo, summaryKo: tr.summaryKo },
        });
        translated++;
        updated += r.count;
        usage.input += tr.usage.inputTokens;
        usage.output += tr.usage.outputTokens;
      } catch (err) {
        this.logger.error(
          `[backfill-translations] failed for "${g.headlineEn.slice(0, 60)}": ${(err as Error).message}`,
        );
      }
    }

    return {
      uniqueHeadlines: grouped.size,
      translated,
      rowsUpdated: updated,
      usage,
    };
  }

  // 직접 입력으로 말풍선 생성 (Finnhub/DB 없이)
  @Post("bubble")
  async makeBubble(@Body() dto: BubbleDto) {
    return this.claude.generateBubble(dto);
  }

  // 실제 Finnhub 뉴스 한 건을 Claude 말풍선으로 변환 — end-to-end 검증
  @Get("ticker-bubble/:ticker")
  async tickerBubble(
    @Param("ticker") ticker: string,
    @Query("speaker") speakerType: SpeakerType = "son",
    @Query("level") level: LearningLevel = "beginner",
    @Query("companyKo") companyKo?: string,
  ) {
    const news = await this.finnhub.getCompanyNews(ticker, { days: 3 });
    if (news.length === 0) return { ticker, message: "최근 3일 뉴스 없음" };
    const top = news[0]!;
    const result = await this.claude.generateBubble({
      speakerType,
      level,
      headline: top.headline,
      summary: top.summary,
      ticker,
      companyKo,
    });
    return {
      ticker: ticker.toUpperCase(),
      source: top.source,
      original: {
        headline: top.headline,
        summary: top.summary?.slice(0, 200),
        url: top.url,
      },
      bubble: result.bubble,
      usage: result.usage,
    };
  }

  // 시드 파이프라인:
  //   1. SEED_STOCKS upsert (5개 종목)
  //   2. 각 종목 Finnhub quote → currentPrice/changePct 갱신
  //   3. 각 종목 최근 7일 뉴스 fetch → 상위 N건 (기본 2건) Claude 말풍선 생성 → news_bubbles upsert
  //
  // 본격 새벽 배치 구현 전, 데이터 채우는 용도. 화자/수준 조합 폭증 막기 위해 (son, beginner) 기본 1쌍만.
  @Post("seed")
  async seed(@Query("perStock") perStockRaw?: string) {
    const perStock = Math.max(1, Math.min(5, Number(perStockRaw ?? 2)));
    const speakerType: SpeakerType = "son";
    const level: LearningLevel = "beginner";

    const summary: Array<{
      ticker: string;
      bubblesCreated: number;
      currentPrice: number | null;
      error?: string;
    }> = [];
    let totalBubbles = 0;
    let totalUsage = { input: 0, output: 0 };

    // Finnhub의 company-news는 시장 일반 뉴스를 여러 종목 응답에 동시에 반환한다.
    // 같은 헤드라인을 여러 종목에 (각각) 변환하면 비용 + 피드 중복 발생.
    // 이번 시드 실행 동안 본 헤드라인을 추적해 두 번째부턴 skip.
    const headlinesSeenThisRun = new Set<string>();

    // 또한 DB에 이미 같은 (speakerType, level, headline) 이 있으면 변환 안 함 (재실행 안전)
    const existingForCombo = await this.prisma.newsBubble.findMany({
      where: { speakerType, level },
      select: { headlineEn: true },
    });
    existingForCombo.forEach((b) => headlinesSeenThisRun.add(b.headlineEn));

    for (const meta of SEED_STOCKS) {
      const t = meta.ticker;
      this.logger.log(`[seed] ${t} start`);
      try {
        // 1) quote
        const q = await this.finnhub.getQuote(t).catch(() => null);
        const currentPrice = q?.c ?? null;
        const changePct = q?.dp ?? null;

        // 52주 high/low: 무료 플랜에선 stock-candle 막혀있으니
        // 우선 quote로 현재가 ±20% 임의값으로 대체. 실데이터는 별도 작업.
        const week52High = currentPrice ? Math.round(currentPrice * 1.2 * 100) / 100 : 0;
        const week52Low = currentPrice ? Math.round(currentPrice * 0.8 * 100) / 100 : 0;

        const stock = await this.prisma.stock.upsert({
          where: { ticker: t },
          create: { ...meta, week52High, week52Low, currentPrice, changePct },
          update: { currentPrice, changePct, week52High, week52Low },
        });

        // 2) 최근 뉴스
        const news = await this.finnhub.getCompanyNews(t, { days: 7 });
        const top = news.slice(0, perStock);

        let created = 0;
        for (const n of top) {
          // 글로벌 헤드라인 dedup: 다른 종목에서 이미 봤으면 skip
          if (headlinesSeenThisRun.has(n.headline)) continue;
          headlinesSeenThisRun.add(n.headline);

          const summaryEn = n.summary?.slice(0, 2000) ?? "";

          // 1) 한국어 번역 (헤드라인 + 요약)
          const tr = await this.claude.translateNews({
            headlineEn: n.headline,
            summaryEn,
          });

          // 2) 가족 말투 말풍선
          const result = await this.claude.generateBubble({
            speakerType,
            level,
            headline: n.headline,
            summary: n.summary,
            ticker: t,
            companyKo: meta.nameKo,
          });

          await this.prisma.newsBubble.create({
            data: {
              stockId: stock.id,
              source: n.source,
              headlineEn: n.headline,
              summaryEn,
              headlineKo: tr.headlineKo,
              summaryKo: tr.summaryKo,
              bubbleKo: result.bubble,
              speakerType,
              level,
              mode: "initial",
              publishedAt: new Date(n.datetime * 1000),
            },
          });
          created++;
          totalBubbles++;
          totalUsage.input += result.usage.inputTokens + tr.usage.inputTokens;
          totalUsage.output += result.usage.outputTokens + tr.usage.outputTokens;
        }

        summary.push({ ticker: t, bubblesCreated: created, currentPrice });
      } catch (err) {
        const msg = (err as Error).message;
        this.logger.error(`[seed] ${t} failed: ${msg}`);
        summary.push({ ticker: t, bubblesCreated: 0, currentPrice: null, error: msg });
      }
    }

    return {
      ok: true,
      perStock,
      totalBubbles,
      totalUsage,
      summary,
    };
  }
}
