# 배포 가이드

> 프로토타입 배포: **Web → Vercel**, **API → Railway**, DB는 이미 **Supabase**.

## 0. 사전 준비

- GitHub 리포 (private 권장 — `.env` 등은 이미 gitignore 되어있음)
- Supabase 프로젝트 (이미 있음, ref `tvhlvlwqjfvqaueowjyc`)
- Finnhub, Anthropic API 키 (이미 발급)

```bash
# 로컬에서 push 전 빌드 한번 확인
npm run build
```

---

## 1. GitHub 리포 push

```bash
gh repo create eomni-money --private --source=. --remote=origin --push
# 또는 수동:
#   GitHub 에서 빈 리포 생성 → 아래로 push
#   git remote add origin https://github.com/<you>/eomni-money.git
#   git push -u origin main
```

---

## 2. API → Railway

1. https://railway.app → New Project → **Deploy from GitHub repo** → 위 리포 선택
2. **Root Directory** 는 비워둠 (모노레포 루트). Railway 가 `Dockerfile` 자동 인식.
3. **Variables** 에 다음 추가:

```
DATABASE_URL=postgresql://postgres.tvhlvlwqjfvqaueowjyc:<PASSWORD>@aws-1-ap-northeast-2.pooler.supabase.com:5432/postgres
FINNHUB_API_KEY=<your finnhub key>
ANTHROPIC_API_KEY=<your anthropic key>
ANTHROPIC_MODEL=claude-sonnet-4-6
NODE_ENV=production
WEB_ORIGIN=https://eomni-money.vercel.app    # 4단계에서 Vercel 배포 후 실제 도메인으로 갱신
```

4. Settings → **Generate Domain** → `https://eomni-money-api-production.up.railway.app` 같은 URL 발급
5. 첫 배포 시 자동으로 `prisma migrate deploy` 실행됨 (`Dockerfile` CMD 에 포함)
6. 헬스 체크: `curl https://<railway-domain>/api/health` → `{"status":"ok","db":"ok"}` 기대

> `/api/dev/*` 는 NODE_ENV=production 일 때 자동으로 비활성화됨 (시드 등 위험 액션 외부 노출 차단). 
> 임시로 켜고 싶으면 `ENABLE_DEV_ENDPOINTS=true` 추가.

---

## 3. DB 시드 (1회)

운영 DB 가 비어있으니 시드 필요. Railway 컨테이너에서:

**옵션 A: 임시로 dev 라우트 활성화**
1. Variables 에 `ENABLE_DEV_ENDPOINTS=true` 추가 → 재배포
2. `curl -X POST https://<railway-domain>/api/dev/seed`
3. `curl -X POST https://<railway-domain>/api/dev/backfill-translations`
4. (선택) `curl -X POST 'https://<railway-domain>/api/dev/expand-bubbles?speaker=son_in_law&level=advanced'`
5. **`ENABLE_DEV_ENDPOINTS` 제거** → 재배포

**옵션 B: Railway shell 에서 직접 실행** (Pro 이상)

```bash
railway run -- npx prisma migrate deploy --schema apps/api/prisma/schema.prisma
# 또는 컨테이너 들어가서 node apps/api/dist/main.js 별도 시드 스크립트 호출
```

> 운영에선 새벽 배치 cron 으로 시드 자동화 (Phase 2 구현 예정).

---

## 4. Web → Vercel

1. https://vercel.com/new → GitHub 리포 import
2. **Framework Preset**: Next.js (자동 감지)
3. **Root Directory**: `.` (모노레포 루트, 비워둠)
4. **Build Settings** (자동 감지되지 않으면 수동):
   - Build Command: `npm run build:shared && npm run build:web`
   - Output Directory: `apps/web/.next`
   - Install Command: `npm install`
   > 위 설정은 `vercel.json` 으로 이미 박혀있음
5. **Environment Variables**:

```
NEXT_PUBLIC_API_URL=https://<railway-domain>          # 2단계 Railway 도메인
# 카카오 OAuth 활성화 시 (보류 중이라 지금은 비워도 됨)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

6. Deploy → `https://eomni-money.vercel.app` 같은 URL 발급
7. **Railway 의 `WEB_ORIGIN` 환경변수를 위 Vercel 도메인으로 갱신** → API CORS 통과

---

## 5. 동작 확인

- `https://<vercel-domain>/` → 랜딩 페이지 (KO/JA 토글)
- 시작하기 → /onboarding 4단계
- /feed → 뉴스 카드 + 광고 + 한도
- /stocks/AAPL → 가격 + 회사 소개 챗 + 뉴스
- /study/1 → 레슨 1, /study/2 → 레슨 2

---

## 트러블슈팅

| 증상 | 원인 / 해결 |
|---|---|
| `/api/health` 가 `db: down` | Railway DATABASE_URL 의 비밀번호 확인. Session pooler URL 사용. |
| Web 에서 fetch 실패 (CORS) | Railway `WEB_ORIGIN` 이 정확한 Vercel 도메인인지 확인. |
| Vercel 빌드 실패 (`@eomni/shared` not found) | Build Command 가 `build:shared && build:web` 인지 확인. |
| Railway 빌드 OOM | Hobby 플랜 메모리(512MB) 초과 가능 — Pro 플랜 또는 prebuild 캐시 활용. |
| Prisma migrate 실패 (P1001) | DATABASE_URL 호스트 도달 못 함. Supabase Direct Connection (IPv6) 대신 Session Pooler (IPv4) 써야 함. |

---

## 비용 추정 (월)

| 서비스 | 플랜 | 비용 |
|---|---|---|
| Vercel | Hobby | 무료 |
| Railway | Hobby | $5/월 사용량 비례 (소규모면 충분) |
| Supabase | Free | 무료 (DB 500MB, 50k MAU) |
| Anthropic | 종량제 | 시드 1회 ~$1, 사용량 기반 |
| Finnhub | Free | 60req/min (충분) |

총 **~$5~15/월** 프로토타입 단계.
