-- CreateEnum
CREATE TYPE "SpeakerType" AS ENUM ('son', 'daughter', 'daughter_in_law', 'son_in_law');

-- CreateEnum
CREATE TYPE "TargetType" AS ENUM ('mother', 'father');

-- CreateEnum
CREATE TYPE "LearningLevel" AS ENUM ('beginner', 'intermediate', 'advanced');

-- CreateEnum
CREATE TYPE "StockBadge" AS ENUM ('cheap', 'expensive', 'hot', 'warning', 'newsy');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "kakao_id" TEXT,
    "speaker_type" "SpeakerType" NOT NULL,
    "speaker_name" TEXT NOT NULL,
    "target_type" "TargetType" NOT NULL,
    "target_name" TEXT NOT NULL,
    "level" "LearningLevel" NOT NULL DEFAULT 'beginner',
    "is_subscribed" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stocks" (
    "id" TEXT NOT NULL,
    "ticker" TEXT NOT NULL,
    "name_ko" TEXT NOT NULL,
    "name_en" TEXT NOT NULL,
    "description_ko" TEXT NOT NULL,
    "logo_url" TEXT,
    "exchange" TEXT NOT NULL,
    "week52_high" DOUBLE PRECISION NOT NULL,
    "week52_low" DOUBLE PRECISION NOT NULL,
    "current_price" DOUBLE PRECISION,
    "change_pct" DOUBLE PRECISION,
    "badge" "StockBadge",
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "stocks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "news_bubbles" (
    "id" TEXT NOT NULL,
    "stock_id" TEXT,
    "source" TEXT NOT NULL,
    "headline_en" TEXT NOT NULL,
    "summary_en" TEXT NOT NULL,
    "bubble_ko" TEXT NOT NULL,
    "speaker_type" "SpeakerType" NOT NULL,
    "level" "LearningLevel" NOT NULL,
    "published_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "news_bubbles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_learnings" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "word" TEXT NOT NULL,
    "learned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_learnings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "watchlist" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "stock_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "watchlist_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_kakao_id_key" ON "users"("kakao_id");

-- CreateIndex
CREATE UNIQUE INDEX "stocks_ticker_key" ON "stocks"("ticker");

-- CreateIndex
CREATE INDEX "stocks_badge_idx" ON "stocks"("badge");

-- CreateIndex
CREATE INDEX "stocks_ticker_idx" ON "stocks"("ticker");

-- CreateIndex
CREATE INDEX "news_bubbles_stock_id_idx" ON "news_bubbles"("stock_id");

-- CreateIndex
CREATE INDEX "news_bubbles_speaker_type_level_idx" ON "news_bubbles"("speaker_type", "level");

-- CreateIndex
CREATE INDEX "news_bubbles_created_at_idx" ON "news_bubbles"("created_at");

-- CreateIndex
CREATE INDEX "user_learnings_user_id_idx" ON "user_learnings"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_learnings_user_id_word_key" ON "user_learnings"("user_id", "word");

-- CreateIndex
CREATE INDEX "watchlist_user_id_idx" ON "watchlist"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "watchlist_user_id_stock_id_key" ON "watchlist"("user_id", "stock_id");

-- AddForeignKey
ALTER TABLE "news_bubbles" ADD CONSTRAINT "news_bubbles_stock_id_fkey" FOREIGN KEY ("stock_id") REFERENCES "stocks"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_learnings" ADD CONSTRAINT "user_learnings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "watchlist" ADD CONSTRAINT "watchlist_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "watchlist" ADD CONSTRAINT "watchlist_stock_id_fkey" FOREIGN KEY ("stock_id") REFERENCES "stocks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
