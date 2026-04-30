# 엄니머니 API Dockerfile (NestJS, npm workspaces 모노레포)
#
# Railway / Fly.io / Render 등 컨테이너 PaaS 에 그대로 배포.
# 빌드 컨텍스트: 모노레포 루트 (workspaces 해석 위해)

# ─────────────────────────────────────────────
# Stage 1: 의존성 + 빌드
# ─────────────────────────────────────────────
FROM node:20-bullseye-slim AS builder

WORKDIR /app

# 워크스페이스 manifest 만 먼저 복사 (캐시 효율 ↑)
COPY package.json package-lock.json ./
COPY apps/api/package.json apps/api/
COPY apps/web/package.json apps/web/
COPY packages/shared/package.json packages/shared/

# 모노레포 전체 install (workspaces 해석)
RUN npm install --include=dev --no-audit --no-fund

# 소스 복사
COPY tsconfig.base.json ./
COPY packages/shared packages/shared
COPY apps/api apps/api

# Prisma client 생성 + shared 빌드 + api 빌드
# `prisma generate` 는 schema 의 datasource.url=env("DATABASE_URL") 를 파싱하느라
# 빌드 타임에도 환경변수를 요구함. 실제 DB 연결은 안 하므로 placeholder 면 OK.
# 운영 DB URL 은 Railway Variables 로 컨테이너 시작 시 주입됨.
RUN npm run build -w @eomni/shared
# `-w @eomni/api` 가 cwd 를 apps/api 로 바꾸므로 schema 는 워크스페이스 기준 상대경로
RUN DATABASE_URL="postgresql://placeholder:placeholder@placeholder:5432/placeholder" \
    npx -w @eomni/api prisma generate --schema prisma/schema.prisma
RUN npm run build -w @eomni/api

# ─────────────────────────────────────────────
# Stage 2: 실행 (slim)
# ─────────────────────────────────────────────
FROM node:20-bullseye-slim AS runner

WORKDIR /app
ENV NODE_ENV=production

# 빌드 결과물 + 필요한 노드 모듈만 가져오기
COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=builder /app/apps/api/package.json apps/api/
COPY --from=builder /app/apps/api/dist apps/api/dist
COPY --from=builder /app/apps/api/prisma apps/api/prisma
COPY --from=builder /app/packages/shared/package.json packages/shared/
COPY --from=builder /app/packages/shared/dist packages/shared/dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api/node_modules apps/api/node_modules

# Prisma engine 바이너리는 builder 의 node_modules 안에 함께 copy 됨

EXPOSE 3001

# Railway 가 자동으로 PORT 환경변수 주입 — main.ts 에서 사용 중
# 시작 시 마이그레이션 적용 (멱등) → 서버 시동
CMD ["sh", "-c", "npx -w @eomni/api prisma migrate deploy && node apps/api/dist/main.js"]
