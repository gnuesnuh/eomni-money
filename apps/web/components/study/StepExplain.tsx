import type { LessonStep } from "@/lib/lessons";
import { PizzaVisual } from "./PizzaVisual";
import { MarketVisual } from "./MarketVisual";
import { NewsVisual } from "./NewsVisual";
import { CoronaVisual } from "./CoronaVisual";

interface Props {
  step: Extract<LessonStep, { type: "explain" }>;
  onNext: () => void;
}

export function StepExplain({ step, onNext }: Props) {
  return (
    <div className="px-4 py-4">
      <div className="text-[11px] tracking-wider text-gray-500 font-medium mb-2">
        개념 설명
      </div>
      <div className="bg-stone-100 rounded-[4px_16px_16px_16px] px-4 py-3 mb-3">
        <div className="text-base font-semibold mb-1">{step.hi}</div>
        <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-line">
          {step.text}
        </p>
      </div>
      {step.visual === "pizza" && (
        <div className="mb-3">
          <PizzaVisual />
        </div>
      )}
      {step.visual === "market" && <MarketVisual />}
      {step.visual === "news" && (
        <div className="mb-3">
          <NewsVisual />
        </div>
      )}
      {step.visual === "corona" && <CoronaVisual />}

      <div className="bg-purple-50 border border-purple-200 rounded-xl px-4 py-3 mb-4">
        <div className="text-sm font-semibold text-purple-800 mb-0.5">
          잘 하고 있어!
        </div>
        <p className="text-sm text-purple-800 leading-relaxed whitespace-pre-line">
          {step.praise}
        </p>
      </div>
      <button
        onClick={onNext}
        className="w-full rounded-xl bg-purple-700 text-white py-3.5 text-sm font-semibold"
      >
        이해했어! 다음으로 →
      </button>
    </div>
  );
}
