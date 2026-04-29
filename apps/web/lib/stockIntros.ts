// 종목 상세 페이지의 "이 회사가 궁금해요?" 섹션 정적 데이터.
// MVP: 5 시드 종목만. 실제로는 새벽 배치에서 LLM 으로 생성/캐싱하는 게 옳음 (Phase 2).
// 4 Q&A 페어 × 5 종목 = 20 카드.

export interface StockIntro {
  ticker: string;
  avatarKo: string; // 카톡 아바타 약칭 (1~2자)
  qa: Array<{ q: string; a: string }>;
}

export const STOCK_INTROS: Record<string, StockIntro> = {
  AAPL: {
    ticker: "AAPL",
    avatarKo: "앱",
    qa: [
      {
        q: "이 회사가 뭐 하는 곳이야?",
        a: "아이폰이랑 맥북 만드는 미국 회사야! 엄마 폰이 아이폰이면 바로 이 회사 거야 😊",
      },
      {
        q: "얼마나 큰 회사야?",
        a: "전 세계에서 가장 비싼 회사 중 하나야! 직원이 16만 명이고 삼성이랑 맞먹는 크기야 🏢",
      },
      {
        q: "우리 생활이랑 관계있어?",
        a: "엄청 있지! 아이폰, 에어팟, 애플워치 다 이 회사 거야. 스타벅스도 애플페이 쓰잖아 ☕",
      },
      {
        q: "요즘 어때?",
        a: "최근 새 CEO가 발표를 앞두고 있어서 사람들이 주목하고 있어. 아래 버튼 눌러봐!",
      },
    ],
  },
  NVDA: {
    ticker: "NVDA",
    avatarKo: "엔",
    qa: [
      {
        q: "이 회사가 뭐 하는 곳이야?",
        a: "AI 컴퓨터에 들어가는 칩(반도체)을 만드는 회사야. 챗GPT 같은 AI들이 다 이 회사 칩으로 돌아가 🤖",
      },
      {
        q: "얼마나 큰 회사야?",
        a: "최근 몇 년 사이 엄청 커져서 세계에서 가장 비싼 회사 중 하나야. 한 주에 200달러 넘어 💸",
      },
      {
        q: "우리 생활이랑 관계있어?",
        a: "직접은 아니지만 엄마가 쓰는 챗GPT, 자율주행 자동차, 게임기 모두 이 칩이 들어 있어",
      },
      {
        q: "요즘 어때?",
        a: "AI 열풍 때문에 한참 좋다가 요즘은 좀 출렁이고 있어. 아래에서 자세히 봐!",
      },
    ],
  },
  TSLA: {
    ticker: "TSLA",
    avatarKo: "테",
    qa: [
      {
        q: "이 회사가 뭐 하는 곳이야?",
        a: "전기차 만드는 회사야! 일론 머스크라고 그 유명한 사람이 사장이야 🚗⚡",
      },
      {
        q: "얼마나 큰 회사야?",
        a: "전기차 회사 중에는 세계 1위급이야. 한국에서도 도로 위에서 자주 보이지?",
      },
      {
        q: "우리 생활이랑 관계있어?",
        a: "지금은 직접 관계 없어도, 점점 전기차로 바뀌면서 우리 동네 주유소도 충전소로 바뀔 거야 🔌",
      },
      {
        q: "요즘 어때?",
        a: "차가 전보다 덜 팔리고 있어서 주식이 좀 흔들려. 아래 뉴스 봐봐!",
      },
    ],
  },
  MSFT: {
    ticker: "MSFT",
    avatarKo: "MS",
    qa: [
      {
        q: "이 회사가 뭐 하는 곳이야?",
        a: "윈도우랑 엑셀 만드는 회사야. 회사·은행 컴퓨터에 거의 다 깔려있어 💻",
      },
      {
        q: "얼마나 큰 회사야?",
        a: "애플이랑 1, 2위 다투는 어마어마한 회사야. 직원 22만 명!",
      },
      {
        q: "우리 생활이랑 관계있어?",
        a: "은행 가서 직원이 보는 컴퓨터, 동사무소 컴퓨터 거의 다 윈도우야. 그래서 매일 쓰는 셈이야",
      },
      {
        q: "요즘 어때?",
        a: "AI 챗봇(코파일럿) 사업이 잘 돼서 분위기 좋아. 자세히는 아래에서!",
      },
    ],
  },
  AMZN: {
    ticker: "AMZN",
    avatarKo: "아마",
    qa: [
      {
        q: "이 회사가 뭐 하는 곳이야?",
        a: "쿠팡 같은 미국 인터넷 쇼핑 회사야. 그리고 클라우드라는 것도 1등이야 📦",
      },
      {
        q: "얼마나 큰 회사야?",
        a: "직원이 150만 명! 미국에서 두 번째로 직원이 많은 회사야. 어마어마하지?",
      },
      {
        q: "우리 생활이랑 관계있어?",
        a: "넷플릭스도 이 회사 클라우드 위에서 돌아가. 우리가 보는 영상이 결국 이 회사 컴퓨터에서 나오는 거야",
      },
      {
        q: "요즘 어때?",
        a: "분기 실적 발표가 곧이야. 그 결과 따라 주가가 움직일 거야",
      },
    ],
  },
};

export function getStockIntro(ticker: string): StockIntro | null {
  return STOCK_INTROS[ticker.toUpperCase()] ?? null;
}

// changePct 와 newsCount 로 가짜 분위기 (mock). 실제는 Finnhub news-sentiment 통합 시 교체.
export function mockMood(changePct: number, totalNews: number) {
  // 양수면 긍정 비율 ↑ , 음수면 ↓
  let percent: number;
  if (changePct >= 3) percent = 80;
  else if (changePct >= 1) percent = 70;
  else if (changePct >= -1) percent = 55;
  else if (changePct >= -3) percent = 40;
  else percent = 25;

  const total = Math.max(totalNews, 6);
  const positive = Math.round((total * percent) / 100);
  return { percent, positive, total };
}
