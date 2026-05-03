"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  NewsCardChat,
  type NewsCardChatDraft,
} from "@/components/news/NewsCardChat";
import { BottomNav } from "@/components/layout/BottomNav";

// 시안 단계 mock 데이터 — personaIntro/bubbles/life/easy/deep는 추후 실 데이터 모델에 어떻게 들어갈지 별도 합의.
const NOW_ISO = "2026-05-02T09:30:00+09:00";

const MOCK_NEWS: NewsCardChatDraft[] = [
  {
    // App Store Today 매핑 검증용 — aurora 시안의 삼성전자 하락 톤
    id: "preview-son-samsung",
    source: "한국경제",
    headline: "반도체 재고 과잉… 삼성전자 2분기 실적 쇼크 우려",
    headlineKo: "반도체 재고 과잉… 삼성전자 2분기 실적 쇼크 우려",
    headlineEn: "Samsung Q2 earnings shock feared on chip inventory glut",
    summaryKo: null,
    summaryEn: null as unknown as string,
    bubble: "엄마, 오늘 삼성 많이 빠졌어. 나도 보다가 좀 놀랐어.",
    speakerType: "son",
    publishedAt: "2시간 전",
    publishedAtIso: "2026-05-02T07:30:00+09:00",
    tickers: [{ ticker: "005930", changePct: -3.5 }],
    companyName: "삼성전자",
    category: "반도체",
    mainComment: "엄마, 오늘 삼성 많이 빠졌어. 나도 보다가 좀 놀랐어.",
    subComment: "창고에 물건만 쌓이는 상황이야 — 자세한 얘기 들어볼래?",
    bubbles: [
      "반도체를 엄청 많이 만들어놨는데 사는 사람이 없는 거야. 창고에 물건만 쌓이는 상황이야.",
      "이게 단기간에 해결될 문제가 아니라서 당분간은 지켜봐야 할 것 같아. 엄마 잘못 아니야.",
    ],
    life: "마트 창고에 재고가 쌓여서 할인행사해야 하는 뭐 그런 상황인건가?",
    easy: [
      "삼성이 TV 100개 만들었는데 50개밖에 못 판 거야. 나머지는 창고에 쌓여있어.",
      "사는 사람이 없으니 가격도 낮춰야 해. 그러면 돈을 덜 버는 거야.",
    ],
    deep: [
      "미국·중국 경기가 동시에 안 좋아지면서 스마트폰·서버 주문이 뚝 끊겼어.",
      "삼성 반도체 재고가 작년 대비 두 배 넘게 쌓였는데, 다 소화하려면 2~3분기는 걸린대.",
      "SK하이닉스도 같은 상황. 삼성만의 문제가 아니야.",
    ],
    winners: {
      up: "TSMC, 재고 적은 업체",
      down: "SK하이닉스, 반도체 장비사",
      neutral: "애플(부품 협상 중), IT 세트 업체들",
    },
  },
  {
    id: "preview-son-1",
    source: "Bloomberg",
    headline: "엔비디아, 4분기 실적 시장 전망 상회",
    headlineKo: "엔비디아, 4분기 실적 시장 전망 상회",
    headlineEn: "Nvidia tops Q4 earnings expectations on AI chip demand",
    summaryKo:
      "엔비디아가 AI 칩 수요 호조에 힘입어 시장 예상치를 웃도는 4분기 실적을 발표했다. 매출은 전년 동기 대비 78% 증가했다.",
    summaryEn:
      "Nvidia reported Q4 results above analyst expectations, driven by strong AI chip demand. Revenue grew 78% year over year.",
    bubble:
      "엄마, 엔비디아라는 회사 알지? 인공지능에 들어가는 칩 만드는 곳인데, 이번 분기에 돈을 엄청 많이 벌었대. 시장이 예상한 것보다 훨씬 더!",
    speakerType: "son",
    publishedAt: "2시간 전",
    publishedAtIso: NOW_ISO,
    tickers: [
      { ticker: "NVDA", changePct: 4.2 },
      { ticker: "AMD", changePct: -1.3 },
    ],
    companyName: "엔비디아",
    category: "AI/반도체",
    mainComment: "엄마, 엔비디아 오늘 진짜 좋은 날이야! 시장 예상보다 훨씬 잘 벌었대.",
    subComment: "AI 칩 만드는 회사인데 매출이 작년보다 78%나 늘었대.",
    bubbles: [
      "엄마, 엔비디아 알지? 인공지능 컴퓨터에 들어가는 핵심 부품을 만드는 회사야.",
      "이번에 돈을 엄청 많이 벌었어. 시장이 기대한 것보다 훨씬 더 — 매출이 작년보다 78%나 늘었대.",
    ],
    life: "💡 동네 떡집에 손님이 갑자기 두 배로 몰려서 매출이 폭발한 셈이야 — 사람들이 더 사고 싶어서 줄을 서는 상황.",
    easy: [
      "엔비디아는 AI(인공지능)가 똑똑해지려면 꼭 필요한 부품을 파는 회사야.",
      "올해 AI가 유행이라 그 부품을 사겠다는 회사가 줄을 섰어. 그래서 돈을 많이 벌었어.",
    ],
    deep: [
      "데이터센터 매출이 전년 대비 90% 이상 증가, AI 학습용 H100 칩이 여전히 공급 부족 상태야.",
      "다만 중국 매출 비중이 크고 미국 수출 규제가 변수 — 차세대 B100 출시 시점에 따라 분기 변동성 클 수 있어.",
    ],
  },
  {
    id: "preview-daughter-1",
    source: "한국경제",
    headline: "코스피, 외국인 매수에 2,800선 회복",
    headlineKo: "코스피, 외국인 매수에 2,800선 회복",
    headlineEn: "KOSPI rebounds above 2,800 on foreign buying",
    summaryKo:
      "외국인 투자자들이 5거래일 연속 순매수를 이어가며 코스피가 2,800선을 회복했다. 반도체와 2차전지 업종이 상승을 이끌었다.",
    summaryEn: null as unknown as string,
    bubble:
      "엄마! 외국 사람들이 우리나라 주식을 많이 사고 있어서 코스피가 다시 올라왔어. 반도체랑 배터리 회사들이 특히 많이 올랐대.",
    speakerType: "daughter",
    publishedAt: "5시간 전",
    publishedAtIso: NOW_ISO,
    tickers: [{ ticker: "005930", changePct: 2.1 }],
    companyName: "코스피",
    category: "한국증시",
    mainComment: "엄마~ 오늘은 외국인이 한국 주식 사주는 날이야. 분위기 좋아!",
    subComment: "5일 연속 사고 있어서 코스피가 다시 2,800 위로 올라왔어.",
    bubbles: [
      "외국 투자자들이 5일 연속 한국 주식을 사고 있어. 코스피가 다시 2,800 위로 올라왔어.",
    ],
    life: "💡 우리 동네 가게에 외국 손님이 갑자기 많이 들어오면 그날 매출이 좋아지는 거랑 비슷해.",
    deep: [
      "반도체·2차전지 업종이 지수 상승을 이끌었고, 환율이 안정되면서 외국인 입장에선 한국 자산이 매력적인 가격대.",
    ],
  },
  {
    id: "preview-dil-1",
    source: "Reuters",
    headline: "Fed signals possible rate cut in June meeting",
    headlineKo: null,
    headlineEn: "Fed signals possible rate cut in June meeting",
    summaryKo: null,
    summaryEn:
      "Federal Reserve Chair indicated the central bank may consider lowering interest rates at the June FOMC meeting if inflation continues to ease.",
    bubble:
      "어머님, 미국 중앙은행에서 6월에 금리를 내릴 수도 있다고 했어요. 금리가 내려가면 보통 주식 가격은 올라가는 경향이 있어요.",
    speakerType: "daughter_in_law",
    publishedAt: "어제",
    publishedAtIso: NOW_ISO,
    tickers: [],
    companyName: "미 연준",
    category: "거시경제",
    mainComment: "어머님, 미국이 6월에 금리를 내릴 수도 있다고 신호를 보냈어요.",
    subComment: "금리가 내려가면 보통 주식 가격은 올라가는 경향이 있어요.",
    bubbles: [
      "미국 중앙은행이 6월 회의에서 금리 인하를 검토할 수 있다고 했어요.",
    ],
  },
  {
    id: "preview-sil-1",
    source: "WSJ",
    headline: "테슬라, 중국 공장 가동률 회복…주가 8% 급등",
    headlineKo: "테슬라, 중국 공장 가동률 회복…주가 8% 급등",
    headlineEn: "Tesla shares jump 8% as Shanghai factory output recovers",
    summaryKo:
      "테슬라 상하이 공장의 생산이 정상화되면서 1분기 인도량 우려가 완화됐다. 주가는 장중 8% 넘게 상승했다.",
    summaryEn:
      "Tesla's Shanghai factory output normalized, easing Q1 delivery concerns. Shares jumped over 8% during trading.",
    bubble:
      "어머님, 테슬라 중국 공장이 다시 잘 돌아가기 시작했답니다. 1분기 차 판매량 걱정이 줄어들면서 주가가 8% 넘게 올랐어요.",
    speakerType: "son_in_law",
    publishedAt: "30분 전",
    publishedAtIso: NOW_ISO,
    tickers: [
      { ticker: "TSLA", changePct: 8.2 },
      { ticker: "RIVN", changePct: -2.4 },
      { ticker: "F", changePct: 0.5 },
    ],
    companyName: "테슬라",
    category: "전기차",
    mainComment: "장모님, 테슬라가 오늘 좋은 소식이 있었어요. 주가가 8% 넘게 뛰었습니다.",
    subComment: "1분기 차 판매량 걱정이 풀려서 시장 분위기가 확 좋아졌어요.",
    bubbles: [
      "테슬라 상하이 공장이 다시 정상적으로 돌아가기 시작했어요.",
      "1분기 자동차 판매량 걱정이 사라지면서, 주가가 장중에 8% 넘게 올랐습니다.",
    ],
    life: "💡 큰 식당이 잠시 문 닫았다가 다시 열었더니 손님이 한꺼번에 몰린 거랑 비슷해요.",
    easy: [
      "테슬라가 중국에 큰 공장이 있어요. 그게 한동안 문제가 있어서 차를 못 만들고 있었어요.",
      "이제 그 공장이 다시 잘 돌아가서, 차를 정상적으로 만들 수 있게 됐어요.",
    ],
    deep: [
      "Q1 인도량 우려가 컸는데, 상하이 공장 가동률이 정상화되면서 컨센서스가 다시 조정 중입니다.",
      "다만 미국·유럽 가격 인하 정책이 마진 압박 요인이라, 인도량 회복이 이익 회복으로 바로 이어질지는 별도 변수입니다.",
    ],
  },
];

export default function NewsCardPreviewPage() {
  // 카드 모달 open 상태 — GNB를 모달과 동시에 hide하기 위해
  const [openCount, setOpenCount] = useState(0);
  const isAnyOpen = openCount > 0;

  const handleOpenChange = (open: boolean) => {
    setOpenCount((c) => Math.max(0, c + (open ? 1 : -1)));
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col bg-[#F8F4FF] pb-20">
      <DevStrip />
      <AppHeader />
      <main className="flex-1 px-5 pt-10">
        {/* 카드 그룹 사이 간격 (gap-10 = 40px) — 그룹(타이틀+카드) 내부 간격(mb-2 = 8px)보다 훨씬 크게 */}
        <div className="flex flex-col gap-10">
          {MOCK_NEWS.map((n) => (
            <NewsCardChat key={n.id} news={n} onOpenChange={handleOpenChange} />
          ))}
        </div>
      </main>
      <AnimatePresence>{!isAnyOpen && <BottomNav />}</AnimatePresence>
    </div>
  );
}

/** 디자인 작업용 보조 strip — 시안 비교 링크. 실 앱엔 들어가지 않음. */
function DevStrip() {
  return (
    <div className="flex items-center justify-between bg-stone-100 px-3 py-1 text-[10px] text-stone-500">
      <span>📝 /preview/news-card · mock 데이터</span>
      <Link href="/preview/aurora" className="underline">
        aurora 원본 시안 →
      </Link>
    </div>
  );
}

/** 앱 상단 헤더 — aurora 시안의 오로라 그라데이션 톤 */
function AppHeader() {
  return (
    <header className="relative overflow-hidden bg-gradient-to-br from-[#3C0A5E] to-[#1A2060]">
      {/* 오로라 블롭 */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute -top-20 -left-7 h-[200px] w-[200px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(123,47,190,0.55) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute -top-12 left-[120px] h-40 w-40 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(196,64,106,0.45) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute -top-5 -right-5 h-[140px] w-[140px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(29,158,117,0.35) 0%, transparent 70%)",
          }}
        />
        <div className="absolute inset-0 bg-white/10" />
      </div>

      <div className="relative flex items-center justify-between px-4 py-3.5">
        <div>
          <div className="text-xl font-extrabold tracking-tight text-white">
            엄니머니
          </div>
          <div className="text-[10px] text-white/70">가족이 써주는 뉴스</div>
        </div>
        <button aria-label="알림" className="text-white/85">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          >
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        </button>
      </div>
    </header>
  );
}

