import type { SpeakerType } from "@eomni/shared";

// ───────────────────────────────────────────────
// 화자별 짧은 칭찬/놀림 말투 (스펙 §5)
// ───────────────────────────────────────────────

const PRAISE_SHORT: Record<SpeakerType, string[]> = {
  son: [
    "엄마 아직 기억력 살아있네 ㅎㅎ",
    "역시 내 엄마! 눈 감고도 맞히네 ㅎㅎ",
    "마지막까지 완벽해! 역시 엄마 ㅎㅎ",
  ],
  daughter: [
    "엄마 이거 나보다 빨리 맞혔어!",
    "엄마 천재 아니야? ㅎㅎ",
    "엄마 짱이야 진짜!",
  ],
  daughter_in_law: [
    "어머니 눈치가 빠르시네요 ㅎㅎ",
    "역시 어머니세요! 단번에 맞히셨어요",
    "어머니 정말 똑똑하시네요!",
  ],
  son_in_law: [
    "어머니 생각보다 감이 있으신데요?",
    "어머니 대단하세요! 한 번에 맞히시네요",
    "어머니 이 정도 실력이실 줄이야!",
  ],
};

const TEASE_SHORT: Record<SpeakerType, string[]> = {
  son: [
    "내가 엄마 닮아서 공부 못한 거였나봐 ㅋㅋ",
    "엄마~ 아직 그 수준은 아니야 ㅋㅋ",
    "엄마 이건 좀 헷갈렸지? 같이 다시 보자",
  ],
  daughter: [
    "엄마 나한테 공부하라고 했잖아 ㅎㅎ",
    "엄마! 이건 나도 처음에 몰랐어 ㅋㅋ",
    "엄마 다시 한 번 봐봐~",
  ],
  daughter_in_law: [
    "저도 처음엔 다 틀렸어요~ 괜찮아요 어머니",
    "어머니, 같이 천천히 봐요",
    "어머니 이 부분이 제일 헷갈려요",
  ],
  son_in_law: [
    "저도 처음엔 이거 몰랐어요 ㅎㅎ",
    "어머니, 같이 다시 보면 됩니다",
    "이 부분은 헷갈리실 수 있어요",
  ],
};

export function pickPraise(speaker: SpeakerType, idx: number): string {
  const arr = PRAISE_SHORT[speaker];
  return arr[idx % arr.length] ?? arr[0]!;
}
export function pickTease(speaker: SpeakerType, idx: number): string {
  const arr = TEASE_SHORT[speaker];
  return arr[idx % arr.length] ?? arr[0]!;
}

// ───────────────────────────────────────────────
// 레슨 1 — 회사 조각이 뭔가요?
// ───────────────────────────────────────────────

export type LessonStep =
  | {
      type: "explain";
      hi: string;
      text: string;
      praise: string;
      visual?: "pizza";
    }
  | {
      type: "ox";
      q: string;
      answer: "O" | "X";
      okBody: string;
      ngBody: string;
    }
  | {
      type: "multi";
      q: string;
      opts: string[];
      answer: number; // 0-based
      okBody: string;
      ngBody: string;
    }
  | {
      type: "blank";
      pre: string;
      post: string;
      opts: string[];
      answer: number;
      okBody: string;
      ngBody: string;
    }
  | { type: "complete" };

export interface Lesson {
  id: number;
  title: string;
  badge: { earned: string; perfect: string };
  steps: LessonStep[];
  premium: boolean;
}

export const LESSON_1: Lesson = {
  id: 1,
  title: "회사 조각이 뭔가요?",
  badge: { earned: "🌱 주식 새싹", perfect: "🏆 퀴즈 천재 엄마" },
  premium: false,
  steps: [
    {
      type: "explain",
      hi: "오늘 배울 거 딱 하나야!",
      text: "삼성, 애플, 카카오 같은 회사들!\n이런 회사들이 돈이 필요할 때\n\"우리 회사 조각 살래요?\" 하고 물어봐.\n그 조각이 바로 주식이야!",
      praise:
        "엄마 첫 시작이 반이야 ㅎㅎ\n이미 또래 엄마들보다 한 발 앞선 거야!",
    },
    {
      type: "explain",
      hi: "피자로 생각하면 쉬워!",
      text: "회사 = 피자 한 판이라고 해봐.\n8조각으로 나누면 1조각 = 1/8 주인!\n내가 파란 조각을 샀으면,\n그 회사 주인이 조금 되는 거야.",
      praise:
        "피자 비유로 바로 이해하다니!\n엄마 아직 머리 팍팍 돌아가네 ㅎㅎ",
      visual: "pizza",
    },
    {
      type: "ox",
      q: "삼성전자 주식을 사면\n삼성전자 주인이 될 수 있다",
      answer: "O",
      okBody: "이거 맞추는 엄마들 별로 없거든? 진짜로!",
      ngBody:
        "정답은 O야!\n주식을 사면 그 회사 조각 주인이 되는 거였지~\n같이 다시 기억해보자!",
    },
    {
      type: "explain",
      hi: "그럼 주식이 오르면?",
      text: "1만원에 산 주식이 2만원이 됐어!\n그럼 내 돈이 2배!\n이게 바로 투자의 매력이야.\n물론 내려갈 수도 있어서 잘 골라야 해.",
      praise:
        "여기까지 이해했으면 솔직히 빠른 거야\n처음 배울 때 나도 이거 몰랐거든 ㅎㅎ",
    },
    {
      type: "multi",
      q: "주식 가격이 오르면\n내 돈은 어떻게 될까?",
      opts: ["그대로야", "줄어들어", "늘어나", "없어져"],
      answer: 2,
      okBody: "주식 감각이 원래 있었던 거 아니야?",
      ngBody:
        '정답은 "늘어나"야!\n주식이 오르면 산 사람 돈도 같이 커지거든.',
    },
    {
      type: "blank",
      pre: "회사를 조각으로 나눈 걸",
      post: "이라고 해",
      opts: ["주식", "펀드", "예금", "적금"],
      answer: 0,
      okBody: "이 정도면 역으로 설명해줄 수 있겠는데?",
      ngBody: '정답은 "주식"이야!\n이 단어 하나만 기억하면 돼!',
    },
    { type: "complete" },
  ],
};

export const ALL_LESSONS: Array<{
  id: number;
  title: string;
  premium: boolean;
}> = [
  { id: 1, title: "회사 조각이 뭔가요?", premium: false },
  { id: 2, title: "올랐다 내렸다, 왜 그래요?", premium: false },
  { id: 3, title: "좋은 회사 고르는 법", premium: true },
  { id: 4, title: "언제 사고 팔까요?", premium: true },
  { id: 5, title: "위험 줄이는 방법", premium: true },
];

export function getLesson(id: number): Lesson | null {
  if (id === 1) return LESSON_1;
  return null; // Phase 2 에서 LESSON_2 ... 추가
}
