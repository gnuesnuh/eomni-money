import { Injectable } from "@nestjs/common";
import type { NewsCardData, SpeakerType, LearningLevel } from "@eomni/shared";
import { PrismaService } from "../prisma/prisma.service";
import { ClaudeService } from "../integrations/claude/claude.service";
import { ExplainDto } from "./dto/explain.dto";

@Injectable()
export class NewsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly claude: ClaudeService,
  ) {}

  async findFeed(filter?: string): Promise<NewsCardData[]> {
    // 일단 화자/수준 고정(아들/beginner) — 인증 붙이면 user 프로필 기반으로 교체
    const speakerType: SpeakerType = "son";
    const level: LearningLevel = "beginner";

    const bubbles = await this.prisma.newsBubble.findMany({
      where: { speakerType, level },
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

    return bubbles.map((b) => ({
      id: b.id,
      source: b.source,
      headline: b.headlineEn,
      bubble: b.bubbleKo,
      speakerType: b.speakerType,
      publishedAt: relativeTimeKo(b.publishedAt ?? b.createdAt),
      tickers: b.stock
        ? [
            {
              ticker: b.stock.ticker,
              changePct: b.stock.changePct ?? 0,
            },
          ]
        : [],
    }));
  }

  async findOne(id: string) {
    return this.prisma.newsBubble.findUnique({
      where: { id },
      include: { stock: true },
    });
  }

  async explain(id: string, dto: ExplainDto) {
    const bubble = await this.prisma.newsBubble.findUnique({
      where: { id },
      include: { stock: true },
    });
    if (!bubble) return { error: "not_found" };

    // 같은 화자/수준이지만 모드(simpler/deeper) 만 다르게 재생성
    const result = await this.claude.generateBubble({
      speakerType: bubble.speakerType,
      level: bubble.level,
      headline: bubble.headlineEn,
      summary: bubble.summaryEn,
      ticker: bubble.stock?.ticker,
      companyKo: bubble.stock?.nameKo,
      mode: dto.mode,
    });

    return {
      id,
      mode: dto.mode,
      bubble: result.bubble,
      usage: result.usage,
    };
  }
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
