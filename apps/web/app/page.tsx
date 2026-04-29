"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useProfile } from "@/lib/profile";
import { isSupabaseConfigured, signInWithKakao } from "@/lib/supabase/client";

export default function LandingPage() {
  const router = useRouter();
  const { profile, loaded } = useProfile();
  const [authError, setAuthError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // ?error= 쿼리 표시
  useEffect(() => {
    if (typeof window === "undefined") return;
    const u = new URL(window.location.href);
    const e = u.searchParams.get("error");
    if (e) setAuthError(decodeURIComponent(e));
  }, []);

  async function handleStart() {
    // 이미 프로필 있는 사용자 → 피드로
    if (profile) {
      router.push("/feed");
      return;
    }
    setBusy(true);
    setAuthError(null);
    try {
      if (!isSupabaseConfigured()) {
        router.push("/onboarding"); // OAuth 미설정 시 로컬 온보딩
        return;
      }
      await signInWithKakao("/onboarding");
    } catch (err) {
      setAuthError((err as Error).message);
      setBusy(false);
    }
  }

  // 로그인된 사용자 vs 신규 사용자 구분 (로딩 중엔 신규로 가정)
  const hasProfile = loaded && !!profile;

  return (
    <div className="min-h-screen bg-stone-50 text-gray-900">
      <NavBar onStart={handleStart} busy={busy} hasProfile={hasProfile} />

      {authError && (
        <div className="mx-4 mt-20 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          로그인 실패: {authError}
        </div>
      )}

      <Hero onStart={handleStart} busy={busy} hasProfile={hasProfile} />
      <Divider />
      <HowItWorks />
      <Divider />
      <Speakers />
      <Divider />
      <Features />
      <Divider />
      <Pricing onStart={handleStart} hasProfile={hasProfile} />
      <Referral />
      <Divider />
      <FinalCta onStart={handleStart} busy={busy} hasProfile={hasProfile} />
      <Footer />
    </div>
  );
}

const PURPLE = "#534AB7";
const PURPLE_LIGHT = "#EEEDFE";
const TEAL = "#1D9E75";

// ───────────────────────────────────────────
// NAV
// ───────────────────────────────────────────
function NavBar({
  onStart,
  busy,
  hasProfile,
}: {
  onStart: () => void;
  busy: boolean;
  hasProfile: boolean;
}) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-stone-50/90 backdrop-blur border-b border-stone-200">
      <div className="font-display text-xl font-bold tracking-tight">
        <span style={{ color: PURPLE }}>엄니</span>
        <span style={{ color: "#EF9F27" }}>머니</span>
      </div>
      <button
        onClick={onStart}
        disabled={busy}
        className="rounded-full bg-[#534AB7] hover:bg-[#3C3489] text-white text-sm font-medium px-5 py-2.5 transition disabled:opacity-50"
      >
        {busy ? "이동 중..." : hasProfile ? "내 피드로 가기 →" : "카카오로 시작하기"}
      </button>
    </nav>
  );
}

// ───────────────────────────────────────────
// HERO
// ───────────────────────────────────────────
function Hero({
  onStart,
  busy,
  hasProfile,
}: {
  onStart: () => void;
  busy: boolean;
  hasProfile: boolean;
}) {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-28 pb-16 text-center overflow-hidden">
      {/* deco circles */}
      <div className="absolute -top-24 -right-24 w-[500px] h-[500px] rounded-full bg-[#534AB7]/10 pointer-events-none" />
      <div className="absolute bottom-0 -left-16 w-[300px] h-[300px] rounded-full bg-[#1D9E75]/10 pointer-events-none" />
      <div className="absolute top-1/3 left-[10%] w-[200px] h-[200px] rounded-full bg-[#EF9F27]/10 pointer-events-none" />

      <div className="relative max-w-2xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#AFA9EC] bg-[#EEEDFE] text-[#534AB7] text-sm font-medium px-4 py-1.5 mb-6">
          👦 아들딸이 직접 설명해드려요
        </div>

        <h1
          className="font-display font-bold leading-tight tracking-tight mb-5"
          style={{ fontSize: "clamp(36px, 8vw, 64px)" }}
        >
          엄마도 이제
          <br />
          <span style={{ color: PURPLE }}>주식 뉴스</span>가
          <br />
          <span style={{ color: TEAL }}>쉬워져요</span>
        </h1>

        <p className="text-base sm:text-lg text-gray-500 leading-relaxed max-w-md mx-auto mb-9">
          어려운 금융 뉴스를 아들, 딸, 며느리, 사위가
          <br />
          엄마한테 설명해주듯 바꿔드려요.
          <br />
          초등학교 3학년도 이해하는 수준으로요!
        </p>

        <div className="flex flex-wrap justify-center gap-3 mb-14">
          <button
            onClick={onStart}
            disabled={busy}
            className="inline-flex items-center gap-2 rounded-2xl bg-[#FEE500] text-[#3A1D00] font-bold px-7 py-3.5 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-yellow-200 disabled:opacity-50"
          >
            {hasProfile ? (
              <>내 피드로 가기 →</>
            ) : (
              <>
                <KakaoIcon />
                카카오로 시작하기
              </>
            )}
          </button>
          <a
            href="#how"
            className="rounded-2xl border-[1.5px] border-[#7F77DD] text-[#534AB7] font-medium px-7 py-3.5 hover:bg-[#EEEDFE] transition"
          >
            서비스 둘러보기 ↓
          </a>
        </div>

        <PhoneMockup />
      </div>
    </section>
  );
}

function PhoneMockup() {
  return (
    <div className="mx-auto w-[280px] bg-white rounded-[36px] border-[6px] border-gray-900 overflow-hidden shadow-2xl">
      <div className="w-20 h-5 bg-gray-900 rounded-b-xl mx-auto" />
      <div className="p-3">
        <div className="flex items-center justify-between mb-3">
          <span className="font-display text-base font-bold">오늘 소식</span>
          <span className="text-[10px] rounded-full bg-[#EEEDFE] text-[#534AB7] font-medium px-2 py-0.5">
            👦 아들 버전
          </span>
        </div>
        <MockNewsCard
          src="Reuters"
          time="1시간 전"
          title="Fed, 기준금리 동결 결정"
          who="아들이 설명해줄게!"
          bubble="엄마~ 나라에서 이자 안 올렸대. 주식한텐 좋은 소식이야!"
          tone="purple"
          tickers={[
            { t: "AAPL", p: "+1.2%", up: true },
            { t: "NVDA", p: "+2.4%", up: true },
          ]}
        />
        <MockNewsCard
          src="CNBC"
          time="3시간 전"
          title="테슬라, 판매 예상 하회"
          who="아들이 설명해줄게!"
          bubble="테슬라 차가 예상보다 덜 팔렸대. 잠깐 지켜봐!"
          tone="amber"
          tickers={[{ t: "TSLA", p: "-4.1%", up: false }]}
        />
      </div>
    </div>
  );
}

function MockNewsCard({
  src,
  time,
  title,
  who,
  bubble,
  tone,
  tickers,
}: {
  src: string;
  time: string;
  title: string;
  who: string;
  bubble: string;
  tone: "purple" | "amber";
  tickers: Array<{ t: string; p: string; up: boolean }>;
}) {
  const bubbleBg = tone === "purple" ? "bg-[#EEEDFE]" : "bg-[#FFF8EC]";
  const bubbleBorder =
    tone === "purple" ? "border-[#AFA9EC]" : "border-[#FAC775]";
  const whoColor = tone === "purple" ? "text-[#534AB7]" : "text-[#854F0B]";
  return (
    <div className="bg-white border border-stone-200 rounded-xl overflow-hidden mb-2">
      <div className="px-3 pt-2.5 pb-1.5">
        <div className="flex justify-between mb-1">
          <span className="text-[10px] text-gray-500">{src}</span>
          <span className="text-[10px] text-gray-400">{time}</span>
        </div>
        <div className="text-xs font-medium leading-snug">{title}</div>
      </div>
      <div className={`px-3 py-2 border-t ${bubbleBg} ${bubbleBorder}`}>
        <div className={`text-[10px] font-bold mb-0.5 ${whoColor}`}>
          👦 {who}
        </div>
        <div className="text-[11px] leading-relaxed text-gray-700">
          {bubble}
        </div>
      </div>
      <div className="flex gap-1.5 px-3 py-1.5">
        {tickers.map((t) => (
          <span
            key={t.t}
            className="text-[10px] rounded-full border border-stone-200 bg-stone-100 px-2 py-0.5"
          >
            {t.t}{" "}
            <span
              className={t.up ? "text-[#1D9E75]" : "text-[#D85A30]"}
            >
              {t.p}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

// ───────────────────────────────────────────
// HOW IT WORKS
// ───────────────────────────────────────────
function HowItWorks() {
  const steps = [
    {
      n: "1",
      title: "화자를 선택해요",
      desc: "아들, 딸, 며느리, 사위 중에 골라요. 엄마 이름도 넣으면 더 따뜻해요.",
    },
    {
      n: "2",
      title: "오늘 뉴스를 봐요",
      desc: "어려운 금융 뉴스가 가족 말투 말풍선으로 변환돼요. 용어는 하나도 없어요.",
    },
    {
      n: "3",
      title: "궁금하면 눌러요",
      desc: '"어려워요" 또는 "더 알고 싶어요"를 누르면 수준에 맞게 다시 설명해줘요.',
    },
  ];
  return (
    <section id="how" className="px-6 py-20">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl px-8 sm:px-10 py-14">
        <div className="text-center mb-12">
          <SectionLabel>어떻게 작동하나요</SectionLabel>
          <SectionTitle>딱 3단계면 끝이에요</SectionTitle>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {steps.map((s) => (
            <div key={s.n} className="text-center">
              <div className="w-12 h-12 rounded-2xl bg-[#EEEDFE] text-[#534AB7] font-display text-xl font-bold flex items-center justify-center mx-auto mb-4">
                {s.n}
              </div>
              <div className="text-base font-bold mb-2">{s.title}</div>
              <div className="text-sm text-gray-500 leading-relaxed">
                {s.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ───────────────────────────────────────────
// SPEAKERS
// ───────────────────────────────────────────
function Speakers() {
  const speakers = [
    {
      emoji: "👦",
      name: "아들",
      tone: "친근하고 편안하게",
      sample: '"엄마~ 이게 뭐냐면, 쉽게 말하면 이자가 그대로래. 걱정 마!"',
    },
    {
      emoji: "👧",
      name: "딸",
      tone: "다정하고 수다스럽게",
      sample: '"엄마~! 있잖아, 오늘 진짜 중요한 뉴스 있어. 이거 꼭 알아야 해!"',
    },
    {
      emoji: "👩",
      name: "며느리",
      tone: "공손하고 따뜻하게",
      sample: '"어머니, 제가 쉽게 설명드릴게요. 오늘 좋은 소식이 있었어요!"',
    },
    {
      emoji: "👨",
      name: "사위",
      tone: "정중하고 깔끔하게",
      sample: '"어머니, 말씀드리자면 오늘 시장에 좋은 흐름이 있었습니다."',
    },
  ];
  return (
    <section className="max-w-5xl mx-auto px-6 py-20">
      <SectionLabel>화자 선택</SectionLabel>
      <SectionTitle>말투가 완전히 달라져요</SectionTitle>
      <p className="text-base text-gray-500 max-w-xl mb-10">
        같은 뉴스도 아들이 말하는 것과 며느리가 말하는 게 느낌이 달라야죠.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {speakers.map((s) => (
          <div
            key={s.name}
            className="bg-white border-[1.5px] border-stone-200 rounded-3xl p-6 hover:border-[#7F77DD] hover:-translate-y-1 transition"
          >
            <div className="text-3xl mb-3">{s.emoji}</div>
            <div className="text-lg font-bold mb-1">{s.name}</div>
            <div className="text-sm text-gray-500 mb-3">{s.tone}</div>
            <div className="bg-[#EEEDFE] text-[#3C3489] text-sm rounded-xl px-3 py-2.5 leading-relaxed">
              {s.sample}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ───────────────────────────────────────────
// FEATURES
// ───────────────────────────────────────────
function Features() {
  const items = [
    {
      icon: "📰",
      tone: "purple",
      title: "매일 아침 뉴스 말풍선",
      desc: "미국 주요 뉴스를 매일 새벽 정리해서 가족 말투로 바꿔드려요. 어려운 용어는 하나도 없어요.",
    },
    {
      icon: "🤔",
      tone: "teal",
      title: "왜 싸졌어? 왜 비싸졌어?",
      desc: "회사 주가가 왜 올랐는지 내렸는지, 관련 뉴스를 연결해서 이유를 설명해드려요.",
    },
    {
      icon: "🛒",
      tone: "amber",
      title: "컬리처럼 쉬운 종목 화면",
      desc: '"지금 저렴해요", "요즘 뜨는 중" 배지로 한눈에 확인. 찜하기도 장바구니처럼 쉬워요.',
    },
    {
      icon: "📚",
      tone: "coral",
      title: "단계별 공부방",
      desc: "회사 조각이 뭔지부터 차근차근. 두올링고처럼 하루 하나씩 배워가요.",
    },
  ];
  const toneColor: Record<string, string> = {
    purple: "#534AB7",
    teal: "#1D9E75",
    amber: "#EF9F27",
    coral: "#D85A30",
  };
  return (
    <section className="max-w-5xl mx-auto px-6 py-20">
      <SectionLabel>주요 기능</SectionLabel>
      <SectionTitle>
        엄마를 위해 만든
        <br />
        모든 것
      </SectionTitle>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-10">
        {items.map((it) => (
          <div
            key={it.title}
            className="relative bg-white border border-stone-200 rounded-3xl p-7 overflow-hidden"
          >
            <div
              className="absolute top-0 left-0 right-0 h-1"
              style={{ background: toneColor[it.tone] }}
            />
            <div className="text-3xl mb-3">{it.icon}</div>
            <div className="text-lg font-bold mb-2">{it.title}</div>
            <div className="text-sm text-gray-500 leading-relaxed">
              {it.desc}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ───────────────────────────────────────────
// PRICING
// ───────────────────────────────────────────
function Pricing({
  onStart,
  hasProfile: _hasProfile,
}: {
  onStart: () => void;
  hasProfile: boolean;
}) {
  return (
    <section className="max-w-5xl mx-auto px-6 py-20 text-center">
      <SectionLabel>요금제</SectionLabel>
      <SectionTitle>부담 없이 시작해요</SectionTitle>
      <p className="text-base text-gray-500 mb-6">
        처음엔 무료로 충분히 써보세요.
      </p>
      <div className="inline-flex items-center gap-2 rounded-full border border-[#FAC775] bg-[#FFF8EC] text-[#633806] text-sm font-medium px-5 py-2 mb-10">
        ⚡ 얼리버드 한정 — 나중엔 79,900원으로 올라요
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
        <PricingCard
          name="무료"
          price="0"
          unit="원"
          desc="일단 써보세요"
          perks={[
            "하루 뉴스 5개",
            "화자 1명 선택",
            "공부방 2단계",
            "찜 종목 3개",
          ]}
          ctaLabel="무료로 시작"
          ctaStyle="outline"
          onCtaClick={onStart}
        />
        <PricingCard
          name="월 구독"
          price="4,900"
          unit="원/월"
          desc="커피 한 잔 값으로"
          perks={[
            "뉴스 무제한",
            "화자 전체 선택",
            "공부방 전체 오픈",
            "찜 종목 무제한",
            "더 알고싶어요 무제한",
          ]}
          featured
          ctaLabel="구독 시작하기"
          ctaStyle="filled"
          onCtaClick={onStart}
        />
        <PricingCard
          name="평생 이용권"
          price="49,900"
          unit="원"
          originalPrice="79,900원"
          desc="한 번만 내고 평생 써요"
          perks={[
            "구독 혜택 전부 포함",
            "추후 기능도 무료",
            "월 구독 대비 50% 절약",
            "얼리버드 전용 배지",
          ]}
          earlyBird
          ctaLabel="얼리버드로 시작하기"
          ctaStyle="amber"
          ctaSubtext="🔥 선착순 100명 한정"
          onCtaClick={onStart}
        />
      </div>
    </section>
  );
}

function PricingCard({
  name,
  price,
  unit,
  originalPrice,
  desc,
  perks,
  ctaLabel,
  ctaStyle,
  ctaSubtext,
  featured,
  earlyBird,
  onCtaClick,
}: {
  name: string;
  price: string;
  unit: string;
  originalPrice?: string;
  desc: string;
  perks: string[];
  ctaLabel: string;
  ctaStyle: "outline" | "filled" | "amber";
  ctaSubtext?: string;
  featured?: boolean;
  earlyBird?: boolean;
  onCtaClick: () => void;
}) {
  const borderClass = featured
    ? "border-[#534AB7] border-[1.5px]"
    : earlyBird
      ? "border-[#EF9F27] border-[1.5px]"
      : "border-stone-200 border-[1.5px]";
  return (
    <div
      className={`relative bg-white rounded-3xl px-7 py-8 text-left ${borderClass}`}
    >
      {featured && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#534AB7] text-white text-xs font-medium px-4 py-1 whitespace-nowrap">
          가장 인기
        </span>
      )}
      {earlyBird && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full text-white text-xs font-medium px-4 py-1 whitespace-nowrap" style={{ background: "linear-gradient(135deg, #EF9F27, #D85A30)" }}>
          ⚡ 얼리버드
        </span>
      )}
      <div className="text-sm text-gray-500 mb-1">{name}</div>
      <div className="font-display text-4xl font-bold mb-1" style={earlyBird ? { color: "#854F0B" } : undefined}>
        {price}
        <span className="text-base font-normal text-gray-500">{unit}</span>
      </div>
      {originalPrice && (
        <div className="text-xs text-gray-400 line-through mb-1">정가 {originalPrice}</div>
      )}
      <div className="text-sm text-gray-500 mb-5">{desc}</div>
      <ul className="flex flex-col gap-2.5 mb-6">
        {perks.map((p) => (
          <li key={p} className="flex items-center gap-2 text-sm">
            <span
              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ background: earlyBird ? "#EF9F27" : "#1D9E75" }}
            />
            {p}
          </li>
        ))}
      </ul>
      <button
        onClick={onCtaClick}
        className={`w-full rounded-xl py-3 text-sm font-medium transition ${
          ctaStyle === "filled"
            ? "bg-[#534AB7] text-white hover:bg-[#3C3489]"
            : ctaStyle === "amber"
              ? "bg-[#EF9F27] text-[#3A1D00]"
              : "border border-stone-200 text-gray-900 hover:border-[#534AB7] hover:text-[#534AB7]"
        }`}
      >
        {ctaLabel}
      </button>
      {ctaSubtext && (
        <div className="text-center text-xs text-gray-400 mt-2">
          {ctaSubtext}
        </div>
      )}
    </div>
  );
}

// ───────────────────────────────────────────
// REFERRAL
// ───────────────────────────────────────────
function Referral() {
  return (
    <section className="max-w-5xl mx-auto px-6 py-20 text-center">
      <SectionLabel>친구 초대</SectionLabel>
      <SectionTitle>
        3명만 초대하면
        <br />
        1개월 무료예요
      </SectionTitle>
      <p className="text-base text-gray-500 mb-12">
        초대한 사람도, 초대받은 사람도 둘 다 혜택이 있어요.
      </p>
      <div className="flex flex-wrap justify-center gap-4 mb-10">
        <div className="bg-white border-[1.5px] border-[#7F77DD] rounded-3xl p-7 w-64 text-center">
          <div className="text-4xl mb-3">👆</div>
          <div className="text-sm font-bold text-[#3C3489] mb-2">초대한 나</div>
          <div className="text-xs text-gray-500 leading-relaxed mb-3">
            친구 3명이 가입하면
            <br />
            구독 1개월 무료!
          </div>
          <div className="bg-[#EEEDFE] text-[#534AB7] rounded-xl px-3 py-2.5 text-xs font-medium leading-relaxed">
            3명 → +1개월 무료
            <br />
            6명 → +2개월 무료
            <br />
            계속 쌓여요 ♾️
          </div>
        </div>
        <div className="hidden sm:flex items-center text-2xl text-gray-400">
          +
        </div>
        <div className="bg-white border-[1.5px] border-[#1D9E75] rounded-3xl p-7 w-64 text-center">
          <div className="text-4xl mb-3">🎁</div>
          <div className="text-sm font-bold text-[#085041] mb-2">초대받은 친구</div>
          <div className="text-xs text-gray-500 leading-relaxed mb-3">
            초대 링크로 가입하면
            <br />첫 달 50% 할인!
          </div>
          <div className="bg-[#E1F5EE] text-[#085041] rounded-xl px-3 py-2.5 text-xs font-medium">
            첫 달 4,900원 →
            <br />
            <span className="text-base font-bold">2,450원</span>
          </div>
        </div>
      </div>
    </section>
  );
}

// ───────────────────────────────────────────
// FINAL CTA
// ───────────────────────────────────────────
function FinalCta({
  onStart,
  busy,
  hasProfile,
}: {
  onStart: () => void;
  busy: boolean;
  hasProfile: boolean;
}) {
  return (
    <div className="px-6 pb-20">
      <div
        className="relative max-w-5xl mx-auto rounded-3xl text-center px-10 py-20 overflow-hidden"
        style={{ background: PURPLE }}
      >
        <div
          className="absolute -top-24 -right-24 w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{ background: "rgba(255,255,255,0.05)" }}
        />
        <h2 className="font-display font-bold text-white text-3xl sm:text-4xl mb-4 leading-tight">
          엄마한테 지금
          <br />
          보내드리세요 💜
        </h2>
        <p className="text-white/75 text-base mb-8 leading-relaxed">
          어려운 주식, 이제 아들딸이 설명해드려요.
          <br />
          엄마도 할 수 있어요.
        </p>
        <button
          onClick={onStart}
          disabled={busy}
          className="inline-flex items-center gap-2 rounded-2xl bg-[#FEE500] text-[#3A1D00] font-bold px-8 py-4 hover:-translate-y-0.5 transition disabled:opacity-50"
        >
          {hasProfile ? (
            <>내 피드로 가기 →</>
          ) : (
            <>
              <KakaoIcon size={20} />
              {busy ? "이동 중..." : "카카오로 시작하기"}
            </>
          )}
        </button>
      </div>
    </div>
  );
}

// ───────────────────────────────────────────
// FOOTER
// ───────────────────────────────────────────
function Footer() {
  return (
    <footer className="text-center py-8 px-6 border-t border-stone-200 text-sm text-gray-500">
      <div className="font-display font-bold text-[#534AB7] text-base mb-2">
        엄니머니
      </div>
      <p>© 2026 엄니머니. 엄마의 첫 번째 머니 앱.</p>
    </footer>
  );
}

// ───────────────────────────────────────────
// shared bits
// ───────────────────────────────────────────
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-xs sm:text-sm font-medium tracking-widest text-[#534AB7] uppercase mb-3">
      {children}
    </div>
  );
}
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="font-display font-bold leading-tight tracking-tight mb-4"
      style={{ fontSize: "clamp(26px, 5vw, 40px)" }}
    >
      {children}
    </h2>
  );
}
function Divider() {
  return <div className="h-px bg-stone-200 mx-6" />;
}
function KakaoIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 3C7.029 3 3 6.358 3 10.5c0 2.636 1.647 4.953 4.148 6.32L6.1 20.5l4.233-2.79c.54.074 1.09.11 1.667.11 4.971 0 9-3.358 9-7.5S16.971 3 12 3z"
        fill="#3A1D00"
      />
    </svg>
  );
}
