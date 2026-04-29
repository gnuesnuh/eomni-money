import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { IsIn, IsOptional, IsString, MinLength } from "class-validator";
import type { LearningLevel, SpeakerType } from "@eomni/shared";
import { ClaudeService } from "../integrations/claude/claude.service";
import { FinnhubService } from "../integrations/finnhub/finnhub.service";

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

@Controller("dev")
export class DevController {
  constructor(
    private readonly claude: ClaudeService,
    private readonly finnhub: FinnhubService,
  ) {}

  // 직접 입력으로 말풍선 생성 (Finnhub/DB 없이)
  @Post("bubble")
  async makeBubble(@Body() dto: BubbleDto) {
    const result = await this.claude.generateBubble(dto);
    return result;
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
    if (news.length === 0) {
      return { ticker, message: "최근 3일 뉴스가 없습니다" };
    }
    const top = news[0]!;
    const bubble = await this.claude.generateBubble({
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
        publishedAt: new Date(top.datetime * 1000).toISOString(),
      },
      bubble: bubble.bubble,
      usage: bubble.usage,
    };
  }
}
