"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useProfile } from "@/lib/profile";
import { isSupabaseConfigured, signInWithKakao } from "@/lib/supabase/client";
import { useLocale, useT, type Messages } from "@/lib/i18n";

const PURPLE = "#534AB7";
const TEAL = "#1D9E75";

export default function LandingPage() {
  const router = useRouter();
  const { profile, loaded } = useProfile();
  const t = useT();
  const [authError, setAuthError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const u = new URL(window.location.href);
    const e = u.searchParams.get("error");
    if (e) setAuthError(decodeURIComponent(e));
  }, []);

  async function handleStart() {
    if (profile) {
      router.push("/feed");
      return;
    }
    setBusy(true);
    setAuthError(null);
    try {
      if (!isSupabaseConfigured()) {
        router.push("/onboarding");
        return;
      }
      await signInWithKakao("/onboarding");
    } catch (err) {
      setAuthError((err as Error).message);
      setBusy(false);
    }
  }

  const hasProfile = loaded && !!profile;

  return (
    <div className="min-h-screen bg-stone-50 text-gray-900">
      <NavBar onStart={handleStart} busy={busy} hasProfile={hasProfile} t={t} />

      {authError && (
        <div className="mx-4 mt-20 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {t.authError}: {authError}
        </div>
      )}

      <Hero onStart={handleStart} busy={busy} hasProfile={hasProfile} t={t} />
      <Divider />
      <HowItWorks t={t} />
      <Divider />
      <Speakers t={t} />
      <Divider />
      <Features t={t} />
      <Divider />
      <Pricing onStart={handleStart} t={t} />
      <Referral t={t} />
      <Divider />
      <FinalCta onStart={handleStart} busy={busy} hasProfile={hasProfile} t={t} />
      <Footer t={t} />
    </div>
  );
}

// ───────────────────────────────────────────
// NAV
// ───────────────────────────────────────────
function NavBar({
  onStart,
  busy,
  hasProfile,
  t,
}: {
  onStart: () => void;
  busy: boolean;
  hasProfile: boolean;
  t: Messages;
}) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 bg-stone-50/90 backdrop-blur border-b border-stone-200 gap-2">
      <div className="font-display text-xl font-bold tracking-tight whitespace-nowrap">
        <span style={{ color: PURPLE }}>{t.brand.name1}</span>
        <span style={{ color: "#EF9F27" }}>{t.brand.name2}</span>
      </div>
      <div className="flex items-center gap-2">
        <LangSwitch />
        <button
          onClick={onStart}
          disabled={busy}
          className="rounded-full bg-[#534AB7] hover:bg-[#3C3489] text-white text-xs sm:text-sm font-medium px-4 py-2.5 transition disabled:opacity-50 whitespace-nowrap"
        >
          {busy ? "..." : hasProfile ? t.nav.ctaForLogged : t.nav.cta}
        </button>
      </div>
    </nav>
  );
}

function LangSwitch() {
  const { locale, setLocale } = useLocale();
  return (
    <div className="flex items-center bg-white border border-stone-200 rounded-full overflow-hidden text-xs">
      <button
        onClick={() => setLocale("ko")}
        className={`px-2.5 py-1.5 transition ${
          locale === "ko"
            ? "bg-[#534AB7] text-white font-semibold"
            : "text-gray-500 hover:text-gray-900"
        }`}
        aria-label="한국어"
      >
        KO
      </button>
      <button
        onClick={() => setLocale("ja")}
        className={`px-2.5 py-1.5 transition ${
          locale === "ja"
            ? "bg-[#534AB7] text-white font-semibold"
            : "text-gray-500 hover:text-gray-900"
        }`}
        aria-label="日本語"
      >
        JA
      </button>
    </div>
  );
}

// ───────────────────────────────────────────
// HERO
// ───────────────────────────────────────────
function Hero({
  onStart,
  busy,
  hasProfile,
  t,
}: {
  onStart: () => void;
  busy: boolean;
  hasProfile: boolean;
  t: Messages;
}) {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-28 pb-16 text-center overflow-hidden">
      <div className="absolute -top-24 -right-24 w-[500px] h-[500px] rounded-full bg-[#534AB7]/10 pointer-events-none" />
      <div className="absolute bottom-0 -left-16 w-[300px] h-[300px] rounded-full bg-[#1D9E75]/10 pointer-events-none" />
      <div className="absolute top-1/3 left-[10%] w-[200px] h-[200px] rounded-full bg-[#EF9F27]/10 pointer-events-none" />

      <div className="relative max-w-2xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#AFA9EC] bg-[#EEEDFE] text-[#534AB7] text-sm font-medium px-4 py-1.5 mb-6">
          {t.hero.badge}
        </div>

        <h1
          className="font-display font-bold leading-tight tracking-tight mb-5"
          style={{ fontSize: "clamp(36px, 8vw, 64px)" }}
        >
          {t.hero.titleLine1}
          <br />
          <span style={{ color: PURPLE }}>{t.hero.titleLine2a}</span>
          {t.hero.titleLine2b}
          <br />
          <span style={{ color: TEAL }}>{t.hero.titleLine3}</span>
        </h1>

        <p className="text-base sm:text-lg text-gray-500 leading-relaxed max-w-md mx-auto mb-9 whitespace-pre-line">
          {t.hero.sub}
        </p>

        <div className="flex flex-wrap justify-center gap-3 mb-14">
          <button
            onClick={onStart}
            disabled={busy}
            className="inline-flex items-center gap-2 rounded-2xl bg-[#FEE500] text-[#3A1D00] font-bold px-7 py-3.5 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-yellow-200 disabled:opacity-50"
          >
            {hasProfile ? (
              <>{t.nav.ctaForLogged}</>
            ) : (
              <>
                <KakaoIcon />
                {t.hero.primaryCta}
              </>
            )}
          </button>
          <a
            href="#how"
            className="rounded-2xl border-[1.5px] border-[#7F77DD] text-[#534AB7] font-medium px-7 py-3.5 hover:bg-[#EEEDFE] transition"
          >
            {t.hero.secondaryCta}
          </a>
        </div>

        <PhoneMockup t={t} />
      </div>
    </section>
  );
}

function PhoneMockup({ t }: { t: Messages }) {
  return (
    <div className="mx-auto w-[280px] bg-white rounded-[36px] border-[6px] border-gray-900 overflow-hidden shadow-2xl">
      <div className="w-20 h-5 bg-gray-900 rounded-b-xl mx-auto" />
      <div className="p-3">
        <div className="flex items-center justify-between mb-3">
          <span className="font-display text-base font-bold">
            {t.brand.tagline.length > 14 ? t.brand.name1 + t.brand.name2 : t.brand.tagline}
          </span>
          <span className="text-[10px] rounded-full bg-[#EEEDFE] text-[#534AB7] font-medium px-2 py-0.5">
            👦 {t.speakers.cards[0]?.name}
          </span>
        </div>
        <MockNewsCard
          src="Reuters"
          time={t.speakers.cards[0]?.name === "息子" ? "1時間前" : "1시간 전"}
          title={
            t.speakers.cards[0]?.name === "息子"
              ? "Fed、政策金利を据え置きと決定"
              : "Fed, 기준금리 동결 결정"
          }
          who={t.speakers.cards[0]?.sample.slice(1, 30) ?? ""}
          bubble={t.speakers.cards[0]?.sample.replace(/^"|"$/g, "") ?? ""}
          tone="purple"
          tickers={[
            { tk: "AAPL", p: "+1.2%", up: true },
            { tk: "NVDA", p: "+2.4%", up: true },
          ]}
          name={t.speakers.cards[0]?.name ?? ""}
        />
      </div>
    </div>
  );
}

function MockNewsCard({
  src,
  time,
  title,
  bubble,
  tone,
  tickers,
  name,
}: {
  src: string;
  time: string;
  title: string;
  who?: string;
  bubble: string;
  tone: "purple" | "amber";
  tickers: Array<{ tk: string; p: string; up: boolean }>;
  name: string;
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
        <div className={`text-[10px] font-bold mb-0.5 ${whoColor}`}>👦 {name}</div>
        <div className="text-[11px] leading-relaxed text-gray-700">{bubble}</div>
      </div>
      <div className="flex gap-1.5 px-3 py-1.5">
        {tickers.map((t) => (
          <span
            key={t.tk}
            className="text-[10px] rounded-full border border-stone-200 bg-stone-100 px-2 py-0.5"
          >
            {t.tk}{" "}
            <span className={t.up ? "text-[#1D9E75]" : "text-[#D85A30]"}>
              {t.p}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

// ───────────────────────────────────────────
function HowItWorks({ t }: { t: Messages }) {
  return (
    <section id="how" className="px-6 py-20">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl px-8 sm:px-10 py-14">
        <div className="text-center mb-12">
          <SectionLabel>{t.how.label}</SectionLabel>
          <SectionTitle>{t.how.title}</SectionTitle>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {t.how.steps.map((s, i) => (
            <div key={i} className="text-center">
              <div className="w-12 h-12 rounded-2xl bg-[#EEEDFE] text-[#534AB7] font-display text-xl font-bold flex items-center justify-center mx-auto mb-4">
                {i + 1}
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

function Speakers({ t }: { t: Messages }) {
  return (
    <section className="max-w-5xl mx-auto px-6 py-20">
      <SectionLabel>{t.speakers.label}</SectionLabel>
      <SectionTitle>
        {t.speakers.title.split("\n").map((line, i) => (
          <span key={i}>
            {line}
            {i < t.speakers.title.split("\n").length - 1 && <br />}
          </span>
        ))}
      </SectionTitle>
      <p className="text-base text-gray-500 max-w-xl mb-10">{t.speakers.sub}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {t.speakers.cards.map((s) => (
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

function Features({ t }: { t: Messages }) {
  const tones = ["#534AB7", "#1D9E75", "#EF9F27", "#D85A30"];
  return (
    <section className="max-w-5xl mx-auto px-6 py-20">
      <SectionLabel>{t.features.label}</SectionLabel>
      <SectionTitle>
        {t.features.title.split("\n").map((line, i) => (
          <span key={i}>
            {line}
            {i < t.features.title.split("\n").length - 1 && <br />}
          </span>
        ))}
      </SectionTitle>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-10">
        {t.features.items.map((it, i) => (
          <div
            key={it.title}
            className="relative bg-white border border-stone-200 rounded-3xl p-7 overflow-hidden"
          >
            <div
              className="absolute top-0 left-0 right-0 h-1"
              style={{ background: tones[i % tones.length] }}
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

function Pricing({
  onStart,
  t,
}: {
  onStart: () => void;
  t: Messages;
}) {
  return (
    <section className="max-w-5xl mx-auto px-6 py-20 text-center">
      <SectionLabel>{t.pricing.label}</SectionLabel>
      <SectionTitle>{t.pricing.title}</SectionTitle>
      <p className="text-base text-gray-500 mb-6">{t.pricing.sub}</p>
      <div className="inline-flex items-center gap-2 rounded-full border border-[#FAC775] bg-[#FFF8EC] text-[#633806] text-sm font-medium px-5 py-2 mb-10">
        {t.pricing.earlyBirdNote}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
        <PricingCard
          name={t.pricing.free.name}
          price={t.pricing.free.price}
          unit={t.pricing.free.unit}
          desc={t.pricing.free.desc}
          perks={t.pricing.free.perks}
          ctaLabel={t.pricing.free.cta}
          ctaStyle="outline"
          onCtaClick={onStart}
        />
        <PricingCard
          name={t.pricing.monthly.name}
          price={t.pricing.monthly.price}
          unit={t.pricing.monthly.unit}
          desc={t.pricing.monthly.desc}
          perks={t.pricing.monthly.perks}
          featured
          featuredBadge={t.pricing.monthly.badge}
          ctaLabel={t.pricing.monthly.cta}
          ctaStyle="filled"
          onCtaClick={onStart}
        />
        <PricingCard
          name={t.pricing.lifetime.name}
          price={t.pricing.lifetime.price}
          unit={t.pricing.lifetime.unit}
          originalPrice={t.pricing.lifetime.originalPrice}
          desc={t.pricing.lifetime.desc}
          perks={t.pricing.lifetime.perks}
          earlyBird
          earlyBirdBadge={t.pricing.lifetime.badge}
          ctaLabel={t.pricing.lifetime.cta}
          ctaStyle="amber"
          ctaSubtext={t.pricing.lifetime.ctaSub}
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
  featuredBadge,
  earlyBird,
  earlyBirdBadge,
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
  featuredBadge?: string;
  earlyBird?: boolean;
  earlyBirdBadge?: string;
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
      {featured && featuredBadge && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#534AB7] text-white text-xs font-medium px-4 py-1 whitespace-nowrap">
          {featuredBadge}
        </span>
      )}
      {earlyBird && earlyBirdBadge && (
        <span
          className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full text-white text-xs font-medium px-4 py-1 whitespace-nowrap"
          style={{ background: "linear-gradient(135deg, #EF9F27, #D85A30)" }}
        >
          {earlyBirdBadge}
        </span>
      )}
      <div className="text-sm text-gray-500 mb-1">{name}</div>
      <div
        className="font-display text-4xl font-bold mb-1"
        style={earlyBird ? { color: "#854F0B" } : undefined}
      >
        {price}
        <span className="text-base font-normal text-gray-500">{unit}</span>
      </div>
      {originalPrice && (
        <div className="text-xs text-gray-400 line-through mb-1">
          {originalPrice}
        </div>
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

function Referral({ t }: { t: Messages }) {
  return (
    <section className="max-w-5xl mx-auto px-6 py-20 text-center">
      <SectionLabel>{t.referral.label}</SectionLabel>
      <SectionTitle>
        {t.referral.title.split("\n").map((line, i) => (
          <span key={i}>
            {line}
            {i < t.referral.title.split("\n").length - 1 && <br />}
          </span>
        ))}
      </SectionTitle>
      <p className="text-base text-gray-500 mb-12">{t.referral.sub}</p>
      <div className="flex flex-wrap justify-center gap-4 mb-10">
        <div className="bg-white border-[1.5px] border-[#7F77DD] rounded-3xl p-7 w-64 text-center">
          <div className="text-4xl mb-3">👆</div>
          <div className="text-sm font-bold text-[#3C3489] mb-2">
            {t.referral.inviterTitle}
          </div>
          <div className="text-xs text-gray-500 leading-relaxed mb-3 whitespace-pre-line">
            {t.referral.inviterDesc}
          </div>
          <div className="bg-[#EEEDFE] text-[#534AB7] rounded-xl px-3 py-2.5 text-xs font-medium leading-relaxed whitespace-pre-line">
            {t.referral.inviterReward}
          </div>
        </div>
        <div className="hidden sm:flex items-center text-2xl text-gray-400">
          +
        </div>
        <div className="bg-white border-[1.5px] border-[#1D9E75] rounded-3xl p-7 w-64 text-center">
          <div className="text-4xl mb-3">🎁</div>
          <div className="text-sm font-bold text-[#085041] mb-2">
            {t.referral.inviteeTitle}
          </div>
          <div className="text-xs text-gray-500 leading-relaxed mb-3 whitespace-pre-line">
            {t.referral.inviteeDesc}
          </div>
          <div className="bg-[#E1F5EE] text-[#085041] rounded-xl px-3 py-2.5 text-xs font-medium whitespace-pre-line">
            {t.referral.inviteeReward}
          </div>
        </div>
      </div>
    </section>
  );
}

function FinalCta({
  onStart,
  busy,
  hasProfile,
  t,
}: {
  onStart: () => void;
  busy: boolean;
  hasProfile: boolean;
  t: Messages;
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
        <h2 className="font-display font-bold text-white text-3xl sm:text-4xl mb-4 leading-tight whitespace-pre-line">
          {t.finalCta.title}
        </h2>
        <p className="text-white/75 text-base mb-8 leading-relaxed whitespace-pre-line">
          {t.finalCta.sub}
        </p>
        <button
          onClick={onStart}
          disabled={busy}
          className="inline-flex items-center gap-2 rounded-2xl bg-[#FEE500] text-[#3A1D00] font-bold px-8 py-4 hover:-translate-y-0.5 transition disabled:opacity-50"
        >
          {hasProfile ? (
            <>{t.nav.ctaForLogged}</>
          ) : (
            <>
              <KakaoIcon size={20} />
              {busy ? "..." : t.finalCta.button}
            </>
          )}
        </button>
      </div>
    </div>
  );
}

function Footer({ t }: { t: Messages }) {
  return (
    <footer className="text-center py-8 px-6 border-t border-stone-200 text-sm text-gray-500">
      <div className="font-display font-bold text-[#534AB7] text-base mb-2">
        {t.brand.name1}
        {t.brand.name2}
      </div>
      <p>{t.footer.line}</p>
    </footer>
  );
}

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
