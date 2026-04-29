import type { LearningLevel, SpeakerType } from "./speaker";

export interface NewsBubble {
  id: string;
  stockId: string | null;
  source: string;
  headlineEn: string;
  summaryEn: string;
  bubbleKo: string;
  speakerType: SpeakerType;
  level: LearningLevel;
  createdAt: string;
}

export interface NewsCardData {
  id: string;
  source: string;
  headline: string;
  bubble: string;
  speakerType: SpeakerType;
  publishedAt: string;
  tickers: Array<{ ticker: string; changePct: number }>;
}

export type ExplainMoreMode = "simpler" | "deeper";
