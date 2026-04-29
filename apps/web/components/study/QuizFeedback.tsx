interface Props {
  ok: boolean;
  /** 화자별 짧은 가족 멘트 (예: "엄마 아직 기억력 살아있네 ㅎㅎ") */
  family: string;
  /** 정답 설명 본문 */
  body: string;
  onNext: () => void;
}

export function QuizFeedback({ ok, family, body, onNext }: Props) {
  return (
    <div className="px-4 pb-4">
      <div
        className={`rounded-xl px-4 py-3 mb-3 leading-relaxed text-sm whitespace-pre-line ${
          ok
            ? "bg-emerald-50 border border-emerald-300 text-emerald-900"
            : "bg-red-50 border border-red-300 text-red-900"
        }`}
      >
        <div className="text-base font-semibold mb-1">
          {ok ? "정답! +10점!" : "아쉽~!"}
        </div>
        <div className="font-medium mb-1.5">{family}</div>
        <div className="text-[13px]">{body}</div>
      </div>
      <button
        onClick={onNext}
        className="w-full rounded-xl bg-purple-700 text-white py-3.5 text-sm font-semibold"
      >
        다음으로 →
      </button>
    </div>
  );
}
