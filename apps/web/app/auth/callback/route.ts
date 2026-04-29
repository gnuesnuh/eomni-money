import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";

// OAuth provider (Kakao via Supabase) 에서 redirect 되어 오는 콜백.
// ?code=... 를 세션으로 교환하고 적절한 페이지로 redirect.
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") ?? "/feed";

  if (!code) {
    return NextResponse.redirect(new URL("/?error=missing_code", url));
  }

  try {
    const supabase = getSupabaseServer();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      return NextResponse.redirect(
        new URL(`/?error=${encodeURIComponent(error.message)}`, url),
      );
    }
  } catch (err) {
    return NextResponse.redirect(
      new URL(
        `/?error=${encodeURIComponent((err as Error).message)}`,
        url,
      ),
    );
  }

  // 프로필이 localStorage 에만 있어 서버는 알 수 없음 → 클라이언트에서
  // 프로필 존재 여부에 따라 onboarding/feed 로 분기. 지금은 next 로 보냄.
  return NextResponse.redirect(new URL(next, url));
}
