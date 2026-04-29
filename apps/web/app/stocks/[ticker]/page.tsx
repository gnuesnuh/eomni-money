interface PageProps {
  params: { ticker: string };
}

export default function StockDetailPage({ params }: PageProps) {
  const ticker = params.ticker.toUpperCase();
  return (
    <main className="px-4 py-6">
      <h1 className="text-2xl font-bold">{ticker}</h1>
      <p className="text-gray-500 mt-1">종목 상세</p>
      <div className="mt-6 rounded-xl border border-dashed border-gray-300 p-6 text-center text-sm text-gray-400">
        TODO: 왜 싸졌어 / 왜 비싸졌어 / 요즘 무슨 일 버튼 + 뉴스 말풍선
      </div>
    </main>
  );
}
