# 엄니머니 디자인 시스템

> 작성: 디자이너 | 마지막 업데이트: 2026-05-03
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

### 폰트 패밀리

- **본문 (sans)**: `Pretendard Variable` — queenit 스택 fallback. weight 45~920 단일 variable font. OFL 라이선스, self-host
- **디스플레이**: `Gowun Dodum` — 랜딩 페이지의 큰 헤드라인 톤 (둥근 한글 디스플레이체)
- **숫자 (numeric)**: `Pretendard → Tahoma → Verdana` — 가격·시세표 등 강조 위치에서 `font-numeric` 클래스로 사용
- **등폭 숫자**: 모든 숫자 표시 위치에 `tabular-nums` 유틸리티 권장 (자릿수 변해도 폭 안정)

### 시맨틱 위계 (Tailwind: `text-{token}`)

> 시작값. 디자이너 결정 후 조정 가능. weight는 토큰에 묶지 않고 사용처에서 명시.

| 토큰 | size | line-height | letter-spacing | 권장 weight | 용도 |
|---|---|---|---|---|---|
| `display` | 32px | 1.2 | -0.02em | 700~800 | 랜딩 큰 헤드라인 |
| `title` | 24px | 1.35 | -0.01em | 700 | 페이지·섹션 제목, NewsStoryView 히어로 |
| `heading` | 19px | 1.4 | -0.005em | 600~700 | 카드 헤드라인, 모달 헤더 |
| `body-lg` | 18px | 1.6 | 0 | 500 | lead 단락 (NewsStoryView 첫 단락) |
| `body` | 16px | 1.6 | 0 | 400 | 일반 본문 |
| `sub` | 14px | 1.5 | 0 | 400 | 부가 설명, 카드 sub, 메타 |
| `caption` | 13px | 1.45 | 0 | 500 | 라벨, 칩, 작은 메타 |

**시니어 친화 최저선**: `caption` 13px 이상. 10~11px 임의값 사용 금지.

**기존 size scale** (`base / lg / xl / 2xl / 3xl`)은 랜딩 페이지(app/page.tsx)에서 이미 사용 중이라 호환 유지. 신규 컴포넌트는 시맨틱 토큰 사용.

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

## 5. 아이콘

### 라이브러리

- **기본**: [Solar Icon Set](https://solar-icons.vercel.app/) — `@iconify/react`로 사용
  - inactive: `solar:[name]-linear`
  - active / 강조: `solar:[name]-bold`
- 다른 아이콘 라이브러리는 도입하지 않음. Solar에 적당한 게 없으면 자체 제작으로.

### 활성 표현 룰 (BottomNav 등)

| 아이콘 톤 | 활성 표현 |
|---|---|
| 두꺼운 라인 + 채움 톤 (App Store 스타일) | 컬러로 활성 표현 |
| 얇은 라인 톤 (Solar Linear 등) | 색 변화 없이 형태(채움)로만 활성 표현 (linear → bold) |

비활성도 블랙(`#111111`)으로 잘 보이게 유지.

### 자체 제작 아이콘 (`apps/web/components/icons/`)

Solar에 없는 모양만 제작. **Solar의 path 톤(둥근 끝, stroke 두께)을 따와서 일관성 유지**.

| 컴포넌트 | 출처 | 사용처 |
|---|---|---|
| `CloseX` | Solar `close-circle-bold`의 안쪽 X path 추출 | 외부 frosted glass 등 별도 배경이 있는 닫기 버튼 (Solar에는 외곽선 없는 단순 X가 없음) |

## 6. 사용 원칙

- 새 색/사이즈/컴포넌트 추가 전 이 문서를 먼저 확인
- 토큰 값이 확정되면 동료에게 `apps/web/tailwind.config.ts` 반영 요청
- 컴포넌트별 노트는 `docs/design/{component}-notes.md` 패턴
- 토큰이 정해지지 않은 항목은 `[TODO]`로 남기고, 결정 후 갱신

## 7. 변경 이력

- 2026-05-03 — 아이콘 정책 추가 (Solar 통일), `CloseX` 자체제작 아이콘 등록
- 2026-05-02 — 골격 작성, NewsCard 기반 첫 분석
