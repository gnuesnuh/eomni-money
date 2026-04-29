"use client";

import { useState } from "react";
import type { ExplainMoreMode } from "@eomni/shared";

interface ExplainMoreProps {
  newsId: string;
  activeMode: ExplainMoreMode | null;
  loading: boolean;
  onAsk: (mode: ExplainMoreMode) => void;
  onReset?: () => void;
}

export function ExplainMore({
  newsId: _newsId,
  activeMode,
  loading,
  onAsk,
  onReset,
}: ExplainMoreProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <button
          onClick={() => onAsk("simpler")}
          disabled={loading}
          className={`flex-1 rounded-xl px-4 py-3 text-base font-semibold border-2 transition active:scale-[0.98] disabled:opacity-50 ${
            activeMode === "simpler"
              ? "bg-orange-50 border-orange-300 text-orange-700"
              : "bg-white border-gray-200 text-gray-700"
          }`}
          aria-label="더 쉽게 설명해줘"
        >
          😅 어려워요
        </button>
        <button
          onClick={() => onAsk("deeper")}
          disabled={loading}
          className={`flex-1 rounded-xl px-4 py-3 text-base font-semibold border-2 transition active:scale-[0.98] disabled:opacity-50 ${
            activeMode === "deeper"
              ? "bg-blue-50 border-blue-300 text-blue-700"
              : "bg-white border-gray-200 text-gray-700"
          }`}
          aria-label="더 자세히 설명해줘"
        >
          🤔 더 알고싶어
        </button>
      </div>
      {activeMode && !loading && onReset && (
        <button
          onClick={onReset}
          className="text-xs text-gray-500 underline self-center"
        >
          원래 설명 다시 보기
        </button>
      )}
    </div>
  );
}

interface UseExplainResult {
  bubble: string | null;
  mode: ExplainMoreMode | null;
  loading: boolean;
  error: string | null;
}

export function useExplainState(): {
  state: UseExplainResult;
  ask: (newsId: string, mode: ExplainMoreMode) => Promise<void>;
  reset: () => void;
} {
  const [state, setState] = useState<UseExplainResult>({
    bubble: null,
    mode: null,
    loading: false,
    error: null,
  });

  async function ask(newsId: string, mode: ExplainMoreMode) {
    setState({ bubble: null, mode, loading: true, error: null });
    try {
      const apiBase =
        process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";
      const res = await fetch(`${apiBase}/api/news/${newsId}/explain`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode }),
      });
      const data = await res.json();
      if (!res.ok || !data.bubble) {
        throw new Error(data.message || "설명 생성 실패");
      }
      setState({ bubble: data.bubble, mode, loading: false, error: null });
    } catch (err) {
      setState({
        bubble: null,
        mode,
        loading: false,
        error: (err as Error).message,
      });
    }
  }

  function reset() {
    setState({ bubble: null, mode: null, loading: false, error: null });
  }

  return { state, ask, reset };
}
