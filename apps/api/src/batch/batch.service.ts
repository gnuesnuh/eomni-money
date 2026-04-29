import { Injectable, Logger } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";

@Injectable()
export class BatchService {
  private readonly logger = new Logger(BatchService.name);

  // 매일 새벽 5시 (KST) — 스펙의 새벽 배치 파이프라인
  @Cron("0 5 * * *", { timeZone: "Asia/Seoul" })
  async dailyBubbleRefresh() {
    this.logger.log("[batch] dailyBubbleRefresh: start");
    // TODO:
    //   1. Finnhub company_news() 수집
    //   2. Finnhub news_sentiment() 수집
    //   3. 52주 고/저가 기반 배지 계산 (수식, LLM 없음)
    //   4. Claude API → 말풍선 생성 (영문 → 한국어 직접 변환)
    //   5. PostgreSQL 저장
    //   6. Redis 캐시 갱신
    this.logger.log("[batch] dailyBubbleRefresh: stub — not yet implemented");
  }
}
