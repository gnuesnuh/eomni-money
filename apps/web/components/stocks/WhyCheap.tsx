"use client";

interface WhyCheapProps {
  ticker: string;
  changePct: number;
}

export function WhyCheap({ ticker, changePct }: WhyCheapProps) {
  const isDown = changePct < 0;
  const label = isDown ? "왜 싸졌어?" : "왜 비싸졌어?";

  return (
    <div className="flex flex-col gap-2">
      <button
        className="w-full rounded-2xl bg-orange-500 px-4 py-4 text-lg font-bold text-white shadow-md active:scale-[0.98] transition"
        onClick={() => {
          // TODO: GET /stocks/:ticker/explain?direction=down|up
          console.log(`Explain ${ticker} ${isDown ? "down" : "up"}`);
        }}
      >
        {label}
      </button>
      <button
        className="w-full rounded-2xl bg-white border-2 border-gray-200 px-4 py-4 text-lg font-semibold text-gray-700 active:scale-[0.98] transition"
        onClick={() => {
          // TODO: GET /stocks/:ticker/news
          console.log(`Recent news ${ticker}`);
        }}
      >
        요즘 무슨 일?
      </button>
    </div>
  );
}
