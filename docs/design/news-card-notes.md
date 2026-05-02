# 뉴스 카드 디자인 노트

> 대상 파일: `apps/web/components/news/NewsCard.tsx`, `BubbleArea.tsx`
> 토큰 정의: [design-system.md](./design-system.md)
> 작성: 디자이너 | 2026-05-02

## 현재 상태 (동료 목업)

- 흰 카드 + `gray-200` border + `rounded-2xl` + `shadow-sm`
- 헤드라인: `text-lg` / 요약: `text-sm` 3줄 클램프 / 말풍선 본문: `text-lg`
- 색 체계 (한 카드에 최대 6색 등장):
  - simpler = orange / deeper = purple
  - 종목 상승 = red / 하락 = blue
  - 학습 완료(deep) = emerald / 학습 완료(easy) = amber

## aurora 톤과의 연결

- [ ] aurora 시안의 메인 컬러 코드 확정 → `design-system.md` 베이스 토큰에 반영
- [ ] 카드 전체 배경에 적용할지 / 말풍선 영역에만 적용할지

## 디자인 입힐 포인트

### 1. 가독성 (시니어 우선)
- [ ] 헤드라인 `text-lg` (18px) → `text-xl` (20px) 검토
- [ ] 음성 버튼 9×9 (36px) → 48×48px 이상 (터치 영역 권장 미달)
- [ ] 본문 line-height 충분한지 실기 확인

### 2. 색 정리 (한 카드에 6색은 과함)
- [ ] simpler/deeper 톤 다운 (orange/purple → 더 부드럽게)
- [ ] 종목 칩 red/blue → aurora 톤으로 변환 검토
- [ ] 학습 완료 뱃지(emerald/amber) 톤 점검

### 3. 화자 (BubbleArea)
- [ ] 화자 이모지 `text-xl` → `text-2xl` 검토
- [ ] 화자별 색상 구분 추가? (현재 모두 같은 `bubble-son`)

### 4. 여백 & 간격
- [ ] 카드 내부 padding (`px-4 py-3`) 더 넉넉하게?
- [ ] 카드 사이 간격 (`gap-4`) 적절한지

## 동료에게 물어볼 것

- [ ] `bubble-son` 토큰의 현재 색 값
- [ ] `tailwind.config.ts`에 새 토큰 추가는 누가 진행?
- [ ] aurora jsx의 실제 적용 범위 (어디까지 반영됐는지)

## 변경 이력

- 2026-05-02 — 골격 작성, 동료 목업 기반 첫 분석
