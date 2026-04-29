"use client";

import { useState } from "react";
import type { LessonStep } from "@/lib/lessons";
import { QuizFeedback } from "./QuizFeedback";

interface Props {
  step: Extract<LessonStep, { type: "blank" }>;
  family: { ok: string; ng: string };
  onAnswer: (ok: boolean) => void;
  onNext: () => void;
}

export function StepBlank({ step, family, onAnswer, onNext }: Props) {
  const [picked, setPicked] = useState<number | null>(null);
  const ok = picked === step.answer;

  function pick(idx: number) {
    if (picked !== null) return;
    setPicked(idx);
    onAnswer(idx === step.answer);
  }

  return (
    <div className="px-4 py-4">
      <div className="text-[11px] tracking-wider text-gray-500 font-medium mb-2">
        퀴즈 · 빈칸 채우기
      </div>
      <div className="bg-white border border-gray-200 rounded-xl px-4 py-3.5 mb-3">
        <p className="text-base font-medium leading-relaxed mb-4">
          {step.pre}{" "}
          <span className="inline-block bg-purple-100 text-purple-700 rounded px-3 py-0.5 mx-0.5">
            ___
          </span>{" "}
          {step.post}
        </p>
        <div className="grid grid-cols-2 gap-2">
          {step.opts.map((opt, idx) => {
            const isPick = picked === idx;
            const isCorrect = isPick && idx === step.answer;
            const isWrong = isPick && idx !== step.answer;
            return (
              <button
                key={idx}
                onClick={() => pick(idx)}
                disabled={picked !== null}
                className={`rounded-xl border-[1.5px] py-3 text-center text-sm font-medium transition ${
                  isCorrect
                    ? "bg-emerald-50 border-emerald-500 text-emerald-800"
                    : isWrong
                      ? "bg-red-50 border-red-500 text-red-800"
                      : "bg-white border-gray-200 hover:border-purple-300"
                }`}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </div>

      {picked !== null && (
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
