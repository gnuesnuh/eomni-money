"use client";

import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Tab = {
  label: string;
  href: string;
  match: (pathname: string) => boolean;
  // Solar Linear → Bold. 색 없이 형태(채움)로만 활성 표현 (디자인 룰).
  iconInactive: string;
  iconActive: string;
};

const TABS: Tab[] = [
  {
    label: "뉴스",
    href: "/feed",
    match: (p) =>
      p === "/" || p.startsWith("/feed") || p.startsWith("/preview/news-card"),
    iconInactive: "solar:chat-line-linear",
    iconActive: "solar:chat-line-bold",
  },
  {
    label: "마이",
    href: "/me",
    match: (p) => p.startsWith("/me"),
    iconInactive: "solar:user-circle-linear",
    iconActive: "solar:user-circle-bold",
  },
];

const COLOR = "#111111";

export function BottomNav() {
  const pathname = usePathname() ?? "";

  return (
    <motion.nav
      initial={{ y: 0, opacity: 1 }}
      exit={{ y: 24, opacity: 0 }}
      transition={{ duration: 0.18 }}
      className="fixed inset-x-0 bottom-0 z-30 mx-auto max-w-md border-t border-stone-200/70 bg-white"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="flex">
        {TABS.map(({ label, href, match, iconInactive, iconActive }) => {
          const active = match(pathname);
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className="block"
              >
                <motion.div
                  whileTap={{ scale: 0.92 }}
                  transition={{ duration: 0.1 }}
                  className="flex flex-col items-center gap-1 py-2.5"
                >
                  <Icon
                    icon={active ? iconActive : iconInactive}
                    width={30}
                    height={30}
                    color={COLOR}
                  />
                  <span
                    className={
                      active
                        ? "text-[14px] font-bold leading-none"
                        : "text-[14px] font-normal leading-none"
                    }
                    style={{ color: COLOR }}
                  >
                    {label}
                  </span>
                </motion.div>
              </Link>
            </li>
          );
        })}
      </ul>
    </motion.nav>
  );
}
