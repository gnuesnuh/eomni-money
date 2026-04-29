// MVP 데모용 mock 광고. 실제 송출은 Phase 2에 광고 SDK / 직접 계약으로 교체.
// 시니어 타겟 (스펙 §2-5: 장기렌터카, 실버보험, 건강식품, 증권사 계좌개설 CPA)

export interface NativeAd {
  id: string;
  brand: string;
  brandTag: string; // "공식 파트너", "추천", 등
  logoText: string; // 2글자 mono
  logoBg: string; // tailwind class
  logoColor: string; // tailwind class
  title: string;
  desc: string;
  cta: string;
}

export const MOCK_ADS: NativeAd[] = [
  {
    id: "kb-securities",
    brand: "KB증권",
    brandTag: "공식 파트너",
    logoText: "KB",
    logoBg: "bg-yellow-50 border-yellow-300",
    logoColor: "text-yellow-700",
    title: "처음 계좌 개설하면 3개월 수수료 무료",
    desc: "엄마도 쉽게 시작할 수 있어요. 10분이면 계좌 개설 완료!",
    cta: "자세히 보기 →",
  },
  {
    id: "silver-insurance",
    brand: "실버케어",
    brandTag: "55세 이상 전용",
    logoText: "실버",
    logoBg: "bg-emerald-50 border-emerald-300",
    logoColor: "text-emerald-700",
    title: "고지의무 없이 가입하는 시니어 의료 보장",
    desc: "월 1만원대로 입원·통원·암 진단까지. 5분 안내 받기.",
    cta: "보장 확인하기 →",
  },
  {
    id: "long-rental",
    brand: "현대 셀렉션",
    brandTag: "장기렌터카",
    logoText: "현대",
    logoBg: "bg-blue-50 border-blue-300",
    logoColor: "text-blue-700",
    title: "취득세·자동차세 부담 없이 매달 차 바꾸기",
    desc: "할부 없이 매달 정해진 비용으로. 보험·정비 다 포함.",
    cta: "차종 둘러보기 →",
  },
];

export function pickAd(index: number): NativeAd {
  return MOCK_ADS[index % MOCK_ADS.length]!;
}
