interface PageProps {
  params: { step: string };
}

export default function StudyStepPage({ params }: PageProps) {
  return (
    <main className="px-4 py-6">
      <h1 className="text-2xl font-bold">공부방 — {params.step}단계</h1>
      <div className="mt-6 rounded-xl border border-dashed border-gray-300 p-6 text-center text-sm text-gray-400">
        TODO: 단계별 학습 콘텐츠
      </div>
    </main>
  );
}
