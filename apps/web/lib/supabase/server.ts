import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// 서버 측 Supabase 클라이언트. /auth/callback 등 Route Handler 에서 사용.
export function getSupabaseServer() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY 환경변수가 필요합니다.",
    );
  }
  const cookieStore = cookies();
  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Server Component 에서 setAll 실패 — middleware 가 토큰 갱신해줘야 함
        }
      },
    },
  });
}
