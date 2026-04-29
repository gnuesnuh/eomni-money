interface Props {
  positive: number;
  total: number;
  percent: number;
}

export function MoodBar({ positive, total, percent }: Props) {
  // 색상: 50% 미만 빨강, 50~70% 노랑, 70%+ 초록
  const fillColor =
    percent >= 70 ? "#1D9E75" : percent >= 50 ? "#EF9F27" : "#D85A30";
  return (
    <div className="bg-white rounded-xl px-3 py-2.5">
      <div className="flex justify-between text-[11px] text-gray-500 mb-1.5">
        <span>오늘 뉴스 분위기</span>
        <span>
          {positive}건 / {total}건 긍정
        </span>
      </div>
      <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${Math.min(100, Math.max(0, percent))}%`, background: fillColor }}
        />
      </div>
    </div>
  );
}
