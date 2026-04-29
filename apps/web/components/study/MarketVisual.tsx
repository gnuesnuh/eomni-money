export function MarketVisual() {
  return (
    <div className="rounded-xl bg-stone-100 p-3.5 mb-3">
      <div className="grid grid-cols-2 gap-2 mb-2.5">
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-3 text-center">
          <div className="text-xl mb-0.5">🛒</div>
          <div className="text-sm font-semibold">사려는 사람 많음</div>
          <div className="text-[11px] text-gray-500 mt-0.5">수요 증가</div>
        </div>
        <div className="rounded-xl bg-red-50 border border-red-200 px-3 py-3 text-center">
          <div className="text-xl mb-0.5">🏃</div>
          <div className="text-sm font-semibold">팔려는 사람 많음</div>
          <div className="text-[11px] text-gray-500 mt-0.5">공급 증가</div>
        </div>
      </div>
      <p className="text-center text-[12px] text-purple-700 font-medium leading-relaxed">
        사는 사람 많음 → 가격 올라
        <span className="mx-1.5 text-gray-300">|</span>
        파는 사람 많음 → 가격 내려
      </p>
    </div>
  );
}
