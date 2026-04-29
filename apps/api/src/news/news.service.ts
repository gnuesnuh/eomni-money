import { Injectable, Logger } from "@nestjs/common";
import type { NewsCardData, SpeakerType, LearningLevel } from "@eomni/shared";
import { PrismaService } from "../prisma/prisma.service";
import { ClaudeService } from "../integrations/claude/claude.service";
import { ExplainDto } from "./dto/explain.dto";

const VALID_SPEAKERS: SpeakerType[] = [
  "son",
  "daughter",
  "daughter_in_law",
  "son_in_law",
];
const VALID_LEVELS: LearningLevel[] = ["beginner", "intermediate", "advanced"];

@Injectable()
export class NewsService {
  private readonly logger = new Logger(NewsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly claude: ClaudeService,
  ) {}

  async findFeed(opts: {
    speakerType?: string;
    level?: string;
    filter?: string;
  }): Promise<{
    items: NewsCardData[];
    speakerType: SpeakerType;
    level: LearningLevel;
    fallback: boolean;
  }> {
    const speakerType = isSpeaker(opts.speakerType) ? opts.speakerType : "son";
    const level = isLevel(opts.level) ? opts.level : "beginner";

    let bubbles = await this.fetchBubbles(speakerType, level);
    let fallback = false;

    if (bubbles.length === 0) {
      // 해당 (화자, 수준) 조합으로 변환된 게 없으면 (son, beginner) 으로 폴백
      this.logger.log(
        `[feed] no bubbles for ${speakerType}/${level}, falling back to son/beginner`,
      );
      bubbles = await this.fetchBubbles("son", "beginner");
      fallback = true;
    }

    // 같은 헤드라인이 여러 종목 응답에 동시에 나오는 경우(예: 메가캡 일반 뉴스)
    // 피드 단에서 1건만 표출. 가장 최신(또는 첫 번째)을 유지.
    const seen = new Set<string>();
    bubbles = bubbles.filter((b) => {
      if (seen.has(b.headlineEn)) return false;
      seen.add(b.headlineEn);
      return true;
    });

    return {
      items: bubbles.map((b) => ({
        id: b.id,
        source: b.source,
        headline: b.headlineEn,
        bubble: b.bubbleKo,
        speakerType: b.speakerType,
        publishedAt: relativeTimeKo(b.publishedAt ?? b.createdAt),
        tickers: b.stock
          ? [{ ticker: b.stock.ticker, changePct: b.stock.changePct ?? 0 }]
          : [],
      })),
      speakerType,
      level,
      fallback,
    };
  }

  private fetchBubbles(speakerType: SpeakerType, level: LearningLevel) {
    return this.prisma.newsBubble.findMany({
      where: { speakerType, level, mode: "initial" },
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      take: 30,
      include: {
        stock: {
          select: {
            ticker: true,
            nameKo: true,
            currentPrice: true,
            changePct: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.newsBubble.findUnique({
      where: { id },
      include: { stock: true },
    });
  }

  async explain(id: string, dto: ExplainDto) {
    // 호출 패턴: id 는 피드의 initial 말풍선 row id.
    // 같은 (stockId, headlineEn, speakerType, level) 의 mode=simpler/deeper 가 DB에 있으면 캐시 hit,
    // 없으면 Claude 호출 → 저장 → 반환 (lazy persist 하이브리드).
    const initial = await this.prisma.newsBubble.findUnique({
      where: { id },
      include: { stock: true },
    });
    if (!initial) return { error: "not_found" as const };

    const targetMode = dto.mode === "simpler" ? "simpler" : "deeper";

    // 1) 캐시 조회
    const cached = await this.prisma.newsBubble.findFirst({
      where: {
        stockId: initial.stockId,
        headlineEn: initial.headlineEn,
        speakerType: initial.speakerType,
        level: initial.level,
        mode: targetMode,
      },
    });
    if (cached) {
      return {
        id: cached.id,
        mode: targetMode,
        bubble: cached.bubbleKo,
        cached: true,
      };
    }

    // 2) 캐시 미스 → 생성 후 저장
    const result = await this.claude.generateBubble({
      speakerType: initial.speakerType,
      level: initial.level,
      headline: initial.headlineEn,
      summary: initial.summaryEn,
      ticker: initial.stock?.ticker,
      companyKo: initial.stock?.nameKo,
      mode: dto.mode,
    });

    const persisted = await this.prisma.newsBubble.create({
      data: {
        stockId: initial.stockId,
        source: initial.source,
        headlineEn: initial.headlineEn,
        summaryEn: initial.summaryEn,
        bubbleKo: result.bubble,
        speakerType: initial.speakerType,
        level: initial.level,
        mode: targetMode,
        publishedAt: initial.publishedAt,
      },
    });

    return {
      id: persisted.id,
      mode: targetMode,
      bubble: result.bubble,
      cached: false,
      usage: result.usage,
    };
  }

  // (speakerType, level) 조합용 말풍선이 없는 뉴스를 찾아 새로 생성
  async expandForCombo(
    speakerType: SpeakerType,
    level: LearningLevel,
  ): Promise<{ created: number; skipped: number; usage: { input: number; output: number } }> {
    // 기준: (son, beginner, initial) 으로 변환된 모든 뉴스가 'canonical' 뉴스 셋
    const sourceBubbles = await this.prisma.newsBubble.findMany({
      where: { speakerType: "son", level: "beginner", mode: "initial" },
      include: { stock: true },
    });

    const existingForCombo = await this.prisma.newsBubble.findMany({
      where: { speakerType, level, mode: "initial" },
      select: { stockId: true, headlineEn: true },
    });
    const existingKey = new Set(
      existingForCombo.map((b) => `${b.stockId}::${b.headlineEn}`),
    );

    let created = 0;
    let skipped = 0;
    const usage = { input: 0, output: 0 };

    for (const src of sourceBubbles) {
      const key = `${src.stockId}::${src.headlineEn}`;
      if (existingKey.has(key)) {
        skipped++;
        continue;
      }

      const result = await this.claude.generateBubble({
        speakerType,
        level,
        headline: src.headlineEn,
        summary: src.summaryEn,
        ticker: src.stock?.ticker,
        companyKo: src.stock?.nameKo,
      });

      await this.prisma.newsBubble.create({
        data: {
          stockId: src.stockId,
          source: src.source,
          headlineEn: src.headlineEn,
          summaryEn: src.summaryEn,
          bubbleKo: result.bubble,
          speakerType,
          level,
          mode: "initial",
          publishedAt: src.publishedAt,
        },
      });
      created++;
      usage.input += result.usage.inputTokens;
      usage.output += result.usage.outputTokens;
    }

    return { created, skipped, usage };
  }
}

function isSpeaker(s: unknown): s is SpeakerType {
  return typeof s === "string" && VALID_SPEAKERS.includes(s as SpeakerType);
}
function isLevel(s: unknown): s is LearningLevel {
  return typeof s === "string" && VALID_LEVELS.includes(s as LearningLevel);
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
