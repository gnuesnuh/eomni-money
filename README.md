# 엄니머니 (Eomni Money)

> 뉴스를 아들·딸·며느리·사위가 설명해주는 시니어 주식 입문 앱

기획서: [eomni-money-spec.md](./eomni-money-spec.md)

## 개발 환경

- Node.js >= 20
- npm >= 10 (npm workspaces 사용)
- (Phase 1+) PostgreSQL, Redis

## 모노레포 구조

```
.
├── apps/
│   ├── web/          # Next.js 14 (App Router) + Tailwind
│   └── api/          # NestJS + TypeScript
├── packages/
│   └── shared/       # 공통 타입 / 배지 계산 로직
└── package.json      # workspace root
```

## 시작하기

```bash
# 의존성 설치 (전체 워크스페이스)
npm install

# shared 패키지 빌드 (api/web이 참조하기 전에 1회)
npm run build:shared

# 개발 서버 동시 실행 (web :3000, api :3001)
npm run dev
```

## 워크스페이스 명령

| 명령 | 설명 |
|------|------|
| `npm run dev` | web + api 동시 실행 |
| `npm run dev:web` | Next.js 만 실행 |
| `npm run dev:api` | NestJS 만 실행 |
| `npm run build` | 전체 빌드 (shared → web → api 순) |
| `npm run typecheck` | 전체 타입 검사 |
| `npm run lint` | 전체 린트 |

## 환경 변수

`.env.example` 을 복사해 사용하세요.

```bash
cp .env.example .env.local
```

| 키 | 용도 |
|---|---|
| `FINNHUB_API_KEY` | 미국 주식 가격/뉴스/감성 |
| `ANTHROPIC_API_KEY` | 말풍선 생성 (새벽 배치) |
| `SUPABASE_*` | 카카오 소셜 로그인 |
| `PORTONE_*` | 구독 결제 (Phase 2) |
| `BIGKINDS_API_KEY` | 한국 뉴스 (Phase 2) |
| `DATABASE_URL` | PostgreSQL |
| `REDIS_URL` | Redis 캐시 |

## 화면 (Web)

| 경로 | 화면 |
|------|------|
| `/` | 진입 (시작하기 / 둘러보기) |
| `/onboarding` | 4단계 온보딩 |
| `/feed` | 뉴스 피드 |
| `/stocks` | 종목 목록 |
| `/stocks/[ticker]` | 종목 상세 ("왜 싸졌어?") |
| `/study` | 공부방 (Phase 2) |
| `/watchlist` | 찜 종목 |
| `/settings` | 설정 |
| `/subscribe` | 구독 (Phase 2) |

## API 엔드포인트

기본 prefix: `/api`

| Method | Path | 설명 |
|---|---|---|
| GET | `/health` | 헬스 체크 |
| GET | `/news?filter=` | 뉴스 피드 |
| POST | `/news/:id/explain` | 더 설명해줘 (mode: simpler/deeper) |
| GET | `/stocks?badge=` | 종목 목록 |
| GET | `/stocks/:ticker` | 종목 상세 |
| GET | `/stocks/:ticker/news` | 종목 관련 뉴스 |
| GET | `/stocks/:ticker/explain?direction=up\|down` | 가격 변동 설명 |
| POST | `/stocks/:ticker/watch` | 찜하기 |
| GET | `/users/me` | 내 정보 |
| POST | `/users/onboarding` | 온보딩 저장 |
| GET | `/study` | 커리큘럼 목록 |
| GET | `/study/:step` | 단계 상세 |

## Phase 1 MVP 진행 상황

- [x] 모노레포 + Next.js + NestJS 골격
- [x] 공통 타입 (`@eomni/shared`) — 화자 / 종목 / 뉴스 / 배지 계산
- [x] 라우트 stub (web + api)
- [x] 새벽 배치 스케줄 (5AM KST) — 구현 비어있음
- [ ] PostgreSQL + Prisma 스키마
- [ ] Redis 캐시 레이어
- [ ] Finnhub 클라이언트
- [ ] Claude 말풍선 생성기
- [ ] Supabase 카카오 로그인
- [ ] 온보딩 4단계 UI
- [ ] 뉴스 카드 / 종목 카드 실제 연동

## 참고

- [Finnhub Docs](https://finnhub.io/docs/api)
- [BigKinds](https://www.bigkinds.or.kr)
- [포트원](https://portone.io)
