"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { label: "전체", href: "/feed", match: (p: string) => p === "/feed" },
  {
    label: "찜한 회사",
    href: "/watchlist",
    match: (p: string) => p.startsWith("/watchlist") || p.startsWith("/stocks"),
  },
  { label: "공부방", href: "/study", match: (p: string) => p.startsWith("/study") },
];

export function TabBar() {
  const pathname = usePathname();
  return (
    <nav className="flex border-b border-gray-100 bg-white sticky top-[57px] z-10">
      {TABS.map((t) => {
        const active = t.match(pathname ?? "");
        return (
          <Link
            key={t.href}
            href={t.href}
            className={`flex-1 text-center text-sm py-3 ${
              active
                ? "text-orange-600 font-semibold border-b-2 border-orange-500"
                : "text-gray-500 border-b-2 border-transparent"
            }`}
          >
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}
