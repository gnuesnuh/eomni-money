"use client";

import { Icon } from "@iconify/react";

/**
 * 하단바 아이콘 라이브러리 비교 시안.
 *
 * 디자인 룰 (사용자 정의):
 * - 비활성: 블랙으로 잘 보이게 유지
 * - 활성: 아이콘 톤에 따라 다르게
 *   · 두꺼운 라인 + 채움 톤(App Store 스타일) → 색으로 표현
 *   · 라인만 있는 톤 → 색 없이 채우기로만 활성 표현
 */

type IconPair = { inactive: string; active: string };

type Variant = {
  id: string;
  title: string;
  desc: string;
  rule: "shape" | "color" | "stroke"; // shape = 형태만, color = 컬러로, stroke = stroke 변화
  // stroke 룰 전용 — outline only 라이브러리에서 active일 때 두께 변경
  inactiveStrokeWidth?: number;
  activeStrokeWidth?: number;
  icons: {
    news: IconPair;
    me: IconPair;
  };
  // 확장 아이콘 톤 — 라이브러리 일관성 비교용 (inactive만 표시)
  extras: {
    stocks: IconPair;
    bell: IconPair;
    settings: IconPair;
    cart: IconPair;
    study: IconPair;
    share: IconPair;
    bookmark: IconPair;
  };
};

const EXTRA_LABELS: Array<{ key: keyof Variant["extras"]; label: string }> = [
  { key: "stocks", label: "주식" },
  { key: "bell", label: "알림" },
  { key: "settings", label: "설정" },
  { key: "cart", label: "장바구니" },
  { key: "study", label: "공부방" },
  { key: "share", label: "공유" },
  { key: "bookmark", label: "즐겨찾기" },
];

const ACTIVE_COLOR = "#7B2FBE";
const INACTIVE_COLOR = "#111111";

const VARIANTS: Variant[] = [
  {
    id: "phosphor-line",
    title: "A. Phosphor — Regular → Fill",
    desc: "얇은 라인 → 채움 (색 없이 형태만)",
    rule: "shape",
    icons: {
      news: { inactive: "ph:newspaper", active: "ph:newspaper-fill" },
      me: { inactive: "ph:user", active: "ph:user-fill" },
    },
    extras: {
      stocks: { inactive: "ph:chart-line-up", active: "ph:chart-line-up-fill" },
      bell: { inactive: "ph:bell", active: "ph:bell-fill" },
      settings: { inactive: "ph:gear", active: "ph:gear-fill" },
      cart: { inactive: "ph:shopping-cart", active: "ph:shopping-cart-fill" },
      study: { inactive: "ph:book-open", active: "ph:book-open-fill" },
      share: { inactive: "ph:share-network", active: "ph:share-network-fill" },
      bookmark: { inactive: "ph:bookmark", active: "ph:bookmark-fill" },
    },
  },
  {
    id: "phosphor-bold",
    title: "B. Phosphor — Bold + Fill",
    desc: "두꺼운 라인 → 채움 + 컬러",
    rule: "color",
    icons: {
      news: { inactive: "ph:newspaper-bold", active: "ph:newspaper-fill" },
      me: { inactive: "ph:user-bold", active: "ph:user-fill" },
    },
    extras: {
      stocks: {
        inactive: "ph:chart-line-up-bold",
        active: "ph:chart-line-up-fill",
      },
      bell: { inactive: "ph:bell-bold", active: "ph:bell-fill" },
      settings: { inactive: "ph:gear-bold", active: "ph:gear-fill" },
      cart: {
        inactive: "ph:shopping-cart-bold",
        active: "ph:shopping-cart-fill",
      },
      study: { inactive: "ph:book-open-bold", active: "ph:book-open-fill" },
      share: {
        inactive: "ph:share-network-bold",
        active: "ph:share-network-fill",
      },
      bookmark: { inactive: "ph:bookmark-bold", active: "ph:bookmark-fill" },
    },
  },
  {
    id: "solar",
    title: "C. Solar — Linear → Bold",
    desc: "얇은 라인 → 두께·채움 (색 없이 형태만)",
    rule: "shape",
    icons: {
      news: {
        inactive: "solar:chat-line-linear",
        active: "solar:chat-line-bold",
      },
      me: {
        inactive: "solar:user-circle-linear",
        active: "solar:user-circle-bold",
      },
    },
    extras: {
      stocks: {
        inactive: "solar:chart-2-linear",
        active: "solar:chart-2-bold",
      },
      bell: { inactive: "solar:bell-linear", active: "solar:bell-bold" },
      settings: {
        inactive: "solar:settings-linear",
        active: "solar:settings-bold",
      },
      cart: { inactive: "solar:cart-3-linear", active: "solar:cart-3-bold" },
      study: { inactive: "solar:book-2-linear", active: "solar:book-2-bold" },
      share: { inactive: "solar:share-linear", active: "solar:share-bold" },
      bookmark: {
        inactive: "solar:bookmark-linear",
        active: "solar:bookmark-bold",
      },
    },
  },
  {
    id: "heroicons",
    title: "D. Heroicons — Outline → Solid",
    desc: "얇은 라인 → 채움 (색 없이 형태만)",
    rule: "shape",
    icons: {
      news: {
        inactive: "heroicons:newspaper",
        active: "heroicons:newspaper-solid",
      },
      me: { inactive: "heroicons:user", active: "heroicons:user-solid" },
    },
    extras: {
      stocks: {
        inactive: "heroicons:chart-bar",
        active: "heroicons:chart-bar-solid",
      },
      bell: { inactive: "heroicons:bell", active: "heroicons:bell-solid" },
      settings: {
        inactive: "heroicons:cog-6-tooth",
        active: "heroicons:cog-6-tooth-solid",
      },
      cart: {
        inactive: "heroicons:shopping-cart",
        active: "heroicons:shopping-cart-solid",
      },
      study: {
        inactive: "heroicons:book-open",
        active: "heroicons:book-open-solid",
      },
      share: { inactive: "heroicons:share", active: "heroicons:share-solid" },
      bookmark: {
        inactive: "heroicons:bookmark",
        active: "heroicons:bookmark-solid",
      },
    },
  },
  {
    id: "lucide",
    title: "E. Lucide — Stroke 1.5 → 2.25 + 컬러",
    desc: "outline 전용 (채움 변종 없음). 두께 + 컬러로 활성",
    rule: "stroke",
    inactiveStrokeWidth: 1.5,
    activeStrokeWidth: 2.25,
    icons: {
      news: { inactive: "lucide:newspaper", active: "lucide:newspaper" },
      me: { inactive: "lucide:user", active: "lucide:user" },
    },
    extras: {
      stocks: {
        inactive: "lucide:trending-up",
        active: "lucide:trending-up",
      },
      bell: { inactive: "lucide:bell", active: "lucide:bell" },
      settings: { inactive: "lucide:settings", active: "lucide:settings" },
      cart: {
        inactive: "lucide:shopping-cart",
        active: "lucide:shopping-cart",
      },
      study: { inactive: "lucide:book-open", active: "lucide:book-open" },
      share: { inactive: "lucide:share-2", active: "lucide:share-2" },
      bookmark: { inactive: "lucide:bookmark", active: "lucide:bookmark" },
    },
  },
  {
    id: "fontawesome",
    title: "F. Font Awesome — Regular → Solid + 컬러",
    desc: "두께 있는 라인 → 채움 + 컬러 (Free에 Regular 제한적)",
    rule: "color",
    icons: {
      news: {
        inactive: "fa6-regular:newspaper",
        active: "fa6-solid:newspaper",
      },
      me: { inactive: "fa6-regular:user", active: "fa6-solid:user" },
    },
    extras: {
      // FA Free: chart-line, gear, cart-shopping, book-open, share는 Solid only
      stocks: {
        inactive: "fa6-solid:chart-line",
        active: "fa6-solid:chart-line",
      },
      bell: { inactive: "fa6-regular:bell", active: "fa6-solid:bell" },
      settings: { inactive: "fa6-solid:gear", active: "fa6-solid:gear" },
      cart: {
        inactive: "fa6-solid:cart-shopping",
        active: "fa6-solid:cart-shopping",
      },
      study: {
        inactive: "fa6-solid:book-open",
        active: "fa6-solid:book-open",
      },
      share: {
        inactive: "fa6-solid:share-nodes",
        active: "fa6-solid:share-nodes",
      },
      bookmark: {
        inactive: "fa6-regular:bookmark",
        active: "fa6-solid:bookmark",
      },
    },
  },
];

export default function BottomNavComparePage() {
  return (
    <div className="min-h-screen bg-stone-50 px-5 py-10">
      <div className="mx-auto max-w-md">
        <header className="mb-8">
          <h1 className="text-xl font-bold text-stone-900">
            하단바 아이콘 비교
          </h1>
          <p className="mt-2 text-sm text-stone-500">
            inactive = 블랙 · active 톤은 라이브러리에 따라 형태 또는 컬러
          </p>
          <p className="mt-1 text-[11px] text-stone-400">
            각 카드 좌측 = 뉴스 active · 우측 = 마이 active
          </p>
        </header>

        <div className="flex flex-col gap-6">
          {VARIANTS.map((v) => (
            <VariantCard key={v.id} variant={v} />
          ))}
        </div>

        <p className="mt-10 text-center text-[11px] text-stone-400">
          📝 /preview/bottom-nav · 결정 후 단일 라이브러리만 남기고 정리
        </p>
      </div>
    </div>
  );
}

function VariantCard({ variant }: { variant: Variant }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
      <div className="flex items-baseline justify-between px-4 pt-4">
        <div>
          <div className="text-[13px] font-semibold text-stone-900">
            {variant.title}
          </div>
          <div className="mt-0.5 text-[11px] text-stone-500">
            {variant.desc}
          </div>
        </div>
        <span
          className={
            variant.rule === "color" || variant.rule === "stroke"
              ? "rounded-full bg-purple-100 px-2 py-0.5 text-[10px] font-bold text-purple-700"
              : "rounded-full bg-stone-100 px-2 py-0.5 text-[10px] font-bold text-stone-600"
          }
        >
          {variant.rule === "color"
            ? "컬러"
            : variant.rule === "stroke"
              ? "두께+컬러"
              : "형태만"}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 divide-x divide-stone-100 border-t border-stone-100">
        <MiniNav variant={variant} activeKey="news" />
        <MiniNav variant={variant} activeKey="me" />
      </div>

      <ExtrasRow variant={variant} />
    </div>
  );
}

/** 확장 아이콘 톤 비교 — 라이브러리 일관성용. inactive 한 줄 + active 한 줄. */
function ExtrasRow({ variant }: { variant: Variant }) {
  return (
    <div className="border-t border-stone-100 px-2 py-3">
      <div className="px-2 pb-2 text-[10px] font-bold uppercase tracking-wider text-stone-400">
        확장 아이콘 톤
      </div>
      <div className="grid grid-cols-7 gap-x-1">
        {EXTRA_LABELS.map(({ key, label }) => {
          const pair = variant.extras[key];
          return (
            <div key={key} className="flex flex-col items-center gap-1.5 py-1">
              <ExtraIcon variant={variant} iconName={pair.inactive} active={false} />
              <ExtraIcon variant={variant} iconName={pair.active} active={true} />
              <span className="mt-0.5 text-[9px] leading-none text-stone-500">
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ExtraIcon({
  variant,
  iconName,
  active,
}: {
  variant: Variant;
  iconName: string;
  active: boolean;
}) {
  const useColor =
    active && (variant.rule === "color" || variant.rule === "stroke");
  const color = useColor ? ACTIVE_COLOR : INACTIVE_COLOR;
  const strokeWidth =
    variant.rule === "stroke"
      ? active
        ? variant.activeStrokeWidth
        : variant.inactiveStrokeWidth
      : undefined;
  return (
    <Icon
      icon={iconName}
      width={20}
      height={20}
      color={color}
      {...(strokeWidth !== undefined ? { strokeWidth } : {})}
    />
  );
}

function MiniNav({
  variant,
  activeKey,
}: {
  variant: Variant;
  activeKey: "news" | "me";
}) {
  const tabs: Array<{ key: "news" | "me"; label: string }> = [
    { key: "news", label: "뉴스" },
    { key: "me", label: "마이" },
  ];

  return (
    <div className="flex bg-white">
      {tabs.map(({ key, label }) => {
        const isActive = key === activeKey;
        const iconName = isActive
          ? variant.icons[key].active
          : variant.icons[key].inactive;
        // color / stroke 룰은 active 시 컬러로 강조. shape 룰은 항상 블랙.
        const useColor =
          isActive &&
          (variant.rule === "color" || variant.rule === "stroke");
        const iconColor = useColor ? ACTIVE_COLOR : INACTIVE_COLOR;
        const labelColor = { color: useColor ? ACTIVE_COLOR : INACTIVE_COLOR };
        const labelWeight = isActive ? "font-bold" : "font-normal";
        // stroke 룰: outline 전용 라이브러리에서 active일 때 stroke 두껍게
        const strokeWidth =
          variant.rule === "stroke"
            ? isActive
              ? variant.activeStrokeWidth
              : variant.inactiveStrokeWidth
            : undefined;

        return (
          <div
            key={key}
            className="flex flex-1 flex-col items-center gap-1 py-3"
          >
            <Icon
              icon={iconName}
              width={26}
              height={26}
              color={iconColor}
              {...(strokeWidth !== undefined ? { strokeWidth } : {})}
            />
            <span
              className={`text-[12px] leading-none ${labelWeight}`}
              style={labelColor}
            >
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
