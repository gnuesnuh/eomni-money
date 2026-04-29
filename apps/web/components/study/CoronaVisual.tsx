export function CoronaVisual() {
  return (
    <div className="rounded-xl bg-stone-100 p-3.5 mb-3">
      <div className="grid grid-cols-2 gap-2 mb-2.5">
        <div className="rounded-xl bg-red-50 border border-red-200 px-3 py-3 text-center">
          <div className="text-xl mb-0.5">✈️</div>
          <div className="text-sm font-semibold">여행회사 주식</div>
          <div className="text-[11px] text-red-700 font-semibold mt-0.5">
            반토막 ▼
          </div>
        </div>
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-3 text-center">
          <div className="text-xl mb-0.5">😷</div>
          <div className="text-sm font-semibold">마스크 회사 주식</div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-0.5">
            폭등 ▲
          </div>
        </div>
      </div>
      <p className="text-center text-[12px] text-purple-700 font-medium">
        코로나 뉴스 하나가 주식 시장을 뒤흔든 거야!
      </p>
    </div>
  );
}
