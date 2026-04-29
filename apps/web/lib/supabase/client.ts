"use client";

import { createBrowserClient } from "@supabase/ssr";

// 브라우저 측 Supabase 클라이언트.
// .env.local 에 NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY 필요.
// 미설정 시 isSupabaseConfigured() 가 false → UI 에서 안내.

export function isSupabaseConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

let cached: ReturnType<typeof createBrowserClient> | null = null;

export function getSupabase() {
  if (cached) return cached;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error(
      "Supabase 환경변수가 없습니다. .env.local 에 NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY 추가 필요.",
    );
  }
  cached = createBrowserClient(url, key);
  return cached;
}

export async function signInWithKakao(redirectTo?: string) {
  const supabase = getSupabase();
  const callbackUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/auth/callback${redirectTo ? `?next=${encodeURIComponent(redirectTo)}` : ""}`
      : undefined;
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "kakao",
    options: {
      redirectTo: callbackUrl,
    },
  });
  if (error) throw error;
}

export async function signOut() {
  const supabase = getSupabase();
  await supabase.auth.signOut();
}
