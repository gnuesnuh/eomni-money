// 앱 화면들 (피드/온보딩/종목/공부방/설정/구독) — 모바일 폭으로 wrap
export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="app-shell mx-auto max-w-md min-h-screen bg-white shadow-sm">
      {children}
    </div>
  );
}
