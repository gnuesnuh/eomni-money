"use client";

import { useState } from "react";
import type { ExplainMoreMode } from "@eomni/shared";

interface ExplainMoreProps {
  newsId: string;
  onAsk?: (mode: ExplainMoreMode) => void;
}

export function ExplainMore({ newsId, onAsk }: ExplainMoreProps) {
  const [active, setActive] = useState<ExplainMoreMode | null>(null);

  function ask(mode: ExplainMoreMode) {
    setActive(mode);
    onAsk?.(mode);
    // TODO: API 호출 — POST /news/:id/explain  body: { mode }
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={() => ask("simpler")}
        className={`flex-1 rounded-xl px-4 py-3 text-base font-semibold border-2 transition active:scale-[0.98] ${
          active === "simpler"
            ? "bg-orange-50 border-orange-300 text-orange-700"
            : "bg-white border-gray-200 text-gray-700"
        }`}
        aria-label="더 쉽게 설명해줘"
      >
        😅 어려워요
      </button>
      <button
        onClick={() => ask("deeper")}
        className={`flex-1 rounded-xl px-4 py-3 text-base font-semibold border-2 transition active:scale-[0.98] ${
          active === "deeper"
            ? "bg-blue-50 border-blue-300 text-blue-700"
            : "bg-white border-gray-200 text-gray-700"
        }`}
        aria-label="더 자세히 설명해줘"
      >
        🤔 더 알고싶어
      </button>
    </div>
  );
}
