import { Injectable } from "@nestjs/common";
import type { NewsCardData } from "@eomni/shared";
import { ExplainDto } from "./dto/explain.dto";

@Injectable()
export class NewsService {
  async findFeed(_filter?: string): Promise<NewsCardData[]> {
    // TODO: PostgreSQL news_bubbles 조회 + Redis 캐시
    return [
      {
        id: "1",
        source: "Reuters",
        headline: "Fed, 기준금리 동결 결정",
        bubble:
          "엄마~ 나라에서 이자 안 올렸대. 은행 이자가 그대로야. 주식 입장에선 좋은 소식이야!",
        speakerType: "son",
        publishedAt: "2시간 전",
        tickers: [
          { ticker: "AAPL", changePct: 1.2 },
          { ticker: "NVDA", changePct: 2.4 },
        ],
      },
    ];
  }

  async findOne(id: string) {
    // TODO: 실제 DB 조회
    return { id, message: "stub" };
  }

  async explain(id: string, dto: ExplainDto) {
    // TODO: Claude API 호출 — mode 별 프롬프트 분기
    //   simpler → 비유를 바꿔 더 쉽게
    //   deeper  → 같은 수준에서 한 단계 깊이
    return {
      id,
      mode: dto.mode,
      bubble: "TODO: Claude API에서 변환된 말풍선",
    };
  }
}
