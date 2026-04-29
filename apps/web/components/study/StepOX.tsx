"use client";

import { useState } from "react";
import type { LessonStep } from "@/lib/lessons";
import { QuizFeedback } from "./QuizFeedback";

interface Props {
  step: Extract<LessonStep, { type: "ox" }>;
  family: { ok: string; ng: string };
  onAnswer: (ok: boolean) => void;
  onNext: () => void;
}

export function StepOX({ step, family, onAnswer, onNext }: Props) {
  const [picked, setPicked] = useState<"O" | "X" | null>(null);
  const ok = picked === step.answer;

  function pick(v: "O" | "X") {
    if (picked) return;
    setPicked(v);
    onAnswer(v === step.answer);
  }

  return (
    <div className="px-4 py-4">
      <div className="text-[11px] tracking-wider text-gray-500 font-medium mb-2">
        퀴즈 · OX
      </div>
      <div className="bg-white border border-gray-200 rounded-xl px-4 py-3.5 mb-3">
        <p className="text-base font-medium leading-relaxed whitespace-pre-line mb-3">
          {step.q}
        </p>
        <div className="flex gap-2">
          {(["O", "X"] as const).map((v) => {
            const isPick = picked === v;
            const isCorrect = isPick && v === step.answer;
            const isWrong = isPick && v !== step.answer;
            return (
              <button
                key={v}
                onClick={() => pick(v)}
                disabled={!!picked}
                className={`flex-1 rounded-xl border-[1.5px] py-4 text-2xl font-semibold transition ${
                  isCorrect
                    ? "bg-emerald-50 border-emerald-500 text-emerald-700"
                    : isWrong
                      ? "bg-red-50 border-red-500 text-red-700"
                      : "bg-white border-gray-200 hover:border-purple-300"
                }`}
              >
                {v}
              </button>
            );
          })}
        </div>
      </div>

      {picked && (
        <QuizFeedback
          ok={ok}
          family={ok ? family.ok : family.ng}
          body={ok ? step.okBody : step.ngBody}
          onNext={onNext}
        />
      )}
    </div>
  );
}
