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
// 레슨 데이터 타입
// ───────────────────────────────────────────────

export type ExplainVisual = "pizza" | "market" | "news" | "corona";

export type LessonStep =
  | {
      type: "explain";
      hi: string;
      text: string;
      praise: string;
      visual?: ExplainVisual;
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
      answer: number;
      okBody: string;
      ngBody: string;
      /** 틀린 답 인덱스별 맞춤 피드백 (없으면 ngBody 사용) */
      ngMap?: Record<number, string>;
    }
  | {
      type: "blank";
      pre: string;
      post: string;
      opts: string[];
      answer: number;
      okBody: string;
      ngBody: string;
      ngMap?: Record<number, string>;
    }
  | { type: "complete" };

export interface LessonBadge {
  emoji: string;
  perfectEmoji: string;
  name: string; // "주식 새싹" / "주가 이해자"
}

export interface LessonShareCard {
  title: string;
  perfectBody: string;
  normalBody: string;
  badgeText: { perfect: string; normal: string };
}

export interface LessonConnectCard {
  title: string;
  text: string;
  linkLabel: string;
  linkHref: string;
}

export interface Lesson {
  id: number;
  title: string;
  steps: LessonStep[];
  premium: boolean;
  badge: LessonBadge;
  completeTitle: { perfect: string; normal: string };
  completeSub: { perfect: string; normal: string };
  shareCard: LessonShareCard;
  connectCard?: LessonConnectCard;
  nextLessonLabel: string; // "다음 레슨 바로 가기" / "레슨 3 보러 가기"
}

// ───────────────────────────────────────────────
// LESSON 1 — 회사 조각이 뭔가요?
// ───────────────────────────────────────────────
export const LESSON_1: Lesson = {
  id: 1,
  title: "회사 조각이 뭔가요?",
  premium: false,
  badge: { emoji: "🌱", perfectEmoji: "🏆", name: "주식 새싹" },
  completeTitle: {
    perfect: "만점이야! 역시 엄마 ㅎㅎ",
    normal: "레슨 1 완료!",
  },
  completeSub: {
    perfect:
      '"주식 새싹" 배지 획득!\n엄마 이제 나한테 가르쳐줄 수 있겠는데?',
    normal:
      '"주식 새싹" 배지 획득!\n틀린 것도 있지만 그래도 잘했어 ㅎㅎ',
  },
  shareCard: {
    title: "엄마가 주식 공부 시작했어!",
    perfectBody:
      '레슨 1 "회사 조각이 뭔가요?" 완료!\n퀴즈 3개 다 맞췄어 ㅎㅎ 엄마 너무한 거 아니야?\n이제 주식이 뭔지 알 것 같아\n나도 이제 주식 새싹이야 🌱',
    normalBody:
      '레슨 1 "회사 조각이 뭔가요?" 완료!\n열심히 풀었어!\n이제 주식이 뭔지 알 것 같아\n나도 이제 주식 새싹이야 🌱',
    badgeText: { perfect: "퀴즈 만점 배지", normal: "주식 새싹 배지" },
  },
  nextLessonLabel: "다음 레슨 바로 가기",
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

// ───────────────────────────────────────────────
// LESSON 2 — 올랐다 내렸다, 왜 그래요?
// ───────────────────────────────────────────────
export const LESSON_2: Lesson = {
  id: 2,
  title: "올랐다 내렸다, 왜 그래요?",
  premium: false,
  badge: { emoji: "📈", perfectEmoji: "📈🏆", name: "주가 이해자" },
  completeTitle: {
    perfect: "만점! 엄마 경제학자 다 됐네 ㅎㅎ",
    normal: "레슨 2 완료!",
  },
  completeSub: {
    perfect:
      '"주가 이해자" 배지 획득!\n이제 뉴스 보면 주가가 보일 거야.\n나보다 더 잘 알 것 같아서 무서워 ㅋㅋ',
    normal:
      '"주가 이해자" 배지 획득!\n이제 뉴스 볼 때 주식이랑 연결해봐!',
  },
  shareCard: {
    title: "엄마가 주식 공부 계속하고 있어!",
    perfectBody:
      '레슨 2 "올랐다 내렸다, 왜 그래요?" 완료!\n퀴즈 만점이야 ㅎㅎ\n이제 뉴스 보면 주가가 왜 움직이는지 알아!\n경제 공부 중인 엄마 🔥',
    normalBody:
      '레슨 2 "올랐다 내렸다, 왜 그래요?" 완료!\n열심히 풀었어!\n이제 뉴스 보면 주가가 왜 움직이는지 알아!\n경제 공부 중인 엄마 🔥',
    badgeText: { perfect: "주가 이해자 배지", normal: "주가 이해자 배지" },
  },
  connectCard: {
    title: "💡 뉴스 피드랑 연결돼!",
    text: '이제 뉴스 피드에서 뉴스 보면\n"아, 이래서 올랐구나!" 하고 이해될 거야.',
    linkLabel: "→ 오늘 뉴스 보러 가기",
    linkHref: "/feed",
  },
  nextLessonLabel: "레슨 3 보러 가기",
  steps: [
    {
      type: "explain",
      hi: "엄마 김장철 배추값 알지?",
      text: "김장철에 배추값이 왜 오르는지 알아?\n다들 배추 사려고 몰려들잖아!\n주식도 똑같아.\n사려는 사람이 많아지면 가격이 올라가.",
      visual: "market",
      praise:
        "엄마 배추값은 알잖아~\n그거랑 주식이 완전 같은 원리야 ㅎㅎ\n이미 경제 전문가였던 거야!",
    },
    {
      type: "explain",
      hi: "그럼 뉴스랑 무슨 관계야?",
      text: '뉴스가 사람들 마음을 움직여!\n"삼성 실적 대박" 뉴스 뜨면\n→ 다들 사고 싶어져\n→ 가격 올라!\n"삼성 공장 불났대" 뉴스 뜨면\n→ 다들 팔고 싶어져\n→ 가격 내려!',
      visual: "news",
      praise:
        "이제 뉴스 보는 눈이 생긴 거야!\n엄마 나보다 빠른 거 맞지? ㅎㅎ",
    },
    {
      type: "ox",
      q: "삼성전자 주식을 사려는\n사람이 많아지면\n가격이 올라간다",
      answer: "O",
      okBody:
        "엄마 배추 장사 해도 되겠다 ㅎㅎ\n사려는 사람 많으면 올라가는 거야!",
      ngBody:
        "엄마~ 김장철 배추값 생각해봐!\n다들 사려고 하면 오르잖아 ㅎㅎ\n주식도 딱 그거야!",
    },
    {
      type: "explain",
      hi: "실제로 이런 일 있었어!",
      text: "2020년 코로나 터졌잖아.\n그때 여행회사 주식이 반토막 났어.\n아무도 여행 못 가니까\n여행사 팔자는 사람이 폭발한 거야.\n근데 마스크 회사 주식은?\n반대로 엄청 올랐어 ㅎㅎ",
      visual: "corona",
      praise:
        "엄마 그때 기억하지?\n그게 다 주식이랑 연결된 거였어!\n이제 뉴스 보면 주식이 보일 거야 ㅎㅎ",
    },
    {
      type: "multi",
      q: "애플이 신제품 대박났다는\n뉴스가 떴어!\n주가는 어떻게 될까?",
      opts: ["그대로야", "올라가", "내려가", "없어져"],
      answer: 1,
      okBody:
        "대박 뉴스 → 사고 싶어짐 → 올라가!\n이제 완전히 이해한 거야!",
      ngBody: '정답은 "올라가"야!',
      ngMap: {
        0: '엄마 그대로는 아니야 ㅎㅎ\n대박 뉴스 뜨면 다들 사려고 달려들잖아!\n정답은 "올라가"야!',
        2: '엄마 좋은 뉴스인데 내려가겠어? ㅋㅋ\n대박 뉴스 → 다들 사고 싶어짐 → 올라가!',
        3: '엄마 또 없어져 눌렀어?! ㅋㅋㅋ\n주식이 그렇게 쉽게 없어지면 아무도 안 하지~\n정답은 "올라가"야!',
      },
    },
    {
      type: "blank",
      pre: "코로나 뉴스가 터졌을 때\n여행회사 주식은",
      post: "",
      opts: ["올랐어", "내렸어", "그대로", "없어졌어"],
      answer: 1,
      okBody:
        "엄마 그때 기억 나지?\n다들 여행 못 갔잖아!\n그러니까 여행사 주식이 폭락한 거야.\n뉴스랑 주식이 이렇게 연결돼!",
      ngBody: '정답은 "내렸어"야!',
      ngMap: {
        0: '엄마 코로나 때 여행 갔어? ㅋㅋ\n아무도 여행 못 가니까 "내렸어"가 정답이야!',
        2: '그대로? ㅎㅎ 그 정도면 다행인데...\n정답은 "내렸어"야!\n여행 못 가니까 여행사가 힘들었던 거야.',
        3: '없어졌어? ㅋㅋ 그건 아니야~\n정답은 "내렸어"야! 반토막이 났었거든.',
      },
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
  if (id === 2) return LESSON_2;
  return null;
}

export function nextLessonHref(currentId: number): string {
  return `/study/${currentId + 1}`;
}
