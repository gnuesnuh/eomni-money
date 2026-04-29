import type { LearningLevel, SpeakerType } from "./speaker";

export interface NewsBubble {
  id: string;
  stockId: string | null;
  source: string;
  headlineEn: string;
  summaryEn: string;
  headlineKo: string | null;
  summaryKo: string | null;
  bubbleKo: string;
  speakerType: SpeakerType;
  level: LearningLevel;
  createdAt: string;
}

export interface NewsCardData {
  id: string;
  source: string;
  /** 폴백/호환용. 가능하면 headlineKo/headlineEn 직접 사용 */
  headline: string;
  headlineKo: string | null;
  headlineEn: string;
  summaryKo: string | null;
  summaryEn: string;
  bubble: string;
  speakerType: SpeakerType;
  /** 한국어 상대시간 (예: "2시간 전") */
  publishedAt: string;
  /** 절대 시각 ISO */
  publishedAtIso: string;
  tickers: Array<{ ticker: string; changePct: number }>;
}

export type ExplainMoreMode = "simpler" | "deeper";
