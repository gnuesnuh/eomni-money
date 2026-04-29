export function PizzaVisual() {
  return (
    <div className="rounded-xl bg-yellow-50 px-3 py-3 text-center">
      <div className="flex justify-center gap-1.5 mb-1.5">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center text-lg ${
              i === 2 ? "ring-2 ring-purple-700" : ""
            }`}
          >
            🍕
          </div>
        ))}
      </div>
      <p className="text-xs text-amber-800 leading-relaxed">
        파란 테두리 조각 = 내가 산 주식 1조각
      </p>
    </div>
  );
}
