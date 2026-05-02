# 엄니머니 디자인 시스템

> 작성: 디자이너 | 마지막 업데이트: 2026-05-02
> 원칙: 시니어 가독성 우선 + aurora 톤 일관성
> 운영 규칙: 토큰은 이 문서에서만 정의, 컴포넌트 노트는 토큰을 **참조**만

## 1. 색 토큰

### 베이스 (aurora)
- `bg-warm`: [TODO — 예: #FFFCF7]
- `bg-card`: [TODO]
- `text-primary`: [TODO]
- `text-secondary`: [TODO]
- `text-muted`: [TODO]
- `border-soft`: [TODO]

### 화자별 (Speaker)
| 화자 | 색 | 비고 |
|---|---|---|
| son (아들) | [TODO] | 현재 `bubble-son` 토큰 사용 중 |
| daughter (딸) | [TODO] | |
| daughter_in_law (며느리) | [TODO] | |
| son_in_law (사위) | [TODO] | |

### 의미별 (Semantic)
| 용도 | 현재 색 | 목표 색 |
|---|---|---|
| price-up (상승) | red-50 / red-600 | [TODO] |
| price-down (하락) | blue-50 / blue-600 | [TODO] |
| mode-easy (더 쉽게) | orange-50 / orange-700 | [TODO] |
| mode-deep (더 자세히) | purple-50 / purple-700 | [TODO] |
| success (이해 완료) | emerald-50 / emerald-800 | [TODO] |
| warning (어려운 뉴스) | amber-50 / amber-800 | [TODO] |

## 2. 타이포

| 용도 | 크기 | 굵기 | 비고 |
|---|---|---|---|
| 헤드라인 | [TODO — 현재 18px] | bold | 시니어 가독성 — 20px 이상 검토 |
| 본문 (말풍선) | [TODO — 현재 18px] | regular | line-height 1.6 이상 |
| 요약 | [TODO — 현재 14px] | regular | 3줄 클램프 |
| 메타/캡션 | [TODO — 현재 12~14px] | medium | 시간·출처 |

## 3. 간격 & 라운드

- 카드 라운드: **16px** (`rounded-2xl`) — 확정
- 카드 padding: [TODO — 현재 px-4 py-3]
- 카드 사이 간격: [TODO — 현재 gap-4]
- **터치 영역 최소: 48×48px** (시니어 권장, 음성 버튼 등 점검 필요)

## 4. 컴포넌트 카탈로그

| 컴포넌트 | 코드 위치 | 디자인 노트 |
|---|---|---|
| Card | `apps/web/components/news/NewsCard.tsx` | [news-card-notes.md](./news-card-notes.md) |
| Bubble | `apps/web/components/news/BubbleArea.tsx` | [TODO bubble-notes.md] |
| PathButton / FollowButton | `NewsCard.tsx` 내부 | [TODO button-notes.md] |
| Tag (종목 칩) | `NewsCard.tsx` footer | [TODO tag-notes.md] |
| FreeLimitCard | `apps/web/components/news/FreeLimitCard.tsx` | [TODO] |
| NativeAdCard | `apps/web/components/news/NativeAdCard.tsx` | [TODO] |

## 5. 사용 원칙

- 새 색/사이즈/컴포넌트 추가 전 이 문서를 먼저 확인
- 토큰 값이 확정되면 동료에게 `apps/web/tailwind.config.ts` 반영 요청
- 컴포넌트별 노트는 `docs/design/{component}-notes.md` 패턴
- 토큰이 정해지지 않은 항목은 `[TODO]`로 남기고, 결정 후 갱신

## 6. 변경 이력

- 2026-05-02 — 골격 작성, NewsCard 기반 첫 분석
