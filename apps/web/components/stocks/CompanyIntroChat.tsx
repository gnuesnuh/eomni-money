import type { StockIntro } from "@/lib/stockIntros";

interface Props {
  intro: StockIntro;
}

export function CompanyIntroChat({ intro }: Props) {
  return (
    <section className="bg-[#B2C7D9] px-3 py-3 flex flex-col gap-2">
      <div className="text-[11px] text-black/45 bg-black/10 rounded-full px-3 py-0.5 w-fit mx-auto">
        이 회사가 궁금해요?
      </div>

      {intro.qa.map((qa, idx) => (
        <div key={idx} className="flex flex-col gap-1.5">
          {/* 질문 (오른쪽, 카카오 노랑) */}
          <div className="flex justify-end">
            <div className="bg-[#FEE500] rounded-[16px_4px_16px_16px] px-3 py-2 max-w-[200px]">
              <p className="text-sm text-gray-900 leading-relaxed">{qa.q}</p>
            </div>
          </div>
          {/* 답변 (왼쪽, 회사 아바타) */}
          <div className="flex items-end gap-1.5">
            <div className="w-7 h-7 rounded-full bg-[#534AB7] text-white text-[11px] flex items-center justify-center flex-shrink-0">
              {intro.avatarKo}
            </div>
            <div className="bg-white rounded-[4px_16px_16px_16px] px-3 py-2 max-w-[210px]">
              <p className="text-sm text-gray-900 leading-relaxed">{qa.a}</p>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
