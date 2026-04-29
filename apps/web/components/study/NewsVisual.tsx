export function NewsVisual() {
  const items: Array<{ headline: string; up: boolean }> = [
    { headline: "삼성 신제품 글로벌 대박!", up: true },
    { headline: "삼성 공장 화재 발생", up: false },
    { headline: "애플 아이폰 판매 급증", up: true },
  ];
  return (
    <div className="rounded-xl bg-yellow-50 px-3 py-2.5">
      {items.map((it, idx) => (
        <div
          key={idx}
          className={`flex items-center gap-2 py-2 ${
            idx === items.length - 1
              ? ""
              : "border-b border-yellow-300"
          }`}
        >
          <p className="flex-1 text-sm text-gray-900 leading-snug">
            {it.headline}
          </p>
          <span
            className={`text-sm font-semibold whitespace-nowrap ${
              it.up ? "text-emerald-700" : "text-red-600"
            }`}
          >
            {it.up ? "▲ 올라" : "▼ 내려"}
          </span>
        </div>
      ))}
    </div>
  );
}
