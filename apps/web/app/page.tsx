"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useProfile } from "@/lib/profile";

export default function HomePage() {
  const router = useRouter();
  const { profile, loaded } = useProfile();

  useEffect(() => {
    if (loaded && profile) {
      router.replace("/feed");
    }
  }, [loaded, profile, router]);

  if (!loaded) return null;
  if (profile) return null; // redirect 중

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 py-10 text-center">
      <div className="text-5xl font-bold mb-4">엄니머니</div>
      <p className="text-lg text-gray-600 mb-2">엄마도 쉽게 보는</p>
      <p className="text-lg text-gray-600 mb-10">오늘의 주식 뉴스</p>
      <Link
        href="/onboarding"
        className="block w-full max-w-xs rounded-2xl bg-orange-500 px-6 py-5 text-2xl font-bold text-white shadow-md active:scale-[0.98] transition"
      >
        시작하기
      </Link>
      <p className="mt-10 text-sm text-gray-400">v0.1 · Phase 1 MVP</p>
    </main>
  );
}
